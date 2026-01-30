const ProfileStrength = ({ strength }) => {
    const getColor = (level) => {
        switch (level) {
            case 'strong': return 'var(--success)';
            case 'completed': return 'var(--success)';
            case 'average': return 'var(--warning)';
            case 'in_progress': return 'var(--warning)';
            case 'draft': return 'var(--warning)';
            case 'weak': return 'var(--danger)';
            case 'not_started': return 'var(--danger)';
            default: return 'var(--text-muted)';
        }
    };

    const getLabel = (level) => {
        return level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="profile-strength">
            <h3>Profile Strength</h3>

            <div className="strength-meter">
                <div
                    className="strength-fill"
                    style={{ width: `${strength.overall}%` }}
                ></div>
                <span className="strength-value">{strength.overall}%</span>
            </div>

            <div className="strength-breakdown">
                <div className="strength-item">
                    <span className="item-label">Academics</span>
                    <span className="item-value" style={{ color: getColor(strength.academics) }}>
                        {getLabel(strength.academics)}
                    </span>
                </div>
                <div className="strength-item">
                    <span className="item-label">Exams</span>
                    <span className="item-value" style={{ color: getColor(strength.exams) }}>
                        {getLabel(strength.exams)}
                    </span>
                </div>
                <div className="strength-item">
                    <span className="item-label">SOP</span>
                    <span className="item-value" style={{ color: getColor(strength.sop) }}>
                        {getLabel(strength.sop)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProfileStrength;
