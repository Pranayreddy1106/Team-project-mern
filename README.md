# EduFlow – Project Structure

## 📁 Directory Overview

- **`backend/`** – All server‑side code (Express API, Mongoose models, middleware, routes, utilities, and configuration). Keep everything related to the API, database, authentication, and business logic here.
- **`frontend/`** – The client‑side React application (components, pages, context, services, assets, and styling). All UI/UX code lives in this folder.

---

### 🛠️ Backend
- Entry point: `backend/server.js`
- API routes are defined under `backend/routes/`
- Controllers under `backend/controllers/`
- Mongoose schemas in `backend/models/`
- Keep authentication logic in `backend/middleware/` and utilities in `backend/utils/`

### 🎨 Frontend
- Entry point: `frontend/src/index.js`
- Main app component: `frontend/src/App.jsx`
- UI components: `frontend/src/components/`
- Pages (routes): `frontend/src/pages/`
- State management via Context in `frontend/src/context/`
- API calls abstracted in `frontend/src/services/`

---

> **Note:** Do **not** mix backend files into the `frontend/` folder or vice‑versa. This separation helps with clear responsibility boundaries, easier builds, and smoother deployments.
