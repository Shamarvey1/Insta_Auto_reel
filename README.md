# Instagram Auto-Reel Agent (InstaAutoReel)

An autonomous AI-powered vertical video (9:16) creation engine powered by LangGraph.js, Claude API, Text-to-Speech, and FFmpeg composition.

## Project Structure

```text
Auto_reel_Insta/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── reelRoutes.js
│   ├── controllers/
│   │   └── reelController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── services/
│   ├── utils/
│   │   └── validators.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── StatusIndicator.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Running the Application

### 1. Start the Backend

```bash
cd backend
npm install
node server.js
```

Backend will run on `http://localhost:5000` (`http://127.0.0.1:5000`).
Health check: `curl http://localhost:5000/api/health`

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Milestone Progress

- [x] **Milestone 1**: Initial Project Setup (Express backend with `/api/health`, centralized error handler, React + Vite frontend with Tailwind CSS, backend connection status indicator).
- [ ] **Milestone 2**: Content Idea & Script Writing Agents (Claude API + LangGraph.js).
- [ ] **Milestone 3**: Scene Planning & Text-to-Speech Narration.
- [ ] **Milestone 4**: FFmpeg Vertical Video Rendering & Subtitle Engine.
- [ ] **Milestone 5**: Quality Control & Interactive Dashboard.

