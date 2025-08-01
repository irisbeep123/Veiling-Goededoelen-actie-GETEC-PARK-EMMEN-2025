const express = require("express");
const Bid = require("../models/bid");
const router = express.Router();

// 🔁 verzamel hoogste biedingen per item
router.get("/bids", async (req, res) => {
  try {
    const bids = await Bid.aggregate([
      { $sort: { amount: -1 } },
      {
        $group: {
          _id: "$itemId",
          amount: { $first: "$amount" },
          name: { $first: "$name" }
        }
      }
    ]);

    const result = {};
    bids.forEach(b => result[b._id] = b);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fout bij ophalen biedingen" });
  }
});

// 📨 nieuwe bod toevoegen
router.post("/bid", async (req, res) => {
  const { itemId, amount, name, email } = req.body;

  console.log("📥 Ontvangen:", req.body); // 👉 voeg dit toe om te debuggen

  if (!itemId || !amount || !name || !email) {
    return res.status(400).json({ message: "Alle velden zijn verplicht." });
  }

  try {
    await Bid.create({ itemId, amount, name, email });
    res.status(200).json({ message: "✅ Bod opgeslagen" });
  } catch (error) {
    console.error("❌ Fout bij opslaan bod:", error);
    res.status(500).json({ message: "❌ Bod opslaan mislukt" });
  }
});

module.exports = router;
