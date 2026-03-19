# AI Consulting Platform

A modern Next.js web application for managing AI consulting engagements across a structured 5-phase Strategic Roadmap. Built for consulting teams to track client portfolios, run AI-assisted discovery, and generate professional deliverables — all in one place.

## 🚀 Key Features

### Portfolio Intelligence
- **Executive Dashboard** — Live KPI cards, pipeline value by phase, delivery velocity, top AI initiatives, and 8-domain maturity benchmarking (Recharts)
- **Customer Portfolio** — Multi-client tracking with industry, phase, ambition level, and readiness scores at a glance
- **Analytics** — Radar, bar, and pie chart views across the full portfolio

### 5-Phase AI Journey Navigator
Guides engagements through a structured methodology with per-phase subtask checklists and deliverable generation:
1. **Discovery & Readiness** — 8-domain assessment wizard (Strategy, Technology, Data, Security, Skills, Operations, Governance, Financial)
2. **Strategy & Roadmap** — Use case backlog, initiative quadrant (drag & drop complexity/value matrix), ROI modelling
3. **PoV Execution** — Proof of value tracking with timeframes, success criteria, and notes per initiative
4. **Change & Adoption** — Change management planning with categorised action items
5. **Value Realization** — Production use case tracking, realized value logging, KPI monitoring

### AI Intake
Paste raw meeting notes from a discovery call and the platform automatically:
- Extracts **readiness scores** across all 8 assessment domains
- Proposes **use cases** based on business pain points
- Presents a **review panel** — consultant approves, rejects, or edits each finding before saving
- Commits approved items directly to the client's assessment and Phase 2 roadmap

See [`AI_INTAKE_DEMO_NARRATIVE.md`](AI_INTAKE_DEMO_NARRATIVE.md) for a step-by-step demo script.

### Deliverable Generation
- **MS Word (.docx)** — One-click export of strategy maps, gap analyses, governance frameworks, and financial models
- **PowerPoint (.pptx)** — Full client strategy deck generated from live platform data
- **Print-ready report** — Gap analysis report formatted for PDF printing

### Initiative Quadrant
Drag-and-drop 2D matrix (Complexity × Value) with automatic cluster spreading when multiple use cases share the same position — all items remain visible and individually interactive.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | SQLite via Prisma 7 (`@prisma/adapter-better-sqlite3`) |
| Charts | Recharts |
| Icons | Lucide React |
| Documents | `docx`, `pptxgenjs`, `marked` |

---

## 📦 Local Setup

1. **Clone the repository**
    ```bash
    git clone https://github.com/adkaris/ai-consulting-platform.git
    cd ai-consulting-platform
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up the database — choose one option:**

    **Option A — Demo snapshot (recommended)**
    Pre-built database with 8 demo companies, assessments, use cases, and full roadmap data:
    ```bash
    cp demo.db dev.db
    ```

    **Option B — Fresh database**
    Empty schema, optionally seeded with the same 8 companies:
    ```bash
    npx prisma db push
    npx tsx prisma/seed.ts
    ```

4. **Start the development server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages & Server Actions
│   ├── actions.ts        # All server actions (customers, use cases, phases, deliverables)
│   ├── customers/        # Portfolio listing + per-customer profile, intake, assessment, report
│   ├── use-cases/        # Global use case backlog
│   ├── analytics/        # Portfolio charts
│   ├── action-plan/      # Consultant task queue
│   └── settings/         # Platform config & methodology reference
├── components/           # React client components
│   ├── ProfileWorkflow.tsx        # Main customer profile orchestrator (5-phase workflow)
│   ├── UseCaseQuadrant.tsx        # Drag & drop initiative matrix
│   ├── PoVDetailModal.tsx         # PoV execution details per use case
│   ├── ChangeItemModal.tsx        # Change management item editor
│   └── ...
└── lib/
    ├── ai-intake.ts               # Meeting notes analyser
    ├── methodology.ts             # 5-phase framework definition
    ├── assessment-data.ts         # 8 domains, 47 questions, scoring weights
    ├── deliverable-generators.ts  # Markdown templates per deliverable
    ├── docx-utils.ts              # Word document generation
    └── pptx-utils.ts              # PowerPoint generation
prisma/
├── schema.prisma          # Data model
└── seed.ts                # 8 demo companies with full engagement data
```

---

## 🎬 Demo

A Playwright screen recording script is included:
```bash
node record-demo.mjs   # requires app running on localhost:3000
```
Output: `demo-output/ai-intake-demo.webm`

---

## 📄 License
Internal use only.
