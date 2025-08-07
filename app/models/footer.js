const mongoose = require("mongoose");

const footerSchema = new mongoose.Schema({
  address: {
    type: String,
  },
  mail: {
    type: String,
  },
  phone: {
    type: String,
  },
  facebook: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Footer", footerSchema);
