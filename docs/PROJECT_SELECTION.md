# Project Selection Report

Source: public GitHub API for `Santhosh-Devlops`, inspected 2026-11-18. Every public repository's file tree, README and commit history was read. Nothing below is invented; where a repo does not state something, the site does not claim it.

## Repositories inspected (16)

| Repository | Language | Last push | What it is | Verdict |
|---|---|---|---|---|
| Multi-Modal-RAG-1 | Python | 2026-09-05 | Multimodal document RAG: PyMuPDF, pdfplumber, BLIP captioning, MiniLM embeddings, Qwen2.5-7B, agent pipeline, React UI | **Selected** |
| BI-Forecast-AI (ORACLE) | Python | 2026-09-06 | Multi-agent BI platform: FastAPI, DuckDB safe SQL, statsmodels forecasting, anomaly + scenario tools, LLM router, React UI | **Selected** |
| Resume-Screener-AI (RecruitAI) | Python | 2026-08-26 | Resume screening: PyMuPDF parsing, sentence-transformers matching with TF-IDF fallback, explainable scoring, Gemini questions, pytest suite | **Selected** |
| OAD- (DyMETER, Java) | Java | 2026-09-29 | Dependency-free Java implementation of the DyMETER online anomaly detection paper (IEEE TPAMI), with self-test, experiments and dashboard | **Selected** (with related DyMETER repos) |
| EnhancedDYmeterOAD | Java | 2026-10-22 | Spring Boot + React DyMETER research workspace | Folded into DyMETER; README references a different machine/user path, so authorship is not claimed |
| Dymeter-MANN-OAD | Python | 2026-09-06 | Python DyMETER research app; contains real run output charts | Folded into DyMETER (source of the real output images) |
| Ai-tutor- | JavaScript | 2025-09-27 | React UI for the hackathon AI tutor; frontend only, one commit | Not selected — achievement is shown in the timeline instead |
| Memory_Management_Techniques | Java | 2026-03-14 | Swing app for OS memory-allocation algorithms | Not selected — strong for the OS skill entry |
| MyBuilds / Invoice_Generation | Java | 2026-06 / 07 | NetBeans Swing invoicing app (Invoice_Generation repo is empty) | Not selected |
| Ripples-Solutions | HTML | 2026-06-13 | Single 105 KB `rs.html` company site | Not selected — less AI relevance |
| My_Portfolio | HTML | 2026-07-11 | Previous portfolio (deployed) | Not a project candidate; source of profile photo |
| Leet-Problems-Santhosh | Java | 2026-09-07 | LeetCode solutions | Supports DSA skill |
| small, Myself, kiro-requirements-design | — | — | Tiny / profile / notes repos | Not candidates |

Resume projects `Cloud_Image_Rainfall_Prediction_And_Farmer_Alert` and `TrackAssistS-w` return **404** (private or renamed), so they cannot be verified from source and are not exhibited. They remain in the downloadable resume.

## The four selections and why

1. **MultiDoc RAG** — highest AI-engineering relevance: six extractors, local MiniLM embeddings, BLIP vision captions, Qwen2.5-7B grounded answers, agent orchestrator (query, retrieval, evidence, verification agents), auth, evaluation routes, Dockerfile. Largest and most complete AI codebase. 11 commits, all from this account.
2. **ORACLE (BI-Forecast-AI)** — multi-agent architecture (Supervisor, Profiling, SQL Analyst, Statistics, Anomaly, Forecasting, Strategy, Critic) with a strong engineering principle: numbers come from Python/SQL tools, never the LLM. Safe-SQL validator, audit log, PDF reports, tests.
3. **RecruitAI (Resume-Screener-AI)** — practical, explainable ML: semantic matching with fallback, a transparent weighted score (40/25/15/10/10), evidence-based capability engine, LLM used only for interview questions, pytest coverage.
4. **DyMETER Online Anomaly Detection** — research-grade work: an equation-by-equation Java port of a 2026 IEEE TPAMI paper (autoencoder, evidential controller, hypernetwork, dynamic threshold) built from scratch with no ML library, plus real run outputs. The algorithm is credited to the paper's authors; the site presents this as an implementation.

## Honesty rules applied on the site
- Contribution lines state only what the commit history shows ("all N public commits are from this account").
- No live-demo links: none of the four repos lists a deployment.
- Visuals for RAG, ORACLE and RecruitAI are labelled **schematics drawn from the README**. The DyMETER image is labelled **real output** from a run in `Dymeter-MANN-OAD`.
- No skill percentages or expertise levels.
- Residential street address and phone number are redacted from the hosted resume PDF.
