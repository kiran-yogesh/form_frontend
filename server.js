    const express = require("express");
    const mongoose = require("mongoose");
    const bodyParser = require("body-parser");
    const multer = require("multer");
    const cors = require("cors");

    const app = express();
    const PORT = 3000;
    mongoose.connect("mongodb+srv://kiranyogesh29:mongo1234@cluster0.r4ken.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Database connection error:", err));
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static("public"));
    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, "upload/"),
        filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
    });
    const upload = multer({ storage });
    const User = mongoose.model("User", new mongoose.Schema({
        name: String,
        category: String,
        resume: String,
    }));
    app.post("/register", upload.single("resume"), async (req, res) => {
        try {
            const { name, category } = req.body;
            const resumePath = req.file ? req.file.path : null;
            const newUser = new User({ name, category, resume: resumePath });
            await newUser.save();
            res.redirect("/login");
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ success: false, message: "Error in registration" });
        }
    });
    app.post("/login", async (req, res) => {
        try {
            const { name } = req.body;
            const user = await User.findOne({ name });
            if (!user){
                return res.status(400).json({ success: false, message: "User not found" });
            } 
            res.redirect("/welcome");
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ success: false, message: "Error in login" });
        }
    });
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    const fs = require("fs");
    const path = require("path");

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "land.html"));
    });

    app.get("/register", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "register.html"));
    });

    app.get("/login", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "login.html"));
    });

    app.get("/welcome", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "welcome.html"));
    });

