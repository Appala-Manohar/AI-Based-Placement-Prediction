# AI-Based Placement Prediction System

An end-to-end web application that leverages Machine Learning to predict student placement readiness, estimate expected starting salaries (LPA), analyze resumes, and guide preparation with personalized roadmaps.

## 🚀 Features

- **Placement Predictor**: Uses ML classification models (Logistic Regression, Decision Tree, Random Forest) to evaluate student profiles and calculate the probability of securing a job offer.
- **Salary Estimator**: Employs a Random Forest Regressor to forecast the starting package (LPA) based on individual achievements and skills.
- **Resume Analyzer**: Scans uploaded resumes (PDF, DOCX, PPTX) to check for key technical skills and keywords, scoring and offering actionable improvements.
- **Mock Interviews**: Conducts an interactive simulated interview tailored to the student's background and evaluates responses.
- **Learning Roadmaps**: Generates custom week-by-week roadmaps and targets specific weak areas (e.g. programming, aptitude, or communication).
- **Report Generation**: Automatically exports a detailed preparation report in PDF format.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Data Visualization**: Recharts (for dashboards and evaluation metrics)
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite3
- **ML libraries**: Scikit-Learn, Pandas, NumPy, Joblib
- **Document Processing**: PyPDF, Docx2Txt, python-pptx
- **PDF Generation**: ReportLab

---

## 💻 Installation and Setup

### Prerequisites
- Python 3.8+
- Node.js (v18+) & npm

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Train and generate ML models**:
   Run the training script to generate the synthetic dataset, compare classifiers, and save the pickle files:
   ```bash
   python train_models.py
   ```
4. **Run the FastAPI server**:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be running at `http://127.0.0.1:8000`.

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd ../frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the Vite development server**:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173`.

## Contributors

- [Appala Manohar](https://github.com/Appala-Manohar)
- [Sahith Sai Pasupula](https://github.com/<Sahith-GitHub-Username>)
