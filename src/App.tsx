import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// Pages
import Home from '@/pages/Home'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import Doctors from '@/pages/Doctors'
import AIDiagnosis from '@/pages/AIDiagnosis'
import Drugs from '@/pages/Drugs'
import Blog from '@/pages/Blog'
import Contact from '@/pages/Contact'
import TermsOfService from '@/pages/legal/TermsOfService'
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import DoctorDashboard from '@/pages/doctor/DoctorDashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/ai-diagnosis" element={<AIDiagnosis />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/drugs" element={<Drugs />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal/terms" element={<TermsOfService />} />
            <Route path="/legal/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App