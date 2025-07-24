-- Insert admin user (password: admin123)
-- Note: In production, use a strong password and hash it properly
INSERT INTO users (
  id,
  email,
  password_hash,
  full_name,
  role,
  is_verified,
  membership_type
) VALUES (
  uuid_generate_v4(),
  'admin@sensidoc.com',
  '$2a$12$LQv3c1yqBwlVHpPjrGrPUeOkKs9wDh2QMnDFBFXvCeVHf6.K5zKGy', -- admin123
  'SensiDoc Admin',
  'admin',
  true,
  'premium'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample doctors
INSERT INTO users (
  id,
  email,
  password_hash,
  full_name,
  phone,
  role,
  is_verified,
  membership_type
) VALUES 
(
  uuid_generate_v4(),
  'dr.smith@sensidoc.com',
  '$2a$12$LQv3c1yqBwlVHpPjrGrPUeOkKs9wDh2QMnDFBFXvCeVHf6.K5zKGy', -- doctor123
  'Dr. John Smith',
  '+1234567890',
  'doctor',
  true,
  'premium'
),
(
  uuid_generate_v4(),
  'dr.johnson@sensidoc.com',
  '$2a$12$LQv3c1yqBwlVHpPjrGrPUeOkKs9wDh2QMnDFBFXvCeVHf6.K5zKGy', -- doctor123
  'Dr. Sarah Johnson',
  '+1234567891',
  'doctor',
  true,
  'premium'
) ON CONFLICT (email) DO NOTHING;

-- Insert doctor profiles
INSERT INTO doctors (
  id,
  user_id,
  specialization,
  experience_years,
  qualification,
  license_number,
  consultation_fee,
  is_verified,
  is_online,
  city,
  hospital_name,
  bio,
  rating,
  total_consultations,
  is_video_available
) VALUES 
(
  uuid_generate_v4(),
  (SELECT id FROM users WHERE email = 'dr.smith@sensidoc.com'),
  'Cardiology',
  15,
  'MD, FACC',
  'LIC001',
  100.00,
  true,
  true,
  'New York',
  'NYC Medical Center',
  'Experienced cardiologist specializing in heart disease prevention and treatment.',
  4.8,
  250,
  true
),
(
  uuid_generate_v4(),
  (SELECT id FROM users WHERE email = 'dr.johnson@sensidoc.com'),
  'Dermatology',
  10,
  'MD, Dermatology',
  'LIC002',
  80.00,
  true,
  false,
  'Los Angeles',
  'LA Skin Clinic',
  'Board-certified dermatologist with expertise in skin cancer detection.',
  4.9,
  180,
  true
) ON CONFLICT (license_number) DO NOTHING;

-- Insert sample patient
INSERT INTO users (
  id,
  email,
  password_hash,
  full_name,
  phone,
  role,
  is_verified,
  membership_type
) VALUES (
  uuid_generate_v4(),
  'patient@sensidoc.com',
  '$2a$12$LQv3c1yqBwlVHpPjrGrPUeOkKs9wDh2QMnDFBFXvCeVHf6.K5zKGy', -- patient123
  'John Doe',
  '+1234567892',
  'patient',
  true,
  'free'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blogs (
  id,
  title,
  content,
  excerpt,
  author_id,
  category,
  tags,
  is_published
) VALUES 
(
  uuid_generate_v4(),
  'Understanding Heart Health: A Complete Guide',
  'Heart health is crucial for overall well-being. In this comprehensive guide, we explore the fundamentals of cardiovascular health, common heart conditions, prevention strategies, and treatment options...',
  'Learn everything you need to know about maintaining a healthy heart and preventing cardiovascular disease.',
  (SELECT id FROM users WHERE email = 'admin@sensidoc.com'),
  'Cardiology',
  ARRAY['heart health', 'prevention', 'cardiology'],
  true
),
(
  uuid_generate_v4(),
  'Skin Care Tips for Healthy Skin',
  'Maintaining healthy skin requires a consistent routine and understanding of your skin type. This article covers essential skin care practices, common skin conditions, and when to see a dermatologist...',
  'Discover professional skin care tips and learn how to maintain healthy, glowing skin.',
  (SELECT id FROM users WHERE email = 'admin@sensidoc.com'),
  'Dermatology',
  ARRAY['skin care', 'dermatology', 'health tips'],
  true
) ON CONFLICT DO NOTHING;