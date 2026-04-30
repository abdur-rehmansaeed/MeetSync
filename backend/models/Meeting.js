const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a meeting title'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please add a meeting date'],
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  notes: {
    type: String,
    default: '',
  },
  actionItems: [{
    text: { type: String, required: true },
  }],
  decisions: [{
    text: { type: String, required: true },
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Meeting', meetingSchema);
