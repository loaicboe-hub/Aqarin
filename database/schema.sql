-- ==========================================================
-- AQAR IN (عقار إن) - Database Schema (MySQL 8.0+)
-- Egypt's Premier Smart Property & Valuation Platform
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `aqarin_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `aqarin_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `role` ENUM('buyer', 'seller', 'agent', 'admin') DEFAULT 'buyer',
  `avatar` VARCHAR(255) NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Location Benchmarks & Intelligence Data
CREATE TABLE IF NOT EXISTS `location_benchmarks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `city_en` VARCHAR(100) NOT NULL,
  `city_ar` VARCHAR(100) NOT NULL,
  `district_en` VARCHAR(100) NOT NULL,
  `district_ar` VARCHAR(100) NOT NULL,
  `compound_en` VARCHAR(150) DEFAULT NULL,
  `compound_ar` VARCHAR(150) DEFAULT NULL,
  `avg_price_sqm` DECIMAL(12, 2) NOT NULL,
  `min_price_sqm` DECIMAL(12, 2) NOT NULL,
  `max_price_sqm` DECIMAL(12, 2) NOT NULL,
  `rental_yield_pct` DECIMAL(5, 2) DEFAULT 7.50,
  `annual_growth_pct` DECIMAL(5, 2) DEFAULT 18.00,
  `lat` DECIMAL(10, 7) NOT NULL,
  `lng` DECIMAL(10, 7) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_loc_city` (`city_en`),
  INDEX `idx_loc_district` (`district_en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Properties Table
CREATE TABLE IF NOT EXISTS `properties` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `description_en` TEXT,
  `description_ar` TEXT,
  `purpose` ENUM('sale', 'rent') DEFAULT 'sale',
  `category` ENUM('residential', 'commercial') DEFAULT 'residential',
  `property_type` VARCHAR(50) NOT NULL,
  `price` DECIMAL(14, 2) NOT NULL,
  `area_sqm` INT NOT NULL,
  `bedrooms` INT DEFAULT 0,
  `bathrooms` INT DEFAULT 0,
  `floor_level` INT DEFAULT 1,
  `finishing_type` ENUM('core_shell', 'semi_finished', 'fully_finished', 'ultra_lux') DEFAULT 'fully_finished',
  `delivery_status` ENUM('ready', 'under_construction') DEFAULT 'ready',
  `delivery_year` INT DEFAULT 2026,
  `payment_type` ENUM('cash', 'installments') DEFAULT 'installments',
  `down_payment` DECIMAL(14, 2) DEFAULT 0,
  `installment_years` INT DEFAULT 0,
  `monthly_installment` DECIMAL(12, 2) DEFAULT 0,
  `city` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `compound` VARCHAR(150) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `lat` DECIMAL(10, 7) NOT NULL,
  `lng` DECIMAL(10, 7) NOT NULL,
  `iscore_rating` DECIMAL(3, 1) DEFAULT 8.8,
  `images_json` JSON NOT NULL,
  `amenities_json` JSON NOT NULL,
  `featured` BOOLEAN DEFAULT FALSE,
  `status` ENUM('published', 'pending', 'rejected', 'archived') DEFAULT 'published',
  `user_id` INT NULL,
  `views_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_prop_purpose` (`purpose`),
  INDEX `idx_prop_category` (`category`),
  INDEX `idx_prop_city` (`city`),
  INDEX `idx_prop_price` (`price`),
  INDEX `idx_prop_area` (`area_sqm`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Valuations Records (AI Valuations)
CREATE TABLE IF NOT EXISTS `valuations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `valuation_code` VARCHAR(50) NOT NULL UNIQUE,
  `property_type` VARCHAR(50) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `compound` VARCHAR(150) DEFAULT NULL,
  `area_sqm` INT NOT NULL,
  `bedrooms` INT DEFAULT 0,
  `bathrooms` INT DEFAULT 0,
  `finishing_type` VARCHAR(50) NOT NULL,
  `floor_level` INT DEFAULT 1,
  `view_type` VARCHAR(50) DEFAULT 'Garden',
  `estimated_price_min` DECIMAL(14, 2) NOT NULL,
  `estimated_price_mid` DECIMAL(14, 2) NOT NULL,
  `estimated_price_max` DECIMAL(14, 2) NOT NULL,
  `price_per_sqm` DECIMAL(12, 2) NOT NULL,
  `confidence_score` INT DEFAULT 94,
  `rental_yield_est` DECIMAL(5, 2) DEFAULT 8.2,
  `input_details_json` JSON NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_val_code` (`valuation_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Mortgage Inquiries & Applications
CREATE TABLE IF NOT EXISTS `mortgage_inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `property_id` INT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `property_price` DECIMAL(14, 2) NOT NULL,
  `down_payment` DECIMAL(14, 2) NOT NULL,
  `loan_amount` DECIMAL(14, 2) NOT NULL,
  `tenure_years` INT NOT NULL,
  `monthly_income` DECIMAL(12, 2) NOT NULL,
  `preferred_bank` VARCHAR(100) DEFAULT 'Any',
  `estimated_installment` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('new', 'contacted', 'in_review', 'approved', 'declined') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Property Leads & Inquiries
CREATE TABLE IF NOT EXISTS `leads_inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `property_id` INT NOT NULL,
  `user_id` INT NULL,
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `message` TEXT,
  `inquiry_type` ENUM('whatsapp', 'call', 'schedule_visit', 'inquiry') DEFAULT 'inquiry',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Professional Valuation & Due Diligence Requests
CREATE TABLE IF NOT EXISTS `professional_valuation_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `property_type` VARCHAR(50) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `preferred_date` DATE NOT NULL,
  `notes` TEXT,
  `status` ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Partner Applications
CREATE TABLE IF NOT EXISTS `partner_applications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `company_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `partner_type` ENUM('developer', 'broker', 'valuer', 'financial_institution') NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `message` TEXT,
  `status` ENUM('pending', 'reviewed', 'contacted') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Saved Properties (Favorites)
CREATE TABLE IF NOT EXISTS `saved_properties` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `property_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_user_prop` (`user_id`, `property_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
