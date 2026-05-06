# CMS Full Stack Application

A complete Content Management System with React frontend, Node.js backend, MongoDB database, and secure OTP authentication.

## Project Structure

```
cms-project/
├── cms-react-main/     # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/            # Node.js Backend
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── README.md
```

## Features

### ✅ **Authentication System**
- **Mobile OTP**: Real SMS verification via Twilio
- **Email Verification**: Secure email OTP verification
- **User ID Generation**: Automatic unique user identification
- **MongoDB Storage**: Persistent user data and OTP management

### ✅ **Security Features**
- OTP expiration (5 minutes)
- Secure API endpoints
- Input validation
- CORS protection

### ✅ **Tech Stack**
- **Frontend**: React, React Router, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **SMS**: Twilio API
- **Email**: Nodemailer (Gmail)

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- Git

### 1. Clone and Setup Backend

```bash
cd backend
npm install
# Configure .env file (see backend/README.md)
npm start
```

### 2. Setup Frontend

```bash
cd ../cms-react-main
npm install
# Configure .env file
npm start
```

### 3. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Environment Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/cms
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
JWT_SECRET=your_secret
PORT=5000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/send-mobile-otp` - Send SMS OTP
- `POST /api/auth/send-email-otp` - Send email OTP
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login with OTP
- `POST /api/auth/verify-email` - Verify email

## Development Workflow

1. **Backend**: Handles all authentication logic securely
2. **Database**: MongoDB stores users and temporary OTPs
3. **Frontend**: Clean UI that calls backend APIs
4. **SMS/Email**: Real services for production OTP delivery

## Production Deployment

### Backend Deployment
```bash
# Set production environment variables
# Deploy to Heroku, AWS, or your preferred platform
```

### Frontend Deployment
```bash
npm run build
# Deploy build folder to static hosting (Netlify, Vercel, etc.)
```

## Security Best Practices

- ✅ API keys stored securely on backend
- ✅ OTPs expire automatically
- ✅ Input validation on all endpoints
- ✅ HTTPS required for production
- ✅ Rate limiting recommended

## Troubleshooting

### Common Issues
- **MongoDB Connection**: Check connection string
- **Twilio SMS**: Verify account credentials
- **Email Sending**: Check Gmail app password
- **CORS Errors**: Configure CORS properly

### Development Mode
- SMS OTP logged to console when Twilio not configured
- Email OTP logged to console when email not configured

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - feel free to use this project for learning and development!
