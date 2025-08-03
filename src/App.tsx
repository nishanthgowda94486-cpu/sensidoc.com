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
            <Route path="/blog" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Blog - Coming Soon</h1></div>} />
            <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Contact - Coming Soon</h1></div>} />
            <Route path="/legal/*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Legal Pages - Coming Soon</h1></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App