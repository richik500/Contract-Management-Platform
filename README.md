# 📜 Contractly - Full-Stack Contract Management Platform

Contractly is an enterprise-grade platform designed to manage the end-to-end lifecycle of contracts. It allows users to create dynamic templates (Blueprints) and manage generated contract instances through a strict, non-bypassable workflow.

## 🏗️ Architecture Overview

This application is built using the **MERN Stack** (MongoDB, Express, React, Node.js) with a focus on data integrity and state management.

* **Frontend:** Developed with **React (Vite)** and **Tailwind CSS**. It uses a full-screen, responsive dashboard layout to provide a high-end management experience.
* **Backend:** A **Node.js & Express** REST API that enforces lifecycle transitions and manages blueprint persistence.
* **Database:** **MongoDB Atlas** was selected for its flexible document-based schema, allowing contract blueprints to store dynamic field arrays (Text, Date, Signature) seamlessly.

## ⚙️ Key Features & Functional Demands

### 1. Blueprint Management

* **Dynamic Customization:** Users can build templates with three supported field types: **Name** (Text), **Date** (Calendar Picker), and **Sign** (Signature).
* **Spatial Persistence:** To satisfy spatial requirements, every field stores its type, custom label, and **X/Y coordinates** for document positioning.
* **Intelligent UI:** Available blueprints display dynamic badges showing only the Name and Date fields defined by the creator.

### 2. Contract Lifecycle State Machine

The platform enforces a strict, linear progression to ensure legal and procedural validity:
**Created → Approved → Sent → Signed → Locked**

* **Strict Validation:** The backend rejects any attempt to "skip" stages or move backward in the pipeline.
* **Immutability:** Once a contract reaches the **Locked** state, the API prevents any further edits or status changes to preserve the audit trail.
* **Revocation:** Contracts can be **Revoked** at any active stage to terminate the workflow.

### 3. Management Dashboard

* A comprehensive view of all active and archived contracts.
* **Contextual Actions:** Buttons for "Approve," "Send," and "Sign" only appear when the contract is in the appropriate stage of its lifecycle.

## 🛠️ Setup & Installation

### Prerequisites

* Node.js (v16+)
* MongoDB Atlas Account

### Backend Setup

1. Navigate to `/backend` and run `npm install`.
2. Create a `.env` file and add: `MONGO_URI=your_mongodb_connection_string`.
3. Run `node server.js` (Server starts on Port 5000).

### Frontend Setup

1. Navigate to `/frontend` and run `npm install`.
2. Run `npm run dev` to launch the dashboard.

## ⚖️ Assumptions & Trade-offs

* **Positioning UI:** While X/Y coordinates are fully supported and persisted in the database, they are hidden in the UI to prioritize a clean, professional dashboard aesthetic.
* **Audit Trail:** The system uses "Revoke" rather than "Delete" for progressed contracts to maintain a legally sound history of all document instances.
* **Authentication:** Per the assignment instructions, authentication is mocked to focus on full-stack data flow and lifecycle logic.

---

*Developed as a full-stack submission for the Contract Management Platform assignment.*

---
