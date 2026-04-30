const Meeting = require('../models/Meeting');

const createMeeting = async (req, res) => {
  try {
    const { title, date, attendees, notes, actionItems, decisions } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const meeting = await Meeting.create({
      title,
      date,
      attendees: attendees || [],
      notes: notes || '',
      actionItems: actionItems || [],
      decisions: decisions || [],
      createdBy: req.user._id,
    });

    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate('attendees', 'name email')
      .populate('createdBy', 'name')
      .sort({ date: -1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('attendees', 'name email')
      .populate('createdBy', 'name');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const updated = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('attendees', 'name email')
      .populate('createdBy', 'name');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meeting deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
};
