const mongoose = require("mongoose");

const quranicVerseSchema = new mongoose.Schema({
  verseNum: {
    type: String,
    required: true,
    unique: true,
  },
  verse: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QuranicVerse", quranicVerseSchema);
