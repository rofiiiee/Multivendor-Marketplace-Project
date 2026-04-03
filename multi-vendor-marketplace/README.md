
#  Multi-Vendor Marketplace API

This is the backend server for a **Multi-Vendor Marketplace** application, built with **Node.js**, **Express**, and **MongoDB**. It handles vendor management, product uploads, and complex order processing logic.

---

##  Features
* **Multi-Vendor System**: Separate logic for vendor registration and dashboard.
* **Product Management**: Vendors can upload and manage their own products.
* **Secure Authentication**: Implementation of JWT for secure access.
* **Clean Architecture**: Organized into Controllers, Models, Routes, and Services.

---

##  Tech Stack
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Mongoose)
* **Security**: Dotenv, JWT, Bcrypt
* **Tools**: Postman (for API testing)

---

##  How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rofiiiee/multivendor-project-backend.git

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

---

##  Project Structure
* `src/controllers`: Handles the request-response logic.
* `src/models`: Database schemas for Users, Products, and Vendors.
* `src/routes`: API endpoint definitions.
* `src/middlewares`: Security and validation functions.

