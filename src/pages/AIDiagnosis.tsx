import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Upload, 
  Camera, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Stethoscope,
  Heart,
  Activity,
  Thermometer
} from 'lucide-react'
import { createDiagnosis, getAIUsageCount } from '@/lib/supabase'

const AIDiagnosis = () => {
  const { profile } = useAuth()
  const [symptoms, setSymptoms] = useState('')
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [diagnosis, setDiagnosis] = useState<any>(null)
  const [usageCount, setUsageCount] = useState(0)

  React.useEffect(() => {
    if (profile) {
      loadUsageCount()
    }
  }, [profile])

  const loadUsageCount = async () => {
    if (!profile) return
    try {
      const count = await getAIUsageCount(profile.id, 'diagnosis')
      setUsageCount(count)
    } catch (error) {
      console.error('Error loading usage count:', error)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedImage(file)
    }
  }

  const handleAnalyze = async () => {
    if (!symptoms.trim() && !uploadedImage) {
      alert('Please enter symptoms or upload an image')
      return
    }

    if (!profile) {
      alert('Please login to use AI diagnosis')
      return
    }

    // Check usage limits for free users
    if (profile.membership_type === 'free' && usageCount >= 3) {
      alert('You have reached your free limit. Please upgrade to premium for unlimited access.')
      return
    }

    setIsAnalyzing(true)
    
    try {
      const imageUrl = uploadedImage ? URL.createObjectURL(uploadedImage) : undefined
      const { data, error } = await createDiagnosis(profile.id, symptoms, imageUrl)
      
      if (error) {
        throw error
      }

      setDiagnosis(data.aiResponse)
      setUsageCount(prev => prev + 1)
    } catch (error) {
      console.error('AI Diagnosis error:', error)
      alert('Failed to generate diagnosis. Please try again later.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleConsultDoctor = () => {
    window.location.href = '/doctors'
  }

  const commonSymptoms = [
    "Headache", "Fever", "Cough", "Sore throat", "Fatigue", 
    "Nausea", "Dizziness", "Chest pain", "Shortness of breath", "Back pain"
  ]

  const canUseAI = profile && (profile.membership_type === 'premium' || usageCount < 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Brain className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">AI Medical Diagnosis</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Get instant medical insights powered by advanced AI technology
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Usage Counter */}
        {profile && (
          <div className="mb-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {profile.membership_type === 'premium' 
                        ? 'Unlimited AI diagnoses (Premium)' 
                        : `Free searches used: ${usageCount}/3 this month`
                      }
                    </span>
                  </div>
                  {profile.membership_type === 'free' && usageCount >= 3 && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!profile && (
          <div className="mb-6">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">
                    Please <a href="/login" className="text-blue-600 hover:underline">login</a> to use AI diagnosis
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Describe Your Symptoms
                </CardTitle>
                <CardDescription>
                  Provide detailed information about what you're experiencing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe your symptoms in detail... (e.g., I have a headache that started this morning, along with a runny nose and slight fever)"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={6}
                  className="resize-none"
                />

                {/* Common Symptoms */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Common Symptoms (click to add)</label>
                  <div className="flex flex-wrap gap-2">
                    {commonSymptoms.map((symptom) => (
                      <Badge
                        key={symptom}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-100 hover:border-blue-300"
                        onClick={() => {
                          if (!symptoms.includes(symptom)) {
                            setSymptoms(prev => prev ? `${prev}, ${symptom}` : symptom)
                          }
                        }}
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Upload Medical Image (Optional)
                </CardTitle>
                <CardDescription>
                  Upload prescription, test results, or medical images for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>

                {uploadedImage && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {uploadedImage.name} uploaded successfully
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !canUseAI || !profile}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-5 w-5" />
                  Get AI Diagnosis
                </>
              )}
            </Button>

            {!canUseAI && profile && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    You've reached your free limit. Upgrade to continue using AI diagnosis.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {diagnosis ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Stethoscope className="h-5 w-5 mr-2" />
                      AI Diagnosis Results
                    </span>
                    <Badge 
                      variant={diagnosis.severity === 'Mild' ? 'success' : diagnosis.severity === 'Moderate' ? 'warning' : 'destructive'}
                    >
                      {diagnosis.severity}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Diagnosis */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {diagnosis.condition}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${diagnosis.confidence_level}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{diagnosis.confidence_level}%</span>
                    </div>
                    <p className="text-gray-700">{diagnosis.description}</p>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Related Symptoms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {diagnosis.symptoms?.map((symptom: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Recommendations:</h4>
                    <ul className="space-y-2">
                      {diagnosis.recommendations?.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Follow-up */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Follow-up Advice:</h4>
                        <p className="text-sm text-blue-800">{diagnosis.when_to_consult}</p>
                      </div>
                    </div>
                  </div>

                  {/* Consult Doctor CTA */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleConsultDoctor}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Consult with a Doctor
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      This AI diagnosis is for informational purposes only and should not replace professional medical advice.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready for AI Analysis
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Enter your symptoms or upload a medical image to get started with AI-powered diagnosis.
                  </p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-1 gap-4 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Brain className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">Advanced AI analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Thermometer className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">Instant results</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Camera className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-700">Image analysis support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Disclaimer */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Important Disclaimer</h4>
                    <p className="text-sm text-yellow-800">
                      This AI diagnosis tool is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
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

export default AIDiagnosis