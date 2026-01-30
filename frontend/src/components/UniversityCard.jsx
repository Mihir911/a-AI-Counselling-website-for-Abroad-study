const UniversityCard = ({
    university,
    category,
    isShortlisted,
    isLocked,
    onShortlist,
    onRemove,
    onLock,
    onUnlock,
    showActions = true,
    fitReason,
    riskLevel
}) => {
    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'dream': return 'var(--dream)';
            case 'target': return 'var(--target)';
            case 'safe': return 'var(--safe)';
            default: return 'var(--primary)';
        }
    };

    const getRiskBadge = (risk) => {
        const colors = { low: 'success', medium: 'warning', high: 'danger' };
        return <span className={`badge badge-${colors[risk] || 'secondary'}`}>{risk} risk</span>;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className={`university-card ${isLocked ? 'locked' : ''}`}>
            {isLocked && <div className="locked-badge">🔒 Locked</div>}

            <div className="card-header">
                <h3 className="uni-name">{university.name}</h3>
                {category && (
                    <span
                        className="category-badge"
                        style={{ backgroundColor: getCategoryColor(category) }}
                    >
                        {category}
                    </span>
                )}
            </div>

            <div className="card-details">
                <div className="detail-row">
                    <span className="detail-icon">📍</span>
                    <span>{university.city}, {university.country}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-icon">🏆</span>
                    <span>Rank #{university.ranking || 'N/A'}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-icon">💰</span>
                    <span>{formatCurrency(university.tuitionPerYear)}/year</span>
                </div>
                <div className="detail-row">
                    <span className="detail-icon">📊</span>
                    <span>{university.acceptanceRate}% acceptance</span>
                </div>
            </div>

            {fitReason && (
                <div className="fit-reason">
                    <p>{fitReason}</p>
                    {riskLevel && getRiskBadge(riskLevel)}
                </div>
            )}

            {university.programs && (
                <div className="programs">
                    {university.programs.slice(0, 3).map(p => (
                        <span key={p} className="program-tag">{p}</span>
                    ))}
                    {university.programs.length > 3 && (
                        <span className="program-tag more">+{university.programs.length - 3}</span>
                    )}
                </div>
            )}

            {showActions && (
                <div className="card-actions">
                    {!isShortlisted ? (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onShortlist && onShortlist(university._id, category || 'target')}
                        >
                            + Shortlist
                        </button>
                    ) : isLocked ? (
                        <button
                            className="btn btn-outline btn-sm btn-danger"
                            onClick={() => onUnlock && onUnlock()}
                        >
                            🔓 Unlock
                        </button>
                    ) : (
                        <>
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => onLock && onLock()}
                            >
                                🔒 Lock
                            </button>
                            <button
                                className="btn btn-outline btn-sm btn-danger"
                                onClick={() => onRemove && onRemove()}
                            >
                                Remove
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default UniversityCard;
