# Quick Start Guide - E-Commerce Lighting Store Backend

## ✅ Installation Complete!

All dependencies have been installed successfully.

## 🚀 Next Steps

### 1. Configure Environment Variables

Copy the example environment file and update with your credentials:

```bash
# Create .env file from example
cp .env.example .env
```

Then edit `.env` and add your actual credentials for:

- MongoDB connection string
- Google OAuth credentials
- Cashfree payment credentials
- Cloudinary credentials
- JWT and Session secrets

### 2. Setup Required Services

#### MongoDB

- **Local**: Install and run MongoDB locally
- **Cloud**: Use MongoDB Atlas (free tier available)

#### Google OAuth

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:5000/api/auth/google/callback`

#### Cashfree Payment Gateway

1. Sign up at [Cashfree](https://www.cashfree.com/)
2. Get App ID and Secret Key from dashboard
3. Start with TEST mode

#### Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get Cloud Name, API Key, and API Secret from dashboard

### 3. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run at: `http://localhost:5000`

### 4. Test the API

Visit `http://localhost:5000` in your browser. You should see:

```json
{
  "success": true,
  "message": "E-Commerce Lighting Store API",
  "version": "1.0.0"
}
```

### 5. Create Admin User

After creating your first user via Google OAuth:

1. Connect to MongoDB
2. Update user role to admin:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
);
```

## 📚 Available API Endpoints

### Public Routes

- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product

### Authentication

- `GET /api/auth/google` - Login with Google
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Protected Routes (Requires Login)

- `GET /api/cart` - Get cart
- `POST /api/cart` - Add to cart
- `POST /api/orders` - Create order
- `GET /api/users/profile` - Get profile

### Admin Routes (Requires Admin Role)

- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `GET /api/admin/dashboard/stats` - Get statistics

## 🧪 Testing with Postman/Thunder Client

1. **Login via Google OAuth**

   - Visit `http://localhost:5000/api/auth/google` in browser
   - Complete Google login
   - Copy the JWT token from the redirect URL

2. **Use token in API calls**
   - Add header: `Authorization: Bearer YOUR_TOKEN`
   - Or use cookie: `token=YOUR_TOKEN`

## 📁 Project Structure

```
Backend/
├── config/          # Configuration files
├── models/          # Database schemas
├── controllers/     # Business logic
├── routes/          # API routes
├── middlewares/     # Custom middlewares
├── utils/           # Helper functions
└── server.js        # Main entry point
```

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Google OAuth 2.0
- ✅ Rate Limiting
- ✅ CORS Protection
- ✅ Helmet Security Headers
- ✅ Input Validation
- ✅ MongoDB Injection Prevention

## 📝 Key Features Implemented

✅ User authentication with Google OAuth
✅ Product management with image upload
✅ Shopping cart functionality
✅ Order processing
✅ Cashfree payment integration
✅ Admin dashboard with statistics
✅ Search, filter, and pagination
✅ User profile management

## 🐛 Troubleshooting

### MongoDB Connection Error

- Check if MongoDB is running
- Verify connection string in .env
- For Atlas, check IP whitelist

### Google OAuth Not Working

- Verify callback URL matches Google Console
- Check client ID and secret
- Ensure Google+ API is enabled

### Port Already in Use

```bash
# Change PORT in .env file
PORT=3000
```

## 📖 Full Documentation

See [README.md](./README.md) for complete API documentation and deployment guide.

## 🎯 Development Workflow

1. Create/update models in `models/`
2. Add business logic in `controllers/`
3. Define routes in `routes/`
4. Test with Postman/Thunder Client
5. Update frontend to consume APIs

## 💡 Tips

- Use `npm run dev` for development (auto-reload)
- Check console for detailed error messages
- Use MongoDB Compass for database visualization
- Test payment flow in Cashfree TEST mode first

---

Need help? Check the [README.md](./README.md) or create an issue!
