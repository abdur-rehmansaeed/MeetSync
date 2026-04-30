const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { title, description, meeting, assignedTo, deadline } = req.body;

    if (!title || !assignedTo || assignedTo.length === 0 || !deadline) {
      return res.status(400).json({ message: 'Title, at least one Assignee, and deadline are required' });
    }

    const task = await Task.create({
      title,
      description,
      meeting: meeting ? meeting : null, 
      assignedTo,
      deadline,
      createdBy: req.user._id,
      status: 'Pending'
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: Failed to create task' });
  }
};

const getTasks = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'member') {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('meeting', 'title')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('meeting', 'title')
      .populate('createdBy', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'member' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'member') {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (req.body.status) {
        task.status = req.body.status;
      }
      await task.save();
    } else {
      Object.assign(task, req.body);
      await task.save();
    }

    const updated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('meeting', 'title')
      .populate('createdBy', 'name');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) 
    {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
