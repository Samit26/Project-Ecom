# 🚀 Quick Commands Reference

## Installation Commands (Already Done ✅)

```bash
cd Backend
npm install
```

## Environment Setup

```bash
# Copy example env file (already done if you ran it)
Copy-Item .env.example .env

# Edit .env file with your credentials
notepad .env
```

## Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Seed sample data
npm run seed

# Seed pages data (Contact, FAQ, Policies)
node seedPages.js
```

## Server URLs

- **API Base**: http://localhost:5000
- **API Status**: http://localhost:5000/
- **Google OAuth**: http://localhost:5000/api/auth/google

## Testing Endpoints with PowerShell

### Check Server Status

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/" -Method Get
```

### Get All Products

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/products" -Method Get
```

### Get Featured Products

```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/products/featured" -Method Get
```

## MongoDB Commands

### Start MongoDB (Local)

```powershell
# Start MongoDB service
net start MongoDB

# Or if using MongoDB Community Edition
mongod
```

### Connect to MongoDB

```powershell
# Using mongosh
mongosh "mongodb://localhost:27017/ecom-lighting"
```

### Create Admin User (After First Login)

```javascript
// In MongoDB shell
use ecom-lighting

db.users.updateOne(
  { email: "your-email@gmail.com" },
  { $set: { role: "admin" } }
)

// Verify
db.users.find({ role: "admin" })
```

## Common npm Commands

```bash
# Install a new package
npm install package-name

# Check for outdated packages
npm outdated

# Update packages
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Git Commands (If using version control)

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial backend setup"

# Add remote
git remote add origin <your-repo-url>

# Push
git push -u origin main
```

## Environment Variables Checklist

Make sure these are set in `.env`:

```env
✅ PORT=5000
✅ NODE_ENV=development
✅ MONGODB_URI=<your-mongodb-uri>
✅ GOOGLE_CLIENT_ID=<your-google-client-id>
✅ GOOGLE_CLIENT_SECRET=<your-google-secret>
✅ JWT_SECRET=<generate-random-string>
✅ SESSION_SECRET=<generate-random-string>
✅ CASHFREE_APP_ID=<your-cashfree-app-id>
✅ CASHFREE_SECRET_KEY=<your-cashfree-secret>
✅ CASHFREE_ENV=TEST
✅ CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
✅ CLOUDINARY_API_KEY=<your-cloudinary-key>
✅ CLOUDINARY_API_SECRET=<your-cloudinary-secret>
✅ CLIENT_URL=http://localhost:5173
```

## Generate Random Secrets

```powershell
# Generate JWT_SECRET
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Generate SESSION_SECRET
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

## Troubleshooting

### Port already in use

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### MongoDB connection error

```bash
# Check MongoDB is running
net start | findstr MongoDB

# Check connection string in .env
```

### Google OAuth not working

- Verify redirect URI in Google Console matches exactly
- Check CLIENT_URL in .env
- Clear browser cookies and try again

## Useful Development Tools

### VS Code Extensions

- ESLint
- Prettier
- REST Client
- MongoDB for VS Code
- Thunder Client (API testing)

### API Testing

- Postman: https://www.postman.com/
- Thunder Client (VS Code Extension)
- REST Client (VS Code Extension)

### Database Viewers

- MongoDB Compass: https://www.mongodb.com/products/compass
- Studio 3T: https://studio3t.com/

## Project Structure Navigation

```bash
# View all routes
ls routes/*.js

# View all models
ls models/*.js

# View all controllers
ls controllers/*.js

# View config files
ls config/*.js
```

## Quick Start (Step by Step)

```bash
# 1. Navigate to backend
cd Backend

# 2. Install dependencies (if not done)
npm install

# 3. Configure environment
Copy-Item .env.example .env
notepad .env

# 4. Start MongoDB (if local)
net start MongoDB

# 5. Run the server
npm run dev

# 6. Seed data (optional)
npm run seed

# 7. Open browser and test
start http://localhost:5000
```

## API Testing Examples (PowerShell)

### Get Products with Filters

```powershell
$uri = "http://localhost:5000/api/products?category=Smart Lighting&page=1&limit=10&sortBy=price&order=asc"
Invoke-WebRequest -Uri $uri -Method Get | Select-Object -ExpandProperty Content
```

### Create Product (Admin - Need Auth Token)

```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_JWT_TOKEN"
    "Content-Type" = "application/json"
}

$body = @{
    name = "Test Product"
    description = "Test Description"
    pricing = @{
        originalPrice = 1000
        offerPrice = 800
    }
    category = "LED Lights"
    stock = @{
        isAvailable = $true
        quantity = 50
    }
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/admin/products" -Method Post -Headers $headers -Body $body
```

## Logs and Debugging

```bash
# Watch logs in development
npm run dev

# Custom logging
# Edit server.js to add more morgan logging options

# Check error logs
# Errors will appear in console when running npm run dev
```

## Production Deployment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB URI
- [ ] Update `CLIENT_URL` to production URL
- [ ] Set `CASHFREE_ENV=PROD`
- [ ] Use strong JWT and session secrets
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up environment variables on hosting platform
- [ ] Review rate limiting settings
- [ ] Set up logging service
- [ ] Configure backup strategy

## Support & Documentation

- **Main Documentation**: [README.md](README.md)
- **Setup Guide**: [QUICK_START.md](QUICK_START.md)
- **Checklist**: [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
- **Implementation Details**: [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)

---

**Happy Coding! 🎉**
