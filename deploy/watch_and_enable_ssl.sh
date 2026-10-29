#!/bin/bash
TARGET_IP="2.24.49.117"
DOMAIN="aqaarin.com"
EMAIL="m.khaled27091990@gmail.com"

CURRENT_IP=$(dig +short $DOMAIN @8.8.8.8 | tail -n1)
echo "Current DNS IP for $DOMAIN is '$CURRENT_IP' (Target: $TARGET_IP)"

if [ "$CURRENT_IP" = "$TARGET_IP" ]; then
    echo "DNS points to our VPS! Issuing Let's Encrypt SSL certificate..."
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m $EMAIL --redirect
    systemctl reload nginx
    echo "SUCCESS: SSL Certificate Successfully Installed and Active!"
else
    echo "DNS not propagated yet. Still points to '$CURRENT_IP'. Waiting for $TARGET_IP."
fi
