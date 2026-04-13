from pymongo import MongoClient
import csv

client = MongoClient('mongodb://localhost:27017/')
db = client['careerpath']
col = db['students']

# clear existing data
col.delete_many({})

records = []

with open('data/student-scores-6k.csv', newline='', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        records.append({
            'first_name': row['first_name'],
            'last_name': row['last_name'],
            'email': row['email'],
            'gender': row['gender'],
            'part_time_job': row['part_time_job'] == 'True',
            'absence_days': int(row['absence_days']),
            'extracurricular': row['extracurricular_activities'] == 'True',
            'study_hours': int(row['weekly_self_study_hours']),
            'career_aspiration': row['career_aspiration'],
            'scores': {
                'math': int(row['math_score']),
                'biology': int(row['biology_score']),
                'english': int(row['english_score'])
            }
        })

# insert into MongoDB
col.insert_many(records)

print("Imported:", col.count_documents({}), "students")