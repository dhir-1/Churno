import pandas as pd
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.metrics import roc_auc_score
from xgboost import XGBClassifier


# -----------------------------
# Paths
# -----------------------------
CSV_PATH = "data/Customer-churn.csv"   # make sure this file exists
TARGET_COL = "Churn"

ARTIFACTS_DIR = Path("ml/artifacts")
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)  # create folder if not exists


# -----------------------------
# Load data
# -----------------------------
df = pd.read_csv(CSV_PATH)

# Clean + encode target Yes/No -> 1/0 (XGBoost expects 0/1 classes) [web:547]
y_raw = df[TARGET_COL].astype(str).str.strip()
y = y_raw.map({"No": 0, "Yes": 1})

if y.isna().any():
    bad_vals = sorted(y_raw[y.isna()].unique().tolist())
    raise ValueError(
        f"Unexpected values in '{TARGET_COL}': {bad_vals}. Expected only 'Yes'/'No'."
    )

X = df.drop(columns=[TARGET_COL])


# -----------------------------
# Split columns
# -----------------------------
cat_cols = X.select_dtypes(include=["object"]).columns.tolist()
num_cols = [c for c in X.columns if c not in cat_cols]


# -----------------------------
# Preprocessing pipelines
# -----------------------------
numeric_pipe = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
])

categorical_pipe = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
])

preprocess = ColumnTransformer(
    transformers=[
        ("num", numeric_pipe, num_cols),
        ("cat", categorical_pipe, cat_cols),
    ],
    remainder="drop",
)


# -----------------------------
# Model (XGBoost)
# -----------------------------
model = XGBClassifier(
    n_estimators=300,
    max_depth=4,
    learning_rate=0.05,
    subsample=0.9,
    colsample_bytree=0.9,
    eval_metric="logloss",
    random_state=42,
)


# Full pipeline = preprocess + model
pipe = Pipeline(steps=[
    ("preprocess", preprocess),
    ("model", model),
])


# -----------------------------
# Train/test split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Train
pipe.fit(X_train, y_train)

# Evaluate
proba = pipe.predict_proba(X_test)[:, 1]
auc = roc_auc_score(y_test, proba)
print("ROC-AUC:", auc)

# Save artifact
artifact_path = ARTIFACTS_DIR / "churno_xgb_pipeline.joblib"
joblib.dump(pipe, artifact_path)  # joblib saves the trained pipeline to a file [web:572]
print("Saved:", artifact_path)
