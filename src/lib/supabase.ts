import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

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
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Doctor {
  id: string
  user_id: string
  specialization: string
  license_number: string
  qualification: string
  experience_years: number
  consultation_fee: number
  hospital_name?: string
  bio?: string
  city: string
  is_verified: boolean
  is_online: boolean
  rating: number
  total_consultations: number
  profile_image?: string
  created_at: string
  updated_at: string
  profile?: Profile
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
  notes?: string
  prescription?: string
  created_at: string
  updated_at: string
  patient?: Profile
  doctor?: Doctor
}

// Auth functions
export const signUp = async (email: string, password: string, userData: any) => {
  try {
    const userId = crypto.randomUUID()
    
    const { error } = await supabase
      .from('users')
      .insert([{
        id: userId,
        email,
        password_hash: password,
        full_name: userData.full_name,
        phone: userData.phone,
        role: userData.role || 'patient',
        is_verified: userData.role === 'admin',
        membership_type: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
    
    if (error) {
      return { data: null, error }
    }

    // If doctor, create doctor profile
    if (userData.role === 'doctor') {
      const { error: doctorError } = await supabase
        .from('doctors')
        .insert([{
          id: crypto.randomUUID(),
          user_id: userId,
          specialization: userData.specialization || 'General Medicine',
          experience_years: parseInt(userData.experienceYears) || 1,
          qualification: userData.qualification || 'MBBS',
          license_number: userData.licenseNumber || `LIC${Date.now()}`,
          consultation_fee: 500,
          city: userData.city || 'Mumbai',
          hospital_name: userData.hospitalName,
          bio: userData.bio,
          is_verified: false,
          is_online: false,
          rating: 0,
          total_consultations: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
      
      if (doctorError) {
        console.error('Doctor profile creation error:', doctorError)
      }
    }
    
    return { data: { user: { id: userId, email } }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password)
      .single()
    
    if (error || !user) {
      return { data: null, error: { message: 'Invalid email or password' } }
    }

    // Store user in localStorage for session management
    localStorage.setItem('currentUser', JSON.stringify(user))
    
    return { data: { user }, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const signOut = async () => {
  localStorage.removeItem('currentUser')
  return { error: null }
}

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('currentUser')
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

// Doctor functions
export const getDoctors = async (filters: any = {}) => {
  let query = supabase
    .from('doctors')
    .select(`
      *,
      profile:users!doctors_user_id_fkey(*)
    `)
    .eq('is_verified', true)
    .order('rating', { ascending: false })

  if (filters.specialization) {
    query = query.eq('specialization', filters.specialization)
  }

  if (filters.city) {
    query = query.ilike('city', `%${filters.city}%`)
  }

  if (filters.is_online !== undefined) {
    query = query.eq('is_online', filters.is_online)
  }

  const { data, error } = await query
  return { data, error }
}

export const getDoctorById = async (id: string) => {
  const { data, error } = await supabase
    .from('doctors')
    .select(`
      *,
      profile:users!doctors_user_id_fkey(*)
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
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

// Appointment functions
export const createAppointment = async (appointmentData: any) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      ...appointmentData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single()

  return { data, error }
}

export const getAppointments = async (userId: string, role: UserRole) => {
  let query = supabase
    .from('appointments')
    .select(`
      *,
      patient:users!appointments_patient_id_fkey(*),
      doctor:doctors!appointments_doctor_id_fkey(*, profile:users!doctors_user_id_fkey(*))
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

// Specialization functions
export const getSpecializations = async () => {
  const { data: doctors, error } = await supabase
    .from('doctors')
    .select('specialization')
    .eq('is_verified', true)

  if (error) return { data: [], error }

  // Get unique specializations with counts
  const specializationCounts = doctors?.reduce((acc: any, doctor) => {
    const spec = doctor.specialization
    acc[spec] = (acc[spec] || 0) + 1
    return acc
  }, {})

  const specializations = Object.entries(specializationCounts || {})
    .map(([name, count], index) => ({ 
      id: (index + 1).toString(), 
      name, 
      count,
      description: `${name} specialists`,
      is_active: true 
    }))
    .sort((a, b) => (b.count as number) - (a.count as number))

  return { data: specializations, error: null }
}

// Admin functions
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

// AI Services
export const createDiagnosis = async (patientId: string, inputText: string, inputImage?: string) => {
  const diagnosisId = crypto.randomUUID()
  
  // Mock AI response - replace with actual AI service
  const aiResponse = {
    condition: "Upper Respiratory Infection",
    confidence_level: 85,
    description: "Based on the symptoms provided, you may have an upper respiratory infection.",
    symptoms: ["Runny nose", "Sore throat", "Cough"],
    recommendations: ["Get plenty of rest", "Stay hydrated", "Use a humidifier"],
    severity: "Mild",
    when_to_consult: "If symptoms worsen or persist for more than 10 days"
  }

  const { data, error } = await supabase
    .from('diagnosis')
    .insert([{
      id: diagnosisId,
      patient_id: patientId,
      input_text: inputText,
      input_image: inputImage,
      ai_response: JSON.stringify(aiResponse),
      condition: aiResponse.condition,
      confidence_level: aiResponse.confidence_level,
      recommendations: aiResponse.recommendations,
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  return { data: { ...data, aiResponse }, error }
}

export const createDrugAnalysis = async (userId: string, drugName?: string, drugImage?: string) => {
  const analysisId = crypto.randomUUID()
  
  // Mock AI response - replace with actual AI service
  const aiResponse = {
    drug_name: drugName || "Paracetamol",
    generic_name: "Acetaminophen",
    uses: ["Pain relief", "Fever reduction"],
    dosage: "500mg every 6 hours",
    side_effects: ["Nausea", "Liver damage with overdose"],
    warnings: ["Do not exceed 4g per day", "Avoid alcohol"],
    interactions: ["Warfarin", "Alcohol"],
    contraindications: ["Liver disease", "Alcohol dependency"]
  }

  const { data, error } = await supabase
    .from('drug_analysis')
    .insert([{
      id: analysisId,
      user_id: userId,
      drug_name: drugName || aiResponse.drug_name,
      drug_image: drugImage,
      analysis_result: JSON.stringify(aiResponse),
      uses: aiResponse.uses,
      side_effects: aiResponse.side_effects,
      dosage: aiResponse.dosage,
      warnings: aiResponse.warnings,
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  return { data: { ...data, aiResponse }, error }
}

// Get user's AI usage count for the current month
export const getAIUsageCount = async (userId: string, type: 'diagnosis' | 'drug_analysis') => {
  const currentMonth = new Date().toISOString().slice(0, 7)
  
  const table = type === 'diagnosis' ? 'diagnosis' : 'drug_analysis'
  const userIdField = type === 'diagnosis' ? 'patient_id' : 'user_id'
  
  const { count } = await supabase
    .from(table)
    .select('id', { count: 'exact' })
    .eq(userIdField, userId)
    .gte('created_at', `${currentMonth}-01`)
    .lt('created_at', `${currentMonth}-32`)

  return count || 0
}