# 🚀 Complete cPanel Deployment Guide for SensiDoc

This guide will walk you through deploying both the frontend and backend of your SensiDoc healthcare platform to cPanel hosting.

## 📋 **Prerequisites**

Before starting, make sure you have:
- ✅ cPanel hosting account with Node.js support
- ✅ Domain name (optional but recommended)
- ✅ File manager access in cPanel
- ✅ SSH access (if available, makes deployment easier)

---

## 🔧 **Step 1: Prepare Your Project Files**

### 1.1 Build the Frontend
Your frontend is already built! The `dist` folder contains the production-ready files.

### 1.2 Prepare Backend Files
Your backend is also built! The `backend/dist` folder contains the compiled JavaScript files.

---

## 🌐 **Step 2: Access Your cPanel**

1. **Login to cPanel**
   - Go to your hosting provider's login page
   - Enter your username and password
   - Click "Login to cPanel"

2. **Navigate to File Manager**
   - In cPanel dashboard, find "Files" section
   - Click on "File Manager"

---

## 📁 **Step 3: Upload Frontend Files**

### 3.1 Navigate to Public HTML Directory
1. In File Manager, navigate to `public_html` folder
2. This is where your website files will be stored

### 3.2 Upload Frontend Files
1. **Select all files from your local `dist` folder:**
   - `index.html`
   - `assets/` folder (contains CSS and JS files)

2. **Upload to cPanel:**
   - Click "Upload" button in File Manager
   - Select all files from your local `dist` folder
   - Upload them to `public_html`

### 3.3 Verify Frontend Upload
1. Check that these files are in your `public_html`:
   ```
   public_html/
   ├── index.html
   └── assets/
       ├── index-[hash].css
       └── index-[hash].js
   ```

---

## ⚙️ **Step 4: Set Up Backend**

### 4.1 Create Backend Directory
1. In File Manager, go to your home directory (not public_html)
2. Create a new folder called `sensidoc-backend`
3. This keeps your backend separate from public files

### 4.2 Upload Backend Files
1. **Upload these files to `sensidoc-backend` folder:**
   - All files from `backend/dist/` folder
   - `backend/package.json`
   - `backend/package-lock.json` (if exists)

2. **Your backend structure should look like:**
   ```
   sensidoc-backend/
   ├── index.js
   ├── controllers/
   ├── middleware/
   ├── routes/
   ├── services/
   ├── config/
   └── package.json
   ```

### 4.3 Create Environment File
1. In the `sensidoc-backend` folder, create a new file called `.env`
2. Add your environment variables:

```env
# Database Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Server Configuration
PORT=3001
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
```

---

## 🔧 **Step 5: Install Node.js Dependencies**

### 5.1 Access Terminal/SSH (Recommended Method)
1. In cPanel, find "Advanced" section
2. Click on "Terminal" or "SSH Access"
3. Connect to your server

### 5.2 Install Dependencies
```bash
# Navigate to backend directory
cd sensidoc-backend

# Install dependencies
npm install --production

# Verify installation
ls node_modules
```

### 5.3 Alternative: Using File Manager
If you don't have SSH access:
1. Upload the entire `node_modules` folder from your local machine
2. This is larger but works if SSH is not available

---

## 🚀 **Step 6: Start the Backend Server**

### 6.1 Using SSH/Terminal (Recommended)
```bash
# Navigate to backend directory
cd sensidoc-backend

# Start the server
node index.js

# Or use PM2 for production (if available)
pm2 start index.js --name sensidoc-backend
pm2 save
pm2 startup
```

### 6.2 Using cPanel Node.js App Manager
1. In cPanel, find "Software" section
2. Click on "Node.js App Manager"
3. Click "Create Application"
4. Fill in the details:
   - **Node.js version:** 18.x or higher
   - **Application mode:** Production
   - **Application root:** /home/username/sensidoc-backend
   - **Application URL:** your-domain.com:3001
   - **Application startup file:** index.js
   - **Passenger port:** 3001
5. Click "Create"

---

## 🔗 **Step 7: Configure Domain and Subdomain**

### 7.1 Set Up Subdomain for API (Recommended)
1. In cPanel, go to "Domains" section
2. Click "Subdomains"
3. Create a subdomain:
   - **Subdomain:** api
   - **Domain:** your-domain.com
   - **Document Root:** /home/username/sensidoc-backend
4. This will make your API available at `api.your-domain.com`

### 7.2 Alternative: Use Port in URL
If you can't create a subdomain, your API will be available at:
`your-domain.com:3001`

---

## ⚙️ **Step 8: Update Frontend Configuration**

### 8.1 Update API Base URL
1. In File Manager, go to `public_html`
2. Edit `index.html`
3. Find the script tag that loads your main JavaScript
4. Add this before the closing `</head>` tag:

```html
<script>
  window.API_BASE_URL = 'https://api.your-domain.com';
  // Or if using port: window.API_BASE_URL = 'https://your-domain.com:3001';
</script>
```

### 8.2 Update Environment Variables
If your frontend needs environment variables, create a `config.js` file in `public_html`:

```javascript
window.ENV = {
  SUPABASE_URL: 'your_supabase_url',
  SUPABASE_ANON_KEY: 'your_supabase_anon_key',
  API_BASE_URL: 'https://api.your-domain.com'
};
```

---

## 🔒 **Step 9: Security Configuration**

### 9.1 Set Up SSL Certificate
1. In cPanel, go to "Security" section
2. Click "SSL/TLS"
3. Install SSL certificate for your domain
4. Enable "Force HTTPS Redirect"

### 9.2 Configure CORS (if needed)
If you get CORS errors, update your backend CORS configuration in `config/cors.ts`:

```typescript
const corsOptions = {
  origin: [
    'https://your-domain.com',
    'https://www.your-domain.com'
  ],
  credentials: true
};
```

---

## 🧪 **Step 10: Test Your Deployment**

### 10.1 Test Frontend
1. Visit your domain: `https://your-domain.com`
2. Check that the website loads properly
3. Test navigation between pages

### 10.2 Test Backend API
1. Visit your API endpoint: `https://api.your-domain.com/api-docs`
2. Check that Swagger documentation loads
3. Test a simple API endpoint like `/api/health`

### 10.3 Test Integration
1. Try to register a new user
2. Test login functionality
3. Check that frontend can communicate with backend

---

## 🔧 **Step 11: Troubleshooting Common Issues**

### 11.1 Frontend Not Loading
- Check file permissions (should be 644 for files, 755 for folders)
- Verify all files are uploaded to `public_html`
- Check browser console for errors

### 11.2 Backend Not Starting
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check `.env` file configuration
- Look at error logs in cPanel

### 11.3 API Connection Issues
- Verify API URL is correct in frontend
- Check CORS configuration
- Ensure backend is running on correct port
- Test API endpoints directly

### 11.4 Database Connection Issues
- Verify Supabase credentials in `.env`
- Check network connectivity
- Ensure Supabase project is active

---

## 📊 **Step 12: Monitoring and Maintenance**

### 12.1 Set Up Logging
1. Check cPanel error logs regularly
2. Monitor application performance
3. Set up uptime monitoring

### 12.2 Regular Updates
1. Keep Node.js version updated
2. Update dependencies regularly
3. Monitor security patches

### 12.3 Backup Strategy
1. Regular backups of your code
2. Database backups (handled by Supabase)
3. Environment configuration backups

---

## 🎯 **Final Checklist**

Before going live, verify:

- ✅ Frontend loads at `https://your-domain.com`
- ✅ Backend API responds at `https://api.your-domain.com`
- ✅ SSL certificates are installed
- ✅ Database connection works
- ✅ User registration/login works
- ✅ All features are functional
- ✅ Error handling is working
- ✅ Performance is acceptable

---

## 🆘 **Getting Help**

If you encounter issues:

1. **Check cPanel Error Logs**
   - Go to "Errors" section in cPanel
   - Look for recent error messages

2. **Contact Your Hosting Provider**
   - They can help with server-specific issues
   - Ask about Node.js support and configuration

3. **Check Browser Console**
   - Press F12 in browser
   - Look for JavaScript errors

4. **Test API Endpoints**
   - Use tools like Postman or curl
   - Test endpoints directly

---

## 🚀 **Congratulations!**

Your SensiDoc healthcare platform is now live! 

**Your URLs:**
- Frontend: `https://your-domain.com`
- Backend API: `https://api.your-domain.com`
- API Documentation: `https://api.your-domain.com/api-docs`

Remember to:
- Monitor your application regularly
- Keep backups of your configuration
- Update dependencies when needed
- Test new features before deploying

---

**Need more help?** Check the main README.md file for additional documentation and troubleshooting tips. 