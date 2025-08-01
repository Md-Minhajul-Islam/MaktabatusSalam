const mongoose = require("mongoose");

const newsEventsPhotoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
  photoId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("NewsEventsPhoto", newsEventsPhotoSchema);
