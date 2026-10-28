# AQAR IN — Comprehensive Security & Vulnerability Audit

**Target System:** AQAR IN Web, API, Database & Infrastructure  
**Auditor:** Principal DevSecOps & Security Specialist  
**Standards:** OWASP Top 10 (2021), CIS Benchmarks, NIST SP 800-53  
**Status:** Complete Forensic Security Audit

---

## 1. Vulnerability Summary Matrix

| Vulnerability ID | Severity | Category | Affected File / Endpoint | Remediation Priority |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | **CRITICAL (CVSS 9.8)** | Broken Access Control | `server/src/routes/adminRoutes.js` | **Immediate (P0)** |
| **SEC-02** | **CRITICAL (CVSS 9.1)** | Broken Access Control | `POST /api/properties` (`propertyRoutes.js:167`) | **Immediate (P0)** |
| **SEC-03** | **HIGH (CVSS 8.5)** | Cryptographic / Auth Failure | `server/src/routes/authRoutes.js:7, 89-97` | **Immediate (P0)** |
| **SEC-04** | **HIGH (CVSS 7.5)** | Security Misconfiguration | `server/src/server.js:24` (CORS `origin: '*'`) | **High (P1)** |
| **SEC-05** | **MEDIUM (CVSS 6.5)** | Denial of Service / Resource Abuse | `GET /api/properties/:id` (`propertyRoutes.js:138`) | **Medium (P2)** |
| **SEC-06** | **MEDIUM (CVSS 6.0)** | Security Headers Missing | `server/src/server.js` | **Medium (P2)** |
| **SEC-07** | **MEDIUM (CVSS 5.8)** | Missing Rate Limiting | All `/api/*` endpoints | **Medium (P2)** |
| **SEC-08** | **LOW (CVSS 4.3)** | Vulnerable Dependency | `multer@1.4.5-lts.1` (`server/package.json`) | **Low (P3)** |

---

## 2. In-Depth Vulnerability Analysis

---

### SEC-01 — [CRITICAL]: Unauthenticated Administrative Endpoints
* **Affected Component:** `server/src/routes/adminRoutes.js` (All endpoints: `GET /stats`, `GET /valuations`, `GET /mortgages`, `PUT /benchmarks/:id`)
* **Evidence from Code:**
  ```javascript
  // adminRoutes.js - Lines 7, 41, 51, 61
  router.get('/stats', async (req, res) => { ... });
  router.get('/valuations', async (req, res) => { ... });
  router.get('/mortgages', async (req, res) => { ... });
  router.put('/benchmarks/:id', async (req, res) => { ... });
  ```
* **Realistic Impact:** Any unauthenticated actor anywhere on the internet can send a `PUT /api/admin/benchmarks/1` request and alter benchmark square-meter prices for New Cairo or Sheikh Zayed, corrupting the entire platform's valuation algorithms. Furthermore, an attacker can extract all applicant financial data via `GET /api/admin/mortgages` without logging in.
* **Remediation:** Introduce mandatory `verifyToken` and `requireRole(['admin', 'super_admin'])` middleware on `adminRoutes.js`.

---

### SEC-02 — [CRITICAL]: Unauthenticated & Arbitrary Property Publishing
* **Affected Component:** `server/src/routes/propertyRoutes.js` (`POST /api/properties`)
* **Evidence from Code:**
  ```javascript
  // propertyRoutes.js - Lines 167-221
  router.post('/', async (req, res) => {
    const { title_en, price, ..., user_id = null } = req.body;
    ...
    // Inserts directly into database with status = 'published'
  });
  ```
* **Realistic Impact:** Spammers or malicious actors can flood the platform with fake listings, illegal content, or phishing links by issuing unauthenticated POST requests. The `user_id` is trusted blindly from the request body rather than extracted from a verified token.
* **Remediation:**
  1. Require user authentication (`verifyToken`).
  2. Extract `user_id` strictly from `req.user.id`.
  3. Default new listings to `status = 'pending_review'` instead of `'published'`.

---

### SEC-03 — [HIGH]: Weak Default JWT Secret & Hardcoded Fallback Credentials
* **Affected Component:** `server/src/routes/authRoutes.js` (Lines 7 and 89-97)
* **Evidence from Code:**
  ```javascript
  // authRoutes.js - Line 7
  const JWT_SECRET = process.env.JWT_SECRET || 'aqarin_super_secret_jwt_key_2026';
  
  // Lines 89-97
  } catch (dbErr) {
    if (email === 'admin@aqarin.com' && password === 'admin123') {
      const token = jwt.sign({ id: 1, email: 'admin@aqarin.com', role: 'admin' }, JWT_SECRET, ...);
      return res.json({ success: true, token, ... });
    }
  }
  ```
* **Realistic Impact:** If the environment variable `JWT_SECRET` is missing or misconfigured, the platform defaults to a predictable static string, allowing anyone to forge administrative JWTs. Additionally, if the database connection ever hiccups, anyone entering `admin@aqarin.com / admin123` is granted a signed super-admin token.
* **Remediation:**
  1. Crash the application immediately on startup if `process.env.JWT_SECRET` is absent or shorter than 32 characters.
  2. Completely purge the hardcoded fallback block in `authRoutes.js`.

---

### SEC-04 — [HIGH]: Wildcard Permissive CORS Configuration
* **Affected Component:** `server/src/server.js` (Lines 24-28)
* **Evidence from Code:**
  ```javascript
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  ```
* **Realistic Impact:** A malicious website visited by an authenticated user can make cross-origin requests to the AQAR IN API.
* **Remediation:** Whitelist specific production origins: `['https://aqarin.com', 'https://www.aqarin.com', 'https://admin.aqarin.com']` while allowing `localhost` only during local development.

---

### SEC-05 — [MEDIUM]: Unthrottled Database Writes on Read Requests
* **Affected Component:** `server/src/routes/propertyRoutes.js` (Line 138)
* **Evidence from Code:**
  ```javascript
  // Triggered on every GET /api/properties/:id
  pool.query('UPDATE properties SET views_count = views_count + 1 WHERE id = ?', [id]).catch(console.error);
  ```
* **Realistic Impact:** A basic scraping bot or DDoS script requesting a property page repeatedly will force thousands of disk-write queries per minute, exhausting MySQL connection pools and degrading database performance for real users.
* **Remediation:** Buffer view counts in **Redis** (`HINCRBY property_views :id 1`) and flush aggregated counts to MySQL in batches every 10 minutes via a scheduled job.

---

### SEC-06 & SEC-07 — [MEDIUM]: Missing Security Headers & Missing Rate Limiting
* **Affected Component:** `server/src/server.js`
* **Evidence from Code:**
  `helmet` and `express-rate-limit` are neither installed nor declared in `server/package.json`.
* **Realistic Impact:** API endpoints are susceptible to automated brute-force attacks on `/api/auth/login`, clickjacking, and MIME-sniffing.
* **Remediation:**
  1. Install `helmet` to set `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security`.
  2. Implement `express-rate-limit` with strict limits on auth routes (e.g. 5 attempts per 15 minutes per IP) and general limits on search routes (60 requests per minute).

---

## 3. Concrete Code Remediation Guide

### 1. Centralized Security Middleware (`server/src/middleware/auth.js`):
```javascript
import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      error: { code: 'UNAUTHORIZED', message: 'Authentication token required' }
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        error: { code: 'FORBIDDEN', message: 'Token is invalid or expired' }
      });
    }
    req.user = user;
    next();
  });
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        error: { code: 'ACCESS_DENIED', message: 'Insufficient administrative permissions' }
      });
    }
    next();
  };
}
```

### 2. Protecting Admin Routes (`server/src/routes/adminRoutes.js`):
```javascript
import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply auth & admin check to ALL admin endpoints automatically
router.use(authenticateToken);
router.use(requireRole(['admin', 'super_admin']));

// Now all routes below are 100% secured:
router.get('/stats', ...);
router.get('/valuations', ...);
router.get('/mortgages', ...);
router.put('/benchmarks/:id', ...);
```
