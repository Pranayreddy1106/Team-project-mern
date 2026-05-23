# Backend Overview

- **Location:** `backend/`
- **Purpose:** Server‑side logic – Express routes, controllers, Mongoose models, middleware, utilities, and configuration.
- **Key entry point:** `backend/server.js`
- **Structure:**
  - `controllers/` – request handling logic.
  - `routes/` – API endpoint definitions.
  - `models/` – Mongoose schemas.
  - `middleware/` – auth, error handling, role checks.
  - `utils/` – helper functions (e.g., token generation, progress calculation).
- **Guidelines:** Keep all API, database, and business‑logic code here. Do not place any React/UI files in this folder.
