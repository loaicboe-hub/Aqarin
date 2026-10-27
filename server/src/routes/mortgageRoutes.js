import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Egyptian Banks mortgage database & current initiative rates
const banksData = [
  {
    id: 'cib',
    name: 'Commercial International Bank (CIB)',
    nameAr: 'البنك التجاري الدولي (CIB)',
    logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=120&q=80',
    interestRate: 18.5,
    maxTenureYears: 20,
    maxFinancePct: 80,
    minSalary: 15000,
    features: ['Fast approval in 5 days', 'Finance up to 25 Million EGP', 'Flexible repayment terms']
  },
  {
    id: 'nbe',
    name: 'National Bank of Egypt (NBE)',
    nameAr: 'البنك الأهلي المصري',
    logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=120&q=80',
    interestRate: 8.0, // Central Bank Initiative rate
    maxTenureYears: 30,
    maxFinancePct: 85,
    minSalary: 8000,
    features: ['CBE 8% & 3% Initiatives', 'Longest repayment period up to 30 years', 'Minimal processing fees']
  },
  {
    id: 'banque-misr',
    name: 'Banque Misr',
    nameAr: 'بنك مصر',
    logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=120&q=80',
    interestRate: 17.9,
    maxTenureYears: 20,
    maxFinancePct: 80,
    minSalary: 10000,
    features: ['CBE Initiatives available', 'Available for Egyptian expats', 'Discounts on unit insurance']
  },
  {
    id: 'qnb',
    name: 'QNB Alahli',
    nameAr: 'بنك قطر الوطني الأهلي',
    logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=120&q=80',
    interestRate: 19.0,
    maxTenureYears: 15,
    maxFinancePct: 75,
    minSalary: 20000,
    features: ['High-end luxury property financing', 'Dedicated wealth mortgage advisor', 'Fast paperwork']
  },
  {
    id: 'aaib',
    name: 'Arab African International Bank (AAIB)',
    nameAr: 'البنك العربي الأفريقي الدولي',
    logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=120&q=80',
    interestRate: 18.2,
    maxTenureYears: 20,
    maxFinancePct: 80,
    minSalary: 18000,
    features: ['Exclusive compound partnerships', 'Competitive decreasing interest rates']
  }
];

// 1. Get banks and current rates
router.get('/banks', (req, res) => {
  res.json({ success: true, count: banksData.length, data: banksData });
});

// 2. Calculate Mortgage Equation
router.post('/calculate', (req, res) => {
  try {
    const {
      propertyPrice = 5000000,
      downPaymentPct = 20,
      tenureYears = 15,
      interestRate = 18.5
    } = req.body;

    const price = Number(propertyPrice);
    const downPayment = Math.round(price * (Number(downPaymentPct) / 100));
    const loanAmount = price - downPayment;
    
    const monthlyRate = (Number(interestRate) / 100) / 12;
    const totalMonths = Number(tenureYears) * 12;

    // Monthly payment formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    let monthlyInstallment = 0;
    if (monthlyRate > 0) {
      monthlyInstallment = Math.round(
        loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
      );
    } else {
      monthlyInstallment = Math.round(loanAmount / totalMonths);
    }

    const totalPayment = monthlyInstallment * totalMonths;
    const totalInterest = totalPayment - loanAmount;
    const minRequiredIncome = Math.round(monthlyInstallment * 2.5); // Installment shouldn't exceed 40% of income

    res.json({
      success: true,
      data: {
        propertyPrice: price,
        downPayment,
        downPaymentPct: Number(downPaymentPct),
        loanAmount,
        tenureYears: Number(tenureYears),
        interestRate: Number(interestRate),
        monthlyInstallment,
        totalInterest,
        totalPayment,
        minRequiredIncome
      }
    });
  } catch (err) {
    res.status(500).json({ error: true, message: 'Calculation error: ' + err.message });
  }
});

// 3. Submit Mortgage Pre-approval Application
router.post('/apply', async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      propertyPrice,
      downPayment,
      loanAmount,
      tenureYears,
      monthlyIncome,
      preferredBank = 'Any',
      estimatedInstallment,
      propertyId = null,
      userId = null
    } = req.body;

    if (!fullName || !phone || !propertyPrice || !monthlyIncome) {
      return res.status(400).json({ error: true, message: 'Full name, phone, property price, and monthly income are required' });
    }

    await pool.query(
      `INSERT INTO mortgage_inquiries (
        user_id, property_id, full_name, phone, email, property_price,
        down_payment, loan_amount, tenure_years, monthly_income,
        preferred_bank, estimated_installment, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      [
        userId, propertyId, fullName, phone, email || '', propertyPrice,
        downPayment || 0, loanAmount || propertyPrice * 0.8, tenureYears || 15,
        monthlyIncome, preferredBank, estimatedInstallment || 0
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Mortgage application submitted. A mortgage specialist will contact you within 24 hours.'
    });
  } catch (err) {
    console.error('Mortgage application error:', err);
    res.status(500).json({ error: true, message: 'Application submission failed: ' + err.message });
  }
});

export default router;
