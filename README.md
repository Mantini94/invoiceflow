# InvoiceFlow

Modern AI-powered invoice management system built with React, Supabase and n8n.

InvoiceFlow automatically processes invoice PDFs from Gmail, extracts structured data using AI, stores documents in Supabase and provides a modern dashboard for invoice management and analysis.

---

## Features

* AI invoice data extraction
* Gmail PDF automation
* Supabase database integration
* PDF invoice preview
* Duplicate invoice detection
* Invoice risk analysis
* AI assistant chat
* Real-time dashboard updates
* Invoice filtering & search
* Missing data detection
* Responsive modern UI
* Automated workflow with n8n

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Custom CSS

### Backend & Infrastructure

* Supabase
* Supabase Realtime
* Supabase Storage
* PostgreSQL

### Automation & AI

* n8n
* OpenAI API
* Gmail Trigger
* PDF processing workflow

---

## Architecture

```txt
Gmail PDF
   ↓
n8n Workflow
   ↓
AI Extraction
   ↓
Validation & Duplicate Detection
   ↓
Supabase Database
   ↓
React Dashboard
```

---

## Main Workflow

1. Gmail Trigger detects invoice PDF
2. PDF is uploaded to Supabase Storage
3. AI extracts invoice data
4. System validates extracted content
5. Duplicate detection is performed
6. Invoice is stored in database
7. Dashboard updates in real time

---

## Dashboard Features

* Invoice table
* PDF preview workspace
* AI assistant
* Risk badges
* Duplicate indicators
* Search & filtering
* Status management

---

## AI Features

The AI system can:

* extract invoice data
* validate invoice structure
* detect duplicates
* identify missing fields
* analyze suspicious invoices
* answer invoice-related questions

---

## Project Goals

This project was built as a practical portfolio SaaS application focused on:

* frontend development
* backend workflows
* AI integrations
* automation systems
* real-world UI/UX patterns

---

## Local Setup

```bash
git clone https://github.com/Mantini94/invoiceflow.git

cd invoiceflow

npm install

npm run dev
```

---

## Environment Variables

Example:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

---

## Status

Project currently under active development.

Planned improvements:

* better mobile layout
* advanced AI invoice analysis
* activity feed
* improved PDF workspace
* notification system

---

## Author

Built by Marcin Żak.
