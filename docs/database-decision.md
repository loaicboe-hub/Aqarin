# AQAR IN — Database Architecture Decision: PostgreSQL 16 + PostGIS

**Target System:** AQAR IN Real Estate Platform (Public Web, Admin Dashboard, Native iOS, Native Android)  
**Author:** Principal Database Architect & Lead Systems Engineer  
**Status:** Approved Architectural Decision Record (Mandatory Decision)  
**Database Choice:** **PostgreSQL 16 + PostGIS Extension** (Authoritative Primary Database from Inception)

---

## 1. Architectural Mandate & Problem Statement

AQAR IN is a national-scale Egyptian real estate intelligence, valuation, and transaction ecosystem. The platform's strategic roadmap mandates:
1. Native, high-precision map exploration and radius filtering across Web, iOS, and Android applications.
2. Polygon-based interactive map search (e.g., drawing a custom search boundary over New Cairo or Sheikh Zayed).
3. Complex multi-criteria property filtering combined with spatial distance from landmarks (e.g. within 5 km of AUC, Monorail stations, or Iconic Tower).
4. Full binary JSON (`JSONB`) querying for property amenities, image metadata, and AI valuation parameter histories.
5. Strict ACID compliance for mortgage and financial applications.

Following architectural review, **PostgreSQL 16 with the PostGIS extension is designated as the sole authoritative database from the beginning**. MySQL is not retained as a long-term database, and migration is not postponed.

---

## 2. Comparative Evaluation Matrix

| Capability | MySQL 8.4 LTS | PostgreSQL 16 + PostGIS (Mandatory Standard) | Architectural Significance |
| :--- | :--- | :--- | :--- |
| **Geospatial & Map Discovery** | Basic OpenGIS spatial support (`SRID 4326`, `ST_Distance_Sphere`). Limited indexing and complex polygon intersection bottlenecks. | **The Industry Gold Standard for GIS:** Native PostGIS spatial indexing (`GIST`), true geodesic ellipsoidal calculations, `ST_DWithin`, spatial clustering, and polygon intersections. | **Critical:** PostGIS powers instant mobile and web map pins, radius search, and custom polygon drawing with zero performance degradation. |
| **JSON Handling & Performance** | Generic binary JSON type. Limited functional indexing; no GIN index. | **`JSONB` with GIN (Generalized Inverted Index) indexing:** Supports key-value containment (`@>`), existence checks, and nested path expressions. | **High:** Instant filtering across dynamic property amenities and valuation parameters. |
| **Text Search & Localization** | Standard full-text search with basic ngram tokenization. | **`pg_trgm` extension:** Trigram-based fuzzy text matching, ideal for handling Arabic compound spelling variants (e.g. matching "اليجريا" with "أليجريا"). | **High:** Superior search user experience for Egyptian compound and district names. |
| **Concurrency & MVCC** | Standard InnoDB row-level locking. | Advanced Multi-Version Concurrency Control (MVCC) without table read locks; superior parallel query execution. | **High:** Sustains heavy concurrent API requests from Web, iOS, Android, and Admin simultaneously. |
| **Ecosystem & Tooling** | Supported by Node.js drivers and ORMs. | Native, first-class citizen across modern backend ORMs (Prisma, Drizzle) and spatial libraries. | **High:** Accelerates type-safe development for shared backend services. |

---

## 3. The Approved Decision & Implementation Strategy

### Decision:
1. **Immediate Migration:** The platform will transition from MySQL 8.4 to **PostgreSQL 16 + PostGIS** prior to launching the mobile applications and the new Admin Dashboard.
2. **Unified Backend Gateway:** Web, Admin, iOS, and Android will interact exclusively with the backend REST API (`/api/v1`), which executes all queries against the authoritative PostgreSQL 16 database. No client will ever connect directly.
3. **Preservation of Existing Data:** All existing compound benchmarks, registered users, bcrypt password hashes, property records, and primary key relationships will be migrated intact with zero data loss.

---

## 4. Key Architectural Enhancements with PostGIS

### 1. Spatial Geometry Architecture:
Every property and benchmark record automatically maintains an indexed spatial geography point:
```sql
location_geog GEOGRAPHY(Point, 4326) GENERATED ALWAYS AS (
  CASE WHEN lat IS NOT NULL AND lng IS NOT NULL 
       THEN ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography 
       ELSE NULL 
  END
) STORED;
```

### 2. High-Performance Spatial Indexing:
```sql
CREATE INDEX idx_prop_location_geog ON properties USING GIST(location_geog);
```

### 3. Native Spatial Querying (Meter-Based):
```sql
-- High-speed radius search: Find properties within :radiusMeters of (:lng, :lat)
SELECT id, title_en, title_ar, price, aqar_score,
       ST_Distance(location_geog, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) AS distance_meters
FROM properties
WHERE status = 'published'
  AND ST_DWithin(location_geog, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
ORDER BY distance_meters ASC
LIMIT $4 OFFSET $5;
```

---

## 5. Migration Reference
For the complete step-by-step migration specification, DDL definitions, data validation checklist, and rollback procedures, refer to:  
👉 [docs/postgresql-migration-plan.md](file:///d:/PROJECTS/AQAR/AQAR%20IN/AQAR%20IN/AQAR%20IN/docs/postgresql-migration-plan.md)
