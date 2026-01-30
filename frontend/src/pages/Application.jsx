import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLockedUniversities, getTodos, updateTodo, deleteTodo, createTodo } from '../api/axios';
import TodoItem from '../components/TodoItem';

const Application = () => {
    const [lockedUniversities, setLockedUniversities] = useState([]);
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUni, setSelectedUni] = useState('all');
    const [newTask, setNewTask] = useState('');
    const [showAddTask, setShowAddTask] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [lockedRes, todosRes] = await Promise.all([
                getLockedUniversities(),
                getTodos()
            ]);
            setLockedUniversities(lockedRes.data);
            setTodos(todosRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTodo = async (id, completed) => {
        try {
            const { data: updatedTodo } = await updateTodo(id, { completed });

            setTodos(prev =>
                prev.map(t => (t._id === id ? updatedTodo : t))
            );
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

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const { data } = await createTodo({
                task: newTask,
                category: 'general',
                priority: 'medium',
                universityId: selectedUni !== 'all' ? selectedUni : undefined
            });
            setTodos([data, ...todos]);
            setNewTask('');
            setShowAddTask(false);
        } catch (err) {
            console.error('Error creating todo:', err);
        }
    };

    const filteredTodos = selectedUni === 'all'
        ? todos
        : todos.filter(t => t.universityId?._id === selectedUni);

    const completedCount = filteredTodos.filter(t => t.completed).length;
    const progress = filteredTodos.length > 0 ? (completedCount / filteredTodos.length) * 100 : 0;

    if (loading) {
        return <div className="loading-screen"><div className="loader"></div></div>;
    }

    if (lockedUniversities.length === 0) {
        return (
            <div className="application-page">
                <div className="locked-gate">
                    <div className="gate-icon">🔒</div>
                    <h2>Lock a University to Continue</h2>
                    <p>You need to lock at least one university to access application guidance and to-do lists.</p>
                    <p className="hint">Locking commits you to applying and unlocks personalized tasks.</p>
                    <Link to="/universities" className="btn btn-primary">
                        Go to Universities
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="application-page">
            <div className="page-header">
                <h1>📋 Application Guidance</h1>
                <p>Track your application progress for locked universities</p>
            </div>

            <div className="locked-universities">
                <h3>Locked Universities ({lockedUniversities.length})</h3>
                <div className="locked-list">
                    <button
                        className={`locked-chip ${selectedUni === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedUni('all')}
                    >
                        All
                    </button>
                    {lockedUniversities.map(item => (
                        <button
                            key={item._id}
                            className={`locked-chip ${selectedUni === item.universityId._id ? 'active' : ''}`}
                            onClick={() => setSelectedUni(item.universityId._id)}
                        >
                            {item.universityId.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="application-content">
                <div className="progress-section">
                    <div className="progress-header">
                        <h3>Progress</h3>
                        <span>{completedCount} of {filteredTodos.length} tasks completed</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="todos-section">
                    <div className="section-header">
                        <h3>Tasks</h3>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setShowAddTask(!showAddTask)}
                        >
                            + Add Task
                        </button>
                    </div>

                    {showAddTask && (
                        <form className="add-task-form" onSubmit={handleAddTask}>
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Enter task description..."
                                autoFocus
                            />
                            <button type="submit" className="btn btn-primary btn-sm">Add</button>
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddTask(false)}>Cancel</button>
                        </form>
                    )}

                    <div className="todos-list">
                        <div className="todo-category">
                            <h4>Pending ({filteredTodos.filter(t => !t.completed).length})</h4>
                            {filteredTodos.filter(t => !t.completed).map(todo => (
                                <TodoItem
                                    key={todo._id}
                                    todo={todo}
                                    onToggle={handleToggleTodo}
                                    onDelete={handleDeleteTodo}
                                />
                            ))}
                            {filteredTodos.filter(t => !t.completed).length === 0 && (
                                <p className="empty-text">All tasks completed! 🎉</p>
                            )}
                        </div>

                        <div className="todo-category completed">
                            <h4>Completed ({filteredTodos.filter(t => t.completed).length})</h4>
                            {filteredTodos.filter(t => t.completed).map(todo => (
                                <TodoItem
                                    key={todo._id}
                                    todo={todo}
                                    onToggle={handleToggleTodo}
                                    onDelete={handleDeleteTodo}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="documents-section">
                    <h3>📄 Required Documents</h3>
                    <div className="documents-grid">
                        <div className="document-item">
                            <span className="doc-icon">📝</span>
                            <span className="doc-name">Statement of Purpose (SOP)</span>
                        </div>
                        <div className="document-item">
                            <span className="doc-icon">📜</span>
                            <span className="doc-name">Academic Transcripts</span>
                        </div>
                        <div className="document-item">
                            <span className="doc-icon">✉️</span>
                            <span className="doc-name">Letters of Recommendation</span>
                        </div>
                        <div className="document-item">
                            <span className="doc-icon">📋</span>
                            <span className="doc-name">Resume/CV</span>
                        </div>
                        <div className="document-item">
                            <span className="doc-icon">🎓</span>
                            <span className="doc-name">Test Scores (IELTS/GRE)</span>
                        </div>
                        <div className="document-item">
                            <span className="doc-icon">🪪</span>
                            <span className="doc-name">Passport Copy</span>
                        </div>
                    </div>
                </div>

                <div className="timeline-section">
                    <h3>📅 Typical Timeline</h3>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <strong>12+ months before</strong>
                                <p>Research universities, take standardized tests</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <strong>6-9 months before</strong>
                                <p>Finalize shortlist, start SOP drafts</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <strong>3-6 months before</strong>
                                <p>Complete applications, request LORs</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <strong>2-3 months before</strong>
                                <p>Submit applications, pay fees</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <strong>After acceptance</strong>
                                <p>Visa application, accommodation, travel</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Application;
