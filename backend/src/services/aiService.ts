import axios from 'axios';

interface DiagnosisResponse {
  condition: string;
  confidence_level: number;
  description: string;
  symptoms: string[];
  recommendations: string[];
  severity: string;
  when_to_consult: string;
}

interface DrugAnalysisResponse {
  drug_name: string;
  generic_name: string;
  uses: string[];
  dosage: string;
  side_effects: string[];
  warnings: string[];
  interactions: string[];
  contraindications: string[];
}

class AIService {
  private geminiApiKey: string;

  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY!;
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key is required');
    }
  }

  async getDiagnosis(symptoms: string, imageUrl?: string): Promise<DiagnosisResponse> {
    try {
      const prompt = `
        As a medical AI assistant, analyze the following symptoms and provide a preliminary diagnosis.
        
        Symptoms: ${symptoms}
        ${imageUrl ? `Image provided: ${imageUrl}` : ''}
        
        Please provide a response in the following JSON format:
        {
          "condition": "Most likely condition name",
          "confidence_level": 85,
          "description": "Detailed description of the condition",
          "symptoms": ["symptom1", "symptom2", "symptom3"],
          "recommendations": ["recommendation1", "recommendation2"],
          "severity": "mild/moderate/severe",
          "when_to_consult": "When to see a doctor"
        }
        
        Important: This is for informational purposes only and should not replace professional medical advice.
      `;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      
      // Try to parse JSON response, fallback to structured response
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        // Fallback response if JSON parsing fails
        return {
          condition: "General Health Concern",
          confidence_level: 70,
          description: aiResponse,
          symptoms: symptoms.split(',').map(s => s.trim()),
          recommendations: [
            "Monitor symptoms closely",
            "Stay hydrated and get adequate rest",
            "Consult a healthcare provider if symptoms persist"
          ],
          severity: "moderate",
          when_to_consult: "If symptoms worsen or persist for more than 48 hours"
        };
      }

      // This should not be reached, but TypeScript requires a return
      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('AI Diagnosis Error:', error);
      throw new Error('Failed to get AI diagnosis. Please try again later.');
    }
  }

  async analyzeDrug(drugName?: string, imageUrl?: string): Promise<DrugAnalysisResponse> {
    try {
      let prompt = '';
      
      if (drugName) {
        prompt = `
          Provide detailed information about the medication: ${drugName}
          
          Please provide a response in the following JSON format:
          {
            "drug_name": "Brand name",
            "generic_name": "Generic name",
            "uses": ["use1", "use2", "use3"],
            "dosage": "Typical dosage information",
            "side_effects": ["side_effect1", "side_effect2"],
            "warnings": ["warning1", "warning2"],
            "interactions": ["interaction1", "interaction2"],
            "contraindications": ["contraindication1", "contraindication2"]
          }
        `;
      } else if (imageUrl) {
        prompt = `
          Analyze the medication in this image: ${imageUrl}
          
          Identify the medication and provide detailed information in the following JSON format:
          {
            "drug_name": "Identified brand name",
            "generic_name": "Generic name",
            "uses": ["use1", "use2", "use3"],
            "dosage": "Typical dosage information",
            "side_effects": ["side_effect1", "side_effect2"],
            "warnings": ["warning1", "warning2"],
            "interactions": ["interaction1", "interaction2"],
            "contraindications": ["contraindication1", "contraindication2"]
          }
          
          If you cannot clearly identify the medication, please indicate so in the response.
        `;
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      
      // Try to parse JSON response
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        // Fallback response
        return {
          drug_name: drugName || "Unknown Medication",
          generic_name: "Not identified",
          uses: ["Information not available"],
          dosage: "Consult healthcare provider",
          side_effects: ["Consult healthcare provider for side effects"],
          warnings: ["Always consult healthcare provider before taking any medication"],
          interactions: ["Check with pharmacist for drug interactions"],
          contraindications: ["Consult healthcare provider"]
        };
      }

      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('Drug Analysis Error:', error);
      throw new Error('Failed to analyze drug. Please try again later.');
    }
  }
}

export default new AIService();