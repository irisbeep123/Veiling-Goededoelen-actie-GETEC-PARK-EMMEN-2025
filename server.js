const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const dataPath = "./data/bids.json";

if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({}));
}

app.get("/api/bids", (req, res) => {
  const bids = JSON.parse(fs.readFileSync(dataPath));
  res.json(bids);
});

app.post("/api/bid", (req, res) => {
  const { itemId, amount, name, email } = req.body;
  const bids = JSON.parse(fs.readFileSync(dataPath));

  if (!bids[itemId] || amount > bids[itemId].amount) {
    bids[itemId] = {
      amount,
      name,
      email,
      time: new Date().toISOString()
    };
    fs.writeFileSync(dataPath, JSON.stringify(bids, null, 2));
    res.json({ success: true, message: "Bod geplaatst" });
  } else {
    res.json({ success: false, message: "Bod is lager dan huidig bod" });
  }
});

app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
