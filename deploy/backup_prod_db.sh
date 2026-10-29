#!/bin/bash
set -e

BACKUP_DIR="/var/www/aqarin/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/aqarin_prod_$TIMESTAMP.sql.gz"
LOG_FILE="$BACKUP_DIR/backup.log"

mkdir -p "$BACKUP_DIR"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting automated backup of aqarin_prod_db..." >> "$LOG_FILE"
docker exec -i aqarin-postgres-prod pg_dump -U aqar_prod_user aqarin_prod_db | gzip > "$BACKUP_FILE"

if [ -s "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] SUCCESS: Backup created at $BACKUP_FILE (Size: $SIZE)" >> "$LOG_FILE"
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Backup file is empty!" >> "$LOG_FILE"
    exit 1
fi

# Rotate backups: delete backups older than 14 days
find "$BACKUP_DIR" -type f -name "aqarin_prod_*.sql.gz" -mtime +14 -delete
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup rotation complete." >> "$LOG_FILE"
