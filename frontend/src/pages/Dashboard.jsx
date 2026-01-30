import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, getProfileStrength, getShortlist, getTodos, updateTodo, deleteTodo } from '../api/axios';
import StageIndicator from '../components/StageIndicator';
import ProfileStrength from '../components/ProfileStrength';
import TodoItem from '../components/TodoItem';

const Dashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [strength, setStrength] = useState(null);
    const [shortlist, setShortlist] = useState([]);
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profileRes, strengthRes, shortlistRes, todosRes] = await Promise.all([
                getProfile(),
                getProfileStrength(),
                getShortlist(),
                getTodos()
            ]);
            setProfile(profileRes.data);
            setStrength(strengthRes.data);
            setShortlist(shortlistRes.data);
            setTodos(todosRes.data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTodo = async (id, completed) => {
        try {
            await updateTodo(id, { completed });
            setTodos(todos.map(t => t._id === id ? { ...t, completed, completedAt: completed ? new Date() : null } : t));
        } catch (err) {
            console.error('Error updating todo:', err);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id);
            setTodos(todos.filter(t => t._id !== id));
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    };

    const getStageDescription = (stage) => {
        const descriptions = {
            1: "Complete your profile to get personalized recommendations",
            2: "Explore universities and talk to AI Counsellor",
            3: "Finalize your university shortlist",
            4: "Prepare your applications"
        };
        return descriptions[stage] || "";
    };

    const getNextAction = () => {
        if (!user?.onboardingComplete) {
            return { text: "Complete Onboarding", link: "/onboarding", icon: "📝" };
        }
        if (shortlist.length === 0) {
            return { text: "Explore Universities", link: "/universities", icon: "🔍" };
        }
        if (!shortlist.some(s => s.locked)) {
            return { text: "Lock a University", link: "/universities", icon: "🔒" };
        }
        return { text: "View Applications", link: "/application", icon: "📋" };
    };

    if (loading) {
        return <div className="loading-screen"><div className="loader"></div></div>;
    }

    const lockedCount = shortlist.filter(s => s.locked).length;
    const nextAction = getNextAction();

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                    <p className="stage-desc">{getStageDescription(user?.currentStage)}</p>
                </div>
                <StageIndicator currentStage={user?.currentStage || 1} />
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-main">
                    {/* Quick Actions */}
                    <div className="card quick-actions">
                        <h3>Quick Actions</h3>
                        <div className="action-buttons">
                            <Link to={nextAction.link} className="action-btn primary">
                                <span className="action-icon">{nextAction.icon}</span>
                                <span>{nextAction.text}</span>
                            </Link>
                            <Link to="/counsellor" className="action-btn">
                                <span className="action-icon">🤖</span>
                                <span>Talk to AI</span>
                            </Link>
                            <Link to="/profile" className="action-btn">
                                <span className="action-icon">⚙️</span>
                                <span>Edit Profile</span>
                            </Link>
                        </div>
                    </div>

                    {/* Profile Summary */}
                    <div className="card profile-summary">
                        <h3>Your Profile</h3>
                        <div className="profile-grid">
                            <div className="profile-item">
                                <span className="item-label">Education</span>
                                <span className="item-value">{profile?.educationLevel?.replace('_', ' ')} - {profile?.degree}</span>
                            </div>
                            <div className="profile-item">
                                <span className="item-label">Target</span>
                                <span className="item-value">{profile?.intendedDegree} in {profile?.fieldOfStudy}</span>
                            </div>
                            <div className="profile-item">
                                <span className="item-label">Intake</span>
                                <span className="item-value">{profile?.targetIntake}</span>
                            </div>
                            <div className="profile-item">
                                <span className="item-label">Countries</span>
                                <span className="item-value">{profile?.preferredCountries?.join(', ')}</span>
                            </div>
                            <div className="profile-item">
                                <span className="item-label">Budget</span>
                                <span className="item-value">{profile?.budgetRange?.replace(/_/g, ' - $').replace('below', 'Below $').replace('above', 'Above $')}</span>
                            </div>
                            <div className="profile-item">
                                <span className="item-label">GPA</span>
                                <span className="item-value">{profile?.gpa || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shortlist Summary */}
                    <div className="card shortlist-summary">
                        <div className="card-header-row">
                            <h3>Shortlisted Universities</h3>
                            <Link to="/universities" className="link-btn">View All →</Link>
                        </div>
                        {shortlist.length > 0 ? (
                            <div className="shortlist-preview">
                                {shortlist.slice(0, 3).map(item => (
                                    <div key={item._id} className={`shortlist-item ${item.locked ? 'locked' : ''}`}>
                                        <span className="uni-name">{item.universityId?.name}</span>
                                        <span className={`category-tag ${item.category}`}>{item.category}</span>
                                        {item.locked && <span className="lock-icon">🔒</span>}
                                    </div>
                                ))}
                                {shortlist.length > 3 && (
                                    <p className="more-link">+{shortlist.length - 3} more</p>
                                )}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No universities shortlisted yet</p>
                                <Link to="/universities" className="btn btn-primary btn-sm">Explore Universities</Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="dashboard-sidebar">
                    {/* Profile Strength */}
                    {strength && <ProfileStrength strength={strength} />}

                    {/* Stats */}
                    <div className="card stats-card">
                        <h3>Stats</h3>
                        <div className="stat-item">
                            <span className="stat-value">{shortlist.length}</span>
                            <span className="stat-label">Shortlisted</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{lockedCount}</span>
                            <span className="stat-label">Locked</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{todos.filter(t => !t.completed).length}</span>
                            <span className="stat-label">Pending Tasks</span>
                        </div>
                    </div>

                    {/* To-Do List */}
                    <div className="card todo-card">
                        <div className="card-header-row">
                            <h3>To-Do List</h3>
                            <span className="todo-count">{todos.filter(t => !t.completed).length} pending</span>
                        </div>
                        <div className="todo-list">
                            {todos.slice(0, 5).map(todo => (
                                <TodoItem
                                    key={todo._id}
                                    todo={todo}
                                    onToggle={handleToggleTodo}
                                    onDelete={handleDeleteTodo}
                                />
                            ))}
                            {todos.length === 0 && (
                                <p className="empty-text">No tasks yet. Lock a university to generate tasks.</p>
                            )}
                            {todos.length > 5 && (
                                <Link to="/application" className="link-btn">View all tasks →</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
