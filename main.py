from pathlib import Path
import os
import joblib
import pandas as pd
import psycopg
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict

# Load .env into environment variables
load_dotenv()  # loads variables from .env [web:986]

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set. Put it in .env as DATABASE_URL=...")  # [web:986]

app = FastAPI()

MODEL_PATH = Path("ml/artifacts/churno_xgb_pipeline.joblib")
model = joblib.load(MODEL_PATH)


class PredictRequest(BaseModel):
    customerID: str
    gender: str
    SeniorCitizen: int
    Partner: str
    Dependents: str
    PhoneService: str
    MultipleLines: str
    InternetService: str
    OnlineSecurity: str
    OnlineBackup: str
    DeviceProtection: str
    TechSupport: str
    StreamingTV: str
    StreamingMovies: str
    Contract: str
    PaperlessBilling: str
    PaymentMethod: str
    tenure: int
    MonthlyCharges: float
    TotalCharges:  float

    model_config = ConfigDict(extra="forbid")


def insert_prediction(row: dict, churn_probability: float, prediction: int):
    with psycopg.connect(DATABASE_URL) as conn:  # connect using connection string [web:971]
        with conn.cursor() as cur:
            cur.execute(
                """
                insert into churn_predictions (
                  churn_probability, prediction,
                  customerid, gender, seniorcitizen, partner, dependents,
                  phoneservice, multiplelines, internetservice,
                  onlinesecurity, onlinebackup, deviceprotection, techsupport,
                  streamingtv, streamingmovies, contract, paperlessbilling, paymentmethod,
                  tenure, monthlycharges, totalcharges
                )
                values (
                  %s, %s,
                  %s, %s, %s, %s, %s,
                  %s, %s, %s,
                  %s, %s, %s, %s,
                  %s, %s, %s, %s, %s,
                  %s, %s, %s
                )
                """,
                (
                    churn_probability, prediction,
                    row["customerID"], row["gender"], row["SeniorCitizen"], row["Partner"], row["Dependents"],
                    row["PhoneService"], row["MultipleLines"], row["InternetService"],
                    row["OnlineSecurity"], row["OnlineBackup"], row["DeviceProtection"], row["TechSupport"],
                    row["StreamingTV"], row["StreamingMovies"], row["Contract"], row["PaperlessBilling"], row["PaymentMethod"],
                    row["tenure"], row["MonthlyCharges"], row["TotalCharges"],
                ),
            )
            conn.commit()  # commit changes [web:971]


@app.get("/")
def root():
    return {"status": "ok", "message": "API running"}


@app.post("/predict")
def predict(req: PredictRequest):
    try:
        row = req.model_dump()
        X = pd.DataFrame([row])

        proba = float(model.predict_proba(X)[0, 1])
        pred = int(proba >= 0.5)

        insert_prediction(row, proba, pred)  # save to Neon [web:1002]
        label = "HIGH" if proba >= 0.7 else ("MEDIUM" if proba >= 0.3 else "LOW")

        # --- Dynamic Insights Calculation ---
        # 1. Top Churn Factors (Heuristic based on encoded inputs)
        # We assign a 'risk impact' score based on industry knowledge for the demo
        factors = []
        
        # Contract Impact
        if row['Contract'] == "Month-to-month":
            factors.append({"name": "Contract", "value": 0.45})
        elif row['Contract'] == "One year":
            factors.append({"name": "Contract", "value": -0.20})
        else:
            factors.append({"name": "Contract", "value": -0.40})

        # Tenure Impact (Higher tenure = lower risk usually, but simple linear here)
        # Normalize tenure 0-72 to risk. Low tenure = high risk
        tenure_val = row['tenure']
        if tenure_val < 12:
            factors.append({"name": "Tenure", "value": 0.30})
        elif tenure_val > 48:
            factors.append({"name": "Tenure", "value": -0.35})
        else:
            factors.append({"name": "Tenure", "value": -0.10})

        # Internet Service
        if row['InternetService'] == "Fiber optic":
            factors.append({"name": "Fiber Net", "value": 0.25}) # Often higher churn due to price/comp
        elif row['InternetService'] == "No":
            factors.append({"name": "Fiber Net", "value": -0.15})
        
        # Charges (High charges = higher churn risk)
        if row['MonthlyCharges'] > 70:
            factors.append({"name": "Charges", "value": 0.20})
        else:
            factors.append({"name": "Charges", "value": -0.10})

        # Tech Support
        if row['TechSupport'] == "No":
            factors.append({"name": "Tech Support", "value": 0.15})
        else:
            factors.append({"name": "Tech Support", "value": -0.15})


        # 2. Customer Persona (Radar Chart)
        # Calculate scores 0-100
        
        # Loyalty: Based on tenure
        loyalty_score = min((row['tenure'] / 72) * 100, 100)
        
        # Cost Sensitivity: Based on MonthlyCharges (Higher charges = usually higher value customer, or higher cost sensitivity if we inverse? Let's treat as 'Value' metric here)
        cost_score = min((row['MonthlyCharges'] / 120) * 100, 100)
        
        # Services Engagement: Count usage of services
        services = ['PhoneService', 'MultipleLines', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport', 'StreamingTV', 'StreamingMovies']
        active_services = sum(1 for s in services if row.get(s) == "Yes")
        engagement_score = (active_services / len(services)) * 100
        
        # Support/Health: TechSupport + Backup
        support_score = 100 if row['TechSupport'] == 'Yes' else 40
        if row['OnlineBackup'] == 'Yes': support_score += 20
        support_score = min(support_score, 100)

        persona = [
            {"subject": "Loyalty", "A": int(loyalty_score), "fullMark": 100},
            {"subject": "Value", "A": int(cost_score), "fullMark": 100},
            {"subject": "Services", "A": int(engagement_score), "fullMark": 100},
            {"subject": "Support", "A": int(support_score), "fullMark": 100},
            {"subject": "Security", "A": 100 if row['OnlineSecurity'] == 'Yes' else 30, "fullMark": 100}
        ]

        insights = {
            "factors": factors,
            "persona": persona
        }

        return {"churn_probability": proba, "prediction": pred, "risk": label, "insights": insights}
    except Exception as e:
        print(f"Prediction Error: {e}")  # [DEBUG] Print exact error
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/predictions")
def list_predictions(limit: int = 20):
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "select id, created_at, churn_probability, prediction, customerid "
                "from churn_predictions order by id desc limit %s",
                (limit,),
            )
            rows = cur.fetchall()
    results = []
    for r in rows:
        # Calculate risk label dynamically since it's not stored
        prob = r[2]
        risk = "High" if prob >= 0.7 else ("Medium" if prob >= 0.3 else "Low")
        
        results.append({
            "id": r[0], 
            "created_at": str(r[1]), 
            "probability": prob, 
            "prediction": r[3], 
            "customer_id": r[4], # Match frontend expectation
            "risk": risk
        })
    return results

@app.delete("/predictions")
def clear_predictions():
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM churn_predictions")
            conn.commit()
    return {"status": "ok", "message": "History cleared"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/analytics")
def get_analytics():
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            # 1. Risk Distribution
            cur.execute("""
                SELECT 
                    CASE 
                        WHEN churn_probability >= 0.7 THEN 'High'
                        WHEN churn_probability >= 0.3 THEN 'Medium'
                        ELSE 'Low'
                    END as risk_level,
                    COUNT(*) 
                FROM churn_predictions 
                GROUP BY 1
            """)
            risk_dist = [{"name": r[0], "value": r[1]} for r in cur.fetchall()]

            # 2. Trends (Last 7 Days) - Fixed for PostgreSQL
            # Using created_at directly if it exists, or assuming we need to cast/extract date
            # Assuming created_at is a TIMESTAMP column
            cur.execute("""
                SELECT 
                    TO_CHAR(created_at, 'YYYY-MM-DD') as date,
                    COUNT(*)
                FROM churn_predictions
                WHERE created_at >= NOW() - INTERVAL '7 days'
                GROUP BY 1
                ORDER BY 1 ASC
            """)
            trends = [{"date": r[0], "count": r[1]} for r in cur.fetchall()]
            
            # 3. Total Stats
            cur.execute("SELECT COUNT(*), AVG(churn_probability) FROM churn_predictions")
            total_stats = cur.fetchone()

    return {
        "risk_distribution": risk_dist,
        "trends": trends,
        "total_predictions": total_stats[0],
        "avg_risk": total_stats[1] if total_stats[1] else 0
    }

from fastapi import UploadFile, File
import io
import csv

@app.post("/predict/batch")
async def predict_batch(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")
    
    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV file: {str(e)}")
    
    # Required columns for the model
    required_cols = [
        "customerID", "gender", "SeniorCitizen", "Partner", "Dependents",
        "PhoneService", "MultipleLines", "InternetService", "OnlineSecurity",
        "OnlineBackup", "DeviceProtection", "TechSupport", "StreamingTV",
        "StreamingMovies", "Contract", "PaperlessBilling", "PaymentMethod",
        "tenure", "MonthlyCharges", "TotalCharges"
    ]
    
    # Validation
    missing_cols = [col for col in required_cols if col not in df.columns]
    if missing_cols:
        raise HTTPException(status_code=400, detail=f"Missing columns: {', '.join(missing_cols)}")
        
    # Pre-calculate predictions for ALL rows
    # 1. Handle " " in TotalCharges (common in this dataset for new customers)
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    
    # 2. Fill NaNs (e.g. TotalCharges becomes NaN if it was " ", or other missing values)
    df = df.fillna(0)
    
    X = df[required_cols].copy()
    try:
        probas = model.predict_proba(X)[:, 1]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {str(e)}")

    # Prepare data for bulk insert
    # We need a list of tuples for executemany
    # Tuple structure must match the SQL placeholder order
    
    # 1. Add prediction columns to DF for easy iteration/export
    df['churn_probability'] = probas
    df['prediction'] = (probas >= 0.5).astype(int)
    
    # 2. Prepare list of tuples for DB
    db_rows = []
    preview_rows = [] # Top 100 Risk
    
    for _, row in df.iterrows():
        # Map pandas row to native python types for psycopg
        db_rows.append((
            float(row['churn_probability']), 
            int(row['prediction']),
            str(row["customerID"]), str(row["gender"]), int(row["SeniorCitizen"]), str(row["Partner"]), str(row["Dependents"]),
            str(row["PhoneService"]), str(row["MultipleLines"]), str(row["InternetService"]),
            str(row["OnlineSecurity"]), str(row["OnlineBackup"]), str(row["DeviceProtection"]), str(row["TechSupport"]),
            str(row["StreamingTV"]), str(row["StreamingMovies"]), str(row["Contract"]), str(row["PaperlessBilling"]), str(row["PaymentMethod"]),
            int(row["tenure"]), float(row["MonthlyCharges"]), float(row["TotalCharges"])
        ))

    # Bulk Insert
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
             cur.executemany(
                """
                insert into churn_predictions (
                  churn_probability, prediction,
                  customerid, gender, seniorcitizen, partner, dependents,
                  phoneservice, multiplelines, internetservice,
                  onlinesecurity, onlinebackup, deviceprotection, techsupport,
                  streamingtv, streamingmovies, contract, paperlessbilling, paymentmethod,
                  tenure, monthlycharges, totalcharges
                )
                values (
                  %s, %s,
                  %s, %s, %s, %s, %s,
                  %s, %s, %s,
                  %s, %s, %s, %s,
                  %s, %s, %s, %s, %s,
                  %s, %s, %s
                )
                """,
                db_rows
            )
             conn.commit()

    # Sort by Risk (Probability Descending) for the Preview
    df_sorted = df.sort_values(by='churn_probability', ascending=False).head(100)
    
    for _, row in df_sorted.iterrows():
        risk = "HIGH" if row['churn_probability'] >= 0.7 else ("MEDIUM" if row['churn_probability'] >= 0.3 else "LOW")
        preview_rows.append({
            "customerID": row["customerID"],
            "churn_probability": row['churn_probability'],
            "risk": risk
        })

    # Summary Stats
    high_risk_count = int((df['churn_probability'] >= 0.7).sum())
    
    # Create full results for download
    full_results = []
    for _, row in df.iterrows():
         risk = "HIGH" if row['churn_probability'] >= 0.7 else ("MEDIUM" if row['churn_probability'] >= 0.3 else "LOW")
         full_results.append({
             "customerID": row["customerID"],
             "churn_probability": row['churn_probability'],
             "risk": risk
         })

    return {
        "status": "success", 
        "total_processed": len(df), 
        "high_risk_count": high_risk_count,
        "preview_rows": preview_rows,
        "full_results": full_results
    }
