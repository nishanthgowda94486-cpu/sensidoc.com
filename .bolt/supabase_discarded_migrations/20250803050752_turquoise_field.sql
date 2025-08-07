/*
  # Complete SensiDoc Healthcare Platform Schema

  1. New Tables
    - `profiles` - Extended user profiles
    - `appointments` - Doctor appointments with full details
    - `doctors` - Complete doctor profiles
    - `specializations` - Medical specializations
    - `notifications` - System notifications
    - `reviews` - Doctor reviews and ratings
    - `availability` - Doctor availability slots
    - `payments` - Payment tracking
    - `admin_logs` - Admin activity logs

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for all user roles
    - Secure admin access controls

  3. Functions
    - Auto-create profiles on user signup
    - Update doctor ratings automatically
    - Send notifications on appointment changes
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'rejected');
CREATE TYPE consultation_type AS ENUM ('chat', 'video', 'visit');
CREATE TYPE membership_type AS ENUM ('free', 'premium');
CREATE TYPE notification_type AS ENUM ('appointment', 'system', 'payment', 'review');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'patient',
  membership_type membership_type NOT NULL DEFAULT 'free',
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'India',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Specializations table
CREATE TABLE IF NOT EXISTS specializations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  specialization_id UUID REFERENCES specializations(id),
  license_number TEXT UNIQUE NOT NULL,
  qualification TEXT NOT NULL,
  experience_years INTEGER NOT NULL CHECK (experience_years >= 0),
  consultation_fee DECIMAL(10,2) DEFAULT 500.00,
  hospital_name TEXT,
  bio TEXT,
  languages TEXT[] DEFAULT ARRAY['English'],
  is_verified BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  total_consultations INTEGER DEFAULT 0,
  profile_image TEXT,
  certificates TEXT[],
  achievements TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability table
CREATE TABLE IF NOT EXISTS availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, day_of_week, start_time)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  consultation_type consultation_type NOT NULL,
  status appointment_status DEFAULT 'pending',
  symptoms TEXT,
  patient_notes TEXT,
  doctor_notes TEXT,
  prescription TEXT,
  diagnosis TEXT,
  follow_up_date DATE,
  consultation_fee DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending',
  meeting_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, appointment_date, appointment_time)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(appointment_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default specializations
INSERT INTO specializations (name, description, icon) VALUES
('General Medicine', 'Primary healthcare and general medical conditions', '🩺'),
('Cardiology', 'Heart and cardiovascular system disorders', '❤️'),
('Dermatology', 'Skin, hair, and nail conditions', '🧴'),
('Pediatrics', 'Medical care for infants, children, and adolescents', '👶'),
('Orthopedics', 'Musculoskeletal system disorders', '🦴'),
('Neurology', 'Nervous system disorders', '🧠'),
('Psychiatry', 'Mental health and behavioral disorders', '🧘'),
('Gynecology', 'Female reproductive health', '👩'),
('Ophthalmology', 'Eye and vision disorders', '👁️'),
('ENT', 'Ear, nose, and throat disorders', '👂'),
('Dentistry', 'Oral health and dental care', '🦷'),
('Radiology', 'Medical imaging and diagnostics', '📷')
ON CONFLICT (name) DO NOTHING;

-- Create default admin user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@sensidoc.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (id, email, full_name, role, is_verified, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@sensidoc.com',
  'System Administrator',
  'admin',
  TRUE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Doctors policies
CREATE POLICY "Anyone can view verified doctors" ON doctors FOR SELECT USING (is_verified = TRUE);
CREATE POLICY "Doctors can update own profile" ON doctors FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all doctors" ON doctors FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Appointments policies
CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (
  patient_id = auth.uid() OR 
  doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Patients can create appointments" ON appointments FOR INSERT WITH CHECK (
  patient_id = auth.uid() AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'patient')
);

CREATE POLICY "Doctors can update appointments" ON appointments FOR UPDATE USING (
  doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Patients can create reviews" ON reviews FOR INSERT WITH CHECK (
  patient_id = auth.uid() AND
  EXISTS (SELECT 1 FROM appointments WHERE id = appointment_id AND patient_id = auth.uid() AND status = 'completed')
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (TRUE);

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update doctor rating
CREATE OR REPLACE FUNCTION update_doctor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE doctors SET
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews
      WHERE doctor_id = NEW.doctor_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE doctor_id = NEW.doctor_id
    ),
    updated_at = NOW()
  WHERE id = NEW.doctor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for rating updates
DROP TRIGGER IF EXISTS on_review_created ON reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_doctor_rating();

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  user_id UUID,
  notification_type notification_type,
  title TEXT,
  message TEXT,
  data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (user_id, notification_type, title, message, data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle appointment status changes
CREATE OR REPLACE FUNCTION handle_appointment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify patient about status change
  IF NEW.status != OLD.status THEN
    PERFORM create_notification(
      NEW.patient_id,
      'appointment',
      'Appointment Status Updated',
      'Your appointment status has been changed to ' || NEW.status,
      jsonb_build_object('appointment_id', NEW.id, 'status', NEW.status)
    );
    
    -- Notify doctor about new appointments
    IF NEW.status = 'pending' AND OLD.status IS NULL THEN
      PERFORM create_notification(
        (SELECT user_id FROM doctors WHERE id = NEW.doctor_id),
        'appointment',
        'New Appointment Request',
        'You have a new appointment request',
        jsonb_build_object('appointment_id', NEW.id, 'patient_id', NEW.patient_id)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for appointment notifications
DROP TRIGGER IF EXISTS on_appointment_status_change ON appointments;
CREATE TRIGGER on_appointment_status_change
  AFTER INSERT OR UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION handle_appointment_status_change();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization_id);
CREATE INDEX IF NOT EXISTS idx_doctors_verified ON doctors(is_verified);
CREATE INDEX IF NOT EXISTS idx_doctors_online ON doctors(is_online);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_reviews_doctor ON reviews(doctor_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);