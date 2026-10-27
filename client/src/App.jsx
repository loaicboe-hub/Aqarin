import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import InstantValuationWizard from './pages/InstantValuationWizard';
import ValuationResultPage from './pages/ValuationResultPage';
import ProfessionalValuationPage from './pages/ProfessionalValuationPage';
import SearchPage from './pages/SearchPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import AddPropertyPage from './pages/AddPropertyPage';
import MortgageCalculatorPage from './pages/MortgageCalculatorPage';
import MortgageApplyPage from './pages/MortgageApplyPage';
import HelpMeChoosePage from './pages/HelpMeChoosePage';
import SellingChecklistPage from './pages/SellingChecklistPage';
import PartnersApplyPage from './pages/PartnersApplyPage';
import { SignInPage, SignUpPage, ForgotPasswordPage } from './pages/AuthPages';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TermsPrivacyPage from './pages/TermsPrivacyPage';

// ScrollToTop on route transition
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-500/20 selection:text-sky-900">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1 bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Valuation Routes */}
          <Route path="/valuation" element={<InstantValuationWizard />} />
          <Route path="/valuation/instant" element={<InstantValuationWizard />} />
          <Route path="/valuation/instant/steps" element={<InstantValuationWizard />} />
          <Route path="/valuation/result/:id" element={<ValuationResultPage />} />
          <Route path="/valuation/professional" element={<ProfessionalValuationPage />} />
          <Route path="/valuation/professional-request" element={<ProfessionalValuationPage />} />

          {/* Search & Discovery Routes */}
          <Route path="/buy" element={<SearchPage />} />
          <Route path="/rent" element={<SearchPage />} />
          <Route path="/commercial" element={<SearchPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/add-property" element={<AddPropertyPage />} />
          <Route path="/property-submitted" element={<PropertyDetailsPage />} />

          {/* Mortgage & Finance Routes */}
          <Route path="/mortgage" element={<MortgageCalculatorPage />} />
          <Route path="/mortgage/calculator" element={<MortgageCalculatorPage />} />
          <Route path="/mortgage/banks" element={<MortgageCalculatorPage />} />
          <Route path="/mortgage/apply" element={<MortgageApplyPage />} />

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

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/properties" element={<AdminDashboardPage />} />
          <Route path="/admin/valuations" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminDashboardPage />} />
          <Route path="/admin/settings" element={<AdminDashboardPage />} />

          {/* Legal */}
          <Route path="/terms" element={<TermsPrivacyPage />} />
          <Route path="/privacy" element={<TermsPrivacyPage />} />

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
