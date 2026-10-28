# AQAR IN — Enterprise Admin Dashboard Blueprint

**Target System:** AQAR IN Dedicated Administration & Operations Portal  
**Author:** Principal Full-Stack Architect & Enterprise Systems Engineer  
**Status:** Approved Administrative Blueprint

---

## 1. Current State vs. Target Architecture

### Verified Existing State (`/admin`):
* An inline page within the public web app ([AdminDashboardPage.jsx](file:///d:/PROJECTS/AQAR/AQAR%20IN/AQAR%20IN/AQAR%20IN/client/src/pages/AdminDashboardPage.jsx)).
* Displays 4 static metric cards (active properties, AI valuations, mortgage apps, registered users).
* Contains an inline table allowing the editing of benchmark prices for 5 pre-configured locations.
* **Critical Flaw:** Backend endpoints (`/api/admin/*`) have **zero authentication middleware**. Anyone who discovers the URL can read all user valuations and change benchmark prices.

### Target Architecture Vision:
* A **dedicated, enterprise-grade Admin Control Center** accessible via `admin.aqarin.com` (or secured route `/portal-admin/`) with strict multi-factor authentication (MFA), role-based permissions, comprehensive audit logging, and complete operational command over all 8 platform services.

---

## 2. Core Functional Modules

```text
+-----------------------------------------------------------------------------------+
|                        AQAR IN ENTERPRISE ADMIN PORTAL                            |
+-----------------------------------------------------------------------------------+
| [1. KPI Dashboard]  | [2. Listings Moderation] | [3. Valuation Benchmarks Engine] |
| [4. Mortgage Hub]   | [5. Flash Deals & Swap]  | [6. User & Broker Access Control]|
| [7. Media Library]  | [8. Audit Logs & System] | [9. Exportable Business Reports] |
+-----------------------------------------------------------------------------------+
```

### Module 1: Executive KPI Dashboard & Operations Command
* **Live Metrics:** Real-time counters for active properties, daily valuation requests, mortgage applications, pending cash sell inquiries, and total platform Gross Merchandise Value (GMV).
* **Traffic & Conversion Charts:** Daily active users (Web, iOS, Android), lead-to-viewing conversion rates, and top-searched compounds in Egypt.
* **Quick Action Alerts:** Banners for pending seller properties requiring review, unassigned fast-sell leads, and mortgage applications pending bank submission.

### Module 2: Property Listings Moderation & Inventory Control
* **Moderation Pipeline:** Tabs for `Pending Review`, `Published`, `Rejected`, and `Archived`.
* **Verification Workflow:** Admins can verify title deed ownership, inspect uploaded images, adjust unit `aqar_score`, and toggle the `Featured (مميز)` spotlight flag.
* **Bulk Operations:** Bulk publish, bulk archive, price adjustments, and export to CSV/Excel.

### Module 3: Dynamic Valuation Benchmarks & Multiplier Engine
* **District & Compound Pricing Grid:** Full management of `location_benchmarks` table:
  - Base price per square meter (`avg_price_sqm`, `min_price_sqm`, `max_price_sqm`).
  - Expected annual growth percentage (`annual_growth_pct`).
  - Estimated rental yield percentage (`rental_yield_pct`).
* **Multiplier Fine-Tuning:** Dynamic sliders for finishing multipliers (core & shell, semi-finished, fully finished, ultra-lux) and view bonuses (Nile, Sea, Golf, Lagoon, Garden).
* **Instant Recalibration:** Changes immediately propagate to the AI Valuation Engine across Web and Mobile clients.

### Module 4: Mortgage & CBE Financial Application Pipeline
* **Kanban Board:** Visual status stages (`New`, `Document Review`, `Submitted to Bank`, `Bank Approved`, `Disbursed`, `Rejected`).
* **Bank Routing:** Assign applicants to partner bank loan officers (CIB, NBE, Banque Misr, QNB) with auto-generated pre-approval financial summaries.

### Module 5: Flash Deals, Swap & Service Management Hub
* **Fast Sell Pipeline:** View incoming urgent cash buyout requests with owner's expected price, calculated market valuation, and assign investment cash buyers.
* **Property Exchange Engine:** Review swap offers, calculate delta difference, and match mutual swap interests (e.g. New Cairo apartment ↔ Sheikh Zayed villa).
* **Finishing Inquiries:** Track site inspection bookings and interior architecture consultations.
* **Asset Management Contracts:** Manage landlord property management agreements, rent collection tracking, and maintenance logs.

### Module 6: User Management, Roles & Broker Portal
* **User Directory:** Searchable list of all registered users (buyers, sellers, verified brokers, admins).
* **Role Management:** Assign roles (`buyer`, `seller`, `agent`, `admin`, `super_admin`) and granular permissions.
* **Broker & Partner Applications:** Review real-estate agency credentials, license numbers, and approve developer accounts.

### Module 7: Audit Trail & Compliance Logging
* **Immutable Activity Log:** Records every administrative action (who edited which property, what benchmark was changed, login timestamps, and IP addresses).
* **Data Retention:** Retained in an encrypted `admin_audit_logs` table for compliance and forensic accountability.

---

## 3. Backend Authorization & Administrative Endpoints

All admin endpoints reside under `/api/v1/admin/*` and are guarded by two mandatory Express middlewares:
1. `authenticateToken`: Validates JWT signature, expiration, and ensures user exists.
2. `requireRole(['admin', 'super_admin'])`: Rejects any request with HTTP 403 Forbidden if role does not match.

```text
====================================================================================================
ENDPOINT                                 | METHOD | REQUIRED PERMISSION          | AUDITED
====================================================================================================
/api/v1/admin/dashboard/stats            | GET    | dashboard:view               | No (Read)
/api/v1/admin/properties                 | GET    | properties:moderate          | No (Read)
/api/v1/admin/properties/:id/status      | PATCH  | properties:moderate          | Yes (Logged)
/api/v1/admin/benchmarks                 | GET    | benchmarks:manage            | No (Read)
/api/v1/admin/benchmarks/:id             | PUT    | benchmarks:manage            | Yes (Logged)
/api/v1/admin/mortgages                  | GET    | mortgage:view                | No (Read)
/api/v1/admin/mortgages/:id/status       | PATCH  | mortgage:manage              | Yes (Logged)
/api/v1/admin/services/fast-sell         | GET    | services:manage              | No (Read)
/api/v1/admin/services/exchange          | GET    | services:manage              | No (Read)
/api/v1/admin/users                      | GET    | users:view                   | No (Read)
/api/v1/admin/users/:id/role             | PATCH  | users:manage (super_admin)   | Yes (Logged)
/api/v1/admin/audit-logs                 | GET    | audit:view (super_admin)     | No (Read)
====================================================================================================
```
