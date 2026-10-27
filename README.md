# 🏛️ AQAR IN (عقار إن) — Egypt's Premier Smart Property & Valuation Platform

منصة رائدة ومتكاملة للاستخبارات والتقييم العقاري الذكي في مصر، مبنية بأحدث معايير الويب الفاخرة مع دعم كامل لقاعدة بيانات **MySQL**، وسيرفر **Node.js (Express)**، وواجهة أمامية فائقة السرعة بـ **React 18 + Vite + Tailwind CSS**.

---

## 🌟 الميزات المكتملة في منصة عقار إن (Features)

1. **مؤشر عقار إن والتقييم الذكي الفوري (Instant Aqar Valuation Engine)**:
   - معالج تفاعلي متعدد الخطوات (Multi-step Wizard) لتحديد المدينة، الحي، الكمبوند، المساحة، نوع التشطيب، الدور، والإطلالة.
   - حساب السعر السوقي العادل (Minimum, Maximum, Median)، وسعر المتر المربع (EGP/m²)، ونسبة دقة التقييم (Confidence Score).
   - رسم بياني تفاعلي لتطور الأسعار خلال 5 سنوات وتوقعات النمو السنوي في المنطقة.
   - حساب العائد الإيجاري السنوي المتوقع (Rental Yield) وقيمة الإيجار الشهري التقريبية.
   - إمكانية طباعة وتصدير شهادة التقييم الرسمية المعتمدة بصيغة **PDF**.

2. **محرك البحث والخرائط التفاعلية (Property Search & Map View)**:
   - تصنيف متطور: للبيع (Buy)، للإيجار (Rent)، وتجاري/إداري (Commercial).
   - وضع العرض المزدوج (Split View) بين قائمة العقارات والخريطة الجغرافية المباشرة (**Leaflet OpenStreetMap**).
   - فلاتر متقدمة: نطاق السعر، المساحة، عدد الغرف، نوع التشطيب، ومقدم الحجز مع خطط السداد (كاش / تقسيط).
   - مؤشر تقييم الوحدة (**Aqar Score 9.4/10**) يظهر مباشرة على كروت العقارات.

3. **صفحة تفاصيل العقار الشاملة (Property Details)**:
   - معرض صور عالي الدقة مع شريط مصغرات تفاعلي.
   - كارت تقييم مؤشر عقار (**Aqar Score**) متوافق مع مواصفات السوق المصري.
   - حاسبة تمويل عقاري سريعة مدمجة في نفس الصفحة لحساب القسط الشهري للوحدة.
   - زر محادثة واتساب مباشر وزر اتصال هاتفي مع استمارة طلب معاينة فورية.

4. **مركز التمويل العقاري للبنوك المصرية (Mortgage Hub)**:
   - حاسبة تفاعلية متوافقة مع مبادرات البنك المركزي المصري (CBE) بنسبة 8% و 3% وأسعار الفائدة التجارية.
   - مقارنة حية بين البنوك الرائدة (CIB، البنك الأهلي، بنك مصر، QNB، AAIB).
   - استمارة التقديم على الموافقة المسبقة للتمويل العقاري.

5. **أدوات دعم القرار الذكية (Smart Decision Tools)**:
   - **ساعدني في الاختيار (Help Me Choose Quiz)**: اختبار ذكي لاقتراح أفضل كمبوندات ومناطق تناسب ميزانية وهدف المشتري (سكن أم استثمار).
   - **قائمة فحص البائع (Selling Due Diligence Checklist)**: دليل تفاعلي بمؤشر تقدم لتجهيز أوراق الملكية والمخالصات وتثمين الوحدة.
   - **طلب معاينة مهندس معتمد (Professional Valuation)**: حجز زيارة خبير تقييم معتمد للمعاينة الميدانية وإصدار تقرير رسمي للبنوك.
   - **برنامج الشركاء (Partners Program)**: للمطورين العقاريين، شركات البروكريدج، ومكاتب التقييم.

6. **إضافة العقارات وإدارة الحسابات (Listing & Dashboards)**:
   - استمارة نشر وإضافة عقار جديد بجميع المواصفات والصور.
   - لوحة تحكم المستخدم (**User Dashboard**) للعقارات المحفوظة وسجل التقييمات.
   - لوحة تحكم الإدارة (**Super Admin Dashboard**) لتعديل أسعار المتر المرجعية لكل منطقة وإدارة المنصة.
   - دعم كامل للغتين العربية والإنجليزية (**RTL / LTR Toggle**).

---

## 🏗️ هيكلية المشروع (Project Structure)

```text
aqar-in/
├── client/                     # واجهة المستخدم React 18 + Vite + Tailwind
│   ├── src/
│   │   ├── components/         # BrandLogo, Navbar, Footer, PropertyCard, Badge...
│   │   ├── pages/              # Home, Valuation, Search, Details, Mortgage, HelpMeChoose...
│   │   ├── context/            # LanguageContext (EN/AR), AuthContext
│   │   ├── services/           # api.js (Express API + LocalStorage fallback)
│   │   └── data/               # mockData.js (بيانات الكمبوندات وأسعار المتر في مصر)
│   └── package.json
│
├── server/                     # الـ Backend REST API بـ Express و MySQL
│   ├── src/
│   │   ├── routes/             # authRoutes, propertyRoutes, valuationRoutes, mortgageRoutes...
│   │   ├── db.js               # اتصال MySQL Connection Pool
│   │   └── server.js
│   ├── .env                    # إعدادات السيرفر وقاعدة البيانات
│   └── package.json
│
├── database/                   # قاعدة البيانات MySQL
│   ├── schema.sql              # كود إنشاء الجداول والعلاقات كاملة (aqarin_db)
│   └── seed_data.sql           # بيانات واقعية لكمبوندات التجمع، زايد، العاصمة، والساحل
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
