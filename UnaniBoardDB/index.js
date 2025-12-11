const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // লোকাল পিসিতে .env ফাইল পড়ার জন্য

const app = express();

// ==============================================
// 1. PORT CONFIGURATION (Render-এর জন্য খুবই জরুরি)
// ==============================================
const port = process.env.PORT || 5000;

// Middleware (JSON ডাটা বোঝার জন্য)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// আপনার প্রজেক্টের সব ফাইল (html, css) দেখানোর জন্য
app.use(express.static(__dirname));

// ==============================================
// 2. MONGODB CONNECTION
// ==============================================
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error("⚠️ Error: MONGO_URI not found! Check Render Environment Variables.");
} else {
    mongoose.connect(mongoUri)
        .then(() => console.log("✅ MongoDB Connected Successfully"))
        .catch(err => console.error("❌ MongoDB Connection Error:", err));
}

// ==============================================
// 3. ROUTES
// ==============================================
// হোম পেজ লোড হলে index.html দেখাবে
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// টেস্ট রুট (API চেক করার জন্য)
app.get('/api/test', (req, res) => {
    res.json({ message: "Server is working properly!" });
});

// ==============================================
// 4. START SERVER
// ==============================================
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});