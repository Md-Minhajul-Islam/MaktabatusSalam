const mongoose = require("mongoose");

const borrowerSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  borrow: {
    type: String,
    required: true,
  },
  due: {
    type: String,
    required: true,
  },
  return: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Borrower", borrowerSchema);
