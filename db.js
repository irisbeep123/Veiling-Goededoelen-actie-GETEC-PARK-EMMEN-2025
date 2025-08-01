require('dotenv').config();  // **Dit moet bovenaan staan**
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('❌ MONGO_URI niet gevonden! Check je .env bestand.');
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log('✅ Verbonden met MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

module.exports = mongoose;
console.log('MONGO_URI is:', process.env.MONGO_URI);
