# E-Commerce Lighting Store - Backend API

A complete Express.js backend for an e-commerce lighting store with Google OAuth authentication, Cashfree payment integration, and comprehensive admin features.

## Features

- ✅ Google OAuth 2.0 Authentication
- ✅ JWT-based Session Management
- ✅ Product Management with Image Upload
- ✅ Shopping Cart Functionality
- ✅ Order Processing & Management
- ✅ Cashfree Payment Gateway Integration
- ✅ Admin Dashboard with Analytics
- ✅ User Profile Management
- ✅ Search, Filter & Pagination
- ✅ Rate Limiting & Security Headers
- ✅ Input Validation & Error Handling

## Technology Stack

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (Google OAuth 2.0)
- **Payment**: Cashfree Payment Gateway
- **File Upload**: Multer + Cloudinary
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
Backend/
├── config/
│   ├── config.js           # Environment configuration
│   ├── database.js         # MongoDB connection
│   ├── passport.js         # Passport Google OAuth setup
│   └── cloudinary.js       # Cloudinary configuration
├── models/
│   ├── User.js            # User schema
│   ├── Product.js         # Product schema
│   ├── Cart.js            # Cart schema
│   └── Order.js           # Order schema
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── productController.js # Product management
│   ├── cartController.js   # Cart operations
│   ├── orderController.js  # Order & payment processing
│   ├── userController.js   # User profile management
│   └── adminController.js  # Admin operations
├── routes/
│   ├── authRoutes.js      # Auth routes
│   ├── productRoutes.js   # Product routes
│   ├── cartRoutes.js      # Cart routes
│   ├── orderRoutes.js     # Order routes
│   ├── userRoutes.js      # User routes
│   └── adminRoutes.js     # Admin routes
├── middlewares/
│   ├── authMiddleware.js  # JWT authentication & admin check
│   ├── errorHandler.js    # Global error handler
│   ├── validation.js      # Joi validation schemas
│   └── upload.js          # Multer configuration
├── utils/
│   ├── uploadHelper.js    # Cloudinary upload helpers
│   └── paymentHelper.js   # Cashfree payment helpers
├── server.js              # Express app entry point
├── package.json
├── .env.example
└── README.md
```

## Installation

### 1. Clone the repository

```bash
cd Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the Backend directory and add the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ecom-lighting

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT & Session
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_key_here

# Cashfree Payment Gateway
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENV=TEST

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### 4. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

### 5. Setup Cashfree

1. Sign up at [Cashfree](https://www.cashfree.com/)
2. Get your App ID and Secret Key from dashboard
3. Add them to `.env`

### 6. Setup Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret
3. Add them to `.env`

### 7. Run the server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (Public)

```
POST   /api/auth/google              - Initiate Google OAuth
GET    /api/auth/google/callback     - Google OAuth callback
GET    /api/auth/me                  - Get current user (Protected)
POST   /api/auth/logout              - Logout user (Protected)
```

### Product Routes

```
GET    /api/products                 - Get all products with filters
GET    /api/products/featured        - Get featured products (max 4)
GET    /api/products/:id             - Get single product
```

**Query Parameters for GET /api/products:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category
- `search` - Search by name/description
- `sortBy` - Sort field (createdAt, price, rating)
- `order` - Sort order (asc, desc)

### Cart Routes (Protected)

```
GET    /api/cart                     - Get user's cart
POST   /api/cart                     - Add item to cart
PUT    /api/cart/:itemId             - Update cart item quantity
DELETE /api/cart/:itemId             - Remove item from cart
DELETE /api/cart                     - Clear entire cart
```

### Order Routes (Protected)

```
POST   /api/orders                   - Create new order
GET    /api/orders                   - Get user's orders
GET    /api/orders/:id               - Get single order
POST   /api/orders/:id/payment       - Process payment
POST   /api/orders/:id/verify-payment - Verify payment status
```

### User Routes (Protected)

```
GET    /api/users/profile            - Get user profile
PUT    /api/users/profile            - Update user profile
```

### Admin Routes (Protected - Admin Only)

```
# Product Management
POST   /api/admin/products           - Create product
PUT    /api/admin/products/:id       - Update product
DELETE /api/admin/products/:id       - Delete product
PATCH  /api/admin/products/:id/featured - Toggle featured status

# Order Management
GET    /api/admin/orders             - Get all orders
PUT    /api/admin/orders/:id/status  - Update order status

# Dashboard
GET    /api/admin/dashboard/stats    - Get dashboard statistics
```

## Request/Response Examples

### Create Order

**Request:**

```json
POST /api/orders
{
  "shippingAddress": {
    "name": "John Doe",
    "phoneNumber": "1234567890",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "...",
    "orderNumber": "ORD-1234567890-1",
    "items": [...],
    "totalAmount": 5000,
    "orderStatus": "pending",
    "paymentStatus": "pending"
  }
}
```

### Add to Cart

**Request:**

```json
POST /api/cart
{
  "productId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "quantity": 2
}
```

**Response:**

```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "items": [...],
    "totalAmount": 2500
  }
}
```

### Create Product (Admin)

**Request:**

```
POST /api/admin/products
Content-Type: multipart/form-data

name: LED Bulb 9W
description: Energy-efficient LED bulb
pricing[originalPrice]: 299
pricing[offerPrice]: 199
stock[quantity]: 100
category: LED Lights
images: [file1.jpg, file2.jpg]
```

## Database Schema

### Categories Available

- LED Lights
- Smart Lighting
- Decorative
- Outdoor

### Order Status Values

- pending
- processing
- delivered
- cancelled

### Payment Status Values

- pending
- completed
- failed

## Security Features

- JWT-based authentication
- Password-protected admin routes
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet security headers
- Input validation with Joi
- MongoDB injection prevention

## Error Handling

All errors return in the format:

```json
{
  "success": false,
  "message": "Error message",
  "error": {}
}
```

Common HTTP Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Creating an Admin User

By default, users are created with role "user". To create an admin:

1. Create a normal user via Google OAuth
2. Manually update the user in MongoDB:

```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } });
```

### Testing APIs

Use Postman or any API testing tool. For authenticated routes:

1. Login via Google OAuth to get JWT token
2. Add token to requests:
   - Cookie: `token=your_jwt_token`
   - OR Header: `Authorization: Bearer your_jwt_token`

## Deployment

### Environment Variables for Production

- Set `NODE_ENV=production`
- Use production MongoDB URI
- Set `CASHFREE_ENV=PROD`
- Update `CLIENT_URL` to production frontend URL
- Use strong secrets for JWT and Session

### Deployment Platforms

- **Backend**: Heroku, Railway, Render, AWS
- **Database**: MongoDB Atlas
- **Images**: Cloudinary

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
