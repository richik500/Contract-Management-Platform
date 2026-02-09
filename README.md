# 📜 Contractly - Contract Management Platform (Full Stack)

Contractly is an enterprise-grade MERN stack application designed for secure document lifecycle management. It features a dynamic blueprint engine, a strictly enforced backend state-machine, and full containerization for seamless deployment.

---

## 🏗️ Architecture & Technical Stack

The platform is built on a **Decoupled Client-Server Architecture** ensuring a clear separation between business logic and the presentation layer:

* **Frontend:** React (Vite) with **Tailwind CSS** for a professional, responsive interface.
* **Backend:** Node.js & Express REST API enforcing the system's business logic and state transitions.
* **Database:** MongoDB Atlas (NoSQL) for flexible schema management of dynamic blueprints.
* **Containerization:** Docker & Docker Compose for environment parity and simplified setup.

---

## ⚙️ Core Functional Implementation

### 1. Dynamic Blueprint Engine & Privacy
* **Custom Templates:** Admins can build templates with Text, Native Date (Calendar Picker), and Details fields.
* **Privacy-First Gallery:** The "Available Blueprints" dashboard automatically filters out and hides **Signature** fields to maintain data privacy in public views.

### 2. Mandatory Compliance Guardrails
* **MANDATORY T&C:** The system enforces a strict legal check. A blueprint cannot be saved unless the **Terms & Cond** field is included and the mandatory checkbox is explicitly ticked by the creator.
* **Non-Editable Text:** Legal terms are fixed and non-editable to ensure consistency across all document instances.

### 3. Strict State Machine & Audit Logs
The contract lifecycle follows a non-bypassable sequence to ensure procedural validity:
`Created → Approved → Sent → Signed → Locked`

* **Transition Guard:** The backend rejects "status jumping" (e.g., you cannot move from 'Created' to 'Signed' directly).
* **Audit History:** Every transition is recorded with a timestamp and description, providing a permanent record of the document's journey.

---

## 🐳 Docker Support (Optional Task Completed)

This project is fully containerized to eliminate "it works on my machine" issues. To run the entire stack (Frontend + Backend) with a single command:

1.  Ensure you have **Docker Desktop** installed.
2.  In the root folder, run:
    ```bash
    docker-compose up --build
    ```
3.  **Frontend:** `http://localhost:5173`
4.  **Backend API:** `http://localhost:5000`

---

## 🚀 Manual Installation

### 1. Backend Setup
1.  `cd backend`
2.  `npm install`
3.  Create a `.env` file: `MONGO_URI=your_mongodb_atlas_url`
4.  `node server.js`

### 2. Frontend Setup
1.  `cd frontend`
2.  `npm install`
3.  `npm run dev`

---

## ⚖️ Senior-Level Assumptions
* **Role-Based UI:** The dashboard adapts actions based on the selected role (Admin vs. Signer) to demonstrate RBAC principles.
* **Immutability:** Once a contract reaches the `Locked` status, all further modifications are blocked by the API.
* **Native UI:** Used browser-native date pickers to ensure accessibility and performance without heavy external libraries.

---