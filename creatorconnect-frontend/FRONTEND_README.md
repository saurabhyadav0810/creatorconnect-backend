# CreatorConnect Frontend

A React-based frontend application for CreatorConnect platform that enables authentication and user management with OTP verification.

## Features

- **User Authentication** with OTP verification
- **Login/Signup** flows
- **Protected Routes** for authenticated users
- **Dashboard** for user management
- **Responsive Design** with modern UI
- **Role-based Access** (User/Creator)

## Tech Stack

- React 19
- React Router DOM
- Axios for API calls
- Vite for build tooling
- CSS3 for styling

## Project Structure

```
src/
├── api/
│   ├── axiosInstance.js    # Axios configuration
│   └── authApi.js           # Authentication API functions
├── components/
│   ├── Layout.jsx           # Main layout wrapper
│   ├── Navbar.jsx           # Navigation bar
│   └── ProtectedRoute.jsx   # Route protection HOC
├── context/
│   └── AuthContext.jsx      # Authentication context
├── pages/
│   ├── Home.jsx             # Landing page
│   ├── Login.jsx            # Login page
│   ├── Signup.jsx           # Signup with OTP
│   └── Dashboard.jsx        # User dashboard
├── routes/
│   └── protectedRoutes.jsx  # Protected route configurations
├── App.jsx                  # Main app component
└── main.jsx                 # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (default: http://localhost:3000)

### Installation

1. Navigate to the frontend directory:
```bash
cd creatorconnect-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoint:
   - The API baseURL is configured in `src/api/axiosInstance.js`
   - Default is set to `http://localhost:3000/api`
   - Modify if your backend runs on a different port

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173` (Vite default port)

### Build for Production

```bash
npm run build
```

The optimized build will be created in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Authentication Flow

### Signup Process

1. User enters email on signup page
2. System sends OTP to the email
3. User receives OTP and enters it along with:
   - Full name
   - Password
   - Role (User/Creator)
4. Upon verification, user is logged in and redirected to dashboard

### Login Process

1. User enters email and password
2. System validates credentials
3. Upon success, user is redirected to dashboard

## API Endpoints Used

- `POST /api/auth/signup/initiate` - Send OTP for signup
- `POST /api/auth/signup/verify` - Verify OTP and complete signup
- `POST /api/auth/login` - Login user

## Pages

### Home (`/`)
- Landing page with features showcase
- Call-to-action buttons for Login/Signup

### Login (`/login`)
- Email and password authentication
- Link to signup page

### Signup (`/signup`)
- Two-step process:
  1. Email verification with OTP
  2. Complete profile with name, password, and role

### Dashboard (`/dashboard`) - Protected
- User profile information
- Quick action buttons
- Creator-specific tools (for creator role)

## Components

### Layout
Provides consistent structure with navigation bar across all pages.

### Navbar
- Dynamic navigation based on authentication state
- Shows user name when logged in
- Login/Signup buttons for guests
- Logout functionality

### ProtectedRoute
Higher-order component that:
- Checks authentication status
- Redirects to login if not authenticated
- Shows loading state during auth check

## Context

### AuthContext
Manages global authentication state:
- `user` - Current user data
- `isAuthenticated` - Authentication status
- `loading` - Loading state
- `login()` - Set user as logged in
- `logout()` - Clear user session
- `checkAuth()` - Verify authentication status

## Styling

The app uses CSS modules and custom CSS files:
- Gradient purple theme (#667eea to #764ba2)
- Responsive design for mobile and desktop
- Modern card-based layouts
- Smooth transitions and hover effects

## Configuration

### Axios Instance
Located in `src/api/axiosInstance.js`:
- Automatic cookie handling with `withCredentials: true`
- Request/Response interceptors
- Automatic redirect to login on 401 errors

## Best Practices Implemented

- Component-based architecture
- Centralized API calls
- Global state management with Context API
- Protected routes for authentication
- Error handling and user feedback
- Loading states for async operations
- Responsive and accessible UI

## Future Enhancements

- [ ] Add profile editing functionality
- [ ] Implement messaging system
- [ ] Add notifications
- [ ] Creator-specific features
- [ ] File upload for profile pictures
- [ ] Password reset functionality
- [ ] Email verification for profile changes

## Troubleshooting

### CORS Issues
Ensure backend has CORS enabled for the frontend origin:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Authentication Not Persisting
- Check cookie settings in backend
- Verify `withCredentials: true` in axios
- Ensure cookies are not blocked by browser

### API Connection Failed
- Verify backend is running
- Check baseURL in `axiosInstance.js`
- Ensure correct port in backend server

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT License

---

Built with ❤️ using React and Vite
