# AI Consulting Platform

A modern, comprehensive Next.js web application for tracking and managing AI consulting engagements across a 5-phase Strategic Roadmap. Designed with a premium glassmorphism aesthetic, this platform provides execution teams with deep portfolio intelligence and automated deliverable processing.

## 🚀 Key Features

*   **Executive Dashboard**: Highly visual portfolio intelligence featuring Recharts-integrated metrics:
    *   Pipeline Value by Phase (ROI distribution)
    *   Delivery Velocity (Use Case status tracking)
    *   Top AI Initiatives Tracking
    *   Maturity Benchmarking (8-domain radar/metrics)
*   **5-Phase AI Journey Navigator**: Guides users through a structured methodology (Discovery, Strategy, PoV, Change Management, Value Realization).
*   **Customer Portfolio Management**: Track multiple organizations and their current positioning on the AI roadmap.
*   **Automated Deliverable Generation**: Synthesize strategy maps, financial models, and governance frameworks using dynamic markdown.
*   **MS Word Integration**: One-click generation and downloading of DOCX deliverables directly from the AI drafts.
*   **Database Seeding**: Robust synthetic data generation with automatic history backfilling for realistic testing.

## 🛠️ Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **UI Components & Icons**: Recharts, Lucide React
*   **Database**: SQLite via [Prisma ORM](https://www.prisma.io/) (`@prisma/adapter-better-sqlite3`)
*   **Document Generation**: `docx`, `marked`

## 📦 Local Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/adkaris/ai-consulting-platform.git
    cd ai-consulting-platform
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set up the Database — choose one option:**

    **Option A — Demo snapshot (recommended):** Use the pre-built database with 8 demo companies, assessments, use cases, and roadmap data ready to go:
    ```bash
    cp demo.db dev.db
    ```

    **Option B — Fresh database:** Start with an empty schema and optionally seed it:
    ```bash
    npx prisma db push
    npx tsx prisma/seed.ts   # populates 8 demo companies
    ```

4.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 📁 Project Structure

*   `src/app/` - Next.js App Router pages and Server Actions.
*   `src/components/` - Reusable React components (Dashboard, Forms, Buttons).
*   `src/lib/` - Core utilities (Prisma client, Methodology config, DOCX generation).
*   `prisma/` - Database schema (`schema.prisma`) and the synthetic data seed script.

## 📄 License
Internal use only.
