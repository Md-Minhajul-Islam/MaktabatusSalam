const mongoose = require("mongoose");

const latestNewsSchema = new mongoose.Schema({
  news: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LatestNews", latestNewsSchema);
