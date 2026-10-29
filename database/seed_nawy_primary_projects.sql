-- ====================================================================
-- AQAR IN — Primary Real Estate & Developers Seed Data (from Nawy Ecosystem)
-- 16 Master Primary Compounds & Verified Developer Units in Egypt
-- ====================================================================

INSERT INTO properties (
  id, title_en, title_ar, description_en, description_ar, 
  purpose, category, property_type, price, area_sqm, 
  bedrooms, bathrooms, floor_level, finishing_type, 
  delivery_status, delivery_year, payment_type, down_payment, 
  installment_years, monthly_installment, city, district, 
  compound, address, lat, lng, aqar_score, 
  images_json, amenities_json, featured, status, views_count
) VALUES
-- 7. Mountain View iCity New Cairo (Mountain View / DMG)
(7,
 'iVilla Garden with Private Lagoon Access in iCity New Cairo',
 'آي فيلا جاردن بمدخل مباشر على اللاجون في ماونتن فيو آي سيتي التجمع',
 'Prime developer unit by Mountain View. Features smart club park view, direct crystal lagoon access, private landscaped garden, and zero-interest 8-year installment plan.',
 'وحدة برايماري مميزة من المطور ماونتن فيو مباشرة. إطلالة على اللاجون والحديقة الملكية، حديقة خاصة، ونظام سداد مريح على 8 سنوات بدون فوائد.',
 'sale', 'residential', 'villa', 17800000, 235, 3, 3, 1, 'fully_finished', 'under_construction', 2027, 'installments', 1780000, 8, 166875,
 'Cairo', 'New Cairo', 'Mountain View iCity', 'Middle Ring Road, New Cairo', 30.0460, 31.5580, 9.7,
 '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Crystal Lagoon", "Private Garden", "Smart Automation", "Club Park", "Underground Parking", "24/7 Security"]'::jsonb,
 TRUE, 'published', 512),

-- 8. Zed East New Cairo (Ora Developers - Naguib Sawiris)
(8,
 'Panoramic Park View Penthouse in Zed East New Cairo',
 'بنتهاوس فاخر بإطلالة بانورامية على الحديقة المركزية في زيد إيست التجمع',
 'Signature luxury penthouse in Zed East by Ora Developers (Naguib Sawiris). Designed by Wimberly, featuring rooftop swimming pool, terrace, and central AC.',
 'بنتهاوس استثنائي من المطور أورا ساويرس في قلب التجمع الخامس بتصميم عالمي. يشمل حمام سباحة خاص على الروف، تكييف مركزي، وإطلالة على أكبر حديقة مركزية.',
 'sale', 'residential', 'penthouse', 22500000, 220, 4, 4, 5, 'ultra_lux', 'under_construction', 2027, 'installments', 1125000, 8, 222656,
 'Cairo', 'New Cairo', 'Zed East', 'Golden Square, Ring Road', 29.9880, 31.5300, 9.8,
 '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Private Rooftop Pool", "Central Park View", "Smart Home", "Sports Club Access", "Underground Parking", "Concierge"]'::jsonb,
 TRUE, 'published', 674),

-- 9. Badya Palm Hills 6th of October (Palm Hills Developments)
(9,
 'Standalone Smart Villa with Private Pool in Badya Palm Hills',
 'فيلا مستقلة بنظام المنزل الذكي وحمام سباحة خاص في باديا بالم هيلز 6 أكتوبر',
 'The Creative City by Palm Hills. Modern autonomous green villa equipped with cognitive AI infrastructure, solar heating, and private landscaped garden.',
 'فيلا مستقلة بأول مدينة ذكية مستدامة في مصر من بالم هيلز. تشمل حمام سباحة، طاقة شمسية، حديقة خاصة، ونظام أمان متطور بالذكاء الاصطناعي.',
 'sale', 'residential', 'villa', 26000000, 310, 4, 5, 1, 'ultra_lux', 'under_construction', 2027, 'installments', 2600000, 8, 243750,
 'Giza', '6th of October', 'Badya Palm Hills', 'Oasis Road, 6th of October', 29.8970, 30.9850, 9.6,
 '["https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Private Pool", "Solar Powered", "Smart Cognitive City", "Clubhouse", "Sports Academy", "Driver Room"]'::jsonb,
 TRUE, 'published', 489),

-- 10. Marassi Sidi Abdel Rahman (Emaar Misr)
(10,
 'Beachfront Luxury Chalet overlooking Marina in Marassi North Coast',
 'شاليه فاخر صف أول على اللاجون والمارينا في مراسي سيدي عبد الرحمن',
 'World-class coastal retreat in Marassi Emaar. Ground floor with private terrace steps away from the turquoise beach and yacht club.',
 'شاليه أرضي فاخر من إعمار مصر في قلب مراسي الساحل الشمالي. إطلالة على المارينا، وصول مباشر للشاطئ الرملي وخدمات فندقية راقية.',
 'sale', 'residential', 'chalet', 24000000, 165, 3, 2, 1, 'ultra_lux', 'ready', 2026, 'installments', 2400000, 7, 257142,
 'Matrouh', 'North Coast', 'Marassi', 'KM 129 Alex-Matrouh Rd, Sidi Abdel Rahman', 30.9820, 28.8520, 9.9,
 '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Beachfront", "Marina View", "Golf Course Access", "Hotel Concierge", "Infinity Pool", "Private Beach Club"]'::jsonb,
 TRUE, 'published', 930),

-- 11. SouthMED North Coast (Talaat Moustafa Group - TMG)
(11,
 'Direct Lagoon Townhouse with Beach Access in SouthMED Dabaa',
 'تاون هاوس فيو لاجون مفتوح على البحر في مشروع ساوث ميد طلعت مصطفى',
 'Premier Mediterranean smart destination by TMG. Modern luxury townhouse directly on the azure lagoon with flexible 10-year installment plan.',
 'مشروع طلعت مصطفى العالمي الأضخم على الساحل الشمالي. تاون هاوس مودرن على اللاجون المفتوح، شاطئ خاص، وتقسيط مريح حتى 10 سنوات.',
 'sale', 'residential', 'townhouse', 21500000, 210, 3, 3, 2, 'fully_finished', 'under_construction', 2028, 'installments', 1075000, 10, 170208,
 'Matrouh', 'North Coast', 'SouthMED', 'KM 165 Alex-Matrouh Coastal Road, Dabaa', 31.0250, 28.4350, 9.7,
 '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Crystal Lagoon", "Marina Access", "International Golf Course", "Private Garden", "Gated Security"]'::jsonb,
 TRUE, 'published', 785),

-- 12. SwanLake Residences New Cairo (Hassan Allam Properties)
(12,
 'Palatial Standalone Villa in SwanLake Residences New Cairo',
 'فيلا مستقلة فاخرة في كمبوند سوان ليك ريزيدنس التجمع الأول حسن علام',
 'Elite private residence in Hassan Allam prestigious development. Expansive manicured garden, signature architectural finish, and private swimming pool.',
 'فيلا قصر مستقلة بأرقى كمبوندات التجمع الأول من حسن علام. مساحات خضراء شاسعة، حمام سباحة، خصوصية مطلقة، وتشطيب معماري استثنائي.',
 'sale', 'residential', 'villa', 48000000, 540, 5, 6, 1, 'ultra_lux', 'ready', 2026, 'installments', 4800000, 7, 514285,
 'Cairo', 'New Cairo', 'SwanLake Residences', 'Suez Road, First Settlement', 30.0620, 31.4480, 9.9,
 '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Private Pool", "Private Garden", "Maid & Driver Rooms", "Smart Home", "Clubhouse", "24/7 Security"]'::jsonb,
 TRUE, 'published', 840),

-- 13. VYE New Zayed (SODIC Developments)
(13,
 'Modern Sky Duplex with Roof Terrace in VYE SODIC New Zayed',
 'دوبلكس عصري بروف وتراس بانورامي في كمبوند فاي سوديك زايد الجديدة',
 'Contemporary double-height duplex in VYE by SODIC. Includes expansive rooftop lounge with sunset views and energy-efficient living spaces.',
 'دوبلكس بسقف مزدوج وتراس روف خاص من سوديك في زايد الجديدة. تصميم عصري يعتمد على الطاقة المستدامة ومساحات معيشة واسعة.',
 'sale', 'residential', 'duplex', 15200000, 205, 3, 3, 3, 'fully_finished', 'under_construction', 2027, 'installments', 760000, 8, 150416,
 'Giza', 'New Zayed', 'VYE SODIC', 'Dabaa Corridor Axis, New Zayed', 30.0920, 30.8850, 9.5,
 '["https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Roof Terrace", "Green Energy", "Co-working Space", "Clubhouse Access", "Electric Car Charger"]'::jsonb,
 TRUE, 'published', 430),

-- 14. Il Monte Galala Ain Sokhna (Tatweer Misr)
(14,
 'Cliffside Beach Chalet with Swimmable Lagoon in Il Monte Galala',
 'شاليه جبلي بإطلالة ساحرة على بحيرات الكريستال لاجون في المونت جلالة السخنة',
 'Elevated seaside residence sculpted into the Galala Mountain by Tatweer Misr. Direct views over the Red Sea with crystal lagoon and beach club membership.',
 'شاليه جبلي ساحر منحوت في جبل الجلالة من تطوير مصر. إطلالة بانورامية على البحر الأحمر والبحيرات الكريستالية مع اشتراك في النادي الشاطئي.',
 'sale', 'residential', 'chalet', 11500000, 120, 2, 2, 2, 'fully_finished', 'under_construction', 2027, 'installments', 575000, 9, 101157,
 'Red Sea', 'Ain Sokhna', 'Il Monte Galala', 'Galala Mountain, Suez-Sokhna Rd', 29.5800, 32.3900, 9.5,
 '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Swimmable Lagoon", "Sea View", "Mountain Elevators", "Beach Club", "Infinity Pool", "Fully Finished"]'::jsonb,
 TRUE, 'published', 610),

-- 15. IL Bosco New Administrative Capital (Misr Italia Properties)
(15,
 'Green River Facing 3BR Apartment in IL Bosco New Capital',
 'شقة 3 غرف فيو مباشر على النهر الأخضر في كمبوند إل بوسكو العاصمة الإدارية',
 'Iconic vertical forest community by Misr Italia. Prime location on the Mohamed Bin Zayed South Axis overlooking the Green River and Opera House.',
 'شقة رائعة في أول كمبوند بيئي بالعاصمة الإدارية من مصر إيطاليا على محور بن زايد والنهر الأخضر بجوار دار الأوبرا وحي السفارات.',
 'sale', 'residential', 'apartment', 8900000, 175, 3, 3, 4, 'fully_finished', 'ready', 2026, 'installments', 890000, 8, 83437,
 'Cairo', 'New Administrative Capital', 'IL Bosco', 'Mohamed Bin Zayed South Axis', 30.0050, 31.7050, 9.4,
 '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Green River View", "Vertical Forest", "Underground Parking", "Smart Community", "Clubhouse"]'::jsonb,
 TRUE, 'published', 530),

-- 16. The Waterway New Cairo (The Waterway Developments)
(16,
 'Ultra-Lux Furnished Serviced Apartment in The Waterway New Cairo',
 'شقة فندقية ألترا سوبر لوكس مفروشة بالكامل في ذا ووتر واي التجمع الخامس',
 'Elite hospitality apartment in North Investors New Cairo. Surrounded by cascading water features, upscale dining strip, and concierge management.',
 'شقة فندقية راقية بتشطيبات وتأثيث فاخر كامل في أرقى مشروعات التجمع الخامس ووتر واي. محاطة بالبحيرات والمطاعم العالمية وخدمات فندقية متكاملة.',
 'sale', 'residential', 'apartment', 19500000, 185, 3, 3, 2, 'ultra_lux', 'ready', 2026, 'installments', 2925000, 6, 230208,
 'Cairo', 'New Cairo', 'The Waterway', 'Northern Investors Area, New Cairo', 30.0450, 31.4780, 9.7,
 '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Water Features", "Fully Furnished", "Commercial Strip", "Concierge", "Underground Parking", "Elevator"]'::jsonb,
 TRUE, 'published', 720),

-- 17. Hyde Park New Cairo (Hyde Park Developments)
(17,
 'Twin House directly overlooking Central Park in Hyde Park New Cairo',
 'توين هاوس بإطلالة مباشرة على أكبر حديقة مركزية في هايد بارك التجمع',
 'Prestigious family twin house directly bordering the 141-acre central park. Spacious private garden, family living room, and maid quarters.',
 'توين هاوس مميز للعائلات على أكبر حديقة خضراء في القاهرة الجديدة من هايد بارك. حديقة واسعة، غرفة مربية، وأمان على مدار الساعة.',
 'sale', 'residential', 'twin_house', 28500000, 280, 4, 4, 2, 'semi_finished', 'under_construction', 2027, 'installments', 1425000, 8, 282031,
 'Cairo', 'New Cairo', 'Hyde Park', 'Main 90th Street, Golden Square', 29.9880, 31.5050, 9.6,
 '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Central Park View", "Private Garden", "Arsenal Soccer School", "Clubhouse", "24/7 Security"]'::jsonb,
 TRUE, 'published', 560),

-- 18. North Edge Towers New Alamein (City Edge Developments)
(18,
 'High-Floor Sea Panorama Penthouse in North Edge Towers New Alamein',
 'بنتهاوس فندقي في الدور 32 ببانوراما كاملة على البحر في أبراج العلمين الجديدة',
 'Spectacular high-rise seafront apartment by City Edge. Unmatched 360-degree views over the Mediterranean and turquoise lagoons with five-star hotel services.',
 'بنتهاوس فندقي استثنائي بأبراج نورث إيدج العلمين من سيتي إيدج. إطلالة بانورامية 360 درجة على البحر الأبيض المتوسط والبحيرات مع خدمات فندقية 5 نجوم.',
 'sale', 'residential', 'penthouse', 32000000, 260, 3, 4, 32, 'ultra_lux', 'ready', 2026, 'installments', 3200000, 7, 342857,
 'Matrouh', 'North Coast', 'North Edge Towers', 'Corniche Beachfront, New Alamein City', 30.8350, 28.9550, 9.8,
 '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Panoramic Sea View", "Infinity Pool", "Private Beach", "Concierge 24/7", "Spa & Wellness", "Smart Valet"]'::jsonb,
 TRUE, 'published', 885),

-- 19. Taj City New Cairo (Madinet Masr - MNHD)
(19,
 'Prime 3BR Family Apartment facing Cairo Airport in Taj City',
 'شقة عائلية 3 غرف أمام فندق الماريوت ومطار القاهرة في تاج سيتي',
 'Exceptional residential community directly connecting Heliopolis and New Cairo on Suez Road. Close to major business districts with easy 8-year installments.',
 'شقة عائلية مميزة في كمبوند تاج سيتي من مدينة مصر على طريق السويس مباشرة أمام مطار القاهرة. موقع استراتيجي وتسهيلات سداد تصل إلى 8 سنوات.',
 'sale', 'residential', 'apartment', 9200000, 160, 3, 2, 3, 'fully_finished', 'ready', 2026, 'installments', 460000, 8, 91041,
 'Cairo', 'New Cairo', 'Taj City', 'Suez Road & Ring Road Intersection', 30.0880, 31.3950, 9.3,
 '["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Clubhouse", "Sports Facilities", "Underground Parking", "Commercial Zone", "Gated Security"]'::jsonb,
 TRUE, 'published', 475),

-- 20. Gaia Ras El Hekma (Al Ahly Sabbour)
(20,
 'Chalet Duplex with Turquoise Lagoon View in Gaia Ras El Hekma',
 'شاليه دوبلكس بإطلالة مباشرة على بحيرات اللاجون الفيروزية في جايا رأس الحكمة',
 'Exquisite coastal duplex in Gaia by Sabbour. Designed with Arabian architectural charm, crystal lagoons, sandy beach, and vibrant summer amenities.',
 'شاليه دوبلكس مميز في قرية جايا رأس الحكمة من الأهلي صبور. بحيرات صناعية فيروزية قابلة للسباحة، شاطئ رملي ناعم، وخدمات ترفيهية متكاملة.',
 'sale', 'residential', 'duplex', 16800000, 175, 3, 3, 2, 'fully_finished', 'under_construction', 2027, 'installments', 840000, 8, 166250,
 'Matrouh', 'North Coast', 'Gaia Ras El Hekma', 'KM 194 Alex-Matrouh Coastal Rd, Ras El Hekma', 31.1050, 27.9100, 9.6,
 '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Direct Lagoon View", "Private Beach", "Aqua Park", "Clubhouse", "Supermarket", "24/7 Security"]'::jsonb,
 TRUE, 'published', 640),

-- 21. La Vista City New Capital (La Vista Developments)
(21,
 'Exclusive Standalone Villa in La Vista City New Administrative Capital',
 'فيلا مستقلة فاخرة في كمبوند لافيستا سيتي على النهر الأخضر بالعاصمة',
 'Master villa community by La Vista on the Green River. Spans 910 acres of lush greenery, international schools, commercial boulevard, and private swimming pool.',
 'فيلا مستقلة رائعة بأكبر كمبوند فيلات متكامل في العاصمة الإدارية من لافيستا. تطل على النهر الأخضر ومحور بن زايد، وتضم حمام سباحة وحديقة واسعة.',
 'sale', 'residential', 'villa', 31500000, 340, 4, 5, 1, 'ultra_lux', 'ready', 2026, 'installments', 3150000, 7, 337500,
 'Cairo', 'New Administrative Capital', 'La Vista City', 'Green River Axis, R4 District', 29.9980, 31.6850, 9.7,
 '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Green River View", "Private Pool", "Private Garden", "International Schools", "Clubhouse", "24/7 Concierge"]'::jsonb,
 TRUE, 'published', 710),

-- 22. Azha Ain Sokhna (Madaar Development)
(22,
 'Waterfront Senior Chalet with Sandy Beach Access in Azha Ain Sokhna',
 'شاليه سينيور على شاطئ رملي ولاجون كريستالي خاص في قرية أزها السخنة',
 'Premier luxury coastal resort by Madaar in Ain Sokhna. Direct beachfront, crystal clear swimmable lagoon, fine dining beach club, and 8-year installments.',
 'شاليه سينيور راقي في قرية أزها العين السخنة من مدار. شاطئ رملي بدون صخور، بحيرة لاجون فيروزية، مطاعم شاطئية راقية، وتقسيط مريح على 8 سنوات.',
 'sale', 'residential', 'chalet', 13900000, 145, 3, 2, 1, 'fully_finished', 'ready', 2026, 'installments', 1390000, 8, 130312,
 'Red Sea', 'Ain Sokhna', 'Azha', 'KM 126 Suez-Sokhna Road', 29.7420, 32.4180, 9.6,
 '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"]'::jsonb,
 '["Sandy Beach", "Crystal Lagoon", "Boutique Hotel Services", "Clubhouse", "Private Garden", "Security"]'::jsonb,
 TRUE, 'published', 590)
ON CONFLICT (id) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_ar = EXCLUDED.title_ar,
  description_en = EXCLUDED.description_en,
  description_ar = EXCLUDED.description_ar,
  price = EXCLUDED.price,
  area_sqm = EXCLUDED.area_sqm,
  bedrooms = EXCLUDED.bedrooms,
  bathrooms = EXCLUDED.bathrooms,
  property_type = EXCLUDED.property_type,
  compound = EXCLUDED.compound,
  city = EXCLUDED.city,
  district = EXCLUDED.district,
  down_payment = EXCLUDED.down_payment,
  installment_years = EXCLUDED.installment_years,
  monthly_installment = EXCLUDED.monthly_installment,
  images_json = EXCLUDED.images_json,
  amenities_json = EXCLUDED.amenities_json,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status;

-- Update sequence to prevent ID conflicts
SELECT setval('properties_id_seq', (SELECT MAX(id) FROM properties));
