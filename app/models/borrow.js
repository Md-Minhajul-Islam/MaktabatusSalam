const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema({
  contact: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Borrow", borrowSchema);
