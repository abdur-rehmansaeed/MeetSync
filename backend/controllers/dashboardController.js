const Meeting = require('../models/Meeting');
const Task = require('../models/Task');

const getAdminDashboard = async (req, res) => {
  try {
    const totalMeetings = await Meeting.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ status: 'Pending' });
    const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });

    const now = new Date();
    const overdueTasks = await Task.countDocuments({
      deadline: { $lt: now },
      status: { $ne: 'Completed' },
    });

    const recentMeetings = await Meeting.find()
      .populate('createdBy', 'name')
      .sort({ date: -1 })
      .limit(5);

    const recentTasks = await Task.find()
      .populate('assignedTo', 'name')
      .populate('meeting', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalMeetings,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      recentMeetings,
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMemberDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const myTasks = await Task.find({ assignedTo: userId })
      .populate('meeting', 'title')
      .sort({ createdAt: -1 });

    const totalTasks = myTasks.length;
    const completedTasks = myTasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = myTasks.filter(t => t.status === 'Pending').length;
    const inProgressTasks = myTasks.filter(t => t.status === 'In Progress').length;

    const now = new Date();
    const overdueTasks = myTasks.filter(
      t => new Date(t.deadline) < now && t.status !== 'Completed'
    ).length;

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      tasks: myTasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminDashboard, getMemberDashboard };
