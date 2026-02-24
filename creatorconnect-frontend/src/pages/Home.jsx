import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles["home-container"]}>
            <div className={styles["hero-section"]}>
                <div className={styles["hero-content"]}>
                    <h1 className={styles["hero-title"]}>Welcome to CreatorConnect</h1>
                    <p className={styles["hero-subtitle"]}>
                        Connect with creators and discover amazing content
                    </p>
                    <div className={styles["hero-buttons"]}>
                        <Link to="/signup" className={`${styles.btn} ${styles["btn-primary"]}`}>
                            Get Started
                        </Link>
                        <Link to="/login" className={`${styles.btn} ${styles["btn-secondary"]}`}>
                            Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* <div className="features-section">
                <h2 className="section-title">Why Choose CreatorConnect?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>For Creators</h3>
                        <p>Showcase your work and connect with your audience</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">👥</div>
                        <h3>For Users</h3>
                        <p>Discover and support your favorite creators</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Secure</h3>
                        <p>Your data is protected with industry-standard security</p>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default Home;
