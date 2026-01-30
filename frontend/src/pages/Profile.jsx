import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../api/axios';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Singapore', 'Switzerland'];
    const fields = ['Computer Science', 'Engineering', 'Business', 'Data Science', 'Medicine', 'Law', 'Arts', 'Physics', 'Mathematics'];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await getProfile();
            setProfile(data);
        } catch (err) {
            if (err.response?.status === 404) {
                navigate('/onboarding');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'preferredCountries') {
            const updated = checked
                ? [...profile.preferredCountries, value]
                : profile.preferredCountries.filter(c => c !== value);
            setProfile({ ...profile, preferredCountries: updated });
        } else {
            setProfile({ ...profile, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const submitData = { ...profile };
            if (submitData.gpa) submitData.gpa = parseFloat(submitData.gpa);
            if (submitData.ieltsScore) submitData.ieltsScore = parseFloat(submitData.ieltsScore);
            if (submitData.greScore) submitData.greScore = parseInt(submitData.greScore);

            await updateProfile(submitData);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading-screen"><div className="loader"></div></div>;
    }

    return (
        <div className="profile-page">
            <div className="page-header">
                <h1>⚙️ Profile Settings</h1>
                <p>Update your information to get better recommendations</p>
            </div>

            {message && (
                <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-section">
                    <h3>📚 Academic Background</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Education Level</label>
                            <select name="educationLevel" value={profile?.educationLevel || ''} onChange={handleChange}>
                                <option value="high_school">High School</option>
                                <option value="bachelors">Bachelor's</option>
                                <option value="masters">Master's</option>
                                <option value="phd">PhD</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Degree/Major</label>
                            <input
                                type="text"
                                name="degree"
                                value={profile?.degree || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Graduation Year</label>
                            <input
                                type="number"
                                name="graduationYear"
                                value={profile?.graduationYear || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>GPA (out of 10)</label>
                            <input
                                type="number"
                                name="gpa"
                                value={profile?.gpa || ''}
                                onChange={handleChange}
                                step="0.1"
                                min="0"
                                max="10"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>🎯 Study Goals</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Target Degree</label>
                            <select name="intendedDegree" value={profile?.intendedDegree || ''} onChange={handleChange}>
                                <option value="bachelors">Bachelor's</option>
                                <option value="masters">Master's</option>
                                <option value="mba">MBA</option>
                                <option value="phd">PhD</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Field of Study</label>
                            <select name="fieldOfStudy" value={profile?.fieldOfStudy || ''} onChange={handleChange}>
                                {fields.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Target Intake</label>
                            <select name="targetIntake" value={profile?.targetIntake || ''} onChange={handleChange}>
                                <option value="Fall 2025">Fall 2025</option>
                                <option value="Spring 2026">Spring 2026</option>
                                <option value="Fall 2026">Fall 2026</option>
                                <option value="Spring 2027">Spring 2027</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Preferred Countries</label>
                        <div className="checkbox-grid">
                            {countries.map(country => (
                                <label key={country} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        name="preferredCountries"
                                        value={country}
                                        checked={profile?.preferredCountries?.includes(country) || false}
                                        onChange={handleChange}
                                    />
                                    <span>{country}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>💰 Budget & Funding</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Annual Budget (USD)</label>
                            <select name="budgetRange" value={profile?.budgetRange || ''} onChange={handleChange}>
                                <option value="below_20k">Below $20,000</option>
                                <option value="20k_40k">$20,000 - $40,000</option>
                                <option value="40k_60k">$40,000 - $60,000</option>
                                <option value="above_60k">Above $60,000</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Funding Plan</label>
                            <select name="fundingPlan" value={profile?.fundingPlan || ''} onChange={handleChange}>
                                <option value="self_funded">Self-funded</option>
                                <option value="scholarship">Scholarship-dependent</option>
                                <option value="loan">Loan-dependent</option>
                                <option value="mixed">Mixed</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>📝 Exam Readiness</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>IELTS/TOEFL Status</label>
                            <select name="ieltsStatus" value={profile?.ieltsStatus || ''} onChange={handleChange}>
                                <option value="not_started">Not Started</option>
                                <option value="preparing">Preparing</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {profile?.ieltsStatus === 'completed' && (
                            <div className="form-group">
                                <label>IELTS Score</label>
                                <input
                                    type="number"
                                    name="ieltsScore"
                                    value={profile?.ieltsScore || ''}
                                    onChange={handleChange}
                                    step="0.5"
                                    min="0"
                                    max="9"
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>GRE/GMAT Status</label>
                            <select name="greStatus" value={profile?.greStatus || ''} onChange={handleChange}>
                                <option value="not_required">Not Required</option>
                                <option value="not_started">Not Started</option>
                                <option value="preparing">Preparing</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {profile?.greStatus === 'completed' && (
                            <div className="form-group">
                                <label>GRE Score</label>
                                <input
                                    type="number"
                                    name="greScore"
                                    value={profile?.greScore || ''}
                                    onChange={handleChange}
                                    min="260"
                                    max="340"
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>SOP Status</label>
                            <select name="sopStatus" value={profile?.sopStatus || ''} onChange={handleChange}>
                                <option value="not_started">Not Started</option>
                                <option value="draft">Draft Ready</option>
                                <option value="ready">Finalized</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
