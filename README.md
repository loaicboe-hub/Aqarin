# 🏛️ AQAR IN (عقار إن) — Egypt's Premier Smart Property Platform

منصة رائدة ومتكاملة للخدمات والاستخبارات العقارية الذكية في مصر، مبنية بأحدث معايير الويب الفاخرة مع دعم كامل لقاعدة بيانات **PostgreSQL 16 + PostGIS**، وسيرفر **Node.js (Express)**، وواجهة أمامية فائقة السرعة بـ **React 18 + Vite + Tailwind CSS**.

---

## 🌟 الميزات المكتملة في منصة عقار إن (Features)

1. **محرك البحث والخرائط التفاعلية المكانية (PostGIS Spatial Property Search & Map)**:
   - تصنيف متطور: للبيع (Buy)، للإيجار (Rent)، وتجاري/إداري (Commercial).
   - استعلامات جغرافية فورية بنصف القطر بالمتر (`ST_DWithin`) ومربع العرض (`ST_MakeEnvelope`).
   - وضع العرض المزدوج (Split View) بين قائمة العقارات والخريطة الجغرافية المباشرة (**Leaflet OpenStreetMap**).
   - فلاتر متقدمة: نطاق السعر، المساحة، عدد الغرف، نوع التشطيب، ونطاق البحث الجغرافي.
   - مؤشر جودة الوحدة (**Aqar Score 9.4/10**) يظهر مباشرة على كروت العقارات.

2. **البيع السريع الفوري (Fast Sell Cash Offer)**:
   - خدمة طلب شراء كاش مباشر للعقارات وتخليص الإجراءات القانونية ونقل الملكية خلال 72 ساعة بدون عمولات وسيط.

3. **خدمة تبادل العقارات (Property Exchange)**:
   - آلية ذكية لمطابقة ملاك العقارات الراغبين في استبدال وحداتهم في مناطق مختلفة مع تسوية الفروق المالية قانونياً.

4. **إدارة وتشغيل الأملاك (Property Management)**:
   - عقود إدارة متكاملة للمستثمرين وأصحاب العقارات تشمل التحصيل والتأجير والصيانة الدورية.

5. **أدوات دعم القرار الذكية (Smart Decision Tools)**:
   - **ساعدني في الاختيار (Help Me Choose Quiz)**: اختبار ذكي لاقتراح أفضل كمبوندات ومناطق تناسب ميزانية وهدف المشتري (سكن أم استثمار).
   - **قائمة فحص البائع (Selling Due Diligence Checklist)**: دليل تفاعلي بمؤشر تقدم لتجهيز أوراق الملكية والمخالصات وتثمين الوحدة.
   - **برنامج الشركاء (Partners Program)**: للمطورين العقاريين، شركات البروكريدج، ومقدمي خدمات الإدارة والتشطيب.

6. **إضافة العقارات وإدارة الحسابات (Listing & Dashboards)**:
   - استمارة نشر وإضافة عقار جديد بجميع المواصفات والصور.
   - لوحة تحكم المستخدم (**User Dashboard**) للعقارات المحفوظة وإدارة الطلبات.
   - لوحة تحكم الإدارة الموحدة (**AQAR IN Admin Portal**) مع 13 بنداً إدارياً حصرياً بدون أي ميزات تمويل أو تقييم.
   - دعم كامل للغتين العربية والإنجليزية (**RTL / LTR Toggle**).

---

## 🏗️ هيكلية المشروع (Project Structure)

```text
aqar-in/
├── client/                     # واجهة المستخدم React 18 + Vite + Tailwind
│   ├── src/
│   │   ├── components/         # BrandLogo, Navbar, Footer, PropertyCard, Map...
│   │   ├── pages/              # Home, Search, Details, FastSell, FastBuy, Exchange...
│   │   ├── context/            # LanguageContext (EN/AR), AuthContext
│   │   ├── services/           # api.js (Express API + PostgreSQL Backend)
│   │   └── data/               # mockData.js (بيانات الكمبوندات وأسعار المتر في مصر)
│   └── package.json
│
├── server/                     # الـ Backend REST API بـ Express و PostgreSQL 16 + PostGIS
│   ├── src/
│   │   ├── routes/             # authRoutes, propertyRoutes, leadRoutes, serviceRoutes, adminRoutes
│   │   ├── db.js               # اتصال PostgreSQL Connection Pool (pg)
│   │   └── server.js
│   ├── .env                    # إعدادات السيرفر وقاعدة البيانات
│   └── package.json
│
├── database/                   # قاعدة البيانات PostgreSQL 16 + PostGIS
│   ├── schema_postgresql.sql   # كود إنشاء الجداول الـ 9 والعلاقات ودوال PostGIS
│   └── migrations/             # ترحيلات آمنة قابلة للتراجع
│
└── deploy/                     # ملفات النشر الجاهزة على السيرفر الخاص VPS
    ├── ecosystem.config.js     # إعدادات PM2 للتشغيل المستمر (aqarin-api)
    └── nginx.conf              # إعدادات Nginx مع SSL Reverse Proxy (aqarin.com)
```

---

## 🚀 كيفية التشغيل محلياً (Local Development)

### 1. تشغيل واجهة المستخدم (Frontend):
```bash
cd client
npm run dev
```
الموقع سيفتح مباشرة على: `http://localhost:5173`

### 2. تشغيل السيرفر (Backend API):
```bash
cd server
npm start
```
الـ API سيعمل على: `http://localhost:5000`

### 3. استيراد قاعدة بيانات MySQL (اختياري، المنصة تعمل ببيانات تجريبية حتى بدون MySQL):
افتح phpMyAdmin أو MySQL Workbench ونفذ الملفين:
1. `database/schema.sql` (ينشئ قاعدة `aqarin_db`)
2. `database/seed_data.sql`

بيانات الدخول التجريبية للمسؤول (Admin):
- **Email**: `admin@aqarin.com`
- **Password**: `admin123`

---

## 🌐 كيفية النشر على السيرفر الخاص (VPS Deployment)

1. ارفع المشروع إلى مسار `/var/www/aqarin` على السيرفر.
2. شغل الـ Backend عبر **PM2**:
   ```bash
   pm2 start deploy/ecosystem.config.js
   pm2 save
   ```
3. انقل ملف `deploy/nginx.conf` إلى `/etc/nginx/sites-available/aqarin.com` واعمل له تفعيل مع تشغيل Certbot للـ SSL:
   ```bash
   sudo certbot --nginx -d aqarin.com -d www.aqarin.com
   sudo systemctl reload nginx
   ```
