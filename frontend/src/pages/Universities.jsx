import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getUniversities,
    getRecommendations,
    getShortlist,
    addToShortlist,
    removeFromShortlist,
    lockUniversity,
    unlockUniversity
} from '../api/axios';
import UniversityCard from '../components/UniversityCard';

const Universities = () => {
    const { user, updateUser } = useAuth();
    const [view, setView] = useState('recommendations'); // recommendations | all | shortlist
    const [recommendations, setRecommendations] = useState({ dream: [], target: [], safe: [] });
    const [allUniversities, setAllUniversities] = useState([]);
    const [shortlist, setShortlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ country: '', maxTuition: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [recsRes, allRes, shortlistRes] = await Promise.all([
                getRecommendations(),
                getUniversities(),
                getShortlist()
            ]);
            setRecommendations(recsRes.data);
            setAllUniversities(allRes.data);
            setShortlist(shortlistRes.data);
        } catch (err) {
            console.error('Error fetching universities:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleShortlist = async (universityId, category) => {
        try {
            const { data } = await addToShortlist({ universityId, category });
            setShortlist([...shortlist, data]);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add to shortlist');
        }
    };

    const handleRemove = async (shortlistId) => {
        if (!window.confirm('Remove this university from shortlist?')) return;
        try {
            await removeFromShortlist(shortlistId);
            setShortlist(shortlist.filter(s => s._id !== shortlistId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to remove');
        }
    };

    const handleLock = async (shortlistId) => {
        if (!window.confirm('Lock this university? This will unlock application guidance for this university.')) return;
        try {
            const { data } = await lockUniversity(shortlistId);
            setShortlist(shortlist.map(s => s._id === shortlistId ? data : s));
            updateUser({ currentStage: 4 });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to lock');
        }
    };

    const handleUnlock = async (shortlistId) => {
        if (!window.confirm('Unlock this university? Your tasks and guidance will remain but may become outdated.')) return;
        try {
            const { data } = await unlockUniversity(shortlistId);
            setShortlist(shortlist.map(s => s._id === shortlistId ? data.shortlist : s));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to unlock');
        }
    };

    const isShortlisted = (universityId) => {
        return shortlist.some(s => s.universityId?._id === universityId);
    };

    const getShortlistItem = (universityId) => {
        return shortlist.find(s => s.universityId?._id === universityId);
    };

    const filteredUniversities = allUniversities.filter(uni => {
        if (filters.country && uni.country !== filters.country) return false;
        if (filters.maxTuition && uni.tuitionPerYear > parseInt(filters.maxTuition)) return false;
        return true;
    });

    const countries = [...new Set(allUniversities.map(u => u.country))];

    if (loading) {
        return <div className="loading-screen"><div className="loader"></div></div>;
    }

    return (
        <div className="universities-page">
            <div className="page-header">
                <h1>🎓 Universities</h1>
                <div className="view-tabs">
                    <button
                        className={`tab ${view === 'recommendations' ? 'active' : ''}`}
                        onClick={() => setView('recommendations')}
                    >
                        Recommendations
                    </button>
                    <button
                        className={`tab ${view === 'all' ? 'active' : ''}`}
                        onClick={() => setView('all')}
                    >
                        All Universities
                    </button>
                    <button
                        className={`tab ${view === 'shortlist' ? 'active' : ''}`}
                        onClick={() => setView('shortlist')}
                    >
                        My Shortlist ({shortlist.length})
                    </button>
                </div>
            </div>

            {view === 'recommendations' && (
                <div className="recommendations-view">
                    <p className="view-desc">
                        Based on your profile, here are universities categorized by your chances of admission.
                    </p>

                    {['dream', 'target', 'safe'].map(category => (
                        <div key={category} className={`category-section ${category}`}>
                            <h2 className="category-title">
                                {category === 'dream' && '🌟 Dream Universities'}
                                {category === 'target' && '🎯 Target Universities'}
                                {category === 'safe' && '✅ Safe Universities'}
                            </h2>
                            <p className="category-desc">
                                {category === 'dream' && 'Highly competitive. Lower admission probability but worth trying.'}
                                {category === 'target' && 'Good match for your profile. Moderate admission chances.'}
                                {category === 'safe' && 'High acceptance probability based on your credentials.'}
                            </p>
                            <div className="universities-grid">
                                {recommendations[category]?.length > 0 ? (
                                    recommendations[category].map(uni => {
                                        const shortlistItem = getShortlistItem(uni._id);
                                        return (
                                            <UniversityCard
                                                key={uni._id}
                                                university={uni}
                                                category={category}
                                                isShortlisted={!!shortlistItem}
                                                isLocked={shortlistItem?.locked}
                                                onShortlist={handleShortlist}
                                                onRemove={() => handleRemove(shortlistItem?._id)}
                                                onLock={() => handleLock(shortlistItem?._id)}
                                                onUnlock={() => handleUnlock(shortlistItem?._id)}
                                                fitReason={uni.fitReason}
                                                riskLevel={uni.riskLevel}
                                            />
                                        );
                                    })
                                ) : (
                                    <p className="empty-text">No {category} universities match your criteria.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {view === 'all' && (
                <div className="all-view">
                    <div className="filters">
                        <select
                            value={filters.country}
                            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                        >
                            <option value="">All Countries</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={filters.maxTuition}
                            onChange={(e) => setFilters({ ...filters, maxTuition: e.target.value })}
                        >
                            <option value="">Any Budget</option>
                            <option value="20000">Under $20,000</option>
                            <option value="40000">Under $40,000</option>
                            <option value="60000">Under $60,000</option>
                        </select>
                    </div>

                    <div className="universities-grid">
                        {filteredUniversities.map(uni => {
                            const shortlistItem = getShortlistItem(uni._id);
                            return (
                                <UniversityCard
                                    key={uni._id}
                                    university={uni}
                                    isShortlisted={!!shortlistItem}
                                    isLocked={shortlistItem?.locked}
                                    onShortlist={handleShortlist}
                                    onRemove={() => handleRemove(shortlistItem?._id)}
                                    onLock={() => handleLock(shortlistItem?._id)}
                                    onUnlock={() => handleUnlock(shortlistItem?._id)}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {view === 'shortlist' && (
                <div className="shortlist-view">
                    {shortlist.length > 0 ? (
                        <>
                            <div className="shortlist-summary">
                                <div className="summary-item">
                                    <span className="label">Total:</span>
                                    <span className="value">{shortlist.length}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">Locked:</span>
                                    <span className="value">{shortlist.filter(s => s.locked).length}</span>
                                </div>
                            </div>

                            <div className="universities-grid">
                                {shortlist.map(item => (
                                    <UniversityCard
                                        key={item._id}
                                        university={item.universityId}
                                        category={item.category}
                                        isShortlisted={true}
                                        isLocked={item.locked}
                                        onRemove={() => handleRemove(item._id)}
                                        onLock={() => handleLock(item._id)}
                                        onUnlock={() => handleUnlock(item._id)}
                                    />
                                ))}
                            </div>

                            {!shortlist.some(s => s.locked) && (
                                <div className="lock-prompt">
                                    <p>🔒 <strong>Lock at least one university</strong> to unlock application guidance and personalized to-do items.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state">
                            <h3>No universities shortlisted</h3>
                            <p>Add universities from recommendations or browse all universities.</p>
                            <button className="btn btn-primary" onClick={() => setView('recommendations')}>
                                View Recommendations
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Universities;
