import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kovetycgltpnqztxklig.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvdmV0eWNnbHRwbnF6dHhrbGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNDcyNzYsImV4cCI6MjA2ODkyMzI3Nn0.Aa0e7elDtFU9K3Hdu2rQ-PYUNv05ixjmLd4rOTbBZJM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Types
export type UserRole = 'patient' | 'doctor' | 'admin' 
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
export type ConsultationType = 'chat' | 'video' | 'visit'
export type MembershipType = 'free' | 'premium'

export interface Profile {
  id: string
  email: string
  full_name: string 
  phone?: string
  role: UserRole
  membership_type: MembershipType
  city?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Specialization {
  id: string
  name: string 
  description?: string
  icon?: string
  is_active: boolean
  created_at: string
}

export interface Doctor {
  id: string
  user_id: string 
  specialization_id: string
  license_number: string
  qualification: string
  experience_years: number
  consultation_fee: number
  hospital_name?: string
  bio?: string
  languages: string[]
  city: string
  is_verified: boolean
  is_online: boolean
  rating: number
  total_consultations: number
  profile_image?: string
  updated_at: string
  profile?: Profile
  specialization?: Specialization
}

export interface Appointment {
  id: string
  patient_id: string 
  doctor_id: string
  appointment_date: string
  appointment_time: string
  consultation_type: ConsultationType
  status: AppointmentStatus
  symptoms?: string
  patient_notes?: string
  notes?: string
  prescription?: string 
  meeting_link?: string
  created_at: string
  updated_at: string
  patient?: Profile
  doctor?: Doctor
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  data?: any
  is_read: boolean
  created_at: string
}

// Auth functions - Updated to work with Supabase Auth
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  
  // If signup successful, create user profile
  if (data.user && !error) {
    const { error: profileError } = await supabase
      .from('users')
      .insert([{
        id: data.user.id,
        email: data.user.email,
        full_name: userData.full_name,
        phone: userData.phone,
        role: userData.role || 'patient',
        is_verified: false,
        membership_type: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
    
    if (profileError) {
      console.error('Profile creation error:', profileError)
    }
  }
  
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return user
}

export const getCurrentProfile = async () => {
  const user = await getCurrentUser()
  if (!user) return { data: null, error: null }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { data, error }
}

// Doctor functions - Updated for new schema
export const getDoctors = async (filters: any = {}) => {
  let query = supabase
    .from('doctors')
    .select(`
      *,
      profile:profiles!doctors_user_id_fkey(*),
      specialization:specializations(*)
    `) 
    .eq('is_verified', true)
    .order('rating', { ascending: false })

  if (filters.specialization_id) {
    query = query.eq('specialization_id', filters.specialization_id)
  }

  if (filters.city) { 
    query = query.ilike('profile.city', `%${filters.city}%`)
  }

  const { data, error } = await query
  return { data, error }
}

export const getDoctorById = async (id: string) => {
  const { data, error } = await supabase
    .from('doctors')
    .select(` 
      *,
      profile:profiles!doctors_user_id_fkey(*),
      specialization:specializations(*)
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

export const createDoctor = async (doctorData: any) => { 
  const { data, error } = await supabase
    .from('doctors')
    .insert([doctorData])
    .select()
    .single()

  return { data, error }
}

export const updateDoctor = async (id: string, updates: any) => { 
  const { data, error } = await supabase
    .from('doctors')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

// Appointment functions - Updated for new schema
export const createAppointment = async (appointmentData: any) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointmentData])
    .select()
    .single()

  return { data, error }
}

export const getAppointments = async (userId: string, role: UserRole) => { 
  let query = supabase
    .from('appointments')
    .select(`
      *,
      patient:profiles!appointments_patient_id_fkey(*),
      doctor:doctors!appointments_doctor_id_fkey(*, profile:profiles!doctors_user_id_fkey(*), specialization:specializations(*))
    `)
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false })

  if (role === 'patient') {
    query = query.eq('patient_id', userId) 
  } else if (role === 'doctor') {
    // Get doctor ID first
    const { data: doctor } = await supabase
      .from('doctors')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (doctor) {
      query = query.eq('doctor_id', doctor.id)
    }
  }

  const { data, error } = await query
  return { data, error }
}

export const updateAppointmentStatus = async (id: string, status: AppointmentStatus, updates: any = {}) => { 
  const { data, error } = await supabase
    .from('appointments')
    .update({ status, ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

// Specialization functions - Mock data for now
export const getSpecializations = async () => {
  // Mock specializations data
  const mockSpecializations = [
    { id: '1', name: 'Cardiology', description: 'Heart and cardiovascular system', is_active: true },
    { id: '2', name: 'Dermatology', description: 'Skin, hair, and nails', is_active: true },
    { id: '3', name: 'Neurology', description: 'Brain and nervous system', is_active: true },
    { id: '4', name: 'Orthopedics', description: 'Bones, joints, and muscles', is_active: true },
    { id: '5', name: 'Pediatrics', description: 'Children\'s health', is_active: true },
    { id: '6', name: 'Psychiatry', description: 'Mental health', is_active: true },
    { id: '7', name: 'General Medicine', description: 'General healthcare', is_active: true },
    { id: '8', name: 'Gynecology', description: 'Women\'s health', is_active: true }
  ]
  
  return { data: mockSpecializations, error: null }
}

// Notification functions - Mock for now
export const getNotifications = async (userId: string) => {
  // Mock notifications
  return { data: [], error: null }
}

export const markNotificationAsRead = async (id: string) => {
  return { data: null, error: null }
}

// Admin functions - Updated for new schema
export const getAdminStats = async () => {
  const [
    totalUsers,
    totalDoctors,
    totalPatients,
    verifiedDoctors,
    totalAppointments,
    pendingAppointments,
    completedAppointments,
    premiumUsers
  ] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact' }),
    supabase.from('users').select('id', { count: 'exact' }).eq('role', 'doctor'),
    supabase.from('users').select('id', { count: 'exact' }).eq('role', 'patient'),
    supabase.from('doctors').select('id', { count: 'exact' }).eq('is_verified', true),
    supabase.from('appointments').select('id', { count: 'exact' }),
    supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'pending'),
    supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'completed'),
    supabase.from('users').select('id', { count: 'exact' }).eq('membership_type', 'premium')
  ])

  return {
    totalUsers: totalUsers.count || 0,
    totalDoctors: totalDoctors.count || 0,
    totalPatients: totalPatients.count || 0,
    verifiedDoctors: verifiedDoctors.count || 0,
    totalAppointments: totalAppointments.count || 0,
    pendingAppointments: pendingAppointments.count || 0,
    completedAppointments: completedAppointments.count || 0,
    premiumUsers: premiumUsers.count || 0
  }
}

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

export const getAllDoctors = async () => {
  const { data, error } = await supabase
    .from('doctors')
    .select(`
      *,
      profile:users!doctors_user_id_fkey(*)
    `)
    .order('created_at', { ascending: false })

  return { data, error }
}

export const verifyDoctor = async (id: string, isVerified: boolean) => {
  const { data, error } = await supabase
    .from('doctors')
    .update({ is_verified: isVerified, updated_at: new Date().toISOString() })
    .eq('id', id)

  return { data, error }
}

export const updateUserMembership = async (id: string, membershipType: MembershipType) => {
  const { data, error } = await supabase
    .from('users')
    .update({ membership_type: membershipType, updated_at: new Date().toISOString() })
    .eq('id', id)

  return { data, error }
}