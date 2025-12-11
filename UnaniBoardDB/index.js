const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // HTML ফাইল দেখানোর জন্য

// 1. MongoDB কানেকশন
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error("⚠️ Error: MONGO_URI not found!");
} else {
    mongoose.connect(mongoUri)
        .then(() => console.log("✅ MongoDB Connected Successfully"))
        .catch(err => console.error("❌ MongoDB Connection Error:", err));
}

// 2. অফিসার স্কিমা এবং মডেল (ডাটাবেসের গঠন)
const officerSchema = new mongoose.Schema({
    name: String,
    position: String,
    city: String,
    salary: Number
});

const Officer = mongoose.model('Officer', officerSchema);

// 3. রাউটস (Routes) - এখানেই সব কাজ হয়

// হোম পেজ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// অফিসার তৈরি করা (POST)
app.post('/officers', async (req, res) => {
    try {
        const newOfficer = new Officer(req.body);
        const savedOfficer = await newOfficer.save();
        res.json(savedOfficer);
    } catch (error) {
        res.status(500).json({ error: "Failed to save officer" });
    }
});

// সব অফিসার দেখা (GET)
app.get('/officers', async (req, res) => {
    try {
        const officers = await Officer.find();
        res.json(officers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch officers" });
    }
});

// অফিসার ডিলিট করা (DELETE)
app.delete('/officers/:id', async (req, res) => {
    try {
        const result = await Officer.deleteOne({ _id: req.params.id });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete officer" });
    }
});

// 4. সার্ভার চালু করা
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});