import chromadb
from chromadb.config import Settings
import os

VECTOR_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_db")

class VectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=VECTOR_DB_PATH)
        self.collection = self.client.get_or_create_collection(name="a1_documents")

    def add_documents(self, ids: list[str], documents: list[str], metadatas: list[dict]):
        self.collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )

    def query_documents(self, query_texts: list[str], n_results: int = 5, where: dict = None):
        return self.collection.query(
            query_texts=query_texts,
            n_results=n_results,
            where=where
        )

vector_store = VectorStore()
