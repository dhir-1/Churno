# Churno: Churn Prediction & Analysis Platform

Churno is a full-stack ML-powered application that predicts customer churn for telecom services. It allows single customer prediction, bulk CSV batch processing, and visualizations of churn trends.

## Features

- **Single Prediction**: Form-based interface to predict churn risk for individual customers.
- **Batch Prediction**: Upload CSV files to process thousands of customers at once.
- **Analytics Dashboard**: Real-time charts showing Risk Distribution and Prediction Trends.
- **History Tracking**: View past predictions stored in a PostgreSQL database.
- **Explainable AI**: Provides transparency into why a customer is flagged as High Risk (via XGBoost probability).

## Tech Stack

- **Frontend**: React + Vite, TailwindCSS (v4), Recharts (for analytics), Lucide Icons.
- **Backend**: FastAPI (Python), PostgreSQL (Neon DB).
- **ML**: XGBoost Pipeline (`scikit-learn`).

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL Database

### Backend
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up `.env` with your database URL:
   ```
   DATABASE_URL=postgresql://user:password@host/dbname
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd churn-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Dashboard**: Navigate to `http://localhost:5173`.
2. **Predict**: Enter customer details to get a churn probability score.
3. **Batch**: Upload a CSV (see `data/test_batch.csv` for format) to bulk predict.
4. **Analytics**: Check the Analytics tab for visual insights.
