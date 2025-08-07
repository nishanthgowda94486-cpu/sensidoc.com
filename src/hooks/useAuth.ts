import { useState, useEffect, createContext, useContext } from 'react'
import { supabase, type Profile, type UserRole, signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut, getCurrentUser } from '@/lib/supabase'

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
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabaseSignIn(email, password)
      
      if (error) {
        return { error }
      }

      if (data?.user) {
        setUser(data.user)
        setProfile(data.user)
      }
      
      return { error: null }
    } catch (error) {
      return { error: { message: 'Login failed' } }
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabaseSignUp(email, password, userData)
      
      if (error) {
        return { error }
      }
      
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    await supabaseSignOut()
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