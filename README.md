# 🛡️ MFCALYTIX – Sovereign Actuarial Intelligence & Analytics
### Enterprise-Grade Integrated Actuarial Development Environment (IADE)

**MFCALYTIX** is a world-class, high-fidelity analytics ecosystem designed for deep-work actuarial modeling and strategic risk capital management. It transforms complex insurance silos into a **Universal Single Source of Truth (SSoT)** through a unified, high-density digital interface.

---

## 💎 Key Enterprise Features

### 🧘 Integrated Actuarial Development Environment (IADE)
*   **Deep Immersive Workspace**: A distraction-free "Zen-Mode" environment for high-stakes mathematical modeling. suppresses all global UI scaffolding for edge-to-edge focus.
*   **Strategic Copilot**: A reasoning-based AI intelligence layer that provides real-time variance detection, strategic reserve advice, and automated Solvency II/IFRS 17 impact analysis.
*   **Capital Stress Heatmap**: Real-time visual heuristics for Monitoring **SCR Node Alpha**, utilizing animated radial stress gauges and high-density KPI summary decks.
*   **Live Modeling Console**: Full-spectrum Python/R sandbox integration with systemic kernel auditing and line-numbered code environments.

### 🗺️ Unified Navigation Architecture
*   **Centralized Actuarial Hub**: Unified vertical navigation for **Simulations**, **Experience Studies**, **Pricing**, **ALM**, **Regulatory Hub** (Solvency II), and **Assumption Matrices**.
*   **Density-Optimized Grids**: Complex financial matrices and liability projections delivered through glassmorphism-inspired, high-contrast UI components.
*   **Global Command & Telemetry**: Real-time telemetry monitoring for compute node health and memory status across the enterprise cluster.

---

## 🏛️ Full Functional Catalog

### 1. Integrated Actuarial Development Environment (IADE)
*   **Edge-to-Edge Workbench**: A specialized, distraction-free environment for deep-work modeling sessions.
*   **Multi-Language Sandbox**: Integrated support for Python and R modeling kernels with system-cluster auditing.
*   **Kernel Telemetry**: Real-time monitoring of compute node performance (CPU/RAM) during heavy valuation runs.

### 2. Strategic Intelligence & AI Copilot
*   **Reasoning Intelligence**: An AI agent that provides descriptive and prescriptive insights during the modeling phase.
*   **Automated Variance Detection**: Instant identification of deviations in survival integrals and mortality vectors.
*   **Predictive Optimization**: Suggestions for parameter smoothing and capital reserve optimization.

### 3. Regulatory & Compliance Hub
*   **Solvency II Engine**: Full calculation of Solvency Capital Requirements (SCR) and Minimum Capital Requirements (MCR).
*   **IFRS 17 Disclosure Desk**: Granular breakdown of **BEL**, **Risk Adjustment**, and **CSM** with P&L release scheduling.
*   **Governance Sign-off**: Multi-level RBAC for Chief Actuary approval workflows on all regulatory reports.

### 4. Mathematical & Experience Studies
*   **Mortality/Lapse Analysis**: High-fidelity investigation of policyholder behavior trends using Gompertz-Makeham approximations.
*   **Survival Modeling**: Advanced deterministic and stochastic survival probability calculation engines.
*   **Data Explorer**: High-density matrix view for raw policy-level data scrubbing and validation.

### 5. Financial & Capital Management
*   **ALM (Asset Liability Management)**: Sophisticated matching of projected liabilities with asset cash-flow gradients.
*   **Pricing Engine**: Real-time evaluation of policy premiums based on current yield curves and mortality bases.
*   **Stress Testing**: Parametric shift modeling (+/- bps, mortality shocks) to evaluate balance-sheet resilience.

### 6. Enterprise Infrastructure (Sovereign Shield)
*   **Role-Based Access Control (RBAC)**: Secure, hierarchical access for Actuaries, Data Scientists, and Executives.
*   **Universal SSoT Gateway**: A single source of truth connecting Auth, Accounting, Risk, and Forecasting services.
*   **System Library Hashing**: Every run is cryptographically hashed for full audit reproducibility.

---

## 🏗️ Technical Architecture

### Core Stack
*   **Microservices**: FastAPI-driven (Auth, Accounting, Risk, Actuarial, Forecasting, Compliance, Workspace, Data Science).
*   **Frontend Engine**: React 18 + Vite + TypeScript / JavaScript (JSX).
*   **State & Data**: React Query (TanStack) + Redis + Kafka.
*   **Storage**: PostgreSQL (TimescaleDB extension for actuarial time-series).
*   **Deployment**: Docker Compose orchestrated cluster.

### Service Map
| Service | Environment URL |
| :--- | :--- |
| **Enterprise Frontend** | http://localhost:5174/ |
| **Actuarial IADE** | http://localhost:5174/actuarial/workspace |
| **Intelligence Gateway** | http://localhost:8000/docs |
| **Risk & Compliance** | http://localhost:8009/docs |
| **Forecasting Engine** | http://localhost:8006/docs |

---

## ⚡ Quick Start

### Local Environment Initialization
```powershell
# 1. Environment Configuration
cp .env.example .env

# 2. Deploy Infrastructure
docker compose build
docker compose up -d

# 3. Frontend Development Cluster
cd frontend
powershell -ExecutionPolicy Bypass -Command "npm install"
powershell -ExecutionPolicy Bypass -Command "npm run dev"
```

### Database Core Migrations
```bash
# Initialize Sovereign Auth
cd backend/services/auth-service
alembic upgrade head

# Initialize Financial Ledger
cd backend/services/accounting-service
alembic upgrade head
```

---

## ⚖️ Governance & Audit Readiness
MFCALYTIX is engineered with high-stakes auditability at its core. Every simulation in the **IADE** is timestamped with a **System Library Hash**, ensuring all data-science findings are reproducible and verifiable for internal and external regulatory scrutiny (Solvency II, IFRS 17).

---
*© 2026 MFCALYTIX. All Rights Reserved. Sovereign Unified Engine V4.1 Active.*

