# SensiDoc - Healthcare Platform

A comprehensive healthcare platform built with React, TypeScript, and Supabase that provides AI-powered medical diagnosis, doctor consultations, and health record management.

## 🚀 Features

### Core Features
- **AI Diagnosis**: Get instant medical diagnosis using advanced AI technology
- **Doctor Consultations**: Chat, video call, or visit doctors in person
- **Drug Information**: Search for drug details, interactions, and side effects
- **Health Records**: Secure storage and management of medical records
- **Membership Plans**: Premium features and unlimited access

### User Roles
- **Patients**: Access all healthcare services, manage health records
- **Doctors**: Provide consultations, manage patient records, set availability
- **Admin**: Manage users, doctors, content, and platform analytics

### UI/UX Features
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Modern Components**: Built with shadcn/ui and Tailwind CSS
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Optimized loading and smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Lucide React** for icons
- **React Router** for navigation
- **React Hook Form** for form handling

### Backend & Database
- **Supabase** for authentication and database
- **PostgreSQL** database with Row Level Security
- **Real-time subscriptions** for live updates

### AI & APIs
- **OpenAI GPT** for text-based diagnosis
- **Google Gemini** for image analysis
- **Custom API endpoints** for healthcare services

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sensidoc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials and API keys.

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (see Database Setup section)
   - Configure authentication settings

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

### Required Tables

Create these tables in your Supabase database:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('patient', 'doctor', 'admin')) NOT NULL DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors table
CREATE TABLE doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  specialization TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  qualification TEXT NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  consultation_fee DECIMAL(10,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  city TEXT NOT NULL,
  hospital_name TEXT,
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_consultations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  consultation_type TEXT CHECK (consultation_type IN ('chat', 'video', 'visit')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  symptoms TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health Records table
CREATE TABLE health_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  diagnosis TEXT,
  prescription TEXT,
  test_results TEXT,
  attachments TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Doctors policies
CREATE POLICY "Anyone can read verified doctors" ON doctors FOR SELECT USING (is_verified = true);
CREATE POLICY "Doctors can update own profile" ON doctors FOR UPDATE USING (user_id = auth.uid());

-- Bookings policies
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT USING (
  patient_id = auth.uid() OR 
  doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
);

-- Health records policies
CREATE POLICY "Patients can read own records" ON health_records FOR SELECT USING (patient_id = auth.uid());
CREATE POLICY "Doctors can read patient records" ON health_records FOR SELECT USING (
  doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid())
);
```

## 🔧 Configuration

### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Configure authentication providers if needed
4. Set up the database schema using the SQL above

### Environment Variables
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=your-backend-api-url
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render/Railway)
1. Deploy your backend API to Render or Railway
2. Set environment variables for API keys
3. Update VITE_API_URL to point to your deployed backend

## 📱 Features Overview

### Home Page
- Hero section with call-to-action
- Rotating ad banners
- How to get started guide
- Services overview
- Why choose us section
- Partner logos
- FAQ section

### Authentication
- Role-based signup (Patient/Doctor)
- Secure login with JWT
- Password reset functionality
- Admin login portal

### AI Diagnosis
- Text-based symptom analysis
- Image upload for prescription analysis
- Usage limits for free users
- Upgrade prompts for premium features

### Doctor Consultations
- Browse available doctors
- Filter by specialization and location
- Book appointments
- Chat, video, or in-person consultations

### Health Records
- Secure document storage
- Prescription management
- Test results tracking
- Doctor notes and diagnoses

### Admin Dashboard
- User management
- Doctor verification
- Platform analytics
- Content management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@sensidoc.com or join our Discord community.

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Video calling integration
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced AI features
- [ ] Telemedicine compliance
- [ ] Insurance integration
- [ ] Pharmacy partnerships

---

Built with ❤️ by the SensiDoc team