# AI-Based Placement Prediction System

A professional, full-stack Machine Learning-based placement assistance and career readiness platform for students, colleges, and placement officers. 

The system leverages pre-trained ML classifiers to predict whether a student will be placed or not and uses a regression model to estimate starting salary packages. It also features interactive dashboards, NLP-based resume keyword scoring, custom week-by-week learning roadmaps, a student leaderboard, and a real-time AI career guidance chatbot.

---

## 🌟 Platform Highlights
- **Prediction Accuracy**: Logistic Regression (92%), Random Forest (91.5%), Decision Tree (90%).
- **Salary Estimations**: Predicts starting package thresholds (₹3.5LPA - ₹18LPA) using Random Forest Regression.
- **NLP Resume Analyzer**: Extracts content from **PDF, Word (.docx), and PowerPoint (.pptx)** uploads to score industry keyword matches.
- **AI Career Consultant**: Interactive career guidance chatbot referencing student profiles with custom particles backdrop.
- **Printable Reports**: Letter/A4-sized PDF report exports utilizing browser print engines and customized styling layers.

---

## 📁 System Architecture & Directory Tree
```
AI Based Placement Prediction/
├── backend/
│   ├── dataset/
│   │   └── placement_data.csv       # Synthetic training dataset (1,000 profiles)
│   ├── main.py                      # FastAPI web server and database CRUD routing
│   ├── train_models.py              # ML classification/regression pipelines
│   ├── requirements.txt             # Python packages listing
│   ├── ml_model.pkl                 # Best classifier (Logistic Regression - 92.0% Acc)
│   ├── salary_model.pkl             # Trained Random Forest Regressor
│   └── placement_system.db          # SQLite Database (Stores profiles & models metrics)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Float glass nav and search loading panel
│   │   │   └── Navbar.jsx           # Active profile toolbar controls
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Gradient mesh hero and feature grid
│   │   │   ├── StudentDashboard.jsx # Core charts, probability scores, readiness indicators
│   │   │   ├── PredictionForm.jsx   # Profile submission form with loading animations
│   │   │   ├── SkillGap.jsx         # Gap benchmarks vs student levels
│   │   │   ├── CompanyRecommendations.jsx # Categorized Dream/Service job targets
│   │   │   ├── ResumeAnalyzer.jsx   # Drag-and-drop parser for PDF/Docx/Pptx
│   │   │   ├── SalaryPrediction.jsx # Regression range charts and package boosters
│   │   │   ├── LearningRoadmap.jsx  # Checklist milestones mapping gaps
│   │   │   ├── StudentRanking.jsx   # Leaderboard ranking query controls
│   │   │   ├── AIChatbot.jsx        # Float particle-based chat console
│   │   │   ├── AdminDashboard.jsx   # Accuracy comparison graphs & delete logs
│   │   │   └── Reports.jsx          # Printable PDF layout generator
│   │   ├── App.jsx                  # Main router and unified active state manager
│   │   ├── main.jsx                 # Entrypoint mounter
│   │   ├── index.css                # Tailwind imports, custom typography, animations
│   │   └── App.css                  # Blank global styles overrides
│   ├── package.json                 # Node library dependencies
│   ├── vite.config.js               # Vite configurations with Tailwind v4
│   └── index.html                   # HTML template loader
└── README.md                        # Documentation guide (this file)
```

---

## 🚀 Step-by-Step Setup Instructions

### Prerequisites
- **Python 3.10+** (System verified Python 3.13)
- **Node.js v18+** (System verified Node 24)
- **NPM** (System verified NPM 11)

---

### Step 1: Initialize the Machine Learning Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the required libraries (fastapi, pandas, numpy, scikit-learn, joblib, pypdf, python-pptx, docx2txt, python-docx):
   ```bash
   pip install -r requirements.txt
   ```

3. Run the ML pipeline script to generate the dataset, train models, compare accuracies, and initialize the SQLite database:
   ```bash
   python train_models.py
   ```
   *This outputs:*
   - `ml_model.pkl` (Trained classifier)
   - `salary_model.pkl` (Trained salary regressor)
   - `dataset/placement_data.csv` (1,000 student training profiles)
   - `placement_system.db` initialized with model metrics.

4. Start the FastAPI backend server:
   ```bash
   python main.py
   ```
   *The server runs locally at: `http://localhost:8000`*
   *Interactive Swagger Docs are generated at: `http://localhost:8000/docs`*

---

### Step 2: Initialize the React Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Download node modules:
   ```bash
   npm install
   ```

3. Start the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
   *The web app runs locally at: `http://localhost:5173`*

---

### Step 3: Seed and Explore the Dashboard
1. Open `http://localhost:5173` in your browser.
2. Go to the **Student Ranking** or **Admin Portal** page.
3. Click the **Seed Mock Data** button at the top-right. This loads 100 students from the trained CSV directly into the database.
4. Click **Load** on any student row in the table (or search their Register Number, e.g. `REG2026000`, in the sidebar).
5. All dashboards (Dashboard, Skill Gaps, Roadmap, Salary Range, Reports) will unlock showing that student's details!
6. Visit the **AI Career Chatbot** or **Resume Analyzer** pages to interact, run live NLP parses, and ask questions!
