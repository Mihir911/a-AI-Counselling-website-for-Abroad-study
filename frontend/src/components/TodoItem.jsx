const TodoItem = ({ todo, onToggle, onDelete }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'var(--danger)';
            case 'medium': return 'var(--warning)';
            case 'low': return 'var(--success)';
            default: return 'var(--text-muted)';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'document': return '📄';
            case 'exam': return '📝';
            case 'application': return '📋';
            default: return '✅';
        }
    };

    const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <button
                className={`todo-finish-btn ${todo.completed ? 'done' : ''}`}
                onClick={() => onToggle(todo._id, !todo.completed)}
                title={todo.completed ? 'Mark as pending' : 'Mark as completed'}
            >
                {todo.completed ? '✓ Completed' : 'Finish'}
            </button>

            <div className="todo-content">
                <span className="todo-icon">{getCategoryIcon(todo.category)}</span>
                <span className="todo-task">{todo.task}</span>
            </div>

            <div className="todo-meta">
                <span
                    className="todo-priority"
                    style={{ color: getPriorityColor(todo.priority) }}
                >
                    {todo.priority}
                </span>
                {todo.dueDate && (
                    <span className="todo-due">{formatDate(todo.dueDate)}</span>
                )}
                {todo.universityId?.name && (
                    <span className="todo-uni">{todo.universityId.name}</span>
                )}
            </div>

            <button
                className="todo-delete"
                onClick={() => onDelete(todo._id)}
                title="Delete"
            >
                ×
            </button>
        </div>
    );
};

export default TodoItem;
