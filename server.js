const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./db"); // MongoDB connectie
const Bid = require('./models/bid');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// GET: haal alle biedingen op
app.get("/api/bids", async (req, res) => {
  try {
    const bids = await Bid.find().sort({ timestamp: -1 });
    res.json(bids);
  } catch (err) {
    console.error("Fout bij ophalen biedingen:", err);
    res.status(500).json({ error: "Serverfout" });
  }
});

// POST: nieuw bod plaatsen
app.post("/api/bid", async (req, res) => {
  const { amount, bidder } = req.body;

  if (!amount || !bidder) {
    return res.status(400).json({ error: "amount en bidder zijn verplicht" });
  }

  try {
    const newBid = new Bid({ amount, bidder });
    await newBid.save();
    res.status(201).json({ success: true, message: "✅ Bod opgeslagen", bid: newBid });
  } catch (err) {
    console.error("Fout bij opslaan bod:", err);
    res.status(500).json({ error: "Serverfout bij opslaan bod" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});
