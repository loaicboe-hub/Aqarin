// ==========================================================
// AQAR IN (عقار إن) - Mock Data & Real-Estate Knowledge Base
// ==========================================================

export const EGYPT_LOCATIONS = [
  {
    cityEn: 'Cairo',
    cityAr: 'القاهرة',
    districts: [
      { nameEn: 'New Cairo', nameAr: 'القاهرة الجديدة', avgSqm: 82000, compounds: ['Mivida', 'Villette Sodic', 'Mountain View iCity', 'Palm Hills New Cairo', 'Hyde Park', 'Katameya Dunes', 'Sarai', 'Eastown'] },
      { nameEn: '5th Settlement', nameAr: 'التجمع الخامس', avgSqm: 78000, compounds: ['Golden Square', 'South 90th', 'North 90th', 'Choueifat', 'Diplomats'] },
      { nameEn: 'New Administrative Capital', nameAr: 'العاصمة الإدارية', avgSqm: 58000, compounds: ['IL Bosco', 'Celia Talaat Moustafa', 'Midtown Sky', 'Scene 7', 'CBD Towers'] },
      { nameEn: 'Mostakbal City', nameAr: 'مدينة المستقبل', avgSqm: 54000, compounds: ['Bloomfields', 'Haptown', 'Aria', 'Il Bosco City', 'Green Square'] },
      { nameEn: 'Madinaty & Shorouk', nameAr: 'مدينتي والشروق', avgSqm: 48000, compounds: ['Madinaty', 'El Patio Prime', 'El Shorouk Gardens'] },
      { nameEn: 'Maadi', nameAr: 'المعادي', avgSqm: 46000, compounds: ['Degla Maadi', 'Sarayat El Maadi', 'Maadi Heights'] },
      { nameEn: 'Zamalek', nameAr: 'الزمالك', avgSqm: 85000, compounds: ['Gezira Island', '26th of July Axis', 'Marashly'] },
      { nameEn: 'Heliopolis', nameAr: 'مصر الجديدة', avgSqm: 52000, compounds: ['Korba', 'Merryland', 'Sheraton Residences'] }
    ]
  },
  {
    cityEn: 'Giza',
    cityAr: 'الجيزة',
    districts: [
      { nameEn: 'Sheikh Zayed', nameAr: 'الشيخ زايد', avgSqm: 95000, compounds: ['Allegria Sodic', 'Zed Towers', 'Beverly Hills', 'Karmell Sodic', 'VYE Sodic', 'Etapa'] },
      { nameEn: 'New Zayed', nameAr: 'زايد الجديدة', avgSqm: 74000, compounds: ['Rivers Tatweer Misr', 'Lugar', 'Naia West', 'Solana Ora'] },
      { nameEn: '6th of October', nameAr: 'السادس من أكتوبر', avgSqm: 62000, compounds: ['O West Orascom', 'Badya Palm Hills', 'Sun Capital', 'Mountain View Chillout Park', 'Pyramids Hills'] }
    ]
  },
  {
    cityEn: 'Matrouh',
    cityAr: 'مطروح (الساحل الشمالي)',
    districts: [
      { nameEn: 'North Coast', nameAr: 'الساحل الشمالي', avgSqm: 135000, compounds: ['Ras El Hekma', 'Hacienda Bay', 'Marassi Emaar', 'Silver Sands Ora', 'Plage Mountain View', 'Salt Tatweer Misr'] }
    ]
  },
  {
    cityEn: 'Red Sea',
    cityAr: 'البحر الأحمر',
    districts: [
      { nameEn: 'El Gouna', nameAr: 'الجونة', avgSqm: 155000, compounds: ['Tawila', 'Ancient Sands', 'Fanadir Bay', 'Cyan', 'Shedwan'] },
      { nameEn: 'Soma Bay', nameAr: 'سوما باي', avgSqm: 98000, compounds: ['Soma Breeze', 'Blanca', 'Mesca'] },
      { nameEn: 'Ain Sokhna', nameAr: 'العين السخنة', avgSqm: 72000, compounds: ['IL Monte Galala', 'Telal Sokhna', 'Azha', 'Little Venice'] }
    ]
  }
];

export const INITIAL_PROPERTIES = [
  {
    id: 1,
    titleEn: 'Luxury 3BR Apartment with Lagoon View in Mivida',
    titleAr: 'شقة فاخرة 3 غرف بإطلالة على اللاجون في ميفيدا',
    descriptionEn: 'Magnificent fully finished modern apartment in Mivida Emaar, Golden Square New Cairo. Features prime lagoon view, central AC, private storage, and 2 underground parking slots.',
    descriptionAr: 'شقة رائعة كاملة التشطيب الفاخر في كمبوند ميفيدا إعمار بالمربع الذهبي بالتجمع الخامس. إطلالة مباشرة على اللاجون، تكييف مركزي، غرفة تخزين، و2 باكيج جراج.',
    purpose: 'sale',
    category: 'residential',
    propertyType: 'apartment',
    price: 14500000,
    areaSqm: 195,
    bedrooms: 3,
    bathrooms: 3,
    floorLevel: 3,
    finishingType: 'ultra_lux',
    deliveryStatus: 'ready',
    deliveryYear: 2026,
    paymentType: 'installments',
    downPayment: 2900000,
    installmentYears: 6,
    monthlyInstallment: 161111,
    city: 'Cairo',
    district: 'New Cairo',
    compound: 'Mivida',
    address: 'Golden Square, Road 90, New Cairo',
    lat: 30.0167,
    lng: 31.4833,
    aqarScore: 9.4,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Lagoon View', 'Central AC', 'Underground Parking', 'Clubhouse Access', '24/7 Security', 'Elevator', 'Smart Home Ready'],
    featured: true,
    viewsCount: 428,
    owner: { name: 'Emaar Signature Real Estate', phone: '+201012345678', whatsapp: '+201012345678', verified: true }
  },
  {
    id: 2,
    titleEn: 'Standalone Signature Villa with Private Pool in Allegria',
    titleAr: 'فيلا مستقلة بحمام سباحة خاص في اليجريا سوديك',
    descriptionEn: 'Exceptional signature villa overlooking the Greg Norman golf course in Allegria Sodic, Sheikh Zayed. Landscaped garden, private infinity pool, and maid room with private bath.',
    descriptionAr: 'فيلا استثنائية بإطلالة مباشرة على ملعب الجولف العالمي في اليجريا سوديك بالشيخ زايد. حديقة واسعة، حمام سباحة خاص، غرفة للمربية بحمام خاص، وتشطيب فندقي.',
    purpose: 'sale',
    category: 'residential',
    propertyType: 'villa',
    price: 38000000,
    areaSqm: 480,
    bedrooms: 5,
    bathrooms: 6,
    floorLevel: 1,
    finishingType: 'ultra_lux',
    deliveryStatus: 'ready',
    deliveryYear: 2026,
    paymentType: 'cash',
    downPayment: 38000000,
    installmentYears: 0,
    monthlyInstallment: 0,
    city: 'Giza',
    district: 'Sheikh Zayed',
    compound: 'Allegria Sodic',
    address: 'Cairo-Alex Desert Road, Sheikh Zayed',
    lat: 30.0520,
    lng: 30.9850,
    aqarScore: 9.8,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Golf View', 'Private Pool', 'Private Garden', 'Smart Automation', 'Maid Room', 'Driver Room', 'Solar Power'],
    featured: true,
    viewsCount: 815,
    owner: { name: 'Sodic Elite Resale', phone: '+201099887766', whatsapp: '+201099887766', verified: true }
  },
  {
    id: 3,
    titleEn: 'Prime Seafront Chalet in Ras El Hekma',
    titleAr: 'شاليه صف أول على البحر مباشرة في رأس الحكمة',
    descriptionEn: 'Charming ground chalet with private terrace and direct sandy beach access in the booming destination of Ras El Hekma, North Coast. High ROI investment opportunity.',
    descriptionAr: 'شاليه أرضي مميز بحديقة وتراس خاص ووصول مباشر للبحر الرملي الفيروزي في رأس الحكمة بالساحل الشمالي. فرصة استثمارية بعائد إيجاري دولاري قياسي.',
    purpose: 'sale',
    category: 'residential',
    propertyType: 'chalet',
    price: 18500000,
    areaSqm: 140,
    bedrooms: 3,
    bathrooms: 2,
    floorLevel: 1,
    finishingType: 'fully_finished',
    deliveryStatus: 'under_construction',
    deliveryYear: 2027,
    paymentType: 'installments',
    downPayment: 1850000,
    installmentYears: 8,
    monthlyInstallment: 173437,
    city: 'Matrouh',
    district: 'North Coast',
    compound: 'Ras El Hekma',
    address: 'KM 210 Alex-Matrouh Road',
    lat: 31.1100,
    lng: 27.8400,
    aqarScore: 9.6,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Direct Beachfront', 'Private Garden', 'Crystal Lagoon', 'Fully Furnished', 'Commercial Strip', 'Water Sports Center'],
    featured: true,
    viewsCount: 690,
    owner: { name: 'Coastline Properties Egypt', phone: '+201055443322', whatsapp: '+201055443322', verified: true }
  },
  {
    id: 4,
    titleEn: 'Ultra-Modern Administrative Office in Central Financial District',
    titleAr: 'مكتب إداري فاخر في حي المال والأعمال بالعاصمة الإدارية',
    descriptionEn: 'Core & shell commercial office space in high-tech corporate tower directly facing the Iconic Tower in the New Administrative Capital. Excellent corporate headquarters location.',
    descriptionAr: 'مكتب إداري مميز بموقع استراتيجي في الحي المالي بالعاصمة الإدارية الجديدة بإطلالة مباشرة على البرج الأيقوني والنهر الأخضر. مناسب لمقرات الشركات والبنوك.',
    purpose: 'sale',
    category: 'commercial',
    propertyType: 'office',
    price: 9800000,
    areaSqm: 110,
    bedrooms: 0,
    bathrooms: 2,
    floorLevel: 7,
    finishingType: 'core_shell',
    deliveryStatus: 'ready',
    deliveryYear: 2026,
    paymentType: 'installments',
    downPayment: 980000,
    installmentYears: 7,
    monthlyInstallment: 105000,
    city: 'Cairo',
    district: 'New Administrative Capital',
    compound: 'CBD Towers',
    address: 'Financial District Axis, New Capital',
    lat: 30.0150,
    lng: 31.7200,
    aqarScore: 9.1,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Iconic Tower View', 'Central Fiber Internet', 'Meeting Rooms', 'Triple Height Lobby', 'Underground Parking', 'LEED Certified'],
    featured: false,
    viewsCount: 310,
    owner: { name: 'Capital Commercial Hub', phone: '+201011223344', whatsapp: '+201011223344', verified: true }
  },
  {
    id: 5,
    titleEn: 'Serviced Duplex Penthouse in Zamalek with Nile Panorama',
    titleAr: 'دوبلكس بنتهاوس فندقي في الزمالك بإطلالة بانورامية على النيل',
    descriptionEn: 'Breathtaking duplex penthouse on high floor overlooking the Nile River and Cairo skyline. Finished with imported Italian marble, parquet flooring, and private rooftop terrace.',
    descriptionAr: 'دوبلكس بنتهاوس خيالي في أرقى شوارع الزمالك بإطلالة بانورامية مفتوحة على النيل وأفق القاهرة. تشطيب رخام إيطالي مستورد، باركيه أرو، وتراس روف خاص.',
    purpose: 'rent',
    category: 'residential',
    propertyType: 'penthouse',
    price: 120000,
    areaSqm: 320,
    bedrooms: 4,
    bathrooms: 4,
    floorLevel: 11,
    finishingType: 'ultra_lux',
    deliveryStatus: 'ready',
    deliveryYear: 2026,
    paymentType: 'cash',
    downPayment: 120000,
    installmentYears: 0,
    monthlyInstallment: 0,
    city: 'Cairo',
    district: 'Zamalek',
    compound: 'Gezira Island',
    address: 'Hassan Sabry Street, Zamalek',
    lat: 30.0600,
    lng: 31.2200,
    aqarScore: 9.7,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Panoramic Nile View', 'Rooftop Terrace', 'Marble Flooring', 'Concierge 24/7', 'Jacuzzi', 'High-Speed Elevators'],
    featured: true,
    viewsCount: 1250,
    owner: { name: 'Zamalek Luxury Homes', phone: '+201077665544', whatsapp: '+201077665544', verified: true }
  },
  {
    id: 6,
    titleEn: 'Lagoon Townhouse with Private Garden in Mountain View iCity',
    titleAr: 'تاون هاوس على اللاجون بحديقة خاصة في ماونتن فيو آي سيتي',
    descriptionEn: 'Contemporary townhouse with 100 sqm private landscaped garden, smart layout, and direct walk to central park and lagoon beach.',
    descriptionAr: 'تاون هاوس عصري مع حديقة خاصة 100 م²، تصميم ذكي، وقريب من السنترال بارك وشاطئ اللاجون في ماونتن فيو بالتجمع.',
    purpose: 'sale',
    category: 'residential',
    propertyType: 'townhouse',
    price: 16200000,
    areaSqm: 230,
    bedrooms: 4,
    bathrooms: 4,
    floorLevel: 1,
    finishingType: 'fully_finished',
    deliveryStatus: 'ready',
    deliveryYear: 2026,
    paymentType: 'installments',
    downPayment: 3240000,
    installmentYears: 5,
    monthlyInstallment: 216000,
    city: 'Cairo',
    district: 'New Cairo',
    compound: 'Mountain View iCity',
    address: 'Middle Ring Road, New Cairo',
    lat: 30.0612,
    lng: 31.5420,
    aqarScore: 9.3,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80'
    ],
    amenities: ['Private Garden', 'Lagoon Beach', 'Central Park', 'Clubhouse', 'Kids Area', 'Underground Parking'],
    featured: false,
    viewsCount: 520,
    owner: { name: 'Mountain View Resale Group', phone: '+201088776655', whatsapp: '+201088776655', verified: true }
  }
];

export const EGYPT_BANKS = [
  {
    id: 'cib',
    name: 'Commercial International Bank (CIB)',
    nameAr: 'البنك التجاري الدولي (CIB)',
    rate: 18.5,
    maxYears: 20,
    maxFinance: 'Up to 25 Million EGP',
    maxFinanceAr: 'حتى 25 مليون جنيه',
    minSalary: 15000,
    badge: 'Popular Choice',
    badgeAr: 'الأكثر طلباً'
  },
  {
    id: 'nbe',
    name: 'National Bank of Egypt (NBE)',
    nameAr: 'البنك الأهلي المصري',
    rate: 8.0,
    maxYears: 30,
    maxFinance: 'CBE 8% & 3% Initiatives',
    maxFinanceAr: 'مبادرات البنك المركزي 8% و 3%',
    minSalary: 8000,
    badge: 'Best Govt Initiative',
    badgeAr: 'أقل فائدة مدعومة'
  },
  {
    id: 'banque-misr',
    name: 'Banque Misr',
    nameAr: 'بنك مصر',
    rate: 17.9,
    maxYears: 20,
    maxFinance: 'Up to 20 Million EGP',
    maxFinanceAr: 'حتى 20 مليون جنيه',
    minSalary: 10000,
    badge: 'Expats Friendly',
    badgeAr: 'مناسب للمغتربين'
  },
  {
    id: 'qnb',
    name: 'QNB Alahli',
    nameAr: 'بنك قطر الوطني الأهلي',
    rate: 19.0,
    maxYears: 15,
    maxFinance: 'Up to 30 Million EGP',
    maxFinanceAr: 'حتى 30 مليون جنيه',
    minSalary: 20000,
    badge: 'Luxury Units',
    badgeAr: 'للوحدات الفاخرة'
  },
  {
    id: 'aaib',
    name: 'Arab African International Bank (AAIB)',
    nameAr: 'البنك العربي الأفريقي الدولي',
    rate: 18.2,
    maxYears: 20,
    maxFinance: 'Up to 25 Million EGP',
    maxFinanceAr: 'حتى 25 مليون جنيه',
    minSalary: 18000,
    badge: 'Flexible Terms',
    badgeAr: 'شروط مرنة'
  }
];

export const SELLER_CHECKLIST = [
  {
    id: 1,
    titleEn: 'Ownership & Legal Papers',
    titleAr: 'أوراق الملكية والمستندات القانونية',
    descEn: 'Ensure you have the registered contract (عقد مسجل) or developer primary contract (عقد ابتدائي) along with full payment clearance certificate (مخالصة نهائية).',
    descAr: 'تأكد من وجود العقد المسجل بالشهر العقاري أو العقد الابتدائي مع المطور، وشهادة المخالصة المالية النهائية ورخصة البناء.',
    category: 'Legal'
  },
  {
    id: 2,
    titleEn: 'Market Price Strategy & Benchmarks',
    titleAr: 'استراتيجية التسعير ومؤشرات السوق',
    descEn: 'Check AQAR IN live market benchmarks to price your property competitively based on current transactions in your district.',
    descAr: 'استعن بمؤشرات أسعار المتر المربع الحية على عقار إن لتسعير عقارك بشكل تنافسي وجذاب للمشترين الجادين.',
    category: 'Pricing'
  },
  {
    id: 3,
    titleEn: 'Maintenance & Utility Clearance',
    titleAr: 'تسوية وديعة الصيانة وفواتير المرافق',
    descEn: 'Obtain official clearance certificates for electricity, water, gas, and maintenance deposit payments from compound management.',
    descAr: 'استخرج شهادات براءة الذمة لعدادات الكهرباء والماء والغاز ومصروفات الصيانة من إدارة الكمبوند أو الحي.',
    category: 'Finance'
  },
  {
    id: 4,
    titleEn: 'Unit Staging & High-Quality Media',
    titleAr: 'تجهيز الوحدة والتصوير الاحترافي',
    descEn: 'Declutter rooms, fix minor plumbing/paint imperfections, and capture wide-angle high-resolution daylight photographs.',
    descAr: 'نظف الوحدة، أصلح العيوب البسيطة في الدهانات أو السباكة، وصور صور وفيديو احترافي بإضاءة نهارية ممتازة.',
    category: 'Marketing'
  },
  {
    id: 5,
    titleEn: 'Publish & Multi-Channel Listing',
    titleAr: 'نشر الإعلان على المنصة والتسويق',
    descEn: 'List your property on AQAR IN to reach verified buyers and get instant WhatsApp/Call inquiries without middlemen hassle.',
    descAr: 'انشر إعلانك على عقار إن (AQAR IN) لتصل لآلاف المشترين الجادين وتستقبل استفسارات مباشرة على واتساب.',
    category: 'Listing'
  }
];

export const HELP_ME_CHOOSE_QUESTIONS = [
  {
    id: 'purpose',
    titleEn: 'What is your primary goal for buying property?',
    titleAr: 'ما هو هدفك الأساسي من شراء العقار؟',
    options: [
      { value: 'living', labelEn: 'Family Home / Living', labelAr: 'سكن عائلي واستقرار', icon: 'Home' },
      { value: 'investment', labelEn: 'High ROI / Capital Growth', labelAr: 'استثمار وزيادة رأس المال', icon: 'TrendingUp' },
      { value: 'rental', labelEn: 'Passive Rental Income', labelAr: 'عائد إيجاري دوري مضمون', icon: 'DollarSign' },
      { value: 'vacation', labelEn: 'Vacation / Summer House', labelAr: 'مصيف وعطلات (ساحل / جونة)', icon: 'Sun' }
    ]
  },
  {
    id: 'budget',
    titleEn: 'What is your approximate budget range?',
    titleAr: 'ما هي الميزانية التقريبية التي تناسبك؟',
    options: [
      { value: 'under_5m', labelEn: 'Under 5 Million EGP', labelAr: 'أقل من 5 مليون جنيه' },
      { value: '5m_10m', labelEn: '5 to 10 Million EGP', labelAr: 'من 5 إلى 10 مليون جنيه' },
      { value: '10m_20m', labelEn: '10 to 20 Million EGP', labelAr: 'من 10 إلى 20 مليون جنيه' },
      { value: 'above_20m', labelEn: '20+ Million EGP (Luxury)', labelAr: 'أكثر من 20 مليون جنيه (فاخر)' }
    ]
  },
  {
    id: 'area',
    titleEn: 'Which area in Egypt do you prefer?',
    titleAr: 'ما هي المنطقة المفضلة بالنسبة لك؟',
    options: [
      { value: 'new_cairo', labelEn: 'New Cairo & 5th Settlement', labelAr: 'القاهرة الجديدة والتجمع' },
      { value: 'zayed', labelEn: 'Sheikh Zayed & 6th of October', labelAr: 'الشيخ زايد وأكتوبر' },
      { value: 'capital', labelEn: 'New Administrative Capital', labelAr: 'العاصمة الإدارية الجديدة' },
      { value: 'coastal', labelEn: 'North Coast & Red Sea', labelAr: 'الساحل الشمالي والجونة' }
    ]
  },
  {
    id: 'payment',
    titleEn: 'How would you prefer to pay?',
    titleAr: 'ما هي طريقة السداد المناسبة لك؟',
    options: [
      { value: 'cash', labelEn: 'Cash (Maximum Discount)', labelAr: 'كاش مع أكبر خصم متاح' },
      { value: 'installments_short', labelEn: 'Installments (3 - 5 Years)', labelAr: 'تقسيط مريح (3 إلى 5 سنوات)' },
      { value: 'installments_long', labelEn: 'Long Installments (6 - 8+ Years)', labelAr: 'تقسيط طويل الأجل (6 إلى 8+ سنوات)' },
      { value: 'exchange', labelEn: 'Property Exchange & Swap', labelAr: 'تبادل عقاري واستبدال وحدة' }
    ]
  }
];
