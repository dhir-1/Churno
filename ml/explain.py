import pandas as pd
import joblib
import shap
import matplotlib.pyplot as plt
from pathlib import Path

# Paths
MODEL_PATH = Path("ml/artifacts/churno_xgb_pipeline.joblib")
DATA_PATH = "data/Customer-churn.csv"

def explain_model():
    print("Loading model and data...")
    # 1. Load Pipeline
    pipeline = joblib.load(MODEL_PATH)
    model = pipeline.named_steps["model"]
    preprocessor = pipeline.named_steps["preprocess"]

    # 2. Load and Preprocess Data (Same as train.py)
    df = pd.read_csv(DATA_PATH)
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce").fillna(0)
    
    # Drop target and ID
    X_raw = df.drop(columns=["Churn", "customerID"])
    
    # Transform data using the pipeline's preprocessor
    # We need the transformed feature names for the plot to make sense
    print("Transforming data...")
    X_transformed = preprocessor.transform(X_raw)
    
    # Get feature names from the preprocessor
    # Numeric cols are passed relatedly, Categorical are one-hot encoded
    num_cols = preprocessor.transformers_[0][2]
    cat_cols = preprocessor.transformers_[1][1].named_steps["onehot"].get_feature_names_out(preprocessor.transformers_[1][2])
    feature_names = list(num_cols) + list(cat_cols)

    # 3. Calculate SHAP Values
    print("Calculating SHAP values (this might take a minute)...")
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_transformed)

    # 4. Generate Summary Plot
    print("Generating plot...")
    plt.figure()
    shap.summary_plot(shap_values, X_transformed, feature_names=feature_names, show=False)
    
    output_path = Path("ml/artifacts/shap_summary.png")
    plt.savefig(output_path, bbox_inches='tight', dpi=300)
    print(f"Explanation saved to {output_path}")

if __name__ == "__main__":
    explain_model()