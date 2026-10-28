# AQAR IN — Architecture & Codebase Audit Report

**Date:** October 2026  
**Auditor:** Lead Software Architect & DevSecOps Specialist  
**Target Repository:** `d:\PROJECTS\AQAR\AQAR IN\AQAR IN\AQAR IN`  
**Database Directive:** **Mandatory PostgreSQL 16 + PostGIS Migration**  
**Status:** Complete Forensic Audit (Read-Only)

---

## 1. Executive Summary & Audit Methodology

This report represents a comprehensive, code-level architectural and security audit of the **AQAR IN (عقار إن)** real estate platform. Every claim, finding, and statistic in this document has been verified against active source code, configuration files, database schemas, and running system daemons.

### Verified Current Scope:
* **Public Web Client:** React 18 single-page application built with Vite and Tailwind CSS.
* **Server API:** Node.js Express application utilizing ES Modules and raw SQL connection pooling via `mysql2`.
* **Database (Current vs Mandated):** Currently running on MySQL 8.4 LTS schema with 9 tables; **mandated for migration to PostgreSQL 16 + PostGIS as the permanent authoritative database**.
* **Live Deployment:** Production Hostinger KVM 4 VPS (4 vCPUs, 16 GB RAM, 200 GB NVMe) running Ubuntu Linux, Nginx 1.28, PM2 7.1, Redis 8.0, and Docker 29.9.

---

## 2. Verified Current Architecture & Folder Structure

```text
aqar-in/
├── client/                     # Frontend Application (React 18 + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI (BrandLogo, Navbar, Footer, PropertyCard, PropertyMap)
│   │   ├── context/            # Global state (AuthContext, LanguageContext)
│   │   ├── data/               # mockData.js (Egypt benchmark prices, mock compounds)
│   │   ├── pages/              # 21 Page Components (Home, Valuation, FastBuy, FastSell, etc.)
│   │   ├── services/           # api.js (Hybrid Fetch client with LocalStorage fallback)
│   │   ├── App.jsx             # React Router v6 route definitions (23 client routes)
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind CSS directives & custom styling
│   ├── package.json            # React 18.3, Leaflet 1.9, Recharts 2.13, Vite 6.0
│   └── vite.config.js          # Vite config with React plugin
│
├── server/                     # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── routes/             # API Route Handlers (6 files)
│   │   │   ├── authRoutes.js       # Register, Login, Me
│   │   │   ├── propertyRoutes.js   # List, Details, Create
│   │   │   ├── valuationRoutes.js  # Instant AI Valuation, Pro Valuation
│   │   │   ├── mortgageRoutes.js   # Calculate, Apply, Bank comparisons
│   │   │   ├── leadRoutes.js       # Property inquiry, Partner application
│   │   │   └── adminRoutes.js      # Platform stats, Benchmarks, Valuations list
│   │   ├── db.js               # Database connection pool (Migrating from mysql2 to pg)
│   │   └── server.js           # Express app setup, CORS, error handling
│   ├── .env                    # Environment configuration
│   └── package.json            # Express 4.21, mysql2 3.11, bcryptjs 2.4, jsonwebtoken 9.0
│
├── database/                   # Database Architecture
│   ├── schema.sql              # Current MySQL DDL schema
│   ├── seed_data.sql           # Seed data for Egyptian compounds & valuation benchmarks
│   └── (docs/postgresql-migration-plan.md contains PostgreSQL 16 + PostGIS DDL)
│
├── deploy/                     # Production Deployment Assets
│   ├── ecosystem.config.js     # PM2 process configuration
│   └── nginx.conf              # Nginx virtual host with SSL reverse proxy
│
└── docs/                       # Complete Architectural Blueprints & Migration Plan
```

---

## 3. End-to-End Feature Traceability Matrix

The table below traces every major user-facing feature from UI trigger through the API and database layer to its actual operational state.

| Feature Name | Client Route & Component | Backend API Endpoint | Database Table | Verified Operational Status | Notes / Gaps |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Browse / Search Properties** | `/buy`, `/rent`, `/search`<br>`SearchPage.jsx` | `GET /api/properties` | `properties` | **100% Operational** | Supports full filtering, pagination, sorting by `aqar_score`, and dual map view. |
| **Property Details View** | `/property/:id`<br>`PropertyDetailsPage.jsx` | `GET /api/properties/:id` | `properties` | **100% Operational** | Loads unit specs, photos, amenities, similar units, and triggers view count increments. |
| **Add New Property** | `/sell`, `/add-property`<br>`AddPropertyPage.jsx` | `POST /api/properties` | `properties` | **Partially Operational (Security Gap)** | Works, but endpoint is unauthenticated; sets status to published without moderation. |
| **Instant AI Valuation** | `/valuation/instant`<br>`InstantValuationWizard.jsx` | `POST /api/valuation/instant` | `valuations`, `location_benchmarks` | **100% Operational** | Calculates fair market value, confidence score, 5-year growth, and generates PDF. |
| **Professional Valuation** | `/valuation/professional`<br>`ProfessionalValuationPage.jsx` | `POST /api/valuation/professional-request` | `professional_valuation_requests` | **100% Operational** | Submits certified on-site appraiser request to database. |
| **Mortgage Calculator** | `/mortgage/calculator`<br>`MortgageCalculatorPage.jsx` | `POST /api/mortgage/calculate` | *In-memory rates* | **100% Operational** | Compares CBE 3%, 8% initiatives and commercial rates for CIB, NBE, Banque Misr. |
| **Mortgage Application** | `/mortgage/apply`<br>`MortgageApplyPage.jsx` | `POST /api/mortgage/apply` | `mortgage_inquiries` | **100% Operational** | Saves full applicant financial profile and selected bank to database. |
| **Property Lead / WhatsApp** | Modals on `PropertyDetailsPage.jsx` | `POST /api/leads/property-inquiry` | `leads_inquiries` | **100% Operational** | Tracks lead inquiries and schedules visits in database. |
| **Partner Program** | `/partners/apply`<br>`PartnersApplyPage.jsx` | `POST /api/leads/partner-apply` | `partner_applications` | **100% Operational** | Records broker/developer applications in database. |
| **Fast Buy Deals** | `/fast-buy`<br>`FastBuyPage.jsx` | `GET /api/properties` | `properties` | **Frontend Emulation** | Filters regular properties and synthesizes promotional liquidation tags client-side. |
| **Fast Sell Cash Offer** | `/fast-sell`<br>`FastSellPage.jsx` | *None* | *None* | **Mocked in UI (Gap)** | Form executes `setTimeout(..., 1000)` and displays success without saving to DB. |
| **Property Exchange** | `/exchange`<br>`ExchangePage.jsx` | *None* | *None* | **Mocked in UI (Gap)** | Listing and submission forms use static dummy swaps and client-side `setSubmitted(true)`. |
| **Finishing Packages** | `/finishing`<br>`FinishingPage.jsx` | *None* | *None* | **Frontend Only (Gap)** | Interactive meter calculator works, but lead generation redirects directly to WhatsApp. |
| **Property Management** | `/management`<br>`ManagementPage.jsx` | *None* | *None* | **Mocked in UI (Gap)** | Submission form uses `setTimeout(..., 1000)` and does not persist requests to DB. |
| **Admin Control Panel** | `/admin`<br>`AdminDashboardPage.jsx` | `GET /api/admin/stats`<br>`PUT /api/admin/benchmarks/:id` | `properties`, `users`, `location_benchmarks` | **Partially Operational (Critical Security Gap)** | Endpoints work and update prices, but have zero backend authentication middleware. |

---

## 4. Backend Route & Endpoint Inventory

The Express backend currently exposes **14 distinct REST endpoints** across 6 route modules:

```text
====================================================================================================
HTTP METHOD | PATH                             | AUTH REQUIRED | AUTH CHECKED | NOTES
====================================================================================================
GET         | /api/health                      | None          | None         | Server health check
POST        | /api/auth/register               | None          | None         | User registration & JWT generation
POST        | /api/auth/login                  | None          | None         | User login & JWT generation
GET         | /api/auth/me                     | User Token    | Verified     | Checks 'Bearer <token>' in header
GET         | /api/properties                  | None          | None         | Multi-filter listing query
GET         | /api/properties/:id              | None          | None         | Single property & similar units
POST        | /api/properties                  | Seller/Admin  | MISSING ❌   | Anyone can publish a listing!
POST        | /api/valuation/instant           | None          | None         | Calculates value & stores record
POST        | /api/valuation/professional-req  | None          | None         | Submits on-site appraisal booking
POST        | /api/mortgage/calculate          | None          | None         | In-memory interest rate calculator
POST        | /api/mortgage/apply              | None          | None         | Submits loan application to DB
POST        | /api/leads/property-inquiry      | None          | None         | Stores contact / viewing request
POST        | /api/leads/partner-apply         | None          | None         | Stores broker/developer application
GET         | /api/admin/stats                 | Admin Token   | MISSING ❌   | Returns platform KPI counts to anyone
GET         | /api/admin/valuations            | Admin Token   | MISSING ❌   | Exposes all user valuations
GET         | /api/admin/mortgages             | Admin Token   | MISSING ❌   | Exposes user financial applications
PUT         | /api/admin/benchmarks/:id        | Admin Token   | MISSING ❌   | Anyone can alter Egypt meter prices!
====================================================================================================
```

---

## 5. Database Schema & PostGIS Migration Imperative

### Verified Deficiencies in Current MySQL Implementation:
1. **Lack of Native Spatial Geometries:** `properties.lat` and `properties.lng` are numeric decimals without spatial R-Tree indexing, causing full-table scans for map searches.
2. **Missing Service Tables:** No database persistence for Fast Sell, Property Exchange, Finishing Inquiries, or Asset Management.
3. **Mandatory PostGIS Solution:** Transitioning to **PostgreSQL 16 + PostGIS** enables true spherical spatial indexing (`GIST`), native bounding-box queries, and polygon map discovery, eliminating all geospatial bottlenecks permanently. Full migration blueprint is documented in [docs/postgresql-migration-plan.md](file:///d:/PROJECTS/AQAR/AQAR%20IN/AQAR%20IN/AQAR%20IN/docs/postgresql-migration-plan.md).

---

## 6. Technical Debt, Deprecations & Build Evaluation

* **Monolithic Bundle Size:** Vite build outputs **992.06 kB** in a single JS file. Code splitting via `React.lazy()` is necessary for mobile network performance.
* **Vulnerable Multer Version:** `multer@1.4.5-lts.1` should be upgraded or replaced with presigned Cloudflare R2 direct uploads.
* **Zero Input Validation Libraries:** Request bodies are manually checked using basic `if (!field)` checks. `zod` schemas must be introduced.
* **Hardcoded Fallbacks:** Fallback admin credentials in `authRoutes.js` must be purged.

---

## 7. Audit Conclusion

The AQAR IN web platform has a solid, well-designed React frontend, a working Express REST backend, and a functional database. However, it currently operates with **critical security vulnerabilities** in its admin and listing endpoints, **missing backend persistence** for 4 of its 8 advertised navbar services, and **lacks the PostgreSQL + PostGIS architecture** needed to support the upcoming iOS and Android native applications.
