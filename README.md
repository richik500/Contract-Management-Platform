# 📜 Contractly - Contract Management Platform

Contractly is an enterprise-grade MERN stack application designed to manage the end-to-end lifecycle of legal documents. It features a dynamic blueprint engine, a strictly enforced state-machine workflow, and Role-Based Access Control (RBAC).

---

## 🏗️ Architecture & Technical Stack

The platform is built on a **Decoupled Client-Server Architecture** to ensure scalability and separation of concerns:

* **Frontend:** React (Vite) with **Tailwind CSS** for a high-fidelity, responsive "Enterprise Warm" UI.
* **Backend:** Node.js & Express REST API enforcing the system's business logic and state transitions.
* **Database:** MongoDB Atlas (NoSQL) for flexible document storage of dynamic blueprint schemas.
* **State Management:** React Hooks for local state and Axios for asynchronous API communication.

---

## ⚙️ Core Functional Implementation

### 1. Dynamic Blueprint Engine
Unlike static forms, Contractly allows admins to build custom templates with specific data constraints:
* **Field Diversity:** Supports Text, Native Date (Calendar Picker), Signature, and Details fields.
* **Single-Instance Logic:** The UI prevents duplicate field types (e.g., two 'Name' fields) to maintain data integrity.
* **Spatial Awareness:** Each field persists its **X/Y coordinates**, allowing for future document rendering and positioning.

### 2. Mandatory Compliance (Legal Guardrails)
* **Non-Editable T&C:** The "Terms & Conditions" field uses a fixed legal string that cannot be modified by the user during creation.
* **Validation Block:** The system blocks the saving of any blueprint that contains a T&C field unless the mandatory checkbox is explicitly ticked.

### 3. Strict State Machine & Audit Logs
The contract lifecycle follows a non-bypassable sequence to ensure procedural validity:
`Created → Approved → Sent → Signed → Locked`



* **Transition Guard:** The backend rejects "status jumping" (e.g., moving from Created to Signed directly).
* **Immutability:** Once a contract is **Locked**, the API prevents any further modifications, preserving the audit trail.
* **Audit History:** Every transition is recorded in a `history` array with timestamps and action descriptions.

### 4. Role-Based Access Control (RBAC)
The UI dynamically adapts based on the logged-in user's role:
* **ADMIN:** Can create/delete blueprints, approve contracts, send documents, and lock final versions.
* **SIGNER:** Has a restricted view; can only interact with contracts in the `Sent` state to provide a signature.

---

## 📊 Dashboard Organization

To handle high volumes of contracts, the dashboard utilizes a **Tabbed Filtering System**:
* **Pending:** Contracts in the `Created` (Draft) phase.
* **Active:** Documents currently in the pipeline (`Approved` or `Sent`).
* **Completed:** Finalized records (`Signed` or `Locked`).
* **Privacy Filter:** Signature fields are automatically hidden from blueprint previews to maintain data privacy.

---

## 🚀 Installation & Local Setup

### Prerequisites
* Node.js (v18+)
* MongoDB Atlas Account

### 1. Backend Setup
1.  `cd backend`
2.  `npm install`
3.  Create a `.env` file: `MONGO_URI=your_mongodb_connection_string`
4.  `node server.js` (Runs on Port 5000)

### 2. Frontend Setup
1.  `cd frontend`
2.  `npm install`
3.  `npm run dev` (Runs on Port 5173)

---

## ⚖️ Strategic Assumptions & Trade-offs
* **Revocation over Deletion:** Contracts cannot be deleted once they enter the pipeline; they can only be `Revoked` to ensure a permanent audit record exists.
* **Mocked Auth:** For the purpose of this technical assessment, roles are toggled via a UI switcher to demonstrate RBAC logic without the overhead of a full JWT implementation.
* **Native UI Components:** Utilized browser-native date pickers to ensure maximum compatibility and accessibility without external library bloat.

---
