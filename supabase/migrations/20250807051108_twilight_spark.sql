/*
  # Create Sample Data for SensiDoc

  1. Sample Users
    - Admin user for testing admin dashboard
    - Doctor users for testing doctor dashboard  
    - Patient users for testing patient dashboard

  2. Sample Doctors
    - Doctor profiles with different specializations
    - Verified and unverified doctors

  3. Sample Appointments
    - Various appointment statuses and types
    - Different dates and times

  4. Security
    - All tables already have RLS enabled
    - Sample data follows existing schema
*/

-- Insert sample admin user
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_verified, membership_type, created_at, updated_at)
VALUES 
  ('admin-001', 'admin@sensidoc.com', 'admin123', 'Admin User', '+1234567890', 'admin', true, 'premium', now(), now())
ON CONFLICT (email) DO NOTHING;

-- Insert sample doctors
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_verified, membership_type, created_at, updated_at)
VALUES 
  ('doctor-001', 'dr.smith@sensidoc.com', 'doctor123', 'Dr. John Smith', '+1234567891', 'doctor', true, 'free', now(), now()),
  ('doctor-002', 'dr.johnson@sensidoc.com', 'doctor123', 'Dr. Sarah Johnson', '+1234567892', 'doctor', true, 'free', now(), now()),
  ('doctor-003', 'dr.williams@sensidoc.com', 'doctor123', 'Dr. Michael Williams', '+1234567893', 'doctor', false, 'free', now(), now())
ON CONFLICT (email) DO NOTHING;

-- Insert sample patients
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_verified, membership_type, created_at, updated_at)
VALUES 
  ('patient-001', 'patient@sensidoc.com', 'patient123', 'John Doe', '+1234567894', 'patient', true, 'free', now(), now()),
  ('patient-002', 'jane@sensidoc.com', 'patient123', 'Jane Smith', '+1234567895', 'patient', true, 'premium', now(), now())
ON CONFLICT (email) DO NOTHING;

-- Insert doctor profiles
INSERT INTO doctors (id, user_id, specialization, experience_years, qualification, license_number, consultation_fee, is_verified, is_online, city, hospital_name, bio, rating, total_consultations, is_video_available, created_at, updated_at)
VALUES 
  ('doc-profile-001', 'doctor-001', 'Cardiology', 10, 'MBBS, MD Cardiology', 'LIC001', 800, true, true, 'Mumbai', 'Apollo Hospital', 'Experienced cardiologist with 10+ years of practice', 4.8, 150, true, now(), now()),
  ('doc-profile-002', 'doctor-002', 'Dermatology', 8, 'MBBS, MD Dermatology', 'LIC002', 600, true, false, 'Delhi', 'Max Hospital', 'Specialist in skin disorders and cosmetic treatments', 4.6, 120, true, now(), now()),
  ('doc-profile-003', 'doctor-003', 'General Medicine', 5, 'MBBS', 'LIC003', 400, false, false, 'Bangalore', 'Fortis Hospital', 'General practitioner with focus on preventive care', 0, 0, true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample appointments
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, appointment_time, consultation_type, status, symptoms, notes, prescription, created_at, updated_at)
VALUES 
  ('appt-001', 'patient-001', 'doc-profile-001', '2024-01-25', '10:00', 'video', 'pending', 'Chest pain and shortness of breath', null, null, now(), now()),
  ('appt-002', 'patient-001', 'doc-profile-002', '2024-01-20', '14:30', 'chat', 'completed', 'Skin rash on arms', 'Patient has allergic dermatitis', 'Apply topical cream twice daily', now(), now()),
  ('appt-003', 'patient-002', 'doc-profile-001', '2024-01-22', '11:00', 'visit', 'confirmed', 'Regular checkup', null, null, now(), now()),
  ('appt-004', 'patient-002', 'doc-profile-002', '2024-01-18', '16:00', 'video', 'completed', 'Acne treatment consultation', 'Prescribed acne medication', 'Use benzoyl peroxide gel', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample diagnosis records
INSERT INTO diagnosis (id, patient_id, input_text, ai_response, condition, confidence_level, recommendations, created_at)
VALUES 
  ('diag-001', 'patient-001', 'I have headache and fever since yesterday', '{"condition": "Viral Fever", "confidence": 85}', 'Viral Fever', 85, ARRAY['Rest and hydration', 'Take paracetamol for fever', 'Consult doctor if symptoms persist'], now()),
  ('diag-002', 'patient-002', 'Stomach pain after eating spicy food', '{"condition": "Gastritis", "confidence": 78}', 'Gastritis', 78, ARRAY['Avoid spicy foods', 'Take antacids', 'Eat smaller meals'], now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample drug analysis records
INSERT INTO drug_analysis (id, user_id, drug_name, analysis_result, uses, side_effects, dosage, warnings, created_at)
VALUES 
  ('drug-001', 'patient-001', 'Paracetamol', '{"drug_name": "Paracetamol", "uses": ["Pain relief", "Fever reduction"]}', ARRAY['Pain relief', 'Fever reduction'], ARRAY['Nausea', 'Liver damage with overdose'], '500mg every 6 hours', ARRAY['Do not exceed 4g per day', 'Avoid alcohol'], now()),
  ('drug-002', 'patient-002', 'Ibuprofen', '{"drug_name": "Ibuprofen", "uses": ["Anti-inflammatory", "Pain relief"]}', ARRAY['Anti-inflammatory', 'Pain relief'], ARRAY['Stomach upset', 'Dizziness'], '400mg every 8 hours', ARRAY['Take with food', 'Avoid if allergic to NSAIDs'], now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blogs (id, title, content, excerpt, author_id, category, tags, featured_image, is_published, created_at, updated_at)
VALUES 
  ('blog-001', 'Understanding Heart Health', 'Heart health is crucial for overall wellbeing...', 'Learn about maintaining a healthy heart with proper diet and exercise', 'admin-001', 'Cardiology', ARRAY['heart', 'health', 'prevention'], 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg', true, now(), now()),
  ('blog-002', 'Skin Care Tips for Healthy Skin', 'Proper skin care routine can prevent many skin problems...', 'Essential tips for maintaining healthy and glowing skin', 'admin-001', 'Dermatology', ARRAY['skincare', 'beauty', 'health'], 'https://images.pexels.com/photos/4386476/pexels-photo-4386476.jpeg', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample contact submissions
INSERT INTO contact_submissions (id, name, email, phone, subject, message, status, created_at)
VALUES 
  ('contact-001', 'Alice Brown', 'alice@example.com', '+1234567896', 'Question about AI diagnosis', 'I would like to know more about how the AI diagnosis works', 'new', now()),
  ('contact-002', 'Bob Wilson', 'bob@example.com', '+1234567897', 'Appointment booking issue', 'I am having trouble booking an appointment with a doctor', 'in_progress', now())
ON CONFLICT (id) DO NOTHING;