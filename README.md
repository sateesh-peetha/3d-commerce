# Audited, AI-Governed 3D Commerce Platform

> **Status:** Audited & Verified (System Audit v1.0.0) | **Security:** Passed (10 Layers) | **AI Governance:** Active

## Overview

**This section is for: Everyone**

The 3D Commerce Platform is a self-hosted, scalable, and fully audited solution designed for businesses selling customizable 3D products. It bridges the gap between secure e-commerce and AI-assisted customization, providing a deterministic pipeline for uploading, pricing, and manufacturing 3D models. Built with a "security-first, zero-drift" philosophy, it offers enterprises a verifiable way to deploy AI features without risking data sovereignty or operational stability.

## What This Platform Is (and Is Not)

**This section is for: Enterprise Architects & Strategy Leads**

To prevent mismatched expectations, we clearly define the system's scope:

### This Platform IS:
- ✅ **A Self-Hostable 3D Commerce Engine:** Full control over data, infrastructure, and plugins.
- ✅ **AI-Governed & Security-First:** All AI actions are sandboxed, human-verified, and strictly budgeted.
- ✅ **Plugin-Extensible:** Safely extend functionality via a sandboxed plugin architecture.
- ✅ **Audited & Compliant:** Mechanically enforced invariants for security and data integrity.

### This Platform is NOT:
- ❌ **A Hosted SaaS:** We do not host your data; you do.
- ❌ **A No-Code Website Builder:** Requires configuration and deployment; not a drag-and-drop site builder.
- ❌ **A Crypto / NFT Platform:** Focused on real-world manufacturing and logistics, not digital speculation.
- ❌ **A "Black Box" AI Wrapper:** No AI action occurs without logging, costing, and optional human approval.

## Key Capabilities

**This section is for: Product Managers & Evaluators**

All capabilities below are **audited and verified** as of the latest System Audit (v1.0.0):

- **Installer-First Deployment:** A non-technical, browser-based setup wizard handles initial configuration, database connection, and admin creation. [See Installer Docs](docs/getting-started/installation-guide.md).
- **3D Model Upload & Pricing:** Secure ingestion pipeline for 3D models with real-time, deterministic pricing calculations (Trace ID: FO-001/FO-003).
- **Secure Checkout:** Redirect-based secure checkout flow ensuring zero payment data persistence on local servers.
- **AI-Assisted Layout Generation:** Governed AI agents suggest UI layouts within strict safety bounds, requiring human approval for application (Trace ID: FO-007).
- **Sandboxed Plugin System:** rigorous plugin architecture that isolates extensions from core system data and prevents privilege escalation (Trace ID: FO-006).

## Architecture Overview

**This section is for: System Architects & CTOs**

The platform follows a **10-Layer Audited Architecture** designed for zero-drift and maximum reliability.

```mermaid
graph TD
    User[User/Browser] -->|HTTPS| CDN[CDN/Edge]
    CDN -->|Static Assets| S3[Storage Bucket]
    CDN -->|API Req| LB[Load Balancer]
    LB -->|Traffic| API[API Gateway / Backend]
    
    subgraph "Core System (Trusted)"
        API -->|Read/Write| DB[(Primary DB)]
        API -->|Pricing Logic| PE[Pricing Engine (Deterministic)]
    end
    
    subgraph "AI Layer (Governed)"
        API -->|Request| AG[AI Governance Proxy]
        AG -->|Sanitized Prompt| LLM[LLM Service]
        LLM -->|Suggestion| AG
    end
    
    subgraph "Extensions (Sandboxed)"
        API -->|Hook| PM[Plugin Manager]
        PM -->|Limited Context| PL[Plugins]
    end
```

### Core Principles
1.  **Deterministic Behavior:** Core business logic (pricing, orders) is hard-coded and invariant-checked, never AI-generated on the fly.
2.  **Agentic Pipeline:** AI agents operate as distinct services with strict input/output contracts, unable to mutate system state directly.
3.  **Human-in-the-Loop:** Critical mutations (applying layouts, changing configs) require explicit administrative approval.

[Read Full Architecture Docs](docs/architecture/system-overview.md)

## Quick Start (Non-Technical)

**This section is for: Business Owners & Non-Technical Installers**

**Time Estimate:** 10–15 minutes

1.  **Download the Installer:** Get the latest release bundle (or Docker image).
2.  **Start the Application:** Double-click the executable or run the Docker container.
3.  **Open Browser:** Navigate to `http://localhost:3000`.
4.  **Follow the Wizard:**
    *   **Step 1:** Create Admin Account.
    *   **Step 2:** Connect Database (or use embedded SQLite for testing).
    *   **Step 3:** Configure Store Settings.
5.  **Finish:** Click "Complete Setup" to launch your Admin Dashboard.

> **Need Help?** See the [Step-by-Step Installer Guide](docs/getting-started/installation-guide.md).

## Quick Start (Developers)

**This section is for: Developers & Contributors**

### Prerequisites
- Node.js v20+
- Docker (optional, for safe isolation)
- Git

### One-Command Startup
```bash
# Clone the repository
git clone <repo-url>
cd 3dcommerce

# Install dependencies and start local dev server
npm install
npm run start:local
```

### Key Configurations
- **Config locations:** stored in `ops/run-mode-config.json`.
- **Local Dev URL:** `http://localhost:3000`
- **Emulator:** Firebase emulators start automatically with `npm run start:local`.

[Developer Guide](docs/getting-started/installation-guide.md#local-development)

## Configuration & Installer

**This section is for: DevOps & System Admins**

The installer is the primary method for safe configuration. It ensures:
- **Secret Management:** Secrets are never logged or exposed.
- **Invariant Checks:** Configuration is validated against system invariants before application.
- **Safe Re-runs:** The installer detects existing installations and switches to "Maintenance Mode" if needed.

**Required Configuration:**
- Database Credentials (if not using embedded)
- Admin Email/Password
- Store Name & Currency

**Optional:**
- AI Provider Keys (for layout generation)
- Plugin Repository URL

[Configuration Reference](docs/getting-started/configuration-reference.md)

## Security & Compliance

**This section is for: Security Auditors & Compliance Officers**

**Status: PASSED (System Audit v1.0.0)**

We adhere to a "Defense in Depth" strategy verified by 10 audit layers.

- **Threat Model:** Complete coverage of OWASP Top 10, preventing common attacks like XSS, SQLi, and IDOR. [See Audit Report](audit/system-audit-report.json).
- **Auth & Authorization:**
    - Zero password storage (hashing enforced).
    - Role-Based Access Control (RBAC) with sealed admin privileges.
    - Verified by `tests/security/authorization-audit.test.ts`.
- **Data Isolation:** Rigid separation between tenant data and plugin environments.
- **Compliance:** Ready for GDPR/CCPA deployment (data export/delete flows implemented).

[Full Security Audit Details](audit/system-audit-report.json)

## AI Governance & Safety

**This section is for: Legal & Risk Teams**

Our AI implementation is **governed, not generative**.

### What AI Can Do:
- Suggest UI layout changes (padding, colors, block order).
- Draft product descriptions (review required).
- Optimize pricing rules (simulation only).

### What AI Cannot Do:
- ❌ Modify pricing logic directly.
- ❌ Delete data or users.
- ❌ Access external URLs (strictly firewalled).
- ❌ Execute arbitrary code.

### Controls
- **Human Approval:** All AI suggestions enter a "Pending" state requiring admin sign-off.
- **Budget Caps:** Hard limits on API usage per day/month.
- **Rollback:** Instant "Undo" for any AI-applied change.

[AI Governance Policy](docs/ai/ai-governance-guide.md)

## Operations & Reliability

**This section is for: SREs & DevOps Teams**

**Status: OPS-READY (Ops Report v1.0.0)**

- **Observability:** Full structured logging (JSON), metric emission (Prometheus-ready), and distributed tracing.
- **Reliability:**
    - **RPO:** 1 Hour
    - **RTO:** 4 Hours
    - **Runbooks:** 6 Verified Runbooks (System Down, Payments Failing, etc.).
- **Backups:** Automated strategies defined in `ops/backup-strategy.json`.
- **Disaster Recovery:** Tested failover scenarios.

[Ops Readiness Report](ops/ops-readiness-report.json)

## Extensibility & Plugins

**This section is for: Developers & Integrators**

Extend the platform safely without forking the core.

- **Plugin Sandbox:** Plugins run in isolated contexts with restricted access to the DOM and API.
- **Lifecycle:** strict install -> enable -> disable -> uninstall lifecycle.
- **Permission Model:** Plugins must request granular permissions (e.g., `read:products`, `write:orders`) at install time.

[Plugin SDK Documentation](docs/plugins/plugin-developer-guide.md)

## Documentation Index

**This section is for: Everyone**

All documentation is versioned and maintained.

- **📚 Getting Started**
    - [Installation Guide](docs/getting-started/installation-guide.md)
    - [Developer Setup](docs/getting-started/installation-guide.md#local-development)
- **🏗 Architecture**
    - [System Overview](docs/architecture/system-overview.md)
    - [Security Audit](audit/system-audit-report.json)
- **🤖 AI & Governance**
    - [AI Governance Guide](docs/ai/ai-governance-guide.md)
    - [AI Capability Matrix](docs/ai/ai-capability-matrix.md)
- **⚙️ Operations**
    - [Ops Readiness Report](ops/ops-readiness-report.json)
    - [Runbooks](ops/runbooks/)
- **🔌 Plugins**
    - [Plugin SDK](docs/plugins/plugin-developer-guide.md)

## Roadmap & Versioning

**This section is for: Stakeholders**

We follow **Semantic Versioning (SemVer)**.

- **v1.0.0 (Current):** Stable, Audited, Feature Complete.
- **v1.1.0 (Planned):** Enhanced AI forecasting, Mobile App companion.
- **Experimental:** Features marked "Experimental" are not subject to semantic versioning guarantees.

## Support & Community

**This section is for: Users & Administrators**

- **Community Support:** Open GitHub Discussions.
- **Enterprise Support:** Available for commercial license holders.
- **Contribution:** We welcome PRs! Please read `CONTRIBUTING.md` and sign the CLA.
- **Security Issues:** Do NOT open GitHub issues. Email `security@example.com`.

## License & Governance

**This section is for: Legal**

- **License:** See [LICENSE](LICENSE) file for details.
- **Governance:** Project steered by the Core Review Board.
- **Trademark:** 3D Commerce Platform names and logos are trademarks of their respective owners.

---
*Generated: 2026-02-05 | System Audit: PASS*
