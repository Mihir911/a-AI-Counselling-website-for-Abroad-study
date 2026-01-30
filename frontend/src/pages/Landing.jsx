import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="landing-page">
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">🚀 AI-Powered Study Abroad Guidance</div>
                    <h1 className="hero-title">
                        Your Personal <span className="gradient-text">AI Counsellor</span> for Study Abroad
                    </h1>
                    <p className="hero-subtitle">
                        Stop guessing. Start planning. Get personalized university recommendations,
                        clear action steps, and guided decision-making from profile to application.
                    </p>

                    <div className="hero-cta">
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary btn-lg">
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" className="btn btn-primary btn-lg">
                                    Get Started Free
                                </Link>
                                <Link to="/login" className="btn btn-outline btn-lg">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-value">20+</span>
                            <span className="stat-label">Universities</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">5+</span>
                            <span className="stat-label">Countries</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">AI</span>
                            <span className="stat-label">Powered</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="floating-card card-1">
                        <span className="card-icon">🎓</span>
                        <span>University Match</span>
                    </div>
                    <div className="floating-card card-2">
                        <span className="card-icon">🤖</span>
                        <span>AI Counsellor</span>
                    </div>
                    <div className="floating-card card-3">
                        <span className="card-icon">✅</span>
                        <span>Action Plan</span>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2 className="section-title">How It Works</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>1. Build Your Profile</h3>
                        <p>Complete a quick onboarding to tell us about your academics, goals, and preferences.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🤖</div>
                        <h3>2. Talk to AI Counsellor</h3>
                        <p>Get personalized advice, university recommendations, and clear explanations of your options.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>3. Shortlist & Compare</h3>
                        <p>Review Dream, Target, and Safe universities tailored to your profile and budget.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>4. Lock & Commit</h3>
                        <p>Lock your final choices to unlock detailed application guidance and to-do lists.</p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Start Your Journey?</h2>
                    <p>Join thousands of students making confident study-abroad decisions.</p>
                    {!user && (
                        <Link to="/signup" className="btn btn-primary btn-lg">
                            Create Free Account
                        </Link>
                    )}
                </div>
            </section>

            <footer className="footer">
                <p>© 2025 AI Counsellor. Built for hackathon demonstration.</p>
            </footer>
        </div>
    );
};

export default Landing;
