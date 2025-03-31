const express = require('express');
const multer = require('multer');
const User = require('../model'); // Adjust path based on your structure
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Register Route
router.post('/register', upload.single('resume'), async (req, res) => {
    try {
        const { name, category } = req.body;
        const resumePath = req.file ? req.file.path : null;

        const newUser = new User({ name, category, resume: resumePath });
        await newUser.save();

        res.redirect('/login.html'); // Ensure the login page exists
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('An error occurred during registration.');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username } = req.body;

        // Add login validation logic
        if (!username) {
            return res.status(400).send('Invalid username');
        }

        res.send('<h1>Welcome to VOAT Network!</h1>');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred during login.');
    }
});

module.exports = router;