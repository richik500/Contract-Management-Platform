# 📜 Contractly: Enterprise Contract Lifecycle Management

**Contractly** is a high-fidelity, full-stack platform designed to manage the entire lifecycle of legal documents. It allows administrators to build dynamic "Blueprints" (templates) and move generated contract instances through a strictly enforced state machine.

---

## 🏗️ Architecture & Tech Stack

This project is built using the **MERN** (MongoDB, Express, React, Node.js) stack, chosen for its flexibility and speed in handling dynamic data:

* **Frontend (React + Vite):** Utilizes a full-width, responsive dashboard layout.
* **Styling (Tailwind CSS):** Implements a custom "Warm Enterprise" theme for a professional user experience.
* **Backend (Node.js + Express):** A RESTful API that serves as the system's "Source of Truth" and State Machine.
* **Database (MongoDB):** A NoSQL document store that persists blueprint structures and contract states.

---

## ⚙️ Core Logic & Requirements Compliance

### 1. Blueprint Management

To satisfy the requirement for dynamic template creation, the system supports:

* **Field Types:** +Add Name (Text), +Add Date (Calendar Picker), and +Add Sign (Signature placeholder).
* **Custom Labels:** Every field allows for a unique label (e.g., "Joining Date" instead of just "Date").
* **Spatial Data (X/Y):** Every field captures and persists numerical coordinates (X/Y) to support future document rendering.

### 2. Contract Generation

* When a user clicks "Create Contract" from an available blueprint, the system generates a unique instance.
* The contract **inherits** the exact field structure of the blueprint at that moment, ensuring consistency.

### 3. Strict State Machine Lifecycle

The most critical demand of the project is the enforcement of the contract pipeline. We have implemented a backend guard that prevents "status jumping".

**The Workflow:**

1. **Created:** The initial stage. Contracts can be renamed or revoked.
2. **Approved:** Verified by an admin.
3. **Sent:** Dispatched to the signing party.
4. **Signed:** Formally executed.
5. **Locked:** The final, immutable state. No further changes allowed.

---

## 🛠️ How it Works (Step-by-Step)

### Phase 1: Blueprinting

* Navigate to **Section 1: Create a Blueprint**.
* Enter a Name and add your desired details (Name, Date, or Sign).
* Click **Save Blueprint**. It will instantly appear in the Library.

### Phase 2: Instantiation

* Locate your template in **Section 2: Available Blueprints**.
* Click **Create Contract**.
* The card dynamically shows the Name and Date fields you defined for that specific template.

### Phase 3: Pipeline Management

* Find your contract in **Section 3: Contract Dashboard**.
* The system only shows the "Next Logical Action" (e.g., you can't click "Sign" until you have clicked "Send").
* **Revocation:** At any point before "Locked," you can click "Revoke" to terminate the document.

---

## 🚀 Installation & Setup

### Prerequisites

* Node.js installed.
* MongoDB Atlas connection string.

### 1. Backend Setup

1. Go to `/backend` folder.
2. Run `npm install`.
3. Create a `.env` file and add: `MONGO_URI=your_mongodb_url`.
4. Start server: `node server.js` (Running on Port 5000).

### 2. Frontend Setup

1. Go to `/frontend` folder.
2. Run `npm install`.
3. Start dashboard: `npm run dev`.

---

## ⚖️ Trade-offs & Assumptions

* **X/Y Positioning:** While stored in the database for compliance, coordinates are hidden in the UI to keep the dashboard clean.
* **Immutability:** Once a contract is "Locked" or "Revoked," all buttons are disabled to prevent data tampering.
* **Audit Trail:** Deletion is restricted on the dashboard to ensure a permanent record of all progressed contracts exists via the "Revoked" or "Locked" status.

---

*This project was developed as a comprehensive full-stack submission for the Contract Management Platform Assignment.*

---
