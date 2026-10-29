// AQAR IN - Centralized Platform & Contact Configuration

export const SITE_CONFIG = {
  name: 'AQAR IN',
  fullNameAr: 'عقار إن - المنصة العقارية الذكية',
  fullNameEn: 'AQAR IN - Real Estate & Investment Platform',
  taglineAr: 'المنصة الذكية الأولى للبيع والشراء والبدل العقاري في مصر',
  taglineEn: 'Egypt\'s Premier Real Estate Exchange, Liquidation & Investment Platform',
  
  // Official Hotlines & Support Contacts
  phone: '+201004491026',
  phoneDisplay: '+20 100 449 1026',
  whatsappNumber: '201004491026',
  whatsappDisplay: '+20 100 449 1026',
  email: 'contact@aqaarin.com',
  supportEmail: 'support@aqaarin.com',
  adminEmail: 'm.khaled27091990@gmail.com',

  // Headquarters
  addressAr: 'مبنى رجال الأعمال، شارع التسعين الشمالي، التجمع الخامس، القاهرة الجديدة',
  addressEn: 'Business Plaza, North 90th St, 5th Settlement, New Cairo, Egypt',
  
  // Operating Hours
  workingHoursAr: 'السبت - الخميس: 9:00 ص - 9:00 م',
  workingHoursEn: 'Sat - Thu: 9:00 AM - 9:00 PM',

  // Social Links
  socialLinks: {
    facebook: 'https://facebook.com/aqarin.egypt',
    instagram: 'https://instagram.com/aqarin.egypt',
    linkedin: 'https://linkedin.com/company/aqarin-egypt'
  },

  // Helper to construct branded WhatsApp direct URL
  getWhatsAppUrl: (customMessage = 'Hello AQAR IN, I have an inquiry.') => {
    const cleanPhone = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`;
  }
};

export default SITE_CONFIG;
