# ResearchX — Autonomous Executive Intelligence & Research Platform

ResearchX is a modern, full-stack multi-agent research intelligence application built with a **FastAPI backend** and a vibrant **React frontend**.

---

## 🌟 Key Features

1. **Modern Colorful Logo & Aesthetic**:
   - Custom chromatic gradient hexagonal prism logo with a glowing neural "X".
   - Vibrant multi-stop neon gradients, dark & light themes, glassmorphism (`backdrop-filter: blur(20px)`), and micro-animations.
2. **Executive-Level Presentation (Zero Pipeline Clutter)**:
   - High-level intelligence workspace designed for executives and analysts.
   - Milestone synthesis tracking (*Global Discovery $\rightarrow$ Evidence Ingestion $\rightarrow$ Intelligence Synthesis $\rightarrow$ Peer Review*).
3. **Multi-Tab Intelligence Studio**:
   - 📑 **Executive Brief**: High-impact TL;DR, strategic metrics, and key takeaways.
   - 📖 **Deep Analysis**: Formatted report with styled headers, code blocks, and callout quotes.
   - 💡 **Key Findings**: Interactive evidentiary cards with category and impact indicators.
   - 🌐 **Source Intelligence**: Domain-badged source references with direct link-outs.
   - 🎯 **Quality Scorecard**: Visual dial rating (e.g., 9.6/10), rigor metrics, and verification checkmarks.
4. **Export Suite**:
   - One-click copy formatted report to clipboard.
   - Download complete Markdown (`.md`) research dossier.
   - Print-ready PDF stylesheet export.
5. **Persistent Intelligence Library**:
   - Side drawer to browse, search, and reload previously synthesized research reports.

---

## 🚀 How to Run Locally

### 1. Start the FastAPI Backend
Open a terminal in the project root:
```bash
# Install backend dependencies
pip install -r backend/requirements.txt

# Run the FastAPI server (runs on http://127.0.0.1:8000)
python backend/main.py
```

### 2. Start the React Frontend
Open a second terminal in the `frontend/` directory:
```bash
cd frontend

# Install frontend dependencies
npm install

# Start Vite development server (runs on http://localhost:3000)
npm run dev
```

Visit **`http://localhost:3000`** in your browser to start synthesizing deep research!
