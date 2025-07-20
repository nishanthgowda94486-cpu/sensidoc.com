import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Only create client if we have valid environment variables
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

export type UserRole = 'patient' | 'doctor' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  full_name: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Doctor {
  id: string
  user_id: string
  specialization: string
  experience_years: number
  qualification: string
  license_number: string
  consultation_fee: number
  is_verified: boolean
  is_online: boolean
  city: string
  hospital_name?: string
  bio?: string
  rating: number
  total_consultations: number
  created_at: string
  updated_at: string
  user?: User
}

export interface Booking {
  id: string
  patient_id: string
  doctor_id: string
  appointment_date: string
  appointment_time: string
  consultation_type: 'chat' | 'video' | 'visit'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  symptoms?: string
  notes?: string
  created_at: string
  updated_at: string
  patient?: User
  doctor?: Doctor
}

export interface HealthRecord {
  id: string
  patient_id: string
  doctor_id?: string
  title: string
  description: string
  diagnosis?: string
  prescription?: string
  test_results?: string
  attachments?: string[]
  created_at: string
  updated_at: string
  patient?: User
  doctor?: Doctor
}