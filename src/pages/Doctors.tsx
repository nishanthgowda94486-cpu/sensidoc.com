import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  MapPin, 
  Video, 
  MessageCircle,
  Phone,
  Calendar,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Bone,
  Baby
} from 'lucide-react'

// Mock doctors data
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    experience: 12,
    rating: 4.9,
    consultationFee: 75,
    isOnline: true,
    isVerified: true,
    image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300",
    location: "New York, NY",
    languages: ["English", "Spanish"],
    nextAvailable: "Today 2:00 PM",
    totalConsultations: 1250,
    bio: "Experienced cardiologist specializing in heart disease prevention and treatment."
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Dermatology",
    experience: 8,
    rating: 4.8,
    consultationFee: 60,
    isOnline: true,
    isVerified: true,
    image: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300",
    location: "Los Angeles, CA",
    languages: ["English", "Mandarin"],
    nextAvailable: "Today 3:30 PM",
    totalConsultations: 890,
    bio: "Board-certified dermatologist with expertise in skin cancer detection and cosmetic procedures."
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialization: "Pediatrics",
    experience: 15,
    rating: 4.9,
    consultationFee: 65,
    isOnline: false,
    isVerified: true,
    image: "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300",
    location: "Chicago, IL",
    languages: ["English", "Spanish"],
    nextAvailable: "Tomorrow 9:00 AM",
    totalConsultations: 2100,
    bio: "Pediatric specialist with focus on child development and preventive care."
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialization: "Neurology",
    experience: 20,
    rating: 4.7,
    consultationFee: 90,
    isOnline: true,
    isVerified: true,
    image: "https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=300",
    location: "Boston, MA",
    languages: ["English"],
    nextAvailable: "Today 4:00 PM",
    totalConsultations: 1680,
    bio: "Neurologist specializing in brain disorders, stroke prevention, and headache management."
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    specialization: "Ophthalmology",
    experience: 10,
    rating: 4.8,
    consultationFee: 70,
    isOnline: false,
    isVerified: true,
    image: "https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=300",
    location: "Miami, FL",
    languages: ["English", "Portuguese"],
    nextAvailable: "Tomorrow 11:00 AM",
    totalConsultations: 950,
    bio: "Eye specialist with expertise in vision correction and eye disease treatment."
  },
  {
    id: 6,
    name: "Dr. Robert Kim",
    specialization: "Orthopedics",
    experience: 14,
    rating: 4.6,
    consultationFee: 80,
    isOnline: true,
    isVerified: true,
    image: "https://images.pexels.com/photos/5327532/pexels-photo-5327532.jpeg?auto=compress&cs=tinysrgb&w=300",
    location: "Seattle, WA",
    languages: ["English", "Korean"],
    nextAvailable: "Today 5:30 PM",
    totalConsultations: 1340,
    bio: "Orthopedic surgeon specializing in joint replacement and sports medicine."
  }
]

const specializations = [
  { name: "All Specialties", icon: Stethoscope, count: 6 },
  { name: "Cardiology", icon: Heart, count: 1 },
  { name: "Dermatology", icon: Eye, count: 1 },
  { name: "Pediatrics", icon: Baby, count: 1 },
  { name: "Neurology", icon: Brain, count: 1 },
  { name: "Ophthalmology", icon: Eye, count: 1 },
  { name: "Orthopedics", icon: Bone, count: 1 }
]

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties')
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [filteredDoctors, setFilteredDoctors] = useState(mockDoctors)

  useEffect(() => {
    let filtered = mockDoctors

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by specialty
    if (selectedSpecialty !== 'All Specialties') {
      filtered = filtered.filter(doctor => doctor.specialization === selectedSpecialty)
    }

    // Filter by online status
    if (showOnlineOnly) {
      filtered = filtered.filter(doctor => doctor.isOnline)
    }

    setFilteredDoctors(filtered)
  }, [searchTerm, selectedSpecialty, showOnlineOnly])

  const handleBookConsultation = (doctorId: number, type: 'chat' | 'video' | 'call') => {
    // This would typically navigate to booking page or open booking modal
    console.log(`Booking ${type} consultation with doctor ${doctorId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Find & Consult Doctors</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Connect with verified doctors for instant consultations via chat, video, or phone
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search doctors, specialties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Online Only Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="online-only"
                    checked={showOnlineOnly}
                    onChange={(e) => setShowOnlineOnly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="online-only" className="text-sm font-medium">
                    Show online doctors only
                  </label>
                </div>

                {/* Specializations */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Specializations</label>
                  <div className="space-y-2">
                    {specializations.map((specialty) => (
                      <button
                        key={specialty.name}
                        onClick={() => setSelectedSpecialty(specialty.name)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                          selectedSpecialty === specialty.name
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          <specialty.icon className="h-4 w-4 mr-2" />
                          <span className="text-sm">{specialty.name}</span>
                        </div>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                          {specialty.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Doctors List */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Doctors ({filteredDoctors.length})
                </h2>
                <p className="text-gray-600">
                  {showOnlineOnly ? 'Online doctors ready for consultation' : 'All verified doctors'}
                </p>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="space-y-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Doctor Info */}
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="relative">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={doctor.image} alt={doctor.name} />
                            <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          {doctor.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                            {doctor.isVerified && (
                              <Badge variant="success" className="text-xs">Verified</Badge>
                            )}
                            {doctor.isOnline && (
                              <Badge className="text-xs bg-green-100 text-green-700">Online</Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                              <Stethoscope className="h-4 w-4 mr-2" />
                              <span>{doctor.specialization} • {doctor.experience} years exp.</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{doctor.location}</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                              <Star className="h-4 w-4 mr-2 text-yellow-500" />
                              <span>{doctor.rating} ({doctor.totalConsultations} consultations)</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>Next available: {doctor.nextAvailable}</span>
                            </div>
                          </div>

                          <p className="text-gray-600 mt-3 text-sm">{doctor.bio}</p>

                          <div className="flex flex-wrap gap-1 mt-3">
                            {doctor.languages.map((lang) => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Consultation Options */}
                      <div className="md:w-64 space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">${doctor.consultationFee}</div>
                          <div className="text-sm text-gray-600">per consultation</div>
                        </div>

                        <div className="space-y-2">
                          <Button
                            onClick={() => handleBookConsultation(doctor.id, 'chat')}
                            className="w-full"
                            variant="outline"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chat Now
                          </Button>

                          <Button
                            onClick={() => handleBookConsultation(doctor.id, 'video')}
                            className="w-full"
                            variant="outline"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Video Call
                          </Button>

                          <Button
                            onClick={() => handleBookConsultation(doctor.id, 'call')}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Book Consultation
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          className="w-full text-blue-600 hover:text-blue-700"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Later
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedSpecialty('All Specialties')
                    setShowOnlineOnly(false)
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doctors