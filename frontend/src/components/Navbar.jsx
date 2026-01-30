import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🎓</span>
                    <span className="logo-text">AI Counsellor</span>
                </Link>

                <div className="navbar-links">
                    {user ? (
                        <>
                            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                                Dashboard
                            </Link>
                            {user.onboardingComplete && (
                                <>
                                    <Link to="/counsellor" className={`nav-link ${isActive('/counsellor') ? 'active' : ''}`}>
                                        AI Counsellor
                                    </Link>
                                    <Link to="/universities" className={`nav-link ${isActive('/universities') ? 'active' : ''}`}>
                                        Universities
                                    </Link>
                                    <Link to="/application" className={`nav-link ${isActive('/application') ? 'active' : ''}`}>
                                        Application
                                    </Link>
                                </>
                            )}
                            <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
                                Profile
                            </Link>
                        </>
                    ) : null}
                </div>

                <div className="navbar-actions">
                    <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    {user ? (
                        <div className="user-menu">
                            <span className="user-name">{user.name}</span>
                            <button onClick={handleLogout} className="btn btn-outline btn-sm">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                            <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
