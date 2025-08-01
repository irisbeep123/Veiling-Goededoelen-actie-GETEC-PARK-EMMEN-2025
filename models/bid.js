const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  amount: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bid", bidSchema);
