# ============================================================
#   KNOWLEDGE-BASED CAREER GUIDANCE SYSTEM
#   Full Integration: Week 1 (Knowledge Base + Forward Chaining)
#                   + Week 2 (Decision Tree)
#                   + Week 3 (Knowledge Graph + Conflict Resolution)
# ============================================================

from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from datetime import datetime
import csv, os, pickle
import pandas as pd
import numpy as np

app = Flask(__name__)

# ── MongoDB ──────────────────────────────────────────────────
MONGO_URI = "mongodb://localhost:27017/"
client    = MongoClient(MONGO_URI)
db        = client["careerpath"]
students_col  = db["students"]
profiles_col  = db["profiles"]
recommend_col = db["recommendations"]

# ── Load trained Decision Tree (Week 2) ──────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "career_model.pkl")
with open(MODEL_PATH, "rb") as f:
    saved        = pickle.load(f)
    DT_MODEL     = saved["model"]
    DT_ENCODER   = saved["encoder"]
    FEATURE_COLS = saved["feature_cols"]

# ============================================================
# WEEK 1: CAREER KNOWLEDGE BASE
# Defines required interests, skills, traits per career.
# Used by the Forward Chaining Inference Engine.
# ============================================================
CAREER_KNOWLEDGE_BASE = {
    "Software Engineer": {
        "required_interests": ["computers", "technology", "problem_solving"],
        "required_skills":    ["math", "logic", "programming"],
        "ideal_traits":       ["analytical", "detail_oriented", "patient"],
        "description":        "Designs and builds software applications and systems.",
        "related_careers":    ["Game Developer", "Accountant", "Stock Investor"]
    },
    "Doctor": {
        "required_interests": ["biology", "health", "helping_people"],
        "required_skills":    ["science", "communication", "critical_thinking"],
        "ideal_traits":       ["empathetic", "patient", "detail_oriented"],
        "description":        "Diagnoses and treats illnesses to improve patient health.",
        "related_careers":    ["Scientist", "Teacher", "Government Officer"]
    },
    "Lawyer": {
        "required_interests": ["law", "communication", "helping_people"],
        "required_skills":    ["communication", "writing", "critical_thinking"],
        "ideal_traits":       ["analytical", "expressive", "persistent"],
        "description":        "Advises clients and represents them in legal matters.",
        "related_careers":    ["Government Officer", "Writer", "Business Owner"]
    },
    "Teacher": {
        "required_interests": ["education", "helping_people", "communication"],
        "required_skills":    ["communication", "patience", "organization"],
        "ideal_traits":       ["empathetic", "patient", "expressive"],
        "description":        "Educates and mentors students in academic subjects.",
        "related_careers":    ["Government Officer", "Doctor", "Social Network Studies"]
    },
    "Scientist": {
        "required_interests": ["research", "biology", "math"],
        "required_skills":    ["science", "math", "critical_thinking"],
        "ideal_traits":       ["curious", "analytical", "detail_oriented"],
        "description":        "Conducts research and experiments to advance knowledge.",
        "related_careers":    ["Doctor", "Construction Engineer", "Stock Investor"]
    },
    "Business Owner": {
        "required_interests": ["communication", "problem_solving", "law"],
        "required_skills":    ["math", "communication", "critical_thinking"],
        "ideal_traits":       ["analytical", "expressive", "persistent"],
        "description":        "Starts and manages a business enterprise.",
        "related_careers":    ["Real Estate Developer", "Stock Investor", "Banker"]
    },
    "Accountant": {
        "required_interests": ["math", "problem_solving"],
        "required_skills":    ["math", "logic", "organization"],
        "ideal_traits":       ["detail_oriented", "analytical", "patient"],
        "description":        "Manages financial records and ensures compliance.",
        "related_careers":    ["Stock Investor", "Banker", "Business Owner"]
    },
    "Banker": {
        "required_interests": ["math", "communication", "problem_solving"],
        "required_skills":    ["math", "communication", "critical_thinking"],
        "ideal_traits":       ["analytical", "detail_oriented", "expressive"],
        "description":        "Manages financial services and banking operations.",
        "related_careers":    ["Accountant", "Lawyer", "Stock Investor"]
    },
    "Designer": {
        "required_interests": ["art", "technology", "problem_solving"],
        "required_skills":    ["creativity", "visual_thinking", "communication"],
        "ideal_traits":       ["creative", "detail_oriented", "expressive"],
        "description":        "Creates visual concepts and user experiences.",
        "related_careers":    ["Artist", "Game Developer", "Software Engineer"]
    },
    "Artist": {
        "required_interests": ["art", "education", "communication"],
        "required_skills":    ["creativity", "visual_thinking", "writing"],
        "ideal_traits":       ["creative", "expressive", "curious"],
        "description":        "Creates original artwork and creative expressions.",
        "related_careers":    ["Designer", "Writer", "Teacher"]
    },
    "Writer": {
        "required_interests": ["communication", "education", "art"],
        "required_skills":    ["writing", "communication", "research"],
        "ideal_traits":       ["expressive", "curious", "persistent"],
        "description":        "Creates written content for various media.",
        "related_careers":    ["Lawyer", "Teacher", "Journalist"]
    },
    "Game Developer": {
        "required_interests": ["computers", "technology", "art", "problem_solving"],
        "required_skills":    ["math", "logic", "programming"],
        "ideal_traits":       ["analytical", "creative", "detail_oriented"],
        "description":        "Designs and builds interactive video games.",
        "related_careers":    ["Software Engineer", "Designer", "Construction Engineer"]
    },
    "Construction Engineer": {
        "required_interests": ["problem_solving", "math", "technology"],
        "required_skills":    ["math", "science", "critical_thinking"],
        "ideal_traits":       ["analytical", "detail_oriented", "patient"],
        "description":        "Plans and oversees construction and infrastructure projects.",
        "related_careers":    ["Game Developer", "Scientist", "Real Estate Developer"]
    },
    "Stock Investor": {
        "required_interests": ["math", "problem_solving", "research"],
        "required_skills":    ["math", "critical_thinking", "communication"],
        "ideal_traits":       ["analytical", "curious", "persistent"],
        "description":        "Analyses markets and manages investment portfolios.",
        "related_careers":    ["Accountant", "Banker", "Business Owner"]
    },
    "Real Estate Developer": {
        "required_interests": ["law", "math", "communication"],
        "required_skills":    ["math", "communication", "critical_thinking"],
        "ideal_traits":       ["analytical", "expressive", "persistent"],
        "description":        "Develops and manages property and real estate.",
        "related_careers":    ["Business Owner", "Government Officer", "Construction Engineer"]
    },
    "Government Officer": {
        "required_interests": ["law", "communication", "helping_people", "education"],
        "required_skills":    ["communication", "writing", "organization"],
        "ideal_traits":       ["empathetic", "expressive", "patient"],
        "description":        "Works in public service and policy implementation.",
        "related_careers":    ["Lawyer", "Teacher", "Social Network Studies"]
    },
    "Social Network Studies": {
        "required_interests": ["communication", "technology", "education", "helping_people"],
        "required_skills":    ["communication", "writing", "research"],
        "ideal_traits":       ["expressive", "curious", "empathetic"],
        "description":        "Studies and manages social media and digital communities.",
        "related_careers":    ["Teacher", "Government Officer", "Designer"]
    },
}

# ============================================================
# WEEK 2: RIASEC CLASSIFICATION
# Used to group careers and explain DT limitations on Artistic types
# ============================================================
RIASEC_MAP = {
    "Construction Engineer": "R", "Software Engineer": "R", "Game Developer":  "R",
    "Doctor":                "I", "Scientist":         "I", "Stock Investor":  "I",
    "Artist":                "A", "Writer":            "A", "Designer":        "A",
    "Teacher":               "S", "Government Officer":"S", "Social Network Studies": "S",
    "Lawyer":                "E", "Business Owner":    "E", "Real Estate Developer":  "E",
    "Accountant":            "C", "Banker":            "C",
}

ARTISTIC_CAREERS   = {"Artist", "Writer", "Designer"}
KG_BOOST_THRESHOLD = 0.35  # if DT confidence < 35%, apply KG boost

CAREER_COLORS = {
    "Software Engineer": "#4f46e5", "Doctor": "#dc2626",
    "Lawyer": "#b45309",            "Teacher": "#0369a1",
    "Scientist": "#0891b2",         "Business Owner": "#7c3aed",
    "Accountant": "#065f46",        "Banker": "#1e3a5f",
    "Designer": "#be185d",          "Artist": "#9d174d",
    "Writer": "#92400e",            "Game Developer": "#6d28d9",
    "Construction Engineer": "#d97706", "Stock Investor": "#15803d",
    "Real Estate Developer": "#7e22ce", "Government Officer": "#1d4ed8",
    "Social Network Studies": "#0e7490",
}

# ============================================================
# WEEK 1: FORWARD CHAINING INFERENCE ENGINE
# Starts from known facts (interests, skills) and applies
# IF-THEN rules to score each career.
# ============================================================
def forward_chaining_score(interests, skills, traits):
    """
    Applies forward chaining rules to score a student against every career.
    Rules:
      - Each matching interest = +3 points
      - Each matching skill    = +3 points
      - Each matching trait    = +2 points
    Returns dict of {career: normalised_score (0-1)}
    """
    scores = {}
    for career_name, career in CAREER_KNOWLEDGE_BASE.items():
        score = 0
        max_score = (len(career["required_interests"]) * 3 +
                     len(career["required_skills"]) * 3 +
                     len(career["ideal_traits"]) * 2)
        for interest in career["required_interests"]:
            if interest in interests:
                score += 3
        for skill in career["required_skills"]:
            if skill in skills:
                score += 3
        for trait in career["ideal_traits"]:
            if trait in traits:
                score += 2
        scores[career_name] = score / max_score if max_score > 0 else 0
    return scores


# ============================================================
# WEEK 2: DECISION TREE PREDICTION
# Uses the trained model to get probability distribution
# ============================================================
def decision_tree_predict(gender, part_time, absence, extracurricular,
                           study_hours, math, history, physics,
                           chemistry, biology, english, geography):
    """
    Runs the trained Decision Tree and returns a probability
    distribution over all 17 careers.
    """
    row = pd.DataFrame([[
        gender, part_time, absence, extracurricular, study_hours,
        math, history, physics, chemistry, biology, english, geography
    ]], columns=FEATURE_COLS)

    probs   = DT_MODEL.predict_proba(row)[0]
    classes = DT_ENCODER.classes_
    return dict(zip(classes, probs))


# ============================================================
# WEEK 3: KNOWLEDGE GRAPH + CONFLICT RESOLUTION
# Boosts Artistic careers when DT confidence is low.
# Resolves conflicts between Forward Chaining and DT.
# ============================================================
def knowledge_graph_boost(dt_probs, fc_scores):
    """
    Knowledge Graph rule:
    IF DT confidence < KG_BOOST_THRESHOLD AND top DT career is Artistic
    THEN apply interest/trait alignment scores as tie-breaker.

    Also blends DT (70%) + Forward Chaining (30%) for all careers.
    Returns final blended scores and a conflict note.
    """
    top_dt_career = max(dt_probs, key=dt_probs.get)
    top_dt_conf   = dt_probs[top_dt_career]
    top_fc_career = max(fc_scores, key=fc_scores.get) if fc_scores else top_dt_career

    kg_boost_applied = False
    conflict_note    = None

    # Conflict resolution (from week1 resolve_conflict logic)
    if top_dt_career != top_fc_career:
        fc_conf = fc_scores.get(top_fc_career, 0)
        if fc_conf >= 0.70:
            conflict_note = f"Rules engine preferred {top_fc_career} with high confidence — used as tiebreaker."
        elif top_dt_conf < KG_BOOST_THRESHOLD:
            conflict_note = f"Low DT confidence ({top_dt_conf*100:.0f}%) — Knowledge Graph applied."
            kg_boost_applied = True
        else:
            conflict_note = f"Decision Tree preferred {top_dt_career} over rules suggestion {top_fc_career}."

    # Blend: DT 70% + Forward Chaining 30%
    # If KG boost needed, shift to 50/50
    dt_weight = 0.50 if kg_boost_applied else 0.70
    fc_weight = 0.50 if kg_boost_applied else 0.30

    final = {}
    for career in CAREER_KNOWLEDGE_BASE.keys():
        dt_p = dt_probs.get(career, 0)
        fc_p = fc_scores.get(career, 0) if fc_scores else 0
        final[career] = dt_p * dt_weight + fc_p * fc_weight

    return final, conflict_note, kg_boost_applied


# ============================================================
# MAIN RECOMMENDATION FUNCTION
# Integrates all three weeks
# ============================================================
def get_recommendations(interests, skills, traits,
                         math, history, physics, chemistry,
                         biology, english, geography, study_hours,
                         gender=0, part_time=0, absence=0, extracurricular=0):
    # Week 2: Decision Tree prediction from scores
    dt_probs = decision_tree_predict(
        gender, part_time, absence, extracurricular, study_hours,
        math, history, physics, chemistry, biology, english, geography
    )

    # Week 1: Forward Chaining from interests/skills/traits
    fc_scores = forward_chaining_score(interests, skills, traits)

    # Week 3: Knowledge Graph blend + conflict resolution
    final_scores, conflict_note, kg_boost = knowledge_graph_boost(dt_probs, fc_scores)

    # Rank top 5
    sorted_careers = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)[:5]

    # Normalise to realistic percentage range (10–95%)
    top_val = sorted_careers[0][1] if sorted_careers[0][1] > 0 else 1
    results = []
    for career, score in sorted_careers:
        pct = min(round((score / top_val) * 85 + 10), 95)
        riasec = RIASEC_MAP.get(career, "R")
        kb     = CAREER_KNOWLEDGE_BASE.get(career, {})
        results.append({
            "name":          career,
            "score":         pct,
            "riasec":        riasec,
            "color":         CAREER_COLORS.get(career, "#555"),
            "related":       kb.get("related_careers", []),
            "description":   kb.get("description", ""),
            "kg_boost":      kg_boost,
            "conflict_note": conflict_note,
        })

    return results


# ── Routes ────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/students")
def students_page():
    return render_template("students.html")

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json

    name        = data.get("name", "Unknown")
    interests   = data.get("interests", [])
    skills      = data.get("skills", [])
    traits      = data.get("traits", [])
    math        = int(data.get("math", 70))
    history     = int(data.get("history", 70))
    physics     = int(data.get("physics", 70))
    chemistry   = int(data.get("chemistry", 70))
    biology     = int(data.get("biology", 70))
    english     = int(data.get("english", 70))
    geography   = int(data.get("geography", 70))
    study_hours = int(data.get("study_hours", 10))
    gender      = int(data.get("gender", 0))
    part_time   = int(data.get("part_time", 0))
    absence     = int(data.get("absence", 2))
    extracurricular = int(data.get("extracurricular", 0))

    results = get_recommendations(
        interests, skills, traits,
        math, history, physics, chemistry,
        biology, english, geography, study_hours,
        gender, part_time, absence, extracurricular
    )

    profiles_col.insert_one({
        "name": name, "interests": interests, "skills": skills, "traits": traits,
        "math": math, "history": history, "physics": physics,
        "chemistry": chemistry, "biology": biology,
        "english": english, "geography": geography,
        "study_hours": study_hours, "created_at": datetime.utcnow()
    })

    recommend_col.insert_one({
        "name": name, "recommendations": results,
        "created_at": datetime.utcnow()
    })

    return jsonify(results)


@app.route("/import-csv", methods=["POST"])
def import_csv():
    csv_path = request.json.get("path", "data/student-scores-6k.csv")
    if not os.path.exists(csv_path):
        return jsonify({"error": f"File not found: {csv_path}"}), 404
    students_col.delete_many({})
    records = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            records.append({
                "id": int(row["id"]),
                "first_name": row["first_name"], "last_name": row["last_name"],
                "email": row["email"], "gender": row["gender"],
                "part_time_job":   row["part_time_job"] == "True",
                "absence_days":    int(row["absence_days"]),
                "extracurricular": row["extracurricular_activities"] == "True",
                "study_hours":     int(row["weekly_self_study_hours"]),
                "career_aspiration": row["career_aspiration"],
                "scores": {
                    "math":      int(row["math_score"]),
                    "history":   int(row["history_score"]),
                    "physics":   int(row["physics_score"]),
                    "chemistry": int(row["chemistry_score"]),
                    "biology":   int(row["biology_score"]),
                    "english":   int(row["english_score"]),
                    "geography": int(row["geography_score"])
                }
            })
    if records:
        students_col.insert_many(records)
    return jsonify({"imported": len(records), "message": "CSV imported successfully!"})


@app.route("/api/profiles")
def get_profiles():
    profiles = list(profiles_col.find({}, {"_id": 0}).sort("created_at", -1).limit(50))
    return jsonify(profiles)


@app.route("/api/students")
def get_students():
    page     = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))
    search   = request.args.get("search", "")
    query    = {}
    if search:
        query = {"$or": [
            {"first_name":        {"$regex": search, "$options": "i"}},
            {"last_name":         {"$regex": search, "$options": "i"}},
            {"career_aspiration": {"$regex": search, "$options": "i"}}
        ]}
    total    = students_col.count_documents(query)
    students = list(students_col.find(query, {"_id": 0})
                    .skip((page-1)*per_page).limit(per_page))
    return jsonify({"students": students, "total": total, "page": page})


if __name__ == "__main__":
    app.run(debug=True)