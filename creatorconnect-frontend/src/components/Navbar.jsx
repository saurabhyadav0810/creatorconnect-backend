import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { logoutUser } from '../api/authApi';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            logout();
            navigate('/login');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-logo">
                    CreatorConnect
                </Link>

                <div className="navbar-menu">
                    {isAuthenticated ? (
                        <>
                            <Link to="/my-assets" className="create-asset-btn">
                                <span>+</span> Create Asset
                            </Link>
                            <Link to="/my-assets" className="navbar-link">
                                My Assets
                            </Link>
                            <div className="navbar-user">
                                <span className="user-name">{user?.name}</span>
                                <button onClick={handleLogout} className="logout-button">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">
                                Login
                            </Link>
                            <Link to="/signup" className="navbar-button">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
