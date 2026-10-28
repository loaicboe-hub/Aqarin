# AQAR IN — Master Implementation Roadmap & Execution Plan

**Project:** AQAR IN Full Real Estate Ecosystem (Web, Admin, iOS, Android, API, Infrastructure)  
**Database Standard:** **PostgreSQL 16 + PostGIS (Mandatory Day-One Migration)**  
**Author:** Lead Software Architect & Program Technical Director  
**Status:** Approved Master Implementation Roadmap

---

## 1. Phased Execution Roadmap

The roadmap is structured into **6 ordered, non-blocking phases**. Each phase contains clear deliverables, automated testing checkpoints, and rollback strategies.

```text
+-----------------------------------------------------------------------------------+
|                        AQAR IN EXECUTION TIMELINE                                 |
+-----------------------------------------------------------------------------------+
| Phase 1: Security Hardening & API v1 Architecture        [P0 - Immediate]         |
| Phase 2: PostgreSQL 16 + PostGIS Migration & Services    [P0 - Core Data Engine]  |
| Phase 3: Media Storage & Cloudflare R2 Integration       [P1 - Media Pipeline]    |
| Phase 4: Enterprise Admin Control Panel                  [P1 - Management]        |
| Phase 5: iOS & Android Mobile Apps (React Native / Expo) [P2 - Mobile Clients]    |
| Phase 6: End-to-End QA, Penetration Test & Store Launch  [P3 - Store Release]     |
+-----------------------------------------------------------------------------------+
```

---

### Phase 1: Security Hardening & Backend Foundation (Sprint 1)
* **Goal:** Eliminate all Critical/High vulnerabilities and establish the authoritative `/api/v1` architecture.
* **Tasks:**
  1. Implement centralized `authenticateToken` and `requireRole` middleware in `server/src/middleware/auth.js`.
  2. Secure all endpoints in `adminRoutes.js` and `propertyRoutes.js`.
  3. Remove hardcoded fallback admin credentials from `authRoutes.js` and enforce a 64-character `JWT_SECRET`.
  4. Restrict CORS to verified domain origins.
  5. Install `helmet` (security headers) and `express-rate-limit` (anti-brute-force).
  6. Introduce `zod` validation schemas for all incoming POST/PUT request bodies.
* **Acceptance Criteria:**
  - Automated curl test confirms `GET /api/v1/admin/stats` without token returns `HTTP 401 Unauthorized`.
  - Unauthenticated `POST /api/v1/properties` is rejected with `HTTP 401`.
  - All existing frontend flows continue working seamlessly via backward-compatible redirects.

---

### Phase 2: PostgreSQL 16 + PostGIS Migration & Service Tables (Sprint 2)
* **Goal:** Execute validated migration to PostgreSQL 16 + PostGIS, and provide real database tables for all navbar services.
* **Tasks (Structured into 6 Implementation Gates with Explicit Approvals):**
  1. **Gate 1:** Provision PostgreSQL 16 with PostGIS 3.4 on the Hostinger VPS and execute staging dry-run using pgloader.
  2. Preserve all existing IDs, users, bcrypt password hashes, and properties intact.
  3. Generate and index PostGIS `location_geog` columns (`GEOGRAPHY(Point, 4326)` with GIST index) for true meter-based `ST_DWithin` calculations.
  4. Create dedicated tables for missing services (`fast_sell_requests`, `property_exchange_requests`, `property_management_contracts`).
  5. **Gate 2:** Switch backend database driver from `mysql2` to `pg` (`node-postgres`), updating parameter placeholders to `$1, $2` and insert statements to `RETURNING id`.
  6. **Gate 3 & 4:** Execute 10-minute scheduled maintenance cutover at 03:00 AM Cairo Time with write-freeze and sequence realignment.
  7. **Gate 5 & 6:** Post-cutover 14-day monitoring before MySQL decommissioning.
  8. Connect `FastSellPage.jsx`, `ExchangePage.jsx`, `FinishingPage.jsx`, and `ManagementPage.jsx` to real API endpoints, eliminating all `setTimeout` mocks.
* **Acceptance Criteria:**
  - PostgreSQL 16 verified as active primary data store with zero data loss.
  - Spatial radius query (`ST_DWithin`) returns nearby properties in < 15ms using true meters.
  - Submitting a Fast Sell, Swap, or Management request persists a record in PostgreSQL.

---

### Phase 3: Cloudflare R2 Media Pipeline & Storage Migration (Sprint 3)
* **Goal:** Offload media from VPS local storage to global S3-compatible Cloudflare R2 storage.
* **Tasks:**
  1. Create Cloudflare R2 Bucket `aqarin-media-production`.
  2. Implement backend endpoint `POST /api/v1/media/upload-url` generating presigned PUT URLs via `@aws-sdk/client-s3`.
  3. Integrate direct file upload in `AddPropertyPage.jsx` and mobile camera uploaders.
  4. One-time migration script copying existing `/uploads` files to R2.
* **Acceptance Criteria:**
  - Image files upload directly from client browser/app to R2 in under 2 seconds.
  - Uploaded images display via Cloudflare CDN with automatic WebP conversion.

---

### Phase 4: Enterprise Admin Control Panel (Sprint 4)
* **Goal:** Deliver a dedicated, responsive operations dashboard.
* **Tasks:**
  1. Develop the standalone Admin Portal with responsive sidebar navigation.
  2. Build Listings Moderation Queue with one-click Approve, Reject, and Feature actions.
  3. Build Dynamic Valuation Benchmark Editor with live district multiplier sliders.
  4. Build Mortgage Pipeline Kanban view with bank routing.
  5. Build Service Lead Inbox for Fast Sell, Swap, and Management contracts.
  6. Implement immutable `admin_audit_logs` tracking all moderator actions.
* **Acceptance Criteria:**
  - Admin login requires valid credentials with role `admin` or `super_admin`.
  - Benchmark changes immediately reflect on the public AI Valuation calculator.

---

### Phase 5: iOS & Android Mobile Apps Development (Sprints 5–7)
* **Goal:** Deliver native iOS and Android applications with 100% feature parity using React Native & Expo.
* **Tasks:**
  1. Initialize React Native / Expo Managed Workflow project with TypeScript.
  2. Configure native navigation via Expo Router (Bottom Tabs: Home, Explore, Valuate, Saved, Profile).
  3. Integrate TanStack Query v5 and MMKV for offline caching of saved properties.
  4. Implement Biometric Authentication (Face ID / Fingerprint) and secure token storage in iOS Keychain / Android Keystore.
  5. Implement Native Map Explorer with clustering pins (`react-native-maps`) powered by PostGIS bounding-box queries.
  6. Implement Firebase Cloud Messaging (FCM) & APNs for price drop alerts and cash offer notifications.
  7. Configure Universal Links for deep-linking into specific properties.
* **Acceptance Criteria:**
  - App compiles and runs natively on iOS Simulator and physical Android devices at 60 FPS.
  - App functions smoothly in offline mode for previously viewed listings.

---

### Phase 6: QA, Penetration Testing & App Store Submission (Sprint 8)
* **Goal:** Secure public launch and store release.
* **Tasks:**
  1. Conduct full security penetration test (OWASP Top 10 API verification).
  2. Execute cross-browser and cross-device responsive testing (iPhone 13-16, Samsung Galaxy, iPad, Android tablets).
  3. Configure automated EAS cloud build pipelines (`eas build --platform all`).
  4. Submit iOS `.ipa` to Apple TestFlight and prepare App Store Connect metadata.
  5. Submit Android `.aab` to Google Play Console Internal Testing track.
* **Acceptance Criteria:**
  - Zero critical or high vulnerabilities in automated security scans.
  - Official approval and public release on the Apple App Store and Google Play Store.

---

## 2. Risk Management & Rollback Strategy

| Identified Risk | Likelihood | Impact | Mitigation & Rollback Checkpoint |
| :--- | :--- | :--- | :--- |
| **Database Migration Data Loss** | Very Low | Critical | Pre-cutover `mysqldump` snapshot taken; 10m maintenance window write-freeze; reverse write-replay protocol for post-cutover rollback; MySQL retained in standby for 14 continuous days of zero rollback triggers and two verified weekly backups before decommissioning. |
| **API Contract Breakage** | Low | High | Strict versioning (`/api/v1`). Legacy `/api` requests rewritten internally. Rollback: PM2 rollback to previous commit (`pm2 revert`). |
| **Apple App Store Review Rejection** | Medium | Medium | Adhere strictly to Apple Human Interface Guidelines; provide full test account credentials and video walkthrough in Review Notes. |
| **Image Upload Bottlenecks** | Low | Medium | Client-side image compression prior to upload (max width 1920px, JPEG quality 85%). |

---

## 3. Definition of Done (DoD)

A phase or feature is marked **Done** only when:
1. Backend business logic is covered by automated unit/integration tests (Jest / Supertest).
2. All endpoints are guarded by authentication, RBAC, input validation, and rate limiting.
3. Zero credentials or secret keys exist in git history or client-side bundles.
4. Feature functions identically on Web, iOS, and Android without code divergence.
5. Deployed and verified against the live PostgreSQL 16 + PostGIS database on the Hostinger KVM 4 production VPS.
