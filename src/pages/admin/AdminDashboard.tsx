import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Stethoscope, 
  Calendar, 
  TrendingUp,
  Shield,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  Activity,
  DollarSign,
  FileText,
  Bell
} from 'lucide-react'
import { 
  getAdminStats, 
  getAllUsers, 
  getAllDoctors, 
  verifyDoctor, 
  updateUserMembership,
  getSpecializations,
  createDoctor,
  signUp,
  getAppointments
} from '@/lib/supabase'

const AdminDashboard = () => {
  const { profile, loading } = useAuth()
  const [stats, setStats] = useState<any>({})
  const [users, setUsers] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [specializations, setSpecializations] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDoctor, setShowAddDoctor] = useState(false)

  // Add Doctor Form State
  const [doctorForm, setDoctorForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    specialization_id: '',
    license_number: '',
    qualification: '',
    experience_years: '',
    consultation_fee: '',
    hospital_name: '',
    bio: '',
    city: ''
  })

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadData()
    }
  }, [profile])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [statsData, usersData, doctorsData, specializationsData] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getAllDoctors(),
        getSpecializations()
      ])

      setStats(statsData)
      setUsers(usersData.data || [])
      setDoctors(doctorsData.data || [])
      setSpecializations(specializationsData.data || [])

      // Load appointments for admin view
      const appointmentsData = await getAppointments('', 'admin')
      setAppointments(appointmentsData.data || [])
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyDoctor = async (doctorId: string, isVerified: boolean) => {
    try {
      await verifyDoctor(doctorId, isVerified)
      loadData() // Refresh data
    } catch (error) {
      console.error('Error verifying doctor:', error)
    }
  }

  const handleUpdateMembership = async (userId: string, membershipType: 'free' | 'premium') => {
    try {
      await updateUserMembership(userId, membershipType)
      loadData() // Refresh data
    } catch (error) {
      console.error('Error updating membership:', error)
    }
  }

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Create user account
      const { data: authData, error: authError } = await signUp(
        doctorForm.email,
        doctorForm.password,
        {
          full_name: doctorForm.full_name,
          phone: doctorForm.phone,
          role: 'doctor',
          city: doctorForm.city
        }
      )

      if (authError) throw authError

      // Create doctor profile
      if (authData.user) {
        await createDoctor({
          user_id: authData.user.id,
          specialization_id: doctorForm.specialization_id,
          license_number: doctorForm.license_number,
          qualification: doctorForm.qualification,
          experience_years: parseInt(doctorForm.experience_years),
          consultation_fee: parseFloat(doctorForm.consultation_fee),
          hospital_name: doctorForm.hospital_name,
          bio: doctorForm.bio,
          is_verified: true // Auto-verify admin-added doctors
        })
      }

      setShowAddDoctor(false)
      setDoctorForm({
        email: '',
        password: '',
        full_name: '',
        phone: '',
        specialization_id: '',
        license_number: '',
        qualification: '',
        experience_years: '',
        consultation_fee: '',
        hospital_name: '',
        bio: '',
        city: ''
      })
      loadData()
    } catch (error) {
      console.error('Error adding doctor:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredDoctors = doctors.filter(doctor =>
    doctor.profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.profile?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your healthcare platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowAddDoctor(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Doctor
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Users</p>
                      <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-12 w-12 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Active Doctors</p>
                      <p className="text-3xl font-bold">{stats.verifiedDoctors}</p>
                    </div>
                    <Stethoscope className="h-12 w-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Total Appointments</p>
                      <p className="text-3xl font-bold">{stats.totalAppointments}</p>
                    </div>
                    <Calendar className="h-12 w-12 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Premium Users</p>
                      <p className="text-3xl font-bold">{stats.premiumUsers}</p>
                    </div>
                    <Award className="h-12 w-12 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <UserCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900">Pending Verifications</h3>
                  <p className="text-2xl font-bold text-blue-600">{doctors.filter(d => !d.is_verified).length}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900">Pending Appointments</h3>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingAppointments}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900">Completed Today</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {appointments.filter(a => 
                      a.status === 'completed' && 
                      new Date(a.appointment_date).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900">Growth Rate</h3>
                  <p className="text-2xl font-bold text-purple-600">+12%</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">User Management</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'doctor' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.membership_type}
                              onChange={(e) => handleUpdateMembership(user.id, e.target.value as 'free' | 'premium')}
                              className="text-sm border rounded px-2 py-1"
                            >
                              <option value="free">Free</option>
                              <option value="premium">Premium</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.is_verified ? 'success' : 'warning'}>
                              {user.is_verified ? 'Verified' : 'Unverified'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Doctor Management</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button onClick={() => setShowAddDoctor(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Doctor
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={doctor.profile_image} />
                          <AvatarFallback>{doctor.profile?.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{doctor.profile?.full_name}</h3>
                          <p className="text-sm text-gray-500">{doctor.specialization?.name}</p>
                        </div>
                      </div>
                      <Badge variant={doctor.is_verified ? 'success' : 'warning'}>
                        {doctor.is_verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{doctor.qualification}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Activity className="h-4 w-4 mr-2" />
                        <span>{doctor.experience_years} years experience</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>₹{doctor.consultation_fee} consultation</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Star className="h-4 w-4 mr-2" />
                        <span>{doctor.rating}/5 ({doctor.total_reviews} reviews)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={doctor.is_verified ? "destructive" : "default"}
                          onClick={() => handleVerifyDoctor(doctor.id, !doctor.is_verified)}
                        >
                          {doctor.is_verified ? (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Unverify
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Appointment Management</h2>
              <div className="flex items-center space-x-4">
                <Badge variant="outline">{appointments.length} Total</Badge>
                <Badge variant="warning">{appointments.filter(a => a.status === 'pending').length} Pending</Badge>
                <Badge variant="success">{appointments.filter(a => a.status === 'completed').length} Completed</Badge>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.slice(0, 10).map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{appointment.patient?.full_name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{appointment.patient?.full_name}</div>
                                <div className="text-sm text-gray-500">{appointment.patient?.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{appointment.doctor?.profile?.full_name}</div>
                            <div className="text-sm text-gray-500">{appointment.doctor?.specialization?.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(appointment.appointment_date).toLocaleDateString()}</div>
                            <div className="text-sm text-gray-500">{appointment.appointment_time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline">{appointment.consultation_type}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant={
                                appointment.status === 'completed' ? 'success' :
                                appointment.status === 'confirmed' ? 'default' :
                                appointment.status === 'pending' ? 'warning' :
                                'destructive'
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{appointment.consultation_fee || appointment.doctor?.consultation_fee}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold">Platform Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    User Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">+{stats.totalUsers}</div>
                  <p className="text-sm text-gray-500">Total registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{stats.totalAppointments}</div>
                  <p className="text-sm text-gray-500">Total appointments booked</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">₹{(stats.completedAppointments * 500).toLocaleString()}</div>
                  <p className="text-sm text-gray-500">Estimated revenue</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add New Doctor</h2>
              <Button variant="ghost" onClick={() => setShowAddDoctor(false)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={doctorForm.full_name}
                    onChange={(e) => setDoctorForm({...doctorForm, full_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={doctorForm.password}
                    onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={doctorForm.phone}
                    onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="specialization_id">Specialization</Label>
                  <select
                    id="specialization_id"
                    value={doctorForm.specialization_id}
                    onChange={(e) => setDoctorForm({...doctorForm, specialization_id: e.target.value})}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map((spec) => (
                      <option key={spec.id} value={spec.id}>{spec.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="license_number">License Number</Label>
                  <Input
                    id="license_number"
                    value={doctorForm.license_number}
                    onChange={(e) => setDoctorForm({...doctorForm, license_number: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={doctorForm.qualification}
                    onChange={(e) => setDoctorForm({...doctorForm, qualification: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="experience_years">Experience (Years)</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={doctorForm.experience_years}
                    onChange={(e) => setDoctorForm({...doctorForm, experience_years: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="consultation_fee">Consultation Fee (₹)</Label>
                  <Input
                    id="consultation_fee"
                    type="number"
                    value={doctorForm.consultation_fee}
                    onChange={(e) => setDoctorForm({...doctorForm, consultation_fee: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={doctorForm.city}
                    onChange={(e) => setDoctorForm({...doctorForm, city: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="hospital_name">Hospital/Clinic</Label>
                  <Input
                    id="hospital_name"
                    value={doctorForm.hospital_name}
                    onChange={(e) => setDoctorForm({...doctorForm, hospital_name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={doctorForm.bio}
                  onChange={(e) => setDoctorForm({...doctorForm, bio: e.target.value})}
                  className="w-full border rounded-md px-3 py-2 h-24"
                  placeholder="Brief description about the doctor..."
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setShowAddDoctor(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Doctor</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard