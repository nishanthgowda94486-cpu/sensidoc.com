import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Pill, 
  Search, 
  Upload, 
  AlertTriangle, 
  Info, 
  Clock, 
  Shield,
  Loader2,
  Camera,
  FileText,
  Activity
} from 'lucide-react'

const Drugs = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [drugInfo, setDrugInfo] = useState<any>(null)
  const [searchCount, setSearchCount] = useState(1)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedImage(file)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim() && !uploadedImage) {
      alert('Please enter a drug name or upload an image')
      return
    }

    setIsSearching(true)
    
    // Mock API call - replace with actual drug database API
    setTimeout(() => {
      setDrugInfo({
        name: searchTerm || "Ibuprofen",
        genericName: "Ibuprofen",
        brandNames: ["Advil", "Motrin", "Nurofen"],
        category: "NSAID (Non-Steroidal Anti-Inflammatory Drug)",
        strength: "200mg, 400mg, 600mg",
        form: "Tablet, Capsule, Liquid",
        uses: [
          "Pain relief",
          "Fever reduction",
          "Inflammation reduction",
          "Headache treatment",
          "Muscle pain relief"
        ],
        dosage: {
          adults: "200-400mg every 4-6 hours, maximum 1200mg per day",
          children: "5-10mg/kg every 6-8 hours"
        },
        sideEffects: {
          common: ["Stomach upset", "Nausea", "Dizziness", "Headache"],
          serious: ["Stomach bleeding", "Kidney problems", "Heart problems", "Allergic reactions"]
        },
        contraindications: [
          "Allergy to NSAIDs",
          "Active stomach ulcers",
          "Severe kidney disease",
          "Heart failure"
        ],
        interactions: [
          "Blood thinners (Warfarin)",
          "ACE inhibitors",
          "Lithium",
          "Methotrexate"
        ],
        warnings: [
          "Take with food to reduce stomach irritation",
          "Do not exceed recommended dose",
          "Consult doctor if symptoms persist",
          "Avoid alcohol while taking this medication"
        ],
        pregnancy: "Category C - Use only if benefits outweigh risks",
        storage: "Store at room temperature, away from moisture and heat"
      })
      setIsSearching(false)
      setSearchCount(prev => prev + 1)
    }, 2000)
  }

  const popularDrugs = [
    "Paracetamol", "Ibuprofen", "Aspirin", "Amoxicillin", 
    "Omeprazole", "Metformin", "Atorvastatin", "Lisinopril"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Pill className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Drug Information Center</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Search for comprehensive drug information, interactions, and safety data
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Usage Counter */}
        <div className="mb-6">
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">
                    Free searches used: {searchCount}/3 this month
                  </span>
                </div>
                {searchCount >= 3 && (
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Upgrade Plan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Search Drug Information
                </CardTitle>
                <CardDescription>
                  Enter drug name or upload prescription image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Enter drug name (e.g., Ibuprofen, Paracetamol)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                {/* Popular Drugs */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Popular Searches</label>
                  <div className="flex flex-wrap gap-2">
                    {popularDrugs.map((drug) => (
                      <Badge
                        key={drug}
                        variant="outline"
                        className="cursor-pointer hover:bg-orange-100 hover:border-orange-300"
                        onClick={() => setSearchTerm(drug)}
                      >
                        {drug}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-center text-gray-500">
                  <span className="text-sm">OR</span>
                </div>

                {/* Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="prescription-upload"
                  />
                  <label htmlFor="prescription-upload" className="cursor-pointer">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload prescription or drug image
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>

                {uploadedImage && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {uploadedImage.name} uploaded successfully
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSearch}
                  disabled={isSearching || searchCount > 3}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Search Drug Info
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {drugInfo ? (
              <div className="space-y-4">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Pill className="h-5 w-5 mr-2" />
                      {drugInfo.name}
                    </CardTitle>
                    <CardDescription>{drugInfo.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Generic Name:</span>
                        <p className="text-gray-600">{drugInfo.genericName}</p>
                      </div>
                      <div>
                        <span className="font-medium">Strength:</span>
                        <p className="text-gray-600">{drugInfo.strength}</p>
                      </div>
                      <div>
                        <span className="font-medium">Form:</span>
                        <p className="text-gray-600">{drugInfo.form}</p>
                      </div>
                      <div>
                        <span className="font-medium">Pregnancy:</span>
                        <p className="text-gray-600">{drugInfo.pregnancy}</p>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-sm">Brand Names:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {drugInfo.brandNames.map((brand: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {brand}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Uses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Info className="h-5 w-5 mr-2" />
                      Uses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {drugInfo.uses.map((use: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">{use}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Dosage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Clock className="h-5 w-5 mr-2" />
                      Dosage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="font-medium text-sm">Adults:</span>
                      <p className="text-sm text-gray-600">{drugInfo.dosage.adults}</p>
                    </div>
                    <div>
                      <span className="font-medium text-sm">Children:</span>
                      <p className="text-sm text-gray-600">{drugInfo.dosage.children}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Side Effects */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                      Side Effects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="font-medium text-sm">Common:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {drugInfo.sideEffects.common.map((effect: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs bg-yellow-50">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-sm">Serious:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {drugInfo.sideEffects.serious.map((effect: string, index: number) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Warnings */}
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg text-red-800">
                      <Shield className="h-5 w-5 mr-2" />
                      Important Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {drugInfo.warnings.map((warning: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-800">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Pill className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Search Drug Information
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Enter a drug name or upload a prescription image to get comprehensive drug information.
                  </p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-1 gap-4 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Info className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="text-sm text-gray-700">Comprehensive drug database</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="text-sm text-gray-700">Side effects & interactions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Camera className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">Prescription image analysis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Disclaimer */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Medical Disclaimer</h4>
                    <p className="text-sm text-yellow-800">
                      This information is for educational purposes only and should not replace professional medical advice. Always consult your healthcare provider before starting, stopping, or changing any medication.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Drugs