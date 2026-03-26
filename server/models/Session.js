import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  focusScoreAvg: { type: Number, default: 0 },
  events: [{
    type: { type: String, enum: ['away', 'drowsy', 'distracted', 'focused'], required: true },
    duration: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
