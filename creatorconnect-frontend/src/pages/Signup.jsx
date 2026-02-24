import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { initiateSignup, verifySignupOtp } from '../api/authApi';
import { useAuth } from '../context/useAuth';
import styles from './Auth.module.css';

const Signup = () => {
    const [step, setStep] = useState(1); // 1: email, 2: OTP verification
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        name: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await initiateSignup(formData.email);
            if (response.success) {
                setStep(2);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await verifySignupOtp({
                email: formData.email,
                otp: formData.otp,
                name: formData.name,
                password: formData.password,
                role: formData.role
            });
            
            if (response.success) {
                login(response.user);
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles["auth-container"]}>
            <div className={styles["auth-card"]}>
                <h2 className={styles["auth-title"]}>Create Account</h2>
                <p className={styles["auth-subtitle"]}>
                    {step === 1 ? 'Enter your email to get started' : 'Verify your email and complete signup'}
                </p>
                
                {step === 1 ? (
                    <form onSubmit={handleEmailSubmit} className={styles["auth-form"]}>
                        {error && (
                            <div className={styles["error-message"]}>
                                {error}
                            </div>
                        )}
                        
                        <div className={styles["form-group"]}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles["auth-button"]}
                            disabled={loading}
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className={styles["auth-form"]}>
                        {error && (
                            <div className={styles["error-message"]}>
                                {error}
                            </div>
                        )}
                        
                        <div className={styles["form-group"]}>
                            <label htmlFor="otp">OTP Code</label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                placeholder="Enter 6-digit OTP"
                                required
                                maxLength="6"
                            />
                            <small>Check your email for the OTP</small>
                        </div>

                        <div className={styles["form-group"]}>
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="user">User</option>
                                <option value="creator">Creator</option>
                            </select>
                        </div>

                        <div className={styles["form-group"]}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                                minLength="6"
                            />
                        </div>

                        <div className={styles["form-group"]}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                required
                                minLength="6"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles["auth-button"]}
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Complete Signup'}
                        </button>

                        <button 
                            type="button" 
                            className={styles["auth-button-secondary"]}
                            onClick={() => setStep(1)}
                        >
                            Back to Email
                        </button>
                    </form>
                )}

                <p className={styles["auth-footer"]}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
