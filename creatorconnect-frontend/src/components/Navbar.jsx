import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { logoutUser } from '../api/authApi';
import styles from './Navbar.module.css';

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
        <nav className={styles.navbar}>
            <div className={styles["navbar-container"]}>
                <Link to="/dashboard" className={styles["navbar-logo"]}>
                    CreatorConnect
                </Link>

                <div className={styles["navbar-menu"]}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/my-assets" className={styles["create-asset-btn"]}>
                                <span>+</span> Create Asset
                            </Link>
                            <Link to="/my-assets" className={styles["navbar-link"]}>
                                My Assets
                            </Link>
                            <Link to="/chat" className={styles["navbar-link"]}>
                                Chat
                            </Link>
                            <div className={styles["navbar-user"]}>
                                <span className={styles["user-name"]}>{user?.name}</span>
                                <button onClick={handleLogout} className={styles["logout-button"]}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={styles["navbar-link"]}>
                                Login
                            </Link>
                            <Link to="/signup" className={styles["navbar-button"]}>
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
