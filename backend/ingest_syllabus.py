import os
import uuid
import sys
# Add backend directory to sys.path so we can import modules
sys.path.append(os.path.dirname(__file__))

from core.vector_db import vector_store
from langchain_text_splitters import RecursiveCharacterTextSplitter

def ingest_syllabus():
    filepath = os.path.join(os.path.dirname(__file__), "uploads", "ktu_s5_aiml_syllabus.txt")
    print(f"Reading syllabus from {filepath}...")
    
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        print("Initializing text splitter...")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100,
            length_function=len,
        )
        
        print("Splitting text into chunks...")
        chunks = text_splitter.split_text(content)
        
        unique_filename = "ktu_s5_aiml_syllabus.txt"
        ids = [f"{unique_filename}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"filename": unique_filename, "source": "local_ingestion"} for _ in range(len(chunks))]
        
        print(f"Adding {len(chunks)} chunks to vector store...")
        vector_store.add_documents(ids=ids, documents=chunks, metadatas=metadatas)
        print("Syllabus successfully ingested into the A1 Engine's knowledge base!")
        
    except Exception as e:
        print(f"Failed to ingest syllabus: {str(e)}")

if __name__ == "__main__":
    ingest_syllabus()
