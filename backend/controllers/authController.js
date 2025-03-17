const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config(); // Ensure .env is loaded

// ==========================
// User Registration
// ==========================
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload profile picture (if provided)
        let profilePicture = {};
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "profile", width: 150, crop: "scale" });
            profilePicture = { public_id: result.public_id, url: result.secure_url };
        }

        // Create new user
        const user = await User.create({ username, email, password: hashedPassword, profilePicture });

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        res.status(201).json({ user: { id: user._id, username, email, profilePicture }, token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==========================
// User Login
// ==========================
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

        res.status(200).json({ user: { id: user._id, username: user.username, email, profilePicture: user.profilePicture }, token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==========================
// Get User Info
// ==========================
const user = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==========================
// Update Profile
// ==========================
const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.params.id;

        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        let profilePicture = user.profilePicture;
        if (req.file) {
            if (profilePicture?.public_id) await cloudinary.uploader.destroy(profilePicture.public_id);
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "profile", width: 150, crop: "scale" });
            profilePicture = { public_id: result.public_id, url: result.secure_url };
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.profilePicture = profilePicture;

        await user.save();
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ==========================
// Google OAuth Strategy
// ==========================
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ email: profile.emails[0].value });

                if (!user) {
                    user = await User.create({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        profilePicture: { url: profile.photos[0].value },
                        provider: "google",
                    });
                }

                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
                done(null, { user, token });
            } catch (error) {
                done(error, null);
            }
        }
    )
);

// ==========================
// Facebook OAuth Strategy
// ==========================
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ["id", "displayName", "email", "photos"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        username: profile.displayName,
                        email: email,
                        profilePicture: { url: profile.photos?.[0]?.value || "" },
                        provider: "facebook",
                    });
                }

                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
                done(null, { user, token });
            } catch (error) {
                done(error, null);
            }
        }
    )
);

// ==========================
// Export Controllers
// ==========================
module.exports = { register, login, user, updateProfile, passport };
