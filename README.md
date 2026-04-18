# Agile Scaling Decision Support System (DSS)

An AI-driven web application designed to help organizational leaders select the most appropriate agile scaling framework (SAFe, LeSS, Scrum@Scale, etc.) based on their specific context.

---

## Overview

This system utilizes a **Multi-Criteria Decision Analysis (MCDA)** engine—specifically the **Simple Additive Weighting (SAW)** algorithm—to rank frameworks across six core pillars:

- Governance  
- Market Dynamics  
- Organizational Culture  
- Flexibility  
- Team Size  
- Technical Excellence  

It further enhances these quantitative results with qualitative strategic insights powered by the **Gemini 2.5 Flash AI**.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4  
- **Backend:** Next.js API Routes (Serverless)  
- **Database:** PostgreSQL with Prisma ORM  
- **Authentication:** Firebase Auth (Google SSO & Email/Password)  
- **AI Integration:** Google Gemini 2.5 Flash API  
- **Deployment:** Vercel  

---

## ⚙️ Features

- **Interactive Evaluation:** User-friendly interface (1–10) to score organizational needs  
- **Real-time Ranking:** Instant framework prioritization using the SAW algorithm  
- **AI Insights:** Automated strategic rationales for the top-recommended framework  
- **Assessment History:** Save and manage previous evaluations securely  
- **PDF Export:** Generate professional reports of the analysis results  

---

## 🚦 Getting Started

### Prerequisites

- Node.js 20+  
- A PostgreSQL database instance (e.g., Neon.tech or Aiven)  
- Firebase project credentials  
- Google Gemini API key  

---

### Installation

```bash
npm install
```

---

### Environment Variables

Create a `.env` file in the root directory and include:

```env
DATABASE_URL="your_postgresql_connection_string"
GEMINI_API_KEY="your_google_gemini_api_key"
```

---

### Database Migration

Generate the Prisma client and push the schema:

```bash
npx prisma generate
npx prisma db push
```

---

### Run Development Server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

## 📄 License

This project is open-source and available under the **MIT License**.