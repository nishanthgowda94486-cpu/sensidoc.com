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
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
                        <p className="text-gray-600">Welcome to your dashboard!</p>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Placeholder routes for other pages */}
              <Route path="/ai-diagnosis" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">AI Diagnosis - Coming Soon</h1></div>} />
              <Route path="/doctors" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Find Doctors - Coming Soon</h1></div>} />
              <Route path="/drugs" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Drug Information - Coming Soon</h1></div>} />
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

export default App