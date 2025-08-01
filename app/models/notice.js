const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  notice: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notice", noticeSchema);
