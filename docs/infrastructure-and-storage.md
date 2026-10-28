# AQAR IN — Infrastructure, Storage & Operations Blueprint

**Hosting Platform:** Hostinger KVM 4 VPS (4 vCPUs, 16 GB RAM, 200 GB NVMe)  
**Edge & CDN:** Cloudflare  
**Media Storage:** Cloudflare R2 (S3-Compatible)  
**Authoritative Database:** **PostgreSQL 16 + PostGIS 3.4**  
**Author:** Principal Infrastructure & DevSecOps Engineer  
**Status:** Approved Infrastructure & Storage Blueprint

---

## 1. Media & Document Storage Strategy

### Current Reality:
* Currently, images uploaded via Multer are stored directly on the local VPS file system in `/var/www/aqarin/server/uploads` and served statically by Nginx.
* Seed and demo data rely on external Unsplash image URLs.

### Storage Evaluation & Comparison:

| Dimension | Local VPS Disk | Amazon AWS S3 | Cloudflare R2 (Recommended) |
| :--- | :--- | :--- | :--- |
| **Storage Cost** | Included in VPS (200 GB cap) | ~$0.023 / GB / month | **$0.015 / GB / month** (10 GB free) |
| **Egress / Bandwidth Cost** | Limited to 16 TB VPS cap | **Expensive** ($0.09 / GB transferred) | **$0.00 (Zero Egress Fees Always)** |
| **CDN Integration** | Handled locally by Nginx | Requires AWS CloudFront setup | **Native Cloudflare Edge Caching** |
| **Image Optimization** | Server CPU overhead | Requires Lambda@Edge | **Cloudflare Polish / Images (WebP/AVIF)** |
| **Client Upload Pattern** | Multipart POST to Node.js | Direct Presigned URL | **Direct Presigned S3-Compatible URL** |

### The Chosen Strategy: **Cloudflare R2 with Presigned Direct Uploads**

```text
+-------------------+              +-----------------------+              +-------------------+
| Web / Mobile App  |              | Express API Gateway   |              | Cloudflare R2     |
+-------------------+              +-----------------------+              +-------------------+
          |                                    |                                    |
          | 1. POST /api/v1/media/upload-url   |                                    |
          |    (filename: "villa-mivida.jpg")  |                                    |
          |----------------------------------->|                                    |
          |                                    | 2. Generate S3 Presigned PUT URL   |
          |                                    |    (Signed with R2 credentials)    |
          | 3. Returns { uploadUrl, fileKey }  |                                    |
          |<-----------------------------------|                                    |
          |                                                                         |
          | 4. Direct Binary PUT to uploadUrl                                       |
          |------------------------------------------------------------------------>|
          |                                                                         |
          | 5. Submit Property with fileKey                                         |
          |----------------------------------->|                                    |
          |                                    | 6. Save permanent CDN URL in DB    |
```

* **Zero Server Load:** Heavy image files (5MB to 20MB per property photoshoot) flow **directly from the user's phone or browser to Cloudflare R2**, bypassing Node.js memory and bandwidth completely.
* **Backward Compatibility:** Existing property records with Unsplash or local `/uploads/` URLs will continue resolving via Nginx rewrite rules until a one-time migration script mirrors them to R2.

---

## 2. Server Infrastructure & VPS Tuning (Hostinger KVM 4)

The provisioned VPS (4 vCPUs, 16 GB RAM, 200 GB NVMe) provides immense headroom. To utilize 100% of its capabilities:

### 2.1. PostgreSQL 16 + PostGIS Database Optimization:
PostgreSQL 16 is tuned specifically for real-estate GIS workloads:
```ini
# /etc/postgresql/16/main/postgresql.conf
shared_buffers = 4GB                  # 25% of total RAM
effective_cache_size = 12GB           # 75% of total RAM
maintenance_work_mem = 1GB
work_mem = 64MB
wal_buffers = 16MB
max_connections = 100
shared_preload_libraries = 'postgis-3'

# Query Tuning for PostGIS
random_page_cost = 1.1                # Optimized for NVMe storage
effective_io_concurrency = 200
```

### 2.2. PM2 Cluster Mode (Multi-Core Scaling):
Currently, the backend runs in `fork` mode on 1 core. Update `deploy/ecosystem.config.js` to run in **cluster mode across all 4 CPU cores**:
```javascript
module.exports = {
  apps: [
    {
      name: 'aqarin-api',
      script: './src/server.js',
      cwd: '/var/www/aqarin/server',
      instances: 'max',        // Spawns 4 worker threads automatically
      exec_mode: 'cluster',
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
```

### 2.3. Redis Caching Architecture (Installed & Verified):
Redis 8.0.5 is already running on `127.0.0.1:6379`. It is dedicated to three high-performance roles:
1. **API Response Caching:** Cache `GET /api/v1/properties` filter combinations for 60 seconds (reduces DB queries by 85%).
2. **Benchmark Multipliers:** Cache the `location_benchmarks` table in Redis memory for instant zero-latency AI valuations.
3. **Session & Rate-Limiter State:** Enforce sliding-window rate limiting per IP without touching the disk.

### 2.4. Nginx Reverse Proxy Optimization:
Incorporate production HTTP/2, client max body size, and upstream load balancing:
```nginx
upstream aqarin_backend {
    server 127.0.0.1:5000;
    keepalive 32;
}

server {
    listen 80;
    server_name aqarin.com www.aqarin.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name aqarin.com www.aqarin.com;

    # SSL Config (Certbot Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/aqarin.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aqarin.com/privkey.pem;

    # Client upload limit (for local fallback)
    client_max_body_size 25M;

    # Static Build (React SPA)
    root /var/www/aqarin/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://aqarin_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 3. Database Backup & Disaster Recovery (DR)

### Recovery Objectives:
* **Recovery Point Objective (RPO):** < 24 hours (maximum allowable data loss).
* **Recovery Time Objective (RTO):** < 30 minutes (full platform restoration from zero).

### Automated Daily PostgreSQL Backup Cron Job:
A shell script (`/root/backup_postgres.sh`) configured in crontab to run every day at **03:00 AM UTC**:
```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/root/db_backups"
DB_NAME="aqarin_db"
mkdir -p $BACKUP_DIR

# Dump and compress PostgreSQL database with PostGIS geometries
PGPASSWORD='AqarIn2026SecurePass!' pg_dump -U aqar_admin -h localhost -d $DB_NAME -F c -b -v -f "$BACKUP_DIR/aqarin_db_$TIMESTAMP.dump"

# Retain only last 7 days locally
find $BACKUP_DIR -name "*.dump" -mtime +7 -delete

# Sync encrypted backup to Cloudflare R2 / Remote S3
# rclone copy "$BACKUP_DIR/aqarin_db_$TIMESTAMP.dump" r2:aqarin-backups/
```

---

## 4. Monitoring, Logging & Alerting

1. **Uptime & Health Monitoring:**
   * Automated monitoring of `https://aqarin.com/api/health` via Uptime Kuma or BetterStack (1-minute intervals).
   * Instant Telegram / WhatsApp / Email alerts upon any HTTP status other than 200.
2. **Application Error Tracking:**
   * Integrate `@sentry/node` (Backend) and `@sentry/react` (Frontend) to capture unhandled exceptions with full stack traces.
3. **Server Metrics:**
   * PM2 Web dashboard (`pm2 plus` / `pm2 monit`) for real-time memory usage and CPU per thread.
