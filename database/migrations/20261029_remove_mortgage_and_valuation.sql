-- ====================================================================
-- AQAR IN — Migration: Complete Mortgage & Valuation Removal
-- Date: 2026-10-29
-- Description: Permanently removes mortgage and valuation tables,
--              indexes, and constraints while preserving all properties,
--              users, benchmarks, leads, exchanges, and management data.
-- ====================================================================

BEGIN;

-- 1. Drop Mortgage Inquiries Table
DROP TABLE IF EXISTS mortgage_inquiries CASCADE;

-- 2. Drop Valuations Table & Index
DROP TABLE IF EXISTS valuations CASCADE;

-- 3. Drop Professional Valuation Requests Table
DROP TABLE IF EXISTS professional_valuation_requests CASCADE;

COMMIT;
