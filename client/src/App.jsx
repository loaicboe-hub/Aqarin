import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import AddPropertyPage from './pages/AddPropertyPage';
import HelpMeChoosePage from './pages/HelpMeChoosePage';
import SellingChecklistPage from './pages/SellingChecklistPage';
import PartnersApplyPage from './pages/PartnersApplyPage';
import { SignInPage, SignUpPage, ForgotPasswordPage } from './pages/AuthPages';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TermsPrivacyPage from './pages/TermsPrivacyPage';
import FastBuyPage from './pages/FastBuyPage';
import FastSellPage from './pages/FastSellPage';
import ExchangePage from './pages/ExchangePage';
import FinishingPage from './pages/FinishingPage';
import ManagementPage from './pages/ManagementPage';

// ScrollToTop on route transition
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-500/20 selection:text-sky-900">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}

      <main className="flex-1 bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Core Services (Fast Buy, Fast Sell, Buy, Sell, Rent, Exchange, Finishing) */}
          <Route path="/fast-buy" element={<FastBuyPage />} />
          <Route path="/fast-sell" element={<FastSellPage />} />
          <Route path="/buy" element={<SearchPage />} />
          <Route path="/sell" element={<AddPropertyPage />} />
          <Route path="/rent" element={<SearchPage />} />
          <Route path="/exchange" element={<ExchangePage />} />
          <Route path="/finishing" element={<FinishingPage />} />
          <Route path="/management" element={<ManagementPage />} />
          <Route path="/property-management" element={<ManagementPage />} />
          <Route path="/commercial" element={<SearchPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/add-property" element={<AddPropertyPage />} />
          <Route path="/property-submitted" element={<PropertyDetailsPage />} />

          {/* Decision Support Tools */}
          <Route path="/help-me-choose" element={<HelpMeChoosePage />} />
          <Route path="/selling-checklist" element={<SellingChecklistPage />} />
          <Route path="/partners/apply" element={<PartnersApplyPage />} />

          {/* Auth & Portal */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/complete-account" element={<UserDashboardPage />} />

          {/* Admin Unified Portal Routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/properties" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminDashboardPage />} />
          <Route path="/admin/leads" element={<AdminDashboardPage />} />
          <Route path="/admin/fast-sell" element={<AdminDashboardPage />} />
          <Route path="/admin/exchange" element={<AdminDashboardPage />} />
          <Route path="/admin/management" element={<AdminDashboardPage />} />
          <Route path="/admin/partners" element={<AdminDashboardPage />} />
          <Route path="/admin/benchmarks" element={<AdminDashboardPage />} />
          <Route path="/admin/reports" element={<AdminDashboardPage />} />
          <Route path="/admin/settings" element={<AdminDashboardPage />} />

          {/* Legal */}
          <Route path="/terms" element={<TermsPrivacyPage />} />
          <Route path="/privacy" element={<TermsPrivacyPage />} />

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}
