import os
import json
import sqlite3
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix, classification_report
import joblib

def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    
    # Pre-defined lists
    departments = [
        "Computer Science", 
        "Information Technology", 
        "Electronics & Communication", 
        "Mechanical Engineering", 
        "Civil Engineering",
        "Artificial Intelligence & Machine Learning"
    ]
    genders = ["Male", "Female"]
    yes_no = ["Yes", "No"]
    
    first_names = ["Rahul", "Anjali", "Amit", "Priya", "Vikram", "Sneha", "Rohit", "Neha", "Sanjay", "Pooja", 
                   "Arjun", "Kiran", "Aditya", "Riya", "Yash", "Divya", "Varun", "Tanvi", "Abhishek", "Deepika"]
    last_names = ["Sharma", "Verma", "Gupta", "Kumar", "Singh", "Patel", "Reddy", "Nair", "Joshi", "Mehta", 
                  "Das", "Choudhury", "Mishra", "Rao", "Sen", "Bose", "Saxena", "Roy", "Yadav", "Trivedi"]
    
    data = []
    
    for i in range(num_samples):
        # Choose a profile type: 0 = Weak (30%), 1 = Medium (40%), 2 = Strong (30%)
        profile_type = np.random.choice([0, 1, 2], p=[0.3, 0.4, 0.3])
        
        reg_no = f"REG{2026000 + i}"
        name = f"{np.random.choice(first_names)} {np.random.choice(last_names)}"
        dept = np.random.choice(departments)
        gender = np.random.choice(genders)
        
        # Academics and skills based on profile type
        if profile_type == 0:  # Weak
            tenth = round(np.random.uniform(50.0, 70.0), 2)
            twelfth = round(np.random.uniform(50.0, 70.0), 2)
            cgpa = round(np.random.uniform(5.0, 6.8), 2)
            backlogs = int(np.random.choice([0, 1, 2, 3], p=[0.3, 0.4, 0.2, 0.1]))
            
            programming = int(np.random.uniform(40, 58))
            aptitude = int(np.random.uniform(40, 58))
            communication = int(np.random.uniform(40, 58))
            
            projects = int(np.random.choice([0, 1], p=[0.7, 0.3]))
            internship = np.random.choice(yes_no, p=[0.05, 0.95])
            certifications = int(np.random.choice([0, 1], p=[0.8, 0.2]))
            hackathons = int(np.random.choice([0, 1], p=[0.9, 0.1]))
            
        elif profile_type == 1:  # Medium
            tenth = round(np.random.uniform(65.0, 85.0), 2)
            twelfth = round(np.random.uniform(65.0, 85.0), 2)
            cgpa = round(np.random.uniform(6.8, 8.2), 2)
            backlogs = int(np.random.choice([0, 1, 2], p=[0.8, 0.15, 0.05]))
            
            programming = int(np.random.uniform(60, 80))
            aptitude = int(np.random.uniform(60, 80))
            communication = int(np.random.uniform(55, 80))
            
            projects = int(np.random.choice([1, 2, 3], p=[0.3, 0.5, 0.2]))
            internship = np.random.choice(yes_no, p=[0.35, 0.65])
            certifications = int(np.random.choice([0, 1, 2], p=[0.4, 0.4, 0.2]))
            hackathons = int(np.random.choice([0, 1, 2], p=[0.6, 0.3, 0.1]))
            
        else:  # Strong
            tenth = round(np.random.uniform(80.0, 98.0), 2)
            twelfth = round(np.random.uniform(80.0, 98.0), 2)
            cgpa = round(np.random.uniform(8.2, 10.0), 2)
            backlogs = int(np.random.choice([0, 1], p=[0.97, 0.03]))
            
            programming = int(np.random.uniform(80, 100))
            aptitude = int(np.random.uniform(80, 100))
            communication = int(np.random.uniform(75, 98))
            
            projects = int(np.random.choice([2, 3, 4], p=[0.2, 0.5, 0.3]))
            internship = np.random.choice(yes_no, p=[0.85, 0.15])
            certifications = int(np.random.choice([1, 2, 3], p=[0.3, 0.5, 0.2]))
            hackathons = int(np.random.choice([1, 2, 3], p=[0.4, 0.4, 0.2]))

        # Calculate correlated skills and scores
        technical = int(np.clip((programming * 0.6 + aptitude * 0.4) + np.random.randint(-5, 5), 40, 100))
        mock_interview = int(np.clip((communication * 0.5 + technical * 0.5) + np.random.randint(-5, 5), 40, 100))
        resume_uploaded = "Yes"
        
        # Normalized parameters (0.0 to 1.0)
        cgpa_norm = (cgpa - 5.0) / 5.0
        prog_norm = programming / 100.0
        apt_norm = aptitude / 100.0
        comm_norm = communication / 100.0
        tech_norm = technical / 100.0
        mock_norm = mock_interview / 100.0
        proj_norm = min(projects, 3) / 3.0
        intern_norm = 1.0 if internship == "Yes" else 0.0
        cert_norm = min(certifications, 2) / 2.0
        
        # Placement Index base calculation
        placed_index = (
            0.20 * cgpa_norm +
            0.15 * prog_norm +
            0.10 * apt_norm +
            0.10 * comm_norm +
            0.15 * tech_norm +
            0.10 * mock_norm +
            0.05 * proj_norm +
            0.10 * intern_norm +
            0.05 * cert_norm
        )
        
        # Penalty for backlogs
        placed_index -= 0.15 * (min(backlogs, 2) / 2.0)
        
        # Strict cutoffs for realistic prediction
        if cgpa < 6.5:
            placed_index -= 0.25
        if backlogs > 1:
            placed_index -= 0.30
        if programming < 50 or aptitude < 50:
            placed_index -= 0.20
            
        final_score = np.clip(placed_index + np.random.normal(0, 0.03), 0.0, 1.0)
        placed = 1 if final_score >= 0.55 else 0
        
        # Expected starting salary (LPA)
        salary_base = 3.0
        if placed == 1:
            salary_base = 4.0
            
        salary_score = (
            0.25 * cgpa_norm + 
            0.25 * prog_norm + 
            0.20 * tech_norm + 
            0.15 * intern_norm + 
            0.15 * (projects / 5.0)
        )
        # Expected salary range between 3.0 LPA and 18.0 LPA
        salary = round(salary_base + salary_score * 12.0 + np.random.normal(0, 0.4), 2)
        salary = max(3.0, min(salary, 18.0))
        
        data.append({
            "student_name": name,
            "register_no": reg_no,
            "department": dept,
            "gender": gender,
            "tenth_percentage": tenth,
            "twelfth_percentage": twelfth,
            "cgpa": cgpa,
            "backlogs": backlogs,
            "programming_skills": programming,
            "aptitude_score": aptitude,
            "communication_skills": communication,
            "technical_skills": technical,
            "projects": projects,
            "internship": internship,
            "certifications": certifications,
            "hackathons": hackathons,
            "resume_uploaded": resume_uploaded,
            "mock_interview_score": mock_interview,
            "placed": placed,
            "salary": salary
        })
        
    return pd.DataFrame(data)

def preprocess_features(df):
    # Map categorical features to numerical indices
    dept_map = {
        "Computer Science": 0, 
        "Information Technology": 1, 
        "Electronics & Communication": 2, 
        "Mechanical Engineering": 3, 
        "Civil Engineering": 4,
        "Artificial Intelligence & Machine Learning": 5
    }
    gender_map = {"Male": 1, "Female": 0}
    yes_no_map = {"Yes": 1, "No": 0}
    
    processed_df = df.copy()
    processed_df["department_encoded"] = processed_df["department"].map(dept_map)
    processed_df["gender_encoded"] = processed_df["gender"].map(gender_map)
    processed_df["internship_encoded"] = processed_df["internship"].map(yes_no_map)
    processed_df["resume_uploaded_encoded"] = processed_df["resume_uploaded"].map(yes_no_map)
    
    # Feature columns for classification and regression
    feature_cols = [
        "department_encoded", "gender_encoded", "tenth_percentage", "twelfth_percentage", 
        "cgpa", "backlogs", "programming_skills", "aptitude_score", 
        "communication_skills", "technical_skills", "projects", "internship_encoded", 
        "certifications", "hackathons", "resume_uploaded_encoded", "mock_interview_score"
    ]
    
    return processed_df[feature_cols], processed_df["placed"], processed_df["salary"]

def main():
    print("Generating synthetic student dataset...")
    df = generate_synthetic_data(1000)
    
    # Ensure directory structure exists
    os.makedirs("dataset", exist_ok=True)
    df.to_csv("dataset/placement_data.csv", index=False)
    print("Dataset saved to dataset/placement_data.csv")
    
    X, y_class, y_reg = preprocess_features(df)
    
    # Split for classification
    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X, y_class, test_size=0.2, random_state=42)
    
    # Split for regression
    X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(X, y_reg, test_size=0.2, random_state=42)
    
    # Dictionary to hold models and metrics
    classifiers = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(max_depth=6, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    }
    
    metrics_summary = {}
    best_accuracy = 0
    best_model_name = ""
    best_model = None
    
    print("\nTraining and comparing classifiers...")
    for name, clf in classifiers.items():
        clf.fit(X_train_c, y_train_c)
        y_pred = clf.predict(X_test_c)
        
        acc = accuracy_score(y_test_c, y_pred)
        precision, recall, f1, _ = precision_recall_fscore_support(y_test_c, y_pred, average="binary")
        cm = confusion_matrix(y_test_c, y_pred).tolist() # Convert numpy array to list for JSON serialization
        rep = classification_report(y_test_c, y_pred, output_dict=True)
        
        metrics_summary[name] = {
            "accuracy": float(acc),
            "precision": float(precision),
            "recall": float(recall),
            "f1_score": float(f1),
            "confusion_matrix": json.dumps(cm),
            "classification_report": json.dumps(rep)
        }
        
        print(f"{name}: Accuracy = {acc:.4f}, F1-Score = {f1:.4f}")
        
        if acc > best_accuracy:
            best_accuracy = acc
            best_model_name = name
            best_model = clf
            
    print(f"\nBest model selected: {best_model_name} with Accuracy = {best_accuracy:.4f}")
    
    # Save the best classifier
    joblib.dump(best_model, "ml_model.pkl")
    print("Best classifier model saved to ml_model.pkl")
    
    # Train Salary Regressor (Random Forest)
    print("\nTraining Expected Salary Regressor model...")
    regressor = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    regressor.fit(X_train_r, y_train_r)
    
    # Evaluate Regressor
    y_pred_r = regressor.predict(X_test_r)
    mae = np.mean(np.abs(y_test_r - y_pred_r))
    rmse = np.sqrt(np.mean((y_test_r - y_pred_r) ** 2))
    print(f"Salary Regressor Evaluated: MAE = {mae:.2f} LPA, RMSE = {rmse:.2f} LPA")
    
    # Save regressor
    joblib.dump(regressor, "salary_model.pkl")
    print("Salary Regressor model saved to salary_model.pkl")
    
    # Write metrics to SQLite database
    conn = sqlite3.connect("placement_system.db")
    cursor = conn.cursor()
    
    # Drop table if exists to make it fresh
    cursor.execute("DROP TABLE IF EXISTS ml_metrics")
    cursor.execute("""
        CREATE TABLE ml_metrics (
            model_name TEXT PRIMARY KEY,
            accuracy REAL,
            precision REAL,
            recall REAL,
            f1_score REAL,
            confusion_matrix TEXT,
            classification_report TEXT,
            is_best INTEGER
        )
    """)
    
    for name, metrics in metrics_summary.items():
        is_best = 1 if name == best_model_name else 0
        cursor.execute("""
            INSERT INTO ml_metrics 
            (model_name, accuracy, precision, recall, f1_score, confusion_matrix, classification_report, is_best)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            name, 
            metrics["accuracy"], 
            metrics["precision"], 
            metrics["recall"], 
            metrics["f1_score"], 
            metrics["confusion_matrix"], 
            metrics["classification_report"],
            is_best
        ))
        
    conn.commit()
    conn.close()
    print("Model metrics saved to SQLite database 'placement_system.db'")

if __name__ == "__main__":
    main()
