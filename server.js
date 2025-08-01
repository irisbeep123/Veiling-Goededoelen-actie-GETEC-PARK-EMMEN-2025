const express = require("express");
const app = express();
const PORT = 5059;

app.use(express.json());
app.use(express.static("public")); // ✅ Deze regel is nu op de juiste plek

// Tijdelijke opslag van biedingen
const bids = {};

// API: biedingen ophalen
app.get("/api/bids", (req, res) => {
  res.json(bids);
});

// API: bod plaatsen
app.post("/api/bid", (req, res) => {
  const { itemId, amount, name, email } = req.body;

  if (!itemId || !amount || !name || !email) {
    return res.status(400).json({ message: "Vul alle velden in." });
  }

  if (!bids[itemId] || amount > bids[itemId].amount) {
    bids[itemId] = { amount, name, email };
    return res.json({ message: "Bod geplaatst!" });
  } else {
    return res.json({ message: "Er is al een hoger bod geplaatst." });
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`✅ Server draait op http://localhost:${PORT}`);
});
