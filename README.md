# 🎓 Learn Agent: Autonomous Academic Intelligence System (A1 Engine)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

**Learn Agent** is a state-of-the-art, multi-agent academic ecosystem designed to autonomously guide students toward academic excellence. By leveraging advanced AI orchestration, it provides personalized learning paths, real-time analytics, and an intelligent examination engine.

---

## 🚀 Key Features

- **🧠 Intelligent Agent Orchestration**: Powered by `LangGraph`, our controller dynamically routes tasks between specialized agents (Chat, RAG, Planner, Evaluator).
- **📚 Advanced RAG (Retrieval-Augmented Generation)**: Seamlessly extract knowledge from PDFs, course syllabi, and even YouTube lectures using `ChromaDB`.
- **📊 Real-time Analytics**: Visualize your learning progress with Topic Mastery Radars and Accuracy Path tracking powered by `Recharts`.
- **📝 Exam Intelligence**: A full-scale mock exam engine with strict timer constraints and automated AI evaluation.
- **🌗 Premium UI/UX**: A sleek, dark-mode focused interface built with `Vite`, `React`, and `TailwindCSS`.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Python, FastAPI, LangChain, LangGraph |
| **Database** | PostgreSQL (SQLAlchemy), ChromaDB (Vector Search) |
| **Frontend** | React, Vite, TailwindCSS, Recharts |
| **Orchestration** | Multi-Agent System (MAS) |
| **Deployment** | Docker, Docker Compose |

---

## ⚙️ Installation & Setup

### 📋 Prerequisites
- **Node.js** (v18+)
- **Python** (3.10+)
- **PostgreSQL** (Port 5432)
- **OpenAI API Key**

### 1️⃣ Database Setup
Create a PostgreSQL database named `a1engine`:
```bash
createdb -U postgres a1engine
```

### 2️⃣ Backend Configuration
1. Navigate to the backend:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1 # Windows
   source venv/bin/activate    # Linux/Mac
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env` with your `OPENAI_API_KEY`.
5. Start the server:
   ```bash
   uvicorn main:app --reload
   ```

### 3️⃣ Frontend Configuration
1. Navigate to the frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```

---

## 🏗️ Architecture Overview

The system operates on a decentralized agent model where the **Agent Controller** acts as the brain, delegating tasks to:
- **Chat Agent**: For general queries and explanations.
- **RAG Agent**: For context-aware information retrieval.
- **Planner**: For creating personalized study schedules.
- **Analyzer**: For parsing complex academic documents.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Developed by Ananthapadmanabhan 
