# 🎓 AI-Powered Thesis Evaluation System (IGL-TEF)

This repository contains an **AI-assisted thesis evaluation system** developed as part of a **university graduation project**.  
The system evaluates academic theses according to formal, ethical, and scholarly standards using a structured, rule-based framework.

📺 **Demo Video:**  
https://youtu.be/oLD7mIhaU3c

---

## 💡 About the Project (English)

**Thesis Evaluation System (IGL-TEF Based)** is an AI-assisted academic assessment tool developed to support the evaluation of undergraduate and graduate theses.

The project addresses a core limitation of traditional word processors (Word / Google Docs):  
they store text, but they do not **evaluate academic compliance, integrity, or methodological rigor**.

This system is designed as a **decision-support tool**.  
Final academic responsibility and judgment always remain with human evaluators.

---

## 🔧 Development Workflow

The project was built using a structured AI-supported pipeline:

### 1. NotebookLM
Authoritative academic and institutional sources were compiled into a controlled knowledge base, including:
- Turkish thesis writing guidelines  
- Ethics and integrity standards  
- APA 7 reporting rules  
- Desk rejection and academic evaluation criteria  

### 2. Google Stitch
A minimal, professional **two-page web interface** was designed:
- **Input Screen:** Thesis file upload (PDF / DOCX) and evaluation start  
- **Result Screen:** Tier-based evaluation results, scoring, and explanations  

### 3. Google AI Studio
The Stitch design and curated knowledge were integrated to develop a working system that:
- Parses PDF/DOCX thesis files  
- Evaluates them using the **IGL-TEF (Integrated Global and Local Thesis Evaluation Framework)**  
- Produces structured results across three evaluation tiers:

#### Evaluation Tiers
- **Tier I – Mandatory Formal Compliance**  
- **Tier II – Ethics & Integrity**  
- **Tier III – Academic Rubric**

---

## 📊 Key Features

- Rule-based thesis evaluation aligned with **Turkish graduate thesis standards**
- Clear distinction between **Mandatory**, **Conditional**, and **N/A** criteria
- Transparent scoring logic:
  - **UYGUN** (Compliant)
  - **UYARI** (Warning – partial compliance)
  - **HATA** (Error – non-compliance)
- Downloadable **TXT-based evaluation report** generated directly from model output
- Consistent logic shared across UI, TXT output, and scoring calculations
- Designed to prevent over-penalization of **non-mandatory** criteria

---

## ⚠️ Ethical & Academic Scope

- The system does **not** generate thesis content  
- It does **not** replace advisors, juries, or reviewers  
- AI is used strictly for **analysis and classification**, not authorship  
- The framework explicitly follows responsible AI and academic ethics principles

---

## 🎓 Special Thanks

Heartfelt thanks to my mentors  
**Nurettin Şenyer** and **Ömer Durmuş**  
for their guidance, academic insight, and continuous support throughout this project. 💐

---


## 📝 Notes

- The project was developed using **NotebookLM, Google Stitch, and Google AI Studio**
- The evaluation framework (IGL-TEF) combines **local institutional requirements** with **international academic standards**
- TXT output is intentionally used for clarity, traceability, and academic transparency
