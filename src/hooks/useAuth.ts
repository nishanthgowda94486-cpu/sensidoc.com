import { useState, useEffect, createContext, useContext } from 'react'
import { supabase, type Profile, type UserRole, getCurrentProfile, getCurrentUser } from '@/lib/supabase'

interface AuthContextType {
  user: any | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useAuthProvider() {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setProfile(currentUser)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single()
      
      if (error || !user) {
        return { error: { message: 'Invalid email or password' } }
      }

      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user))
      setUser(user)
      setProfile(user)
      
      return { error: null }
    } catch (error) {
      return { error: { message: 'Login failed' } }
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
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
        return { error }
      }

      // If doctor, create doctor profile
      if (userData.role === 'doctor') {
        await supabase
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
      }
      
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    localStorage.removeItem('currentUser')
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') }

    const { error } = await supabase 
      .from('users')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (!error) {
      const updatedUser = { ...user, ...data }
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setProfile(updatedUser)
    }

    return { error }
  }

  return {
    user, 
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
}

export { AuthContext }