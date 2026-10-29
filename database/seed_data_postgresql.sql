-- ====================================================================
-- AQAR IN — Production PostgreSQL 16 + PostGIS Baseline Seed Data
-- ====================================================================

-- 1. Users
INSERT INTO users (id, full_name, email, password_hash, phone, role) VALUES
(1, 'AQAR IN Admin', 'admin@aqarin.com', '$2a$10$mHk4XSxx9FEPOWHQ4Q4Yg.426DoVhHvVMhkyoiRIIvbsHhsmwsOuW', '+201000000001', 'admin')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, full_name = EXCLUDED.full_name;

-- 2. Location Benchmarks
INSERT INTO location_benchmarks (id, city_en, city_ar, district_en, district_ar, compound_en, compound_ar, avg_price_sqm, min_price_sqm, max_price_sqm, rental_yield_pct, annual_growth_pct, lat, lng) VALUES
(1, 'Cairo', 'القاهرة', 'New Cairo', 'القاهرة الجديدة', 'Mivida', 'ميفيدا', 92000, 80000, 115000, 8.5, 24.0, 30.0167, 31.4833),
(2, 'Cairo', 'القاهرة', 'New Cairo', 'القاهرة الجديدة', 'Villette Sodic', 'فيليت سوديك', 88000, 75000, 105000, 8.0, 22.5, 30.0245, 31.5012),
(3, 'Cairo', 'القاهرة', 'New Cairo', 'القاهرة الجديدة', 'Mountain View iCity', 'ماونتن فيو آي سيتي', 72000, 62000, 88000, 8.8, 26.0, 30.0612, 31.5420),
(4, 'Cairo', 'القاهرة', 'New Cairo', 'القاهرة الجديدة', 'Palm Hills New Cairo', 'بالم هيلز نيو كايرو', 95000, 82000, 120000, 8.2, 23.0, 30.0388, 31.5150),
(5, 'Cairo', 'القاهرة', 'New Cairo', 'التجمع الخامس', 'Golden Square', 'المربع الذهبي', 78000, 68000, 95000, 8.4, 21.0, 30.0200, 31.4700),
(6, 'Giza', 'الجيزة', 'Sheikh Zayed', 'الشيخ زايد', 'Allegria Sodic', 'اليجريا سوديك', 105000, 90000, 135000, 7.8, 20.0, 30.0520, 30.9850),
(7, 'Giza', 'الجيزة', 'Sheikh Zayed', 'الشيخ زايد', 'Zed Towers', 'أبراج زد', 125000, 105000, 160000, 9.2, 28.0, 30.0410, 30.9980),
(8, 'Giza', 'الجيزة', '6th of October', 'السادس من أكتوبر', 'O West Orascom', 'أو ويست أوراسكوم', 68000, 58000, 82000, 8.6, 25.0, 29.9650, 30.9450),
(9, 'Giza', 'الجيزة', '6th of October', 'السادس من أكتوبر', 'Badya Palm Hills', 'بادية بالم هيلز', 64000, 54000, 76000, 8.3, 24.5, 29.9120, 30.8750),
(10, 'Cairo', 'القاهرة', 'New Administrative Capital', 'العاصمة الإدارية', 'IL Bosco Misr Italia', 'البوسكو مصر إيطاليا', 58000, 48000, 72000, 9.5, 30.0, 30.0150, 31.7200),
(11, 'Cairo', 'القاهرة', 'Mostakbal City', 'مدينة المستقبل', 'Bloomfields', 'بلومفيلدز', 56000, 47000, 68000, 8.9, 27.0, 30.0800, 31.6200),
(12, 'Matrouh', 'مطروح', 'North Coast', 'الساحل الشمالي', 'Ras El Hekma', 'رأس الحكمة', 145000, 120000, 220000, 11.5, 38.0, 31.1100, 27.8400),
(13, 'Matrouh', 'مطروح', 'North Coast', 'الساحل الشمالي', 'Hacienda Bay', 'هاسيندا باي', 130000, 110000, 185000, 10.8, 32.0, 30.9500, 28.7500),
(14, 'Red Sea', 'البحر الأحمر', 'El Gouna', 'الجونة', 'Tawila Gouna', 'طويلة الجونة', 155000, 130000, 210000, 12.0, 25.0, 27.3950, 33.6750),
(15, 'Cairo', 'القاهرة', 'Maadi', 'المعادي', 'Degla Maadi', 'دجلة المعادي', 48000, 40000, 62000, 8.1, 17.0, 29.9600, 31.2800),
(16, 'Cairo', 'القاهرة', 'Zamalek', 'الزمالك', 'Gezira Island', 'جزيرة الزمالك', 85000, 70000, 130000, 7.2, 16.0, 30.0600, 31.2200);

-- 3. Realistic Featured Properties in Egypt
INSERT INTO properties (id, title_en, title_ar, description_en, description_ar, purpose, category, property_type, price, area_sqm, bedrooms, bathrooms, floor_level, finishing_type, delivery_status, delivery_year, payment_type, down_payment, installment_years, monthly_installment, city, district, compound, address, lat, lng, aqar_score, images_json, amenities_json, featured, status, user_id, views_count) VALUES
(1, 
 'Luxury 3BR Apartment with Lagoon View in Mivida', 
 'شقة فاخرة 3 غرف بإطلالة على اللاجون في ميفيدا', 
 'Magnificent fully finished modern apartment in Mivida Emaar, Golden Square New Cairo. Features prime lagoon view, central AC, private storage, and 2 underground parking slots.', 
 'شقة رائعة كاملة التشطيب الفاخر في كمبوند ميفيدا إعمار بالمربع الذهبي بالتجمع الخامس. إطلالة مباشرة على اللاجون، تكييف مركزي، غرفة تخزين، و2 باكيج جراج.', 
 'sale', 'residential', 'apartment', 14500000, 195, 3, 3, 3, 'ultra_lux', 'ready', 2026, 'installments', 2900000, 6, 161111, 'Cairo', 'New Cairo', 'Mivida', 'Golden Square, Road 90', 30.0167, 31.4833, 9.4, 
 '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"]'::jsonb, 
 '["Lagoon View", "Central AC", "Underground Parking", "Clubhouse Access", "24/7 Security", "Elevator", "Smart Home Ready"]'::jsonb, 
 TRUE, 'published', 2, 428),

(2, 
 'Standalone Villa with Private Pool in Allegria', 
 'فيلا مستقلة بحمام سباحة خاص في اليجريا سوديك', 
 'Exceptional signature villa overlooking the Greg Norman signature golf course in Allegria Sodic, Sheikh Zayed. Huge landscaped garden, private infinity pool, and maid room with private bath.', 
 'فيلا استثنائية بإطلالة مباشرة على ملعب الجولف العالمي في اليجريا سوديك بالشيخ زايد. حديقة واسعة، حمام سباحة خاص، غرفة للمربية بحمام خاص، وتشطيب فندقي.', 
 'sale', 'residential', 'villa', 38000000, 480, 5, 6, 1, 'ultra_lux', 'ready', 2026, 'cash', 38000000, 0, 0, 'Giza', 'Sheikh Zayed', 'Allegria Sodic', 'Cairo-Alex Desert Road', 30.0520, 30.9850, 9.8, 
 '["https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"]'::jsonb, 
 '["Golf View", "Private Pool", "Private Garden", "Smart Automation", "Maid Room", "Driver Room", "Solar Power"]'::jsonb, 
 TRUE, 'published', 2, 815),

(3, 
 'Prime Seafront Chalet in Ras El Hekma', 
 'شاليه صف أول على البحر مباشرة في رأس الحكمة', 
 'Charming ground chalet with private terrace and direct sandy beach access in the booming destination of Ras El Hekma, North Coast. High ROI investment opportunity.', 
 'شاليه أرضي مميز بحديقة وتراس خاص ووصول مباشر للبحر الرملي الفيروزي في رأس الحكمة بالساحل الشمالي. فرصة استثمارية بعائد إيجاري دولاري قياسي.', 
 'sale', 'residential', 'chalet', 18500000, 140, 3, 2, 1, 'fully_finished', 'under_construction', 2027, 'installments', 1850000, 8, 173437, 'Matrouh', 'North Coast', 'Ras El Hekma', 'KM 210 Alex-Matrouh Rd', 31.1100, 27.8400, 9.6, 
 '["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"]'::jsonb, 
 '["Direct Beachfront", "Private Garden", "Crystal Lagoon", "Fully Furnished", "Commercial Strip", "Water Sports Center"]'::jsonb, 
 TRUE, 'published', 2, 690),

(4, 
 'Ultra-Modern Administrative Office in Central Financial District', 
 'مكتب إداري فاخر في حي المال والأعمال بالعاصمة الإدارية', 
 'Core & shell commercial office space in high-tech corporate tower directly facing the Iconic Tower in the New Administrative Capital. Excellent corporate headquarters location.', 
 'مكتب إداري مميز بموقع استراتيجي في الحي المالي بالعاصمة الإدارية الجديدة بإطلالة مباشرة على البرج الأيقوني والنهر الأخضر. مناسب لمقرات الشركات والبنوك.', 
 'sale', 'commercial', 'office', 9800000, 110, 0, 2, 7, 'core_shell', 'ready', 2026, 'installments', 980000, 7, 105000, 'Cairo', 'New Administrative Capital', 'CBD Towers', 'Financial District Axis', 30.0150, 31.7200, 9.1, 
 '["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"]'::jsonb, 
 '["Iconic Tower View", "Central Fiber Internet", "Meeting Rooms", "Triple Height Lobby", "Underground Parking", "LEED Certified"]'::jsonb, 
 FALSE, 'published', 1, 310),

(5, 
 'Serviced Duplex Penthouse in Zamalek with Nile Panorama', 
 'دوبلكس بنتهاوس فندقي في الزمالك بإطلالة بانورامية على النيل', 
 'Breathtaking duplex penthouse on high floor overlooking the Nile River and Cairo skyline. Finished with imported Italian marble, parquet flooring, and private rooftop terrace.', 
 'دوبلكس بنتهاوس خيالي في أرقى شوارع الزمالك بإطلالة بانورامية مفتوحة على النيل وأفق القاهرة. تشطيب رخام إيطالي مستورد، باركيه أرو، وتراس روف خاص.', 
 'rent', 'residential', 'penthouse', 120000, 320, 4, 4, 11, 'ultra_lux', 'ready', 2026, 'cash', 120000, 0, 0, 'Cairo', 'Zamalek', 'Gezira Island', 'Hassan Sabry Street', 30.0600, 31.2200, 9.7, 
 '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"]'::jsonb, 
 '["Panoramic Nile View", "Rooftop Terrace", "Marble Flooring", "concierge 24/7", "Jacuzzi", "High-Speed Elevators"]'::jsonb, 
 TRUE, 'published', 1, 1250);

-- Sync identity sequences
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE(MAX(id), 1)) FROM users;
SELECT setval(pg_get_serial_sequence('location_benchmarks', 'id'), COALESCE(MAX(id), 1)) FROM location_benchmarks;
SELECT setval(pg_get_serial_sequence('properties', 'id'), COALESCE(MAX(id), 1)) FROM properties;
