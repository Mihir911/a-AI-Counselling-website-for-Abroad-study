import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProfile } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { updateUser } = useAuth();

    const [formData, setFormData] = useState({
        // Academic
        educationLevel: '',
        degree: '',
        graduationYear: new Date().getFullYear(),
        gpa: '',
        // Goals
        intendedDegree: '',
        fieldOfStudy: '',
        targetIntake: '',
        preferredCountries: [],
        // Budget
        budgetRange: '',
        fundingPlan: '',
        // Exams
        ieltsStatus: 'not_started',
        ieltsScore: '',
        greStatus: 'not_started',
        greScore: '',
        sopStatus: 'not_started'
    });

    const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Singapore', 'Switzerland'];
    const fields = ['Computer Science', 'Engineering', 'Business', 'Data Science', 'Medicine', 'Law', 'Arts', 'Physics', 'Mathematics'];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'preferredCountries') {
            const updated = checked
                ? [...formData.preferredCountries, value]
                : formData.preferredCountries.filter(c => c !== value);
            setFormData({ ...formData, preferredCountries: updated });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateStep = () => {
        switch (step) {
            case 1:
                return formData.educationLevel && formData.degree && formData.graduationYear;
            case 2:
                return formData.intendedDegree && formData.fieldOfStudy && formData.targetIntake && formData.preferredCountries.length > 0;
            case 3:
                return formData.budgetRange && formData.fundingPlan;
            case 4:
                return true;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (!validateStep()) {
            setError('Please fill all required fields');
            return;
        }
        setError('');
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const submitData = { ...formData };
            if (submitData.gpa) submitData.gpa = parseFloat(submitData.gpa);
            if (submitData.ieltsScore) submitData.ieltsScore = parseFloat(submitData.ieltsScore);
            if (submitData.greScore) submitData.greScore = parseInt(submitData.greScore);

            await createProfile(submitData);
            updateUser({ onboardingComplete: true, currentStage: 2 });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="onboarding-step">
                        <h2>📚 Academic Background</h2>
                        <p className="step-desc">Tell us about your education</p>

                        <div className="form-group">
                            <label>Current Education Level *</label>
                            <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} required>
                                <option value="">Select...</option>
                                <option value="high_school">High School</option>
                                <option value="bachelors">Bachelor's Degree</option>
                                <option value="masters">Master's Degree</option>
                                <option value="phd">PhD</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Your Degree/Major *</label>
                            <input
                                type="text"
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                placeholder="e.g., Computer Science, Mechanical Engineering"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Graduation Year *</label>
                                <input
                                    type="number"
                                    name="graduationYear"
                                    value={formData.graduationYear}
                                    onChange={handleChange}
                                    min="2000"
                                    max="2030"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>GPA (out of 10)</label>
                                <input
                                    type="number"
                                    name="gpa"
                                    value={formData.gpa}
                                    onChange={handleChange}
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    placeholder="e.g., 8.5"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="onboarding-step">
                        <h2>🎯 Study Goals</h2>
                        <p className="step-desc">What do you want to achieve?</p>

                        <div className="form-group">
                            <label>Target Degree *</label>
                            <select name="intendedDegree" value={formData.intendedDegree} onChange={handleChange} required>
                                <option value="">Select...</option>
                                <option value="bachelors">Bachelor's</option>
                                <option value="masters">Master's</option>
                                <option value="mba">MBA</option>
                                <option value="phd">PhD</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Field of Study *</label>
                            <select name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} required>
                                <option value="">Select...</option>
                                {fields.map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Target Intake *</label>
                            <select name="targetIntake" value={formData.targetIntake} onChange={handleChange} required>
                                <option value="">Select...</option>
                                <option value="Fall 2025">Fall 2025</option>
                                <option value="Spring 2026">Spring 2026</option>
                                <option value="Fall 2026">Fall 2026</option>
                                <option value="Spring 2027">Spring 2027</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Preferred Countries * (select at least one)</label>
                            <div className="checkbox-grid">
                                {countries.map(country => (
                                    <label key={country} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            name="preferredCountries"
                                            value={country}
                                            checked={formData.preferredCountries.includes(country)}
                                            onChange={handleChange}
                                        />
                                        <span>{country}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="onboarding-step">
                        <h2>💰 Budget & Funding</h2>
                        <p className="step-desc">What's your financial plan?</p>

                        <div className="form-group">
                            <label>Annual Budget (USD) *</label>
                            <select name="budgetRange" value={formData.budgetRange} onChange={handleChange} required>
                                <option value="">Select...</option>
                                <option value="below_20k">Below $20,000</option>
                                <option value="20k_40k">$20,000 - $40,000</option>
                                <option value="40k_60k">$40,000 - $60,000</option>
                                <option value="above_60k">Above $60,000</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Funding Plan *</label>
                            <select name="fundingPlan" value={formData.fundingPlan} onChange={handleChange} required>
                                <option value="">Select...</option>
                                <option value="self_funded">Self-funded</option>
                                <option value="scholarship">Scholarship-dependent</option>
                                <option value="loan">Loan-dependent</option>
                                <option value="mixed">Mixed (Multiple sources)</option>
                            </select>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="onboarding-step">
                        <h2>📝 Exam Readiness</h2>
                        <p className="step-desc">Where are you with standardized tests?</p>

                        <div className="form-group">
                            <label>IELTS/TOEFL Status</label>
                            <select name="ieltsStatus" value={formData.ieltsStatus} onChange={handleChange}>
                                <option value="not_started">Not Started</option>
                                <option value="preparing">Preparing</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {formData.ieltsStatus === 'completed' && (
                            <div className="form-group">
                                <label>IELTS Score</label>
                                <input
                                    type="number"
                                    name="ieltsScore"
                                    value={formData.ieltsScore}
                                    onChange={handleChange}
                                    min="0"
                                    max="9"
                                    step="0.5"
                                    placeholder="e.g., 7.5"
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>GRE/GMAT Status</label>
                            <select name="greStatus" value={formData.greStatus} onChange={handleChange}>
                                <option value="not_required">Not Required</option>
                                <option value="not_started">Not Started</option>
                                <option value="preparing">Preparing</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {formData.greStatus === 'completed' && (
                            <div className="form-group">
                                <label>GRE Score</label>
                                <input
                                    type="number"
                                    name="greScore"
                                    value={formData.greScore}
                                    onChange={handleChange}
                                    min="260"
                                    max="340"
                                    placeholder="e.g., 320"
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Statement of Purpose (SOP)</label>
                            <select name="sopStatus" value={formData.sopStatus} onChange={handleChange}>
                                <option value="not_started">Not Started</option>
                                <option value="draft">Draft Ready</option>
                                <option value="ready">Finalized</option>
                            </select>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="onboarding-page">
            <div className="onboarding-container">
                <div className="onboarding-progress">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
                    </div>
                    <div className="progress-steps">
                        <span className={step >= 1 ? 'active' : ''}>Academic</span>
                        <span className={step >= 2 ? 'active' : ''}>Goals</span>
                        <span className={step >= 3 ? 'active' : ''}>Budget</span>
                        <span className={step >= 4 ? 'active' : ''}>Exams</span>
                    </div>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {renderStep()}

                <div className="onboarding-actions">
                    {step > 1 && (
                        <button className="btn btn-outline" onClick={prevStep}>
                            ← Back
                        </button>
                    )}
                    {step < 4 ? (
                        <button className="btn btn-primary" onClick={nextStep}>
                            Continue →
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Saving...' : 'Complete Setup ✓'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
