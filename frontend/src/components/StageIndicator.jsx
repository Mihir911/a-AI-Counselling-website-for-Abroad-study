const StageIndicator = ({ currentStage }) => {
    const stages = [
        { num: 1, label: 'Profile', icon: '📝' },
        { num: 2, label: 'Discover', icon: '🔍' },
        { num: 3, label: 'Finalize', icon: '✅' },
        { num: 4, label: 'Apply', icon: '📤' }
    ];

    return (
        <div className="stage-indicator">
            <div className="stage-track">
                {stages.map((stage, idx) => (
                    <div key={stage.num} className="stage-item-wrapper">
                        <div
                            className={`stage-item ${currentStage >= stage.num ? 'completed' : ''} ${currentStage === stage.num ? 'current' : ''}`}
                        >
                            <div className="stage-icon">{stage.icon}</div>
                            <div className="stage-num">{stage.num}</div>
                        </div>
                        <div className="stage-label">{stage.label}</div>
                        {idx < stages.length - 1 && (
                            <div className={`stage-connector ${currentStage > stage.num ? 'completed' : ''}`}></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StageIndicator;
