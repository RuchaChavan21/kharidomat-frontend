# CampusRent Frontend

A modern React application for campus item rental and booking.

## Project Structure

```
src/
│
├── assets/              → Images, logos, etc.
├── components/          → Reusable components (Navbar, Footer, ItemCard)
├── pages/               → Page-level components
│   ├── Home.jsx         → Landing page
│   ├── Login.jsx        → User login
│   ├── Register.jsx     → User registration
│   ├── ForgotPassword.jsx → Password reset flow - Step 1
│   ├── VerifyOtp.jsx    → Password reset flow - Step 2
│   ├── ResetPassword.jsx → Password reset flow - Step 3
│   ├── Dashboard.jsx    → User dashboard
│   ├── Items.jsx        → Browse items
│   ├── PostItem.jsx     → Add new item
│   ├── BookItem.jsx     → Book an item
│   └── About.jsx        → About page
├── context/             → Global state (AuthContext)
├── App.jsx              → Main app with routes
├── main.jsx             → Entry point
└── index.css            → Tailwind styles
```

## Features

### Authentication Flow
- **Login/Register**: Standard user authentication
- **Forgot Password Flow**:
  1. **ForgotPassword.jsx**: User enters email to receive OTP
  2. **VerifyOtp.jsx**: User enters 6-digit OTP for verification
  3. **ResetPassword.jsx**: User sets new password with strength validation

### API Endpoints Used
- `POST /api/auth/send-otp` - Send OTP to user email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password with new password

### UI Features
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Password strength indicator
- Loading states and error handling
- Form validation and user feedback


