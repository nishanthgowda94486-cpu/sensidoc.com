import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthProvider from '@/components/AuthProvider'
import ProtectedRoute from '@/components/ProtectedRoute'
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
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Doctor Routes */}
              <Route 
                path="/doctor/dashboard" 
                element={
                  <ProtectedRoute requiredRole="doctor">
                    <DoctorDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Placeholder routes for other pages */}
              <Route path="/ai-diagnosis" element={<AIDiagnosis />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/drugs" element={<Drugs />} />
              <Route path="/blog" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Blog - Coming Soon</h1></div>} />
              <Route path="/contact" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Contact - Coming Soon</h1></div>} />
              <Route path="/legal/*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Legal Pages - Coming Soon</h1></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

// Dashboard Router Component
function DashboardRouter() {
  const { profile } = useAuth()
  
  if (!profile) {
    return <Navigate to="/login" replace />
  }
  
  switch (profile.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />
    case 'doctor':
      return <Navigate to="/doctor/dashboard" replace />
    case 'patient':
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Patient Dashboard</h1>
            <p className="text-gray-600">Welcome to your dashboard!</p>
          </div>
        </div>
      )
  }
}

export default App