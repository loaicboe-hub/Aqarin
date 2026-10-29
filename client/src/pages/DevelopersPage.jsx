import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Calendar, 
  Coins, 
  ArrowRight, 
  MessageSquareShare, 
  MapPin, 
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SITE_CONFIG } from '../config/siteConfig';

export const MASTER_DEVELOPERS = [
  {
    id: 'emaar',
    nameAr: 'إعمار مصر',
    nameEn: 'Emaar Misr',
    badgeAr: 'مطور معتمد فئة أ • عالمي',
    badgeEn: 'Grade-A Global Master Developer',
    established: '1997',
    region: 'new_cairo',
    regionAr: 'القاهرة الجديدة والساحل',
    regionEn: 'New Cairo & North Coast',
    projectsAr: ['ميفيدا', 'مراسي', 'أبتاون كايرو', 'كايرو جيت', 'سول'],
    projectsEn: ['Mivida', 'Marassi', 'Uptown Cairo', 'Cairo Gate', 'Soul'],
    searchKey: 'Mivida',
    downPayment: '5%',
    maxYears: '8 سنوات',
    descriptionAr: 'رائد المشروعات العمرانية المتكاملة الفاخرة ووجهات الحياة العصرية في التجمع الخامس والساحل الشمالي.',
    descriptionEn: 'World-renowned master developer behind Egypt’s most iconic communities in New Cairo and North Coast.'
  },
  {
    id: 'sodic',
    nameAr: 'سوديك العقارية',
    nameEn: 'SODIC Developments',
    badgeAr: 'رائد المجتمعات الراقية',
    badgeEn: 'Integrated Living Pioneer',
    established: '1996',
    region: 'zayed_october',
    regionAr: 'الشيخ زايد والتجمع والساحل',
    regionEn: 'Sheikh Zayed, New Cairo & Sahel',
    projectsAr: ['أليجريا', 'فيليت', 'كارميل', 'فاي زايد', 'جون رأس الحكمة', 'إيست تاون'],
    projectsEn: ['Allegria', 'Villette', 'Karmell', 'VYE Sodic', 'June Ras El Hekma', 'Eastown'],
    searchKey: 'Allegria',
    downPayment: '5%',
    maxYears: '8 سنوات',
    descriptionAr: 'أحد أكبر المطورين العقاريين في مصر برصيد أكثر من 28 عاماً من الابتكار في غرب وشرق القاهرة والساحل.',
    descriptionEn: 'Over 28 years of award-winning master development spanning West Cairo, East Cairo, and North Coast.'
  },
  {
    id: 'palmhills',
    nameAr: 'بالم هيلز للتعمير',
    nameEn: 'Palm Hills Developments',
    badgeAr: 'أكبر محفظة مجتمعات سكنية',
    badgeEn: 'Leading Residential Portfolio',
    established: '2005',
    region: 'zayed_october',
    regionAr: 'أكتوبر والتجمع والساحل',
    regionEn: 'October, New Cairo & Sahel',
    projectsAr: ['باديا', 'بالم هيلز أكتوبر', 'بالم هيلز نيو كايرو', 'هاسيندا باي', 'هاسيندا ووترز'],
    projectsEn: ['Badya', 'Palm Hills October', 'Palm Hills New Cairo', 'Hacienda Bay', 'Hacienda Waters'],
    searchKey: 'Palm Hills',
    downPayment: '5%',
    maxYears: '8 سنوات',
    descriptionAr: 'المطور الرائد لأول مدينة ذكية مستدامة بالكامل (باديا) وأفخم المنتجعات الساحلية على البحر المتوسط.',
    descriptionEn: 'Pioneering sustainable smart cities (Badya) and Egypt’s premier Mediterranean coastal resorts.'
  },
  {
    id: 'mountainview',
    nameAr: 'ماونتن فيو (DMG)',
    nameEn: 'Mountain View (DMG)',
    badgeAr: 'رواد سعادة العيش واللاجون',
    badgeEn: 'Happiness & Lagoon Innovation',
    established: '2005',
    region: 'new_cairo',
    regionAr: 'القاهرة الجديدة وأكتوبر ورأس الحكمة',
    regionEn: 'New Cairo, October & Ras El Hekma',
    projectsAr: ['آي سيتي التجمع', 'آي سيتي أكتوبر', 'ماونتن فيو رأس الحكمة', 'ليفيلز', 'بلاج سيدي عبد الرحمن'],
    projectsEn: ['iCity New Cairo', 'iCity October', 'MV Ras El Hekma', 'LVLS', 'Plage Sidi Abdel Rahman'],
    searchKey: 'Mountain View',
    downPayment: '10%',
    maxYears: '8 سنوات',
    descriptionAr: 'مبتكر مفهوم "آي فيلا" وبحيرات الكريستال لاجون ومجتمعات السعادة الأسرية المتكاملة في مصر.',
    descriptionEn: 'Renowned for the patented iVilla concept, turquoise swimmable lagoons, and family-centric communities.'
  },
  {
    id: 'ora',
    nameAr: 'أورا للتطوير (ساويرس)',
    nameEn: 'Ora Developers (Sawiris)',
    badgeAr: 'أبراج عالمية فاخرة',
    badgeEn: 'Ultra-Luxury Towers & Destinations',
    established: '2016',
    region: 'new_cairo',
    regionAr: 'الشيخ زايد والتجمع والساحل',
    regionEn: 'Sheikh Zayed, New Cairo & North Coast',
    projectsAr: ['أبراج زيد الشيخ زايد', 'زيد إيست التجمع', 'سيلفرساندز الساحل', 'سولانا زايد'],
    projectsEn: ['Zed Towers Zayed', 'Zed East New Cairo', 'Silversands Sahel', 'Solana Zayed'],
    searchKey: 'Zed',
    downPayment: '5%',
    maxYears: '8 سنوات',
    descriptionAr: 'بقيادة المهندس نجيب ساويرس، تقدم أورا معايير معمارية عالمية ووجهات فندقية وترفيهية غير مسبوقة.',
    descriptionEn: 'Led by Naguib Sawiris, delivering international luxury hospitality, park living, and high-rise living.'
  },
  {
    id: 'tmg',
    nameAr: 'مجموعة طلعت مصطفى (TMG)',
    nameEn: 'Talaat Moustafa Group',
    badgeAr: 'أكبر مطور مدن ذكية متكاملة',
    badgeEn: 'Largest Smart City Master Builder',
    established: '1970',
    region: 'north_coast',
    regionAr: 'القاهرة والساحل الشمالي والعاصمة',
    regionEn: 'Cairo, North Coast & Capital',
    projectsAr: ['ساوث ميد الساحل', 'مدينتي', 'الرحاب', 'نور سيتي', 'سيليا العاصمة'],
    projectsEn: ['SouthMED Sahel', 'Madinaty', 'Al Rehab', 'Noor City', 'Celia Capital'],
    searchKey: 'Madinaty',
    downPayment: '5%',
    maxYears: '10 سنوات',
    descriptionAr: 'الصرح العقاري الأكبر في الشرق الأوسط ومطور المدن المليونية المتكاملة بمساحات تتجاوز 74 مليون م².',
    descriptionEn: 'The Middle East’s leading master builder of fully autonomous mega-cities with over 74 million sqm developed.'
  },
  {
    id: 'hassanallam',
    nameAr: 'حسن علام العقارية',
    nameEn: 'Hassan Allam Properties',
    badgeAr: 'تراث معماري وهندسي عريق',
    badgeEn: 'Heritage Architecture & Engineering',
    established: '1936',
    region: 'new_cairo',
    regionAr: 'التجمع وزايد والجونة والمستقبل',
    regionEn: 'New Cairo, Zayed, Gouna & Mostakbal',
    projectsAr: ['سوان ليك التجمع', 'سوان ليك ويست', 'هاب تاون المستقبل', 'سوان ليك الجونة', 'ليتل فينيس'],
    projectsEn: ['SwanLake Residences', 'SwanLake West', 'HAPTown Mostakbal', 'SwanLake Gouna', 'Little Venice'],
    searchKey: 'SwanLake',
    downPayment: '10%',
    maxYears: '7 سنوات',
    descriptionAr: 'إرث يمتد لنحو 90 عاماً من الريادة الإنشائية والتطوير الفاخر لأرقى القصور والفيلات السكنية.',
    descriptionEn: 'Nine decades of construction excellence and luxury residential community development.'
  },
  {
    id: 'tatweermisr',
    nameAr: 'تطوير مصر',
    nameEn: 'Tatweer Misr',
    badgeAr: 'أيقونة المشروعات الساحلية',
    badgeEn: 'Iconic Coastal & City Living',
    established: '2014',
    region: 'north_coast',
    regionAr: 'السخنة والساحل والمستقبل وزايد',
    regionEn: 'Sokhna, Sahel, Mostakbal & Zayed',
    projectsAr: ['المونت جلالة السخنة', 'فوكا باي', 'سولت رأس الحكمة', 'بلومفيلدز المستقبل', 'دي أو إس إي'],
    projectsEn: ['Il Monte Galala', 'Fouka Bay', 'Salt Ras El Hekma', 'Bloomfields Mostakbal', 'D.O.S.E'],
    searchKey: 'Monte Galala',
    downPayment: '5%',
    maxYears: '9 سنوات',
    descriptionAr: 'رواد الهندسة الجبلية والشاطئية والتعليم المتطور في مصر من خلال مشروعاتها الحائزة على جوائز دولية.',
    descriptionEn: 'Award-winning master planner known for cliffside Red Sea architecture, beachfront resorts, and education hubs.'
  },
  {
    id: 'misritalia',
    nameAr: 'مصر إيطاليا العقارية',
    nameEn: 'Misr Italia Properties',
    badgeAr: 'رواد العاصمة ورأس الحكمة',
    badgeEn: 'Capital & Coastal Trailblazer',
    established: '1998',
    region: 'capital',
    regionAr: 'العاصمة الإدارية ورأس الحكمة والمستقبل',
    regionEn: 'New Capital, Ras El Hekma & Mostakbal',
    projectsAr: ['إل بوسكو العاصمة', 'فينشي العاصمة', 'سولاري رأس الحكمة', 'إل بوسكو سيتي', 'كاي السخنة'],
    projectsEn: ['IL Bosco Capital', 'Vinci Capital', 'Solare Ras El Hekma', 'IL Bosco City', 'Kai Sokhna'],
    searchKey: 'Bosco',
    downPayment: '5%',
    maxYears: '8 سنوات',
    descriptionAr: 'أكبر مطور بالقطاع الخاص في العاصمة الإدارية وصاحب أول مشروع غابة عمودية خضراء في مصر.',
    descriptionEn: 'The leading private developer in the New Capital, introducing vertical forest architecture to Egypt.'
  },
  {
    id: 'waterway',
    nameAr: 'ذا ووتر واي للتطوير العقاري',
    nameEn: 'The Waterway Developments',
    badgeAr: 'أيقونة الرفاهية والخدمات الفندقية',
    badgeEn: 'Ultra-Luxury Boutique Living',
    established: '2010',
    region: 'new_cairo',
    regionAr: 'القاهرة الجديدة والساحل والعاصمة',
    regionEn: 'New Cairo, Sahel & New Capital',
    projectsAr: ['ذا ووتر واي التجمع', 'ووتر واي الساحل', 'ذا كابيتال واي', 'ذا فيو التجمع', 'دبليو بي آر'],
    projectsEn: ['The Waterway New Cairo', 'Waterway Sahel', 'The Capitalway', 'The View', 'WPR'],
    searchKey: 'Waterway',
    downPayment: '10%',
    maxYears: '6 سنوات',
    descriptionAr: 'الاسم المرادف لأفخم أسلوب حياة فندقي ومجمعات الأعمال والوحدات السكنية الحصرية في مصر.',
    descriptionEn: 'Synonymous with ultra-luxury residential living, cascading water features, and prime commercial hubs.'
  },
  {
    id: 'hydepark',
    nameAr: 'هايد بارك للتطوير العقاري',
    nameEn: 'Hyde Park Developments',
    badgeAr: 'أكبر سنترال بارك في التجمع',
    badgeEn: 'Central Park Living Champion',
    established: '2007',
    region: 'new_cairo',
    regionAr: 'القاهرة الجديدة وأكتوبر ورأس الحكمة',
    regionEn: 'New Cairo, October & Ras El Hekma',
    projectsAr: ['هايد بارك التجمع', 'سي شور رأس الحكمة', 'جاردن ليكس أكتوبر', 'تاوني أكتوبر'],
    projectsEn: ['Hyde Park New Cairo', 'Seashore Ras El Hekma', 'Garden Lakes', 'Tawny October'],
    searchKey: 'Hyde Park',
    downPayment: '5%',
    maxYears: '8 سنوات',
    descriptionAr: 'يحتضن أكبر حديقة مركزية خاصة بمساحة 141 فداناً في التجمع الخامس مع نوادي رياضية دولية.',
    descriptionEn: 'Home to the largest 141-acre central park in New Cairo with Arsenal soccer school and premier living.'
  },
  {
    id: 'cityedge',
    nameAr: 'سيتي إيدج العقارية',
    nameEn: 'City Edge Developments',
    badgeAr: 'المطور الوطني للأبراج والأيقونات',
    badgeEn: 'National Icon & High-Rise Developer',
    established: '2017',
    region: 'north_coast',
    regionAr: 'العلمين الجديدة والعاصمة وماسبيرو',
    regionEn: 'New Alamein, Capital & Maspero',
    projectsAr: ['أبراج نورث إيدج العلمين', 'داون تاون العلمين', 'أبراج ماسبيرو', 'المقصد العاصمة', 'زاهية المنصورة'],
    projectsEn: ['North Edge Towers Alamein', 'Downtown Alamein', 'Maspero Towers', 'Al Maqsad', 'Zahya'],
    searchKey: 'North Edge Towers',
    downPayment: '10%',
    maxYears: '7 سنوات',
    descriptionAr: 'الشراكة الرائدة مع هيئة المجتمعات العمرانية لتشييد أول ناطحات سحاب فندقية على البحر في العلمين.',
    descriptionEn: 'Flagship partnership with NUCA developing Egypt’s first beachfront high-rise towers in New Alamein.'
  },
  {
    id: 'madinetmasr',
    nameAr: 'مدينة مصر للإسكان والتعمير',
    nameEn: 'Madinet Masr (MNHD)',
    badgeAr: 'خبرة عريقة منذ 1959',
    badgeEn: 'Legacy Pioneer Since 1959',
    established: '1959',
    region: 'new_cairo',
    regionAr: 'القاهرة الجديدة وطريق السويس',
    regionEn: 'New Cairo & Suez Road',
    projectsAr: ['تاج سيتي', 'سراي', 'زهو أسيوط', 'كافانا'],
    projectsEn: ['Taj City', 'Sarai', 'Zaho Assiut', 'Cavana'],
    searchKey: 'Taj City',
    downPayment: '5%',
    maxYears: '8 سنوات',
    descriptionAr: 'أعرق شركة تعمير في مصر بخبرة 65 عاماً، وتطور حالياً مدينتي تاج سيتي وسراي بمساحات تتجاوز 9 ملايين م².',
    descriptionEn: '65 years of urban development, transforming 9M+ sqm across Taj City and Sarai on Suez Road.'
  },
  {
    id: 'sabbour',
    nameAr: 'الأهلي صبور للتطوير العقاري',
    nameEn: 'Al Ahly Sabbour',
    badgeAr: 'صناع الثقة والمنتجعات',
    badgeEn: 'Trusted Resort & Urban Master',
    established: '1994',
    region: 'north_coast',
    regionAr: 'المستقبل والساحل وأكتوبر',
    regionEn: 'Mostakbal City, Sahel & October',
    projectsAr: ['جايا رأس الحكمة', 'أمواج الساحل', 'سيتي أوف أوديسيا', 'كيفا 6 أكتوبر', 'جرين سكوير'],
    projectsEn: ['Gaia Ras El Hekma', 'Amwaj Sahel', 'The City of Odyssia', 'Keeva October', 'Green Square'],
    searchKey: 'Gaia',
    downPayment: '5%',
    maxYears: '8 سنوات',
    descriptionAr: 'شراكة قوية بين عائلة صبور والبنك الأهلي المصري تضم أكثر من 60 مشروعاً سكنياً وتجارياً وساحلياً.',
    descriptionEn: 'Strategic partnership with the National Bank of Egypt with over 60 premier residential & resort communities.'
  },
  {
    id: 'lavista',
    nameAr: 'لافيستا للتطوير العقاري',
    nameEn: 'La Vista Developments',
    badgeAr: 'عنوان الخصوصية والتشطيب الفاخر',
    badgeEn: 'Unmatched Privacy & Craftsmanship',
    established: '1991',
    region: 'capital',
    regionAr: 'الساحل والعاصمة والسخنة والتجمع',
    regionEn: 'Sahel, Capital, Sokhna & New Cairo',
    projectsAr: ['لافيستا سيتي العاصمة', 'لافيستا باي الساحل', 'لافيستا رأس الحكمة', 'الباتيـو أورو', 'لافيستا راي'],
    projectsEn: ['La Vista City Capital', 'La Vista Bay', 'La Vista Ras El Hekma', 'El Patio Oro', 'La Vista Ray'],
    searchKey: 'La Vista City',
    downPayment: '10%',
    maxYears: '7 سنوات',
    descriptionAr: 'المعيار الذهبي للجودة العالية واللاندسكيب الرائع والالتزام التاريخي بمواعيد التسليم الدقيقة.',
    descriptionEn: 'The benchmark for meticulous landscape design, privacy, and flawless construction delivery standards.'
  },
  {
    id: 'madaar',
    nameAr: 'مدار للتطوير العقاري',
    nameEn: 'Madaar Development',
    badgeAr: 'رواد الفخامة الساحلية',
    badgeEn: 'Boutique Coastal Luxury',
    established: '2015',
    region: 'red_sea',
    regionAr: 'العين السخنة ورأس الحكمة',
    regionEn: 'Ain Sokhna & Ras El Hekma',
    projectsAr: ['أزها العين السخنة', 'أزها رأس الحكمة', 'نورد العلمين'],
    projectsEn: ['Azha Ain Sokhna', 'Azha Ras El Hekma', 'Nord Alamein'],
    searchKey: 'Azha',
    downPayment: '10%',
    maxYears: '8 سنوات',
    descriptionAr: 'المطور لمشروع أزها السخنة ورأس الحكمة بمفاهيم التصميم العصري والبحيرات المفتوحة والخدمات الفندقية.',
    descriptionEn: 'Master developer of Azha Sokhna & Ras El Hekma, delivering turquoise lagoons and 5-star beachfront living.'
  }
];

export default function DevelopersPage() {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const regions = [
    { id: 'all', nameAr: 'كل المطورين (16)', nameEn: 'All Developers (16)' },
    { id: 'new_cairo', nameAr: 'القاهرة الجديدة والمستقبل', nameEn: 'New Cairo & Mostakbal' },
    { id: 'zayed_october', nameAr: 'الشيخ زايد و 6 أكتوبر', nameEn: 'Zayed & 6th October' },
    { id: 'north_coast', nameAr: 'الساحل الشمالي ورأس الحكمة', nameEn: 'North Coast & Ras El Hekma' },
    { id: 'capital', nameAr: 'العاصمة الإدارية', nameEn: 'New Administrative Capital' },
    { id: 'red_sea', nameAr: 'العين السخنة والجونة', nameEn: 'Ain Sokhna & El Gouna' }
  ];

  const filteredDevelopers = MASTER_DEVELOPERS.filter((dev) => {
    const matchesRegion = selectedRegion === 'all' || dev.region === selectedRegion;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesRegion;

    const matchesName = 
      dev.nameAr.toLowerCase().includes(query) ||
      dev.nameEn.toLowerCase().includes(query) ||
      dev.projectsAr.some((p) => p.toLowerCase().includes(query)) ||
      dev.projectsEn.some((p) => p.toLowerCase().includes(query));

    return matchesRegion && matchesName;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20 text-slate-900">
      
      {/* 1. Hero Banner */}
      <section className="bg-gradient-to-b from-[#0B1C3D] via-[#0F2752] to-[#0B1C3D] text-white pt-16 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-sky-300 text-xs font-bold border border-white/15">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isRTL ? 'دليل كبار المطورين المعتمدين في مصر' : 'Egypt’s Verified Master Real Estate Developers'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {isRTL ? 'استكشف وحدات البرايماري من كبار مطوري مصر' : 'Explore Primary Projects from Egypt’s Top Developers'}
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isRTL 
              ? 'تصفح أحدث المشروعات السكنية والتجارية والساحلية من المطور مباشرة. خطط سداد مريحة تصل إلى 10 سنوات وبدون أي عمولات سمسرة.'
              : 'Browse verified primary compounds and developer sales directly with zero brokerage fees and installment plans up to 10 years.'}
          </p>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
              <p className="text-2xl font-black text-amber-400">16+</p>
              <p className="text-[11px] text-slate-300 font-semibold">{isRTL ? 'مطور فئة أ معتمد' : 'Grade-A Developers'}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
              <p className="text-2xl font-black text-sky-400">80+</p>
              <p className="text-[11px] text-slate-300 font-semibold">{isRTL ? 'كمبوند ومدينة متكاملة' : 'Master Communities'}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
              <p className="text-2xl font-black text-emerald-400">10Y</p>
              <p className="text-[11px] text-slate-300 font-semibold">{isRTL ? 'أطول فترات تقسيط' : 'Up to 10Y Installments'}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
              <p className="text-2xl font-black text-teal-300">0%</p>
              <p className="text-[11px] text-slate-300 font-semibold">{isRTL ? 'بدون عمولة وساطة' : 'Zero Brokerage Fees'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200/80 space-y-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? 'ابحث باسم المطور (سوديك، إعمار، بالم هيلز) أو اسم الكمبوند (ميفيدا، باديا، مراسي)...' : 'Search by developer (SODIC, Emaar, Palm Hills) or compound (Mivida, Badya, Marassi)...'}
              className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {regions.map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setSelectedRegion(reg.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedRegion === reg.id
                    ? 'bg-[#0B1C3D] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isRTL ? reg.nameAr : reg.nameEn}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Developers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            {isRTL ? `عرض ${filteredDevelopers.length} من كبار المطورين المعتمدين` : `Showing ${filteredDevelopers.length} Verified Master Developers`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevelopers.map((dev) => (
            <div
              key={dev.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                {/* Card Top: Logo & Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#0B1C3D] text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                    {dev.nameEn.charAt(0)}
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                      {isRTL ? dev.badgeAr : dev.badgeEn}
                    </span>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">
                      {isRTL ? `تأسست عام ${dev.established}` : `Est. ${dev.established}`}
                    </p>
                  </div>
                </div>

                {/* Developer Name & Description */}
                <div>
                  <h3 className="text-lg font-black text-[#0B1C3D] group-hover:text-sky-600 transition-colors flex items-center gap-1.5">
                    <span>{isRTL ? dev.nameAr : dev.nameEn}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {isRTL ? dev.descriptionAr : dev.descriptionEn}
                  </p>
                </div>

                {/* Terms Pills */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                    <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">{isRTL ? 'المقدم يبدأ من' : 'Down Payment'}</span>
                      <strong className="text-slate-800">{dev.downPayment}</strong>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">{isRTL ? 'فترة التقسيط حتى' : 'Installments'}</span>
                      <strong className="text-slate-800">{dev.maxYears}</strong>
                    </div>
                  </div>
                </div>

                {/* Flagship Projects Pills */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-2">
                    {isRTL ? 'أبرز الكمبوندات والمشروعات:' : 'Flagship Communities:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(isRTL ? dev.projectsAr : dev.projectsEn).map((proj, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"
                      >
                        {proj}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
                <Link
                  to={`/search?search=${encodeURIComponent(dev.searchKey)}`}
                  className="flex-1 py-2.5 rounded-xl bg-[#0B1C3D] hover:bg-[#122B5C] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>{isRTL ? 'تصفح وحدات المطور' : 'View Units'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>

                <a
                  href={SITE_CONFIG.getWhatsAppUrl(
                    isRTL
                      ? `مرحباً، أود الاستفسار عن مشروعات وأسعار مطور (${dev.nameAr}) وأنظمة السداد المتاحة.`
                      : `Hello, I want to inquire about projects by (${dev.nameEn}) and payment plans.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0 transition-colors"
                  title="WhatsApp"
                >
                  <MessageSquareShare className="w-4 h-4" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* 4. Consultation CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        <div className="rounded-3xl bg-gradient-to-r from-[#0B1C3D] to-[#122B5C] p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              {isRTL ? 'تحتاج مساعدة في اختيار المطور أو المشروع الأنسب؟' : 'Need Guidance on Choosing the Right Developer?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              {isRTL
                ? 'مستشارونا العقاريون يساعدونك في مقارنة أسعار المتر، نسب التحميل، خطط السداد، وجدول تسليم الوحدات بدون أي مقابل.'
                : 'Our certified property advisors will help you compare price per sqm, payment plans, and delivery schedules for free.'}
            </p>
          </div>

          <a
            href={SITE_CONFIG.getWhatsAppUrl(
              isRTL 
                ? 'مرحباً، أود استشارة عقارية مجانية لمقارنة مشروعات كبار المطورين في مصر.' 
                : 'Hello, I would like a free consultation comparing top developer projects in Egypt.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg hover:scale-105 transition-all shrink-0"
          >
            <MessageSquareShare className="w-4 h-4" />
            <span>{isRTL ? 'تحدث مع مستشارك العقاري الآن' : 'Speak to Real Estate Advisor'}</span>
          </a>
        </div>
      </section>

    </div>
  );
}
