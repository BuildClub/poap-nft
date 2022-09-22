const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventDescription: { type: String, required: true },
    eventUri: { type: String, required: true },
    eventImage: { type: String, required: true },
    email: { type: String, required: true },
    eventOwner: { type: String, default: '' },
    temporaryEventOwner: { type: String, required: true },
    ownerAddress: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
