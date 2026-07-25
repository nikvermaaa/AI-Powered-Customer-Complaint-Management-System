# AI-Powered Customer Complaint Management System

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

An intelligent, state-driven Quality Assurance platform that transforms unstructured customer feedback (emails, PDFs, text) into structured, actionable database records. Powered by **FastAPI**, **React**, **LangGraph**, and **Groq LPU acceleration**, this system features real-time data extraction and non-destructive form updates.

## Key Features

* **Multi-Format Ingestion:** Directly parse PDFs, DOCX, and EML files in-memory (`io.BytesIO`) without writing temporary files to disk.
* **Instant AI Extraction:** Utilizes Groq's LPUs and `llama-3.1-8b-instant` for sub-second, highly accurate data mapping from unstructured text.
* **Stateful Context (LangGraph):** The AI understands current form state, allowing users to issue conversational corrections (e.g., *"Change the priority to urgent"*) without overwriting previously filled fields.
* **Type-Safe Outputs (Pydantic):** Guaranteed structural JSON generation, preventing hallucinated database columns or application crashes.
* **Centralized State (Redux Toolkit):** Seamless bidirectional synchronization between manual user typing and AI-generated form fills.
* **Cloud Persistence:** Fully integrated with Aiven MySQL via SQLAlchemy ORM.

---

## Architecture Overview

1. **Frontend (React/Redux):** Manages a dynamic, two-column UI (Form View & AI Assistant). Dispatches user inputs and AI extractions to a unified Redux store.
2. **Backend API (FastAPI):** Exposes asynchronous endpoints for file parsing, LLM inference, and database transactions.
3. **AI Engine (LangGraph + Groq):** Takes parsed text and current form state, executing a targeted prompt to return Pydantic-validated JSON deltas.
4. **Database (MySQL):** Stores finalized complaint records, accessible via a dedicated Dashboard view.

---

## Installation & Local Setup

Follow these instructions to run the project locally on your machine.

### Prerequisites
* **Python 3.9+**
* **Node.js 18+** & **npm**
* **MySQL Database** (Local or Cloud like Aiven)
* **Groq API Key** (Get one free at [console.groq.com](https://console.groq.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/AI-Powered-Customer-Complaint-Management-System.git
cd AI-Powered-Customer-Complaint-Management-System
```

### 2. Backend Setup
Navigate to the backend directory and set up a virtual environment:

```bash
cd backend
python3 -m venv env

# On macOS/Linux:
source env/bin/activate
# On Windows:
env\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

**Configure Backend Environment Variables:**
Create a `.env` file in the `backend/` directory:
```env
# backend/.env
GROQ_API_KEY=gsk_your_actual_api_key_here
DATABASE_URL=mysql+pymysql://username:password@your-database-host:port/defaultdb
```

**Run the FastAPI Server:**
```bash
uvicorn app.main:app --reload
```
*The backend will now be running at `http://localhost:8000`. API documentation is automatically available at `http://localhost:8000/docs`.*

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

**Configure Frontend Environment Variables:**
Create a `.env` file in the `frontend/` directory (if you are using Vite):
```env
# frontend/.env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Run the React Development Server:**
```bash
npm run dev
```
*The frontend will now be running (typically at `http://localhost:5173`).*

---

## Usage Guide

1. **Log a New Complaint:** Open the web app. You will see a blank complaint form on the left and the AI Assistant on the right.
2. **Upload or Type:** Drag and drop a customer email (.eml), a scanned report (.pdf), or paste raw text into the AI Assistant.
3. **AI Extraction:** Watch as the AI instantly reads the document and populates the exact fields on the left (Customer Name, Product, Priority, etc.).
4. **Conversational Edits:** If the AI missed something, type a command like *"The batch number is actually B-992"*. The form will update automatically without erasing the rest of the data.
5. **Save to Database:** Review the extracted data. Manually tweak any fields if necessary, then click **Save Complaint**.
6. **View Dashboard:** Toggle to the **Dashboard** view to see all historical complaints securely stored in your MySQL database.
