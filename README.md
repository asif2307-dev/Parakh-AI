# PARAKH AI

**Automating Trust in Public Procurement**

PARAKH AI is a powerful, AI-assisted decision-support platform designed for the Government e-Marketplace (GeM). It streamlines bid evaluation, enforces statutory compliance, and upholds transparency across the national public procurement lifecycle by bridging isolated data silos and employing deterministic AI scrutiny.

---

## 🌟 Unique Selling Propositions (USPs) & Core Features

PARAKH AI is built upon 9 core pillars of procurement intelligence.

### 1. BidDoc (Tender Intelligence)
**What it is:** Advanced OCR and structural parsing engine.
**What it does:** Autonomously reads complex PDF tender documents to extract mandatory compliance clauses (e.g., annual turnover requirements, ISO certifications, OEM authorizations).

### 2. Verify (Compliance Scrutiny)
**What it is:** Requirement-to-Evidence mapping engine.
**What it does:** Automatically links extracted tender requirements to the specific pages and bounding boxes within a vendor's submitted evidence. It ensures every claim has a traceable, verified lineage.

### 3. Expiry Monitor
**What it is:** Real-time document validity tracking.
**What it does:** Actively monitors the expiration dates of critical certificates (ISO, MSME, specific licenses) submitted by bidders to ensure compliance throughout the contract lifecycle.

### 4. CrossCheck (Multi-Source Verification)
**What it is:** Direct API integrations with authoritative government registries.
**What it does:** Instantly cross-verifies vendor submissions against external databases (MCA21 for financials, GSTN for tax status, Udyam for MSME claims, and central debarment lists) to detect forged documents or inflated claims.

### 5. Risk Analysis
**What it is:** Predictive risk scoring and cartelization detection.
**What it does:** Assigns a risk profile to bidders (High/Medium/Low) based on historical bidding patterns, shared IP addresses, and cross-entity relationships, helping procurement officers flag suspicious behavior before awarding contracts.

### 6. SmartBid Compare
**What it is:** AI-driven side-by-side technical and financial comparison.
**What it does:** Generates a unified matrix comparing multiple bids against the required evaluation criteria, highlighting passes, fails, and overall AI compliance scores for rapid decision-making.

### 7. Explainable AI
**What it is:** Transparent reasoning for all automated flags.
**What it does:** Ensures that whenever a discrepancy is flagged (e.g., a turnover mismatch), the platform provides the exact source data, the target registry data, and the deviation percentage, keeping the human officer in control.

### 8. Reports & Exports
**What it is:** Cryptographically secure compliance reports.
**What it does:** Allows officers to generate PDF briefs summarizing the entire scrutiny process for a specific tender, ready for stakeholder review and procurement audits.

### 9. Immutable Audit Trail
**What it is:** Secure, tamper-proof logging.
**What it does:** Maintains a cryptographically-hashed log of all system interactions, AI verifications, API syncs, and manual overrides performed by officers.

---

## 💻 How to Use the Platform

### 1. Accessing the System
1. Navigate to the **Public Portal** to read about the framework, view platform architecture, and access governance resources.
2. Click **Access Officer Portal** to enter the secure login barrier.
3. Authenticate using your designated Procurement Officer credentials.

### 2. Navigating the Dashboard
Once authenticated, you will land on the **Procurement Intelligence Dashboard**. The sidebar provides access to all USPs:
* **Overview:** View high-level KPIs, active scrutiny cases, and recent compliance flags.
* **Tenders & Bids / Bid Documents:** Upload new tender documents (PDF, CSV, XLSX, JSON) for the AI engine to parse.
* **Compliance Scrutiny:** Run multi-stage analysis on a selected bid to extract rules and verify evidence.
* **Registry CrossCheck:** View live sync statuses with MCA21, GSTN, and Udyam, and monitor expiring documents.
* **Risk Analysis:** Review predictive risk scores for specific bidders.
* **SmartBid Compare:** Load a comparison matrix for a specific tender to determine the most compliant L1 bidder.
* **Reports & Export:** Generate and download SHA-256 verified PDF reports.
* **Audit Trail:** View the immutable timeline of all platform actions.

### 3. Running a Compliance Check (Example Workflow)
1. Go to **Bid Documents** and upload a vendor's submission package.
2. Navigate to **Compliance Scrutiny**, select the Target Tender & Bidder from the dropdown, and click **[ Run Compliance Scrutiny ]**.
3. Watch as the 5-stage pipeline executes: *BidDoc Parsing -> Rule Extraction -> Registry CrossCheck -> Contradiction Check -> Final Verdict*.
4. Review any **Critical Compliance Flags** detected (e.g., Financial Discrepancy).
5. Click **Generate Compliance Report** to export the findings for the official procurement file.

---

## 🛠️ Local Development & Setup

### Requirements
* Python 3.9+
* PostgreSQL (or Supabase integration)
* Node.js (Optional, depending on frontend tooling)

### Running the Application

1. **Install Python Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables (Optional):**
   Copy `.env.example` to `.env` if custom Supabase or Gemini API configurations are needed.

3. **Start the API Server:**
   You can run the application using the provided batch script or manually via Python:
   ```bash
   # Using the batch script (Windows)
   run.bat

   # OR manually using Python at root
   python main.py
   ```
   *The server will start on `http://127.0.0.1:8000`.*

4. **Access the Application:**
   * **Public Landing Page:** `http://localhost:8000/`
   * **Bidder & Vendor Self-Service Portal:** `http://localhost:8000/bidder`
   * **Officer Login Portal:** `http://localhost:8000/portal`
   * **Officer Scrutiny Dashboard:** `http://localhost:8000/portal/dashboard`
   * **Interactive API Documentation:** `http://localhost:8000/docs`

5. **Run Automated Verification Tests:**
   ```bash
   python test_golden_path.py
   python test_full_workflow.py
   ```

---
*Developed for the Government e-Marketplace (GeM) Initiative | Smart India Hackathon 2026 | Problem Statement: SIH26100 | Team: BUTTER CHICKEN*
