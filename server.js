const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
require("./db");

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Gebruik je router
app.use("/api", require("./routes/bid")); // <-- let op: routerbestand

// Start de server
const PORT = process.env.PORT || 5057;
app.listen(PORT, () => {
  console.log(`✅ Server draait op http://localhost:${PORT}`);
});
