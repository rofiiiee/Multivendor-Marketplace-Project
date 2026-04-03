#  Tradify - Multi-Vendor Marketplace

> A full-stack, production-ready e-commerce platform enabling multiple vendors to sell premium products with secure authentication, real-time inventory management, and streamlined order processing.

---

##  Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                  │
│  ├─ Pages (Home, Products, Cart, Checkout, Dashboard)      │
│  ├─ Components (Reusable UI, Forms, Tables)                │
│  └─ State Management (React Hooks + localStorage)          │
└────────────────────────────┬────────────────────────────────┘
                             │ (REST API - Axios)
                             ↓
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Node.js + Express.js)                 │
│  ├─ Routes (Auth, Products, Orders, Cart, Vendors)         │
│  ├─ Controllers (Business Logic)                           │
│  ├─ Models (MongoDB Schemas)                               │
│  ├─ Middleware (Auth, Uploads, Error Handling)             │
│  └─ Services (Reusable Logic Layer)                        │
└────────────────────────────┬────────────────────────────────┘
                             │ (Mongoose ODM)
                             ↓
┌─────────────────────────────────────────────────────────────┐
│              DATABASE & STORAGE LAYER                        │
│  ├─ MongoDB (NoSQL Database)                               │
│  └─ Cloudinary (Image CDN & Management)                    │
└─────────────────────────────────────────────────────────────┘
```

---

##  Tech Stack

### **Frontend**
| Technology | Purpose | Version |
|-----------|----------|---------|
| React | UI Framework | 19.2.4 |
| Vite | Build Tool & Dev Server | Latest |
| React Router | Client-side Routing | 7.13.2 |
| Tailwind CSS | Utility-first Styling | Latest |
| Framer Motion | Animation Library | 12.38.0 |
| React Hook Form | Form State Management | 7.72.0 |
| Zod | Schema Validation | 4.3.6 |
| Axios | HTTP Client | 1.14.0 |
| Lucide React | Icon Library | 1.7.0 |
| React Hot Toast | Toast Notifications | 2.6.0 |

### **Backend**
| Technology | Purpose | Version |
|-----------|---------|---------|
| Node.js | Runtime Environment | 18+ |
| Express.js | Web Framework | 5.2.1 |
| MongoDB | NoSQL Database | Latest |
| Mongoose | ODM Library | 9.3.0 |
| JWT (jsonwebtoken) | Auth Tokens | 9.0.3 |
| Bcryptjs | Password Hashing | 3.0.3 |
| Multer | File Upload Handler | 2.1.1 |
| Cloudinary | Image Storage | 1.41.3 |
| Helmet | Security Headers | 8.1.0 |
| CORS | Cross-Origin Requests | 2.8.6 |
| Dotenv | Environment Variables | 17.3.1 |

---

##  Key Features

### **Authentication & Authorization**
- ✅ JWT-based secure authentication
- ✅ Role-based access control (Customer, Vendor, Admin)
- ✅ Bcrypt password hashing with salt rounds
- ✅ Token persistence with localStorage
- ✅ Protected API endpoints with middleware

### **Customer Features**
-  Browse & search products with category filtering
-  Shopping cart with quantity management
-  Secure checkout with address validation
-  Order history and tracking
-  Favorites system
-  Product ratings and reviews
-  Advanced filtering (price, category, ratings)

### **Vendor Management**
-  Vendor profile creation and management
-  Real-time inventory tracking dashboard
-  Revenue analytics and order statistics
-  Product CRUD operations
-  Cloudinary image upload integration
-  Order fulfillment management
-  Sales metrics and performance tracking

### **Product Management**
-  Rich product descriptions
-  Multiple image support (Cloudinary CDN)
-  Category-based organization
-  Dynamic pricing system
-  Real-time stock management
-  Product edit/update functionality
-  Soft delete with restore option

### **Order Processing**
-  Order creation with cart items
-  Order status tracking (Pending, Confirmed, Shipped, Delivered)
-  Delivery information capture
-  Total price calculation with tax
-  Vendor-order association for management

### **Security & Validation**
-  HTTPS-ready infrastructure
-  Helmet security headers
-  Input validation with Zod schemas
-  CORS protection
-  Secure JWT implementation
-  Error handling middleware

### **UI/UX Enhancements**
-  Modern minimalist design with Tailwind CSS
-  Smooth animations with Framer Motion
- Fully responsive (mobile-first approach)
-  Professional color scheme (emerald accents)
-  Semantic HTML for accessibility
-  Intuitive navigation and user flows

---

##  Project Structure

### **Backend Structure**
```
multi-vendor-marketplace/
├── src/
│   ├── app.js                 # Express app setup & middleware
│   ├── server.js              # Server entry point
│   ├── config/
│   │   └── db.js              # MongoDB connection config
│   ├── controllers/
│   │   ├── authController.js  # Auth logic (register, login)
│   │   ├── productController.js      # Product CRUD
│   │   ├── vendorController.js       # Vendor management
│   │   ├── cartController.js         # Shopping cart logic
│   │   ├── orderController.js        # Order processing
│   │   └── categoryController.js     # Category management
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Vendor.js          # Vendor schema
│   │   ├── Product.js         # Product schema
│   │   ├── Cart.js            # Cart schema
│   │   ├── Order.js           # Order schema
│   │   └── Category.js        # Category schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── productRoutes.js   # Product endpoints
│   │   ├── vendorRoutes.js    # Vendor endpoints
│   │   ├── cartRoutes.js      # Cart endpoints
│   │   ├── orderRoutes.js     # Order endpoints
│   │   └── categoryRoutes.js  # Category endpoints
│   ├── middlewares/
│   │   ├── authMiddleware.js  # JWT verification
│   │   ├── uploadMiddleware.js # Cloudinary upload
│   │   └── errorMiddleware.js # Global error handler
│   ├── services/              # Business logic layer (future)
│   └── utils/
│       ├── AppError.js        # Custom error class
│       └── catchAsync.js      # Async error wrapper
├── .env                       # Environment variables
└── package.json              # Dependencies
```

### **Frontend Structure**
```
frontend/
├── public/                    # Static assets
├── src/
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Main routing component
│   ├── index.css             # Global styles
│   ├── api.js                # Axios API client
│   ├── assets/               # Images, logos
│   ├── pages/
│   │   ├── Home.jsx          # Landing page
│   │   ├── Products.jsx      # Product listing
│   │   ├── ProductDetails.jsx # Single product view
│   │   ├── VendorDashboard.jsx # Vendor control panel
│   │   └── About.jsx         # About page
│   ├── components/
│   │   ├── Cart.jsx          # Shopping cart
│   │   ├── Checkout.jsx      # Checkout form
│   │   ├── Login.jsx         # Login form
│   │   ├── Register.jsx      # Registration form
│   │   ├── Order.jsx         # Order history
│   │   ├── ProductCard.jsx   # Product display
│   │   ├── layout/
│   │   │   ├── Navbar.jsx    # Navigation bar
│   │   │   └── Footer.jsx    # Footer
│   │   ├── home/
│   │   │   ├── Hero.jsx      # Hero section
│   │   │   ├── Categories.jsx # Categories showcase
│   │   │   ├── Features.jsx  # Features section
│   │   │   └── FeaturedProducts.jsx
│   │   └── VendorDashboard/
│   │       ├── InventoryTable.jsx    # Product table
│   │       ├── OrdersTable.jsx       # Orders table
│   │       ├── ProductModal.jsx      # Product form
│   │       └── StatCard.jsx          # Stats cards
├── index.html                # HTML shell
├── vite.config.js           # Vite configuration
├── eslint.config.js         # Linting rules
└── package.json             # Dependencies
```

---

##  API Endpoints

### **Authentication**
```
POST   /api/v1/auth/register    # Register user/vendor
POST   /api/v1/auth/login       # Login user
GET    /api/v1/auth/me          # Get current user (protected)
```

### **Products**
```
GET    /api/v1/products         # List all products
POST   /api/v1/products         # Create product (vendor)
GET    /api/v1/products/:id     # Get product details
PUT    /api/v1/products/:id     # Update product (vendor)
DELETE /api/v1/products/:id     # Delete product (vendor)
```

### **Cart**
```
POST   /api/v1/cart             # Add to cart
GET    /api/v1/cart             # Get cart items
PUT    /api/v1/cart/:id         # Update cart item
DELETE /api/v1/cart/:id         # Remove from cart
```

### **Orders**
```
POST   /api/v1/orders           # Create order
GET    /api/v1/orders           # Get user orders
GET    /api/v1/orders/:id       # Get order details
PUT    /api/v1/orders/:id       # Update order status
```

### **Vendors**
```
POST   /api/v1/vendors          # Create vendor profile
GET    /api/v1/vendors/me       # Get vendor profile (protected)
PUT    /api/v1/vendors/:id      # Update vendor info
```

### **Categories**
```
GET    /api/v1/categories       # List all categories
POST   /api/v1/categories       # Create category (admin)
PUT    /api/v1/categories/:id   # Update category
DELETE /api/v1/categories/:id   # Delete category
```

---

##  How to Run

### **Prerequisites**
- Node.js v18 or higher
- MongoDB (local or Atlas)
- Cloudinary account
- Git

### **Backend Setup**

1. **Clone & Install Dependencies**
```bash
cd multi-vendor-marketplace
npm install
```

2. **Create `.env` File**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tradify

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=http://localhost:5173
```

3. **Start Development Server**
```bash
npm run dev
```
Server runs on `http://localhost:5000`

4. **Start Production Server**
```bash
npm start
```

---

### **Frontend Setup**

1. **Clone & Install Dependencies**
```bash
cd frontend
npm install
```

2. **Create `.env` File**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

3. **Start Development Server**
```bash
npm run dev
```
App runs on `http://localhost:5173`

4. **Build for Production**
```bash
npm run build
```
Output in `dist/` folder

5. **Lint Code**
```bash
npm run lint
```

---

##  Database Schema Overview

### **User Model**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ["customer", "vendor"],
  createdAt: Date
}
```

### **Vendor Model**
```javascript
{
  userId: ObjectId (ref: User),
  storeName: String,
  description: String,
  address: String,
  phoneNumber: String,
  balance: Number (default: 0),
  createdAt: Date
}
```

### **Product Model**
```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String (Cloudinary URL),
  category: ObjectId (ref: Category),
  vendor: ObjectId (ref: Vendor),
  stock: Number,
  isFeatured: Boolean,
  createdAt: Date
}
```

### **Cart Model**
```javascript
{
  userId: ObjectId (ref: User),
  items: [
    {
      productId: ObjectId (ref: Product),
      quantity: Number,
      price: Number
    }
  ],
  createdAt: Date
}
```

### **Order Model**
```javascript
{
  userId: ObjectId (ref: User),
  items: [ProductId],
  totalPrice: Number,
  status: ["pending", "confirmed", "shipped", "delivered"],
  deliveryInfo: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String
  },
  createdAt: Date
}
```

---

##  Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - Bcrypt with salt rounds  
✅ **CORS Protection** - Restricted cross-origin requests  
✅ **Helmet Security** - Security HTTP headers  
✅ **Input Validation** - Zod schema validation  
✅ **Error Handling** - Centralized error middleware  
✅ **Protected Routes** - Role-based access control  
✅ **Image CDN** - Cloudinary for safe image storage  

---

##  Development Guidelines

### **Adding New Features**

1. **Backend Flow**
   ```
   Route → Middleware → Controller → Service → Model → Response
   ```

2. **Frontend Flow**
   ```
   Page/Component → API Call → State Update → Re-render
   ```

### **Best Practices**
- Use environment variables for sensitive data
- Validate all inputs on both client & server
- Handle errors gracefully with try-catch
- Use async/await for cleaner promises
- Comment complex logic
- Test API endpoints with Postman

---

##  Performance Optimization

- **Frontend**
  - Code splitting with Vite
  - Image optimization via Cloudinary
  - Lazy loading components with React
  - Memoization for expensive computations

- **Backend**
  - MongoDB indexing on frequently queried fields
  - Connection pooling with Mongoose
  - Caching strategies for products/categories
  - Pagination for large datasets

---

##  Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| CORS errors | Check `CORS_ORIGIN` in `.env` |
| MongoDB connection fails | Verify `MONGO_URI` and network access |
| Image upload fails | Confirm Cloudinary credentials |
| JWT token expired | Refresh token in localStorage |
| Port already in use | Change `PORT` in `.env` |

---

##  Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request


---

##  Contact & Support

For issues, questions, or contributions:
-  Email: rahafaast@gmail.com


---

**Built with ❤️ by the Tradify Team**