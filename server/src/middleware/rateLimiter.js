import rateLimit from 'express-rate-limit';

/**
 * 1. Global API Rate Limiter
 * Allows up to 120 requests per minute per IP address.
 */
export const globalApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'تم تجاوز الحد الأقصى للطلبات المسموح بها، يرجى المحاولة بعد دقيقة.',
    messageEn: 'Too many requests from this IP, please try again in 1 minute.',
    retryAfterSeconds: 60
  }
});

/**
 * 2. Strict Authentication Rate Limiter
 * Protects login and register routes from brute force and credential stuffing.
 * Max 10 attempts per 15 minutes.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 12, // 12 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: {
    success: false,
    error: 'Authentication Locked',
    message: 'تم حظر محاولات الدخول مؤقتاً لحماية أمان الحسابات، يرجى المحاولة بعد 15 دقيقة.',
    messageEn: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
    retryAfterMinutes: 15
  }
});

/**
 * 3. Leads & Inquiries Submission Limiter
 * Prevents spamming property inquiries or contact forms.
 * Max 15 submissions per 15 minutes.
 */
export const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Lead Submission Limit Exceeded',
    message: 'تم إرسال طلبات متعددة، يرجى الانتظار قليلاً قبل إرسال طلب جديد.',
    messageEn: 'Too many lead submissions, please try again later.'
  }
});

/**
 * 4. Image Upload Limiter
 * Max 25 uploads per 10 minutes.
 */
export const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Upload Limit Exceeded',
    message: 'تم تجاوز الحد المسموح لرفع الملفات، يرجى المحاولة لاحقاً.',
    messageEn: 'Upload rate limit exceeded, please try again in a few minutes.'
  }
});
