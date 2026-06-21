# LIFE WITH AI - Production Ready Educational Platform

## Features
- **Frontend**: Next.js 15, Tailwind CSS, TypeScript.
- **Backend**: Node.js, Express, MongoDB.
- **Authentication**: JWT & Bcrypt.
- **Payments**: Razorpay Standard Checkout.
- **Storage**: Cloudinary (Images & Videos).
- **Admin Panel**: Complete control over courses, PDFs, users, and coupons.
- **User Dashboard**: Track progress and access purchased content.

## Setup Instructions

### 1. Environment Variables
Ensure you have the following `.env` files:

**server/.env**
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=princerajpiyush84@gmail.com
ADMIN_PASSWORD=Prince@123
```

**client/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

### 2. Installation
Run the following command from the root directory:
```bash
npm run install:all
```

### 3. Running the App
Open two terminals:

**Terminal 1 (Backend)**
```bash
npm run start:server
```

**Terminal 2 (Frontend)**
```bash
npm run start:client
```

### 4. Default Admin
The admin account is automatically created on the first run using the credentials in `server/.env`.
Email: `princerajpiyush84@gmail.com`
Password: `Prince@123`

## Deployment
- **Frontend**: Deploy to Vercel (set Environment Variables).
- **Backend**: Deploy to Render/Heroku (set Environment Variables).
- **Database**: MongoDB Atlas.
