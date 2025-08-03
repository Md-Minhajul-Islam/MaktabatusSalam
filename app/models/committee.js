const mongoose = require("mongoose");

const committeeSchema = new mongoose.Schema({
  committee: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Committee", committeeSchema);
