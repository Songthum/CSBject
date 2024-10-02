import re
from pdfminer.high_level import extract_text
from pymongo import MongoClient
import sys
import logging

# ตั้งค่า logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

client = MongoClient('mongodb+srv://s6304062636120:sknk2563@cluster0.upocefc.mongodb.net/CSB?retryWrites=true&w=majority&appName=Cluster0')

def get_data_from_mongodb(database_name, collection_name):
    try:
        db = client[database_name]
        collection = db[collection_name]
        data = collection.find_one()
        return data
    except Exception as e:
        logging.error(f"Error connecting to MongoDB: {e}")
        return None

def get_files_from_mongodb(student_id):
    try:
        db = client['CSB']
        collection = db['filepdfs']
        file_docs = collection.find_one({'F_id': student_id})
        if file_docs:
            return file_docs.get('F_ST1', [])
        return []
    except Exception as e:
        logging.error(f"Error connecting to MongoDB: {e}")
        return []

# ฟังก์ชันบันทึกผลลัพธ์ไปที่ MongoDB
def update_results_in_mongodb(student_id, result):
    try:
        db = client['CSB']
        collection = db['filepdfs']
        document = collection.find_one({'F_id': student_id})

        if document:
            logging.info(f"Document found for student_id: {student_id} -> {document}")
        else:
            logging.info(f"No document found for student_id: {student_id}")

        update_result = collection.update_one(
            {'F_id': student_id},
            {'$set': {'fi_result': result}}
        )
        logging.info(f"Updated fi_result for student_id: {student_id}, matched_count: {update_result.matched_count}, modified_count: {update_result.modified_count}")

        if update_result.modified_count == 0:
            logging.info(f"No documents were updated for student_id: {student_id}")
        else:
            logging.info(f"Document updated successfully for student_id: {student_id}")

    except Exception as e:
        logging.error(f"Error updating MongoDB: {e}")

# ฟังก์ชันตรวจสอบทะเบียนเรียนวิชา 040613141 Special Project I
def check(file_path, student_id):
    student_id = student_id.strip().replace("s", "")
    mongodb_data = get_data_from_mongodb('CSB', 'english_subjects')

    if mongodb_data:
        try:
            # ข้อมูลที่จำเป็นสำหรับการตรวจสอบ
            total_credits_required = 102
            project_credits_required = 57

            # ตรวจสอบวิชา 040613141 Special Project I
            data_to_search = "040613141"  # ชื่อวิชา
            text = extract_text(file_path)

            # นับหน่วยกิต
            total_credits = text.count(data_to_search) * 3  # สมมติว่าแต่ละวิชาให้ 3 หน่วยกิต
            project_credits = len(re.findall(r'0406\d{3}', text))  # นับวิชาภาคที่เริ่มด้วย 0406
            
            if total_credits >= total_credits_required and project_credits >= project_credits_required:
                update_results_in_mongodb(student_id, "Pass: ได้ผลการเรียนรวม ≥ 102 หน่วยกิต และวิชาภาค ≥ 57 หน่วยกิต")
            else:
                update_results_in_mongodb(student_id, "Fail: ไม่ตรงตามเกณฑ์การเรียน")
        
        except Exception as e:
            update_results_in_mongodb(student_id, f"Error processing PDF or regular expression: {e}")
    else:
        update_results_in_mongodb(student_id, "Failed to retrieve data from MongoDB")

# ฟังก์ชันหลัก
def main():
    if len(sys.argv) != 2:
        sys.exit(1)

    student_id = sys.argv[1]
    files = get_files_from_mongodb(student_id)

    if not files:
        print(f"No files found for student ID: {student_id}")
        sys.exit(1)

    for file_path in files:
        if file_path and isinstance(file_path, str) and file_path.endswith('.pdf'):
            check(file_path, student_id)
        else:
            print(f"Invalid file path or not a PDF: {file_path}")

if __name__ == "__main__":
    main()
