const Todo = require('../models/Todo');

// @desc    Get all todos for user
// @route   GET /api/todos
exports.getTodos = async (req, res) => {
    try {
        const { universityId, completed } = req.query;
        let query = { userId: req.user._id };

        if (universityId) query.universityId = universityId;
        if (completed !== undefined) query.completed = completed === 'true';

        const todos = await Todo.find(query)
            .populate('universityId', 'name')
            .sort({ priority: -1, dueDate: 1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create todo
// @route   POST /api/todos
exports.createTodo = async (req, res) => {
    try {
        const todo = await Todo.create({
            userId: req.user._id,
            ...req.body
        });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
exports.updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // If marking as complete, set completedAt
        if (req.body.completed && !todo.completed) {
            req.body.completedAt = new Date();
        } else if (req.body.completed === false) {
            req.body.completedAt = null;
        }

        Object.assign(todo, req.body);
        await todo.save();

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
