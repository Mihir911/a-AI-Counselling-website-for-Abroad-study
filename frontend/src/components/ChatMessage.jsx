const ChatMessage = ({ message, isUser }) => {
    // Format message with markdown-like styling
    const formatMessage = (text) => {
        if (!text) return '';

        // Bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Bullet points
        text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        // Numbered lists
        text = text.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
        // Line breaks
        text = text.replace(/\n/g, '<br>');

        return text;
    };

    return (
        <div className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
            <div className="message-avatar">
                {isUser ? '👤' : '🤖'}
            </div>
            <div className="message-content">
                <div
                    className="message-text"
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
                {message.actions && message.actions.length > 0 && (
                    <div className="message-actions">
                        {message.actions.map((action, idx) => (
                            <span key={idx} className={`action-badge ${action.success ? 'success' : 'failed'}`}>
                                {action.type === 'shortlist' && `✓ Added ${action.university} to shortlist`}
                                {action.type === 'todo' && `✓ Created task: ${action.task}`}
                                {action.type === 'lock' && `✓ University locked`}
                            </span>
                        ))}
                    </div>
                )}
                <span className="message-time">
                    {new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            </div>
        </div>
    );
};

export default ChatMessage;
