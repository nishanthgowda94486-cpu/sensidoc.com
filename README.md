# SensiDoc - Complete Healthcare Platform

SensiDoc is a comprehensive healthcare platform that provides AI-powered diagnosis, doctor appointment booking, drug information, and health record management. Built with modern technologies and a focus on user experience and security.

## 🏥 Features

### Core Features
- **AI-Powered Diagnosis**: Preliminary health assessments using advanced AI algorithms
- **Doctor Management**: Find, book, and manage appointments with verified healthcare providers
- **Drug Information**: Comprehensive drug database with interactions and side effects
- **Health Records**: Secure storage and management of medical records
- **Blog & Education**: Health articles and educational content
- **Contact & Support**: Multiple channels for customer support

### User Management
- **Multi-Role System**: Patients, Doctors, and Administrators
- **Authentication**: Secure login/signup with JWT tokens
- **Profile Management**: Complete user profile and preference management
- **Appointment Scheduling**: Real-time appointment booking and management

### Security & Compliance
- **HIPAA Compliant**: Full compliance with healthcare privacy regulations
- **Data Encryption**: End-to-end encryption for all sensitive data
- **Access Controls**: Role-based access control system
- **Audit Logging**: Comprehensive activity tracking

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **Routing**: React Router DOM
- **State Management**: React Hooks and Context API
- **Build Tool**: Vite for fast development and building

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript for type safety
- **Database**: Supabase (PostgreSQL) with real-time capabilities
- **Authentication**: JWT with bcrypt password hashing
- **Email**: Nodemailer for transactional emails
- **AI Integration**: OpenAI API for diagnosis features
- **Documentation**: Swagger/OpenAPI for API documentation

### Infrastructure
- **Database**: Supabase cloud PostgreSQL
- **File Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Real-time**: Supabase real-time subscriptions
- **Security**: Helmet, CORS, rate limiting

## 📁 Project Structure

```
sensidoc/
├── src/                          # Frontend source code
│   ├── components/               # Reusable UI components
│   │   ├── ui/                  # Base UI components (Radix UI)
│   │   ├── layout/              # Layout components (Header, Footer)
│   │   └── home/                # Home page components
│   ├── pages/                   # Page components
│   │   ├── auth/                # Authentication pages
│   │   ├── admin/               # Admin dashboard pages
│   │   ├── doctor/              # Doctor dashboard pages
│   │   └── legal/               # Legal pages (Terms, Privacy)
│   ├── lib/                     # Utility functions
│   └── types/                   # TypeScript type definitions
├── backend/                     # Backend source code
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   ├── middleware/          # Express middleware
│   │   ├── routes/              # API route definitions
│   │   ├── services/            # Business logic services
│   │   ├── config/              # Configuration files
│   │   └── types/               # TypeScript type definitions
│   └── package.json
├── public/                      # Static assets
└── package.json                 # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sensidoc.git
   cd sensidoc
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create `.env` file in the root directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Backend Configuration
   PORT=3001
   NODE_ENV=development
   
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_password
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key
   ```

   Create `.env` file in the backend directory:
   ```env
   # Database
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   
   # Server
   PORT=3001
   NODE_ENV=development
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # Email
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_password
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Database Setup**
   
   Run the database migrations:
   ```bash
   cd backend
   npm run migrate
   npm run seed
   ```

6. **Start Development Servers**

   Frontend (in root directory):
   ```bash
   npm run dev
   ```

   Backend (in backend directory):
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api-docs

## 📚 API Documentation

The API documentation is available at `/api-docs` when the backend server is running. It includes:

- Authentication endpoints
- User management
- Doctor and appointment management
- AI diagnosis endpoints
- Drug information endpoints
- Blog and contact management

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

## 🛡️ Security Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (Patient, Doctor, Admin)
- **Data Protection**: HIPAA-compliant data handling
- **Input Validation**: Comprehensive input sanitization and validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Configured CORS policies
- **Helmet**: Security headers middleware

## 🧪 Testing

```bash
# Frontend tests
npm run test

# Backend tests
cd backend
npm run test
```

## 📦 Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service:

```bash
npm run build
```

### Backend Deployment
The backend can be deployed to platforms like:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@sensidoc.com
- Phone: +1 (555) 123-4567
- Documentation: [docs.sensidoc.com](https://docs.sensidoc.com)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [OpenAI](https://openai.com) for AI capabilities
- [Radix UI](https://radix-ui.com) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Vite](https://vitejs.dev) for the build tool

## 📊 Project Status

- ✅ Core Features Implemented
- ✅ Authentication System
- ✅ AI Diagnosis Integration
- ✅ Doctor Management
- ✅ Drug Information System
- ✅ Blog & Contact Pages
- ✅ Legal Pages (Terms, Privacy)
- ✅ Admin Dashboard
- ✅ Doctor Dashboard
- ✅ Responsive Design
- ✅ Security Implementation
- 🔄 Testing Coverage (In Progress)
- 🔄 Performance Optimization (In Progress)
- 🔄 Mobile App (Planned)

---

**SensiDoc** - Your trusted healthcare companion. 🏥💙