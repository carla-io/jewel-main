const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');
const admin = require('firebase-admin');

// admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//   });
// Registration Controller
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload profile picture to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile',
            width: 150,
            crop: 'scale',
        });

        // Create new user with profile picture
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            profilePicture: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        });

        // Generate JWT token (30-day expiration)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        // Respond with user info and token
        res.status(201).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const register = async (req, res) => {
//     const { username, email, password, firebaseToken } = req.body;

//     try {
//         // Verify Firebase ID Token
//         const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
//         const uid = decodedToken.uid;

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ message: 'User already exists' });

//         // Upload profile picture to Cloudinary
//         const result = await cloudinary.uploader.upload(req.file.path, {
//             folder: 'profile',
//             width: 150,
//             crop: 'scale',
//         });

//         // Create new user
//         const user = await User.create({
//             username,
//             email,
//             password,  // You can choose to keep this or not, depending on your use case.
//             firebaseUid: uid,
//             profilePicture: {
//                 public_id: result.public_id,
//                 url: result.secure_url,
//             },
//         });

//         // Respond with user info
//         res.status(201).json({
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email,
//                 profilePicture: user.profilePicture,
//             },
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token (30-day expiration)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        // Respond with user info and token
        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,  // Ensure 'role' exists in your model
                profilePicture: user.profilePicture,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const user = async (req, res) => {
    try {
        // Retrieve token directly from the request body
        const { token } = req.body;
        if (!token) return res.status(401).json({ message: 'No token provided' });

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID and exclude the password
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Send user information
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.params.id;

        // Find the user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update profile picture if provided
        let profilePicture = user.profilePicture;

        if (req.file) {
            // Convert buffer to base64 for Cloudinary
            const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

            // Delete old image if exists
            if (profilePicture?.public_id) {
                await cloudinary.uploader.destroy(profilePicture.public_id);
            }

            // Upload new image
            const result = await cloudinary.uploader.upload(base64File, {
                folder: "profile",
                width: 150,
                crop: "scale",
            });

            profilePicture = { public_id: result.public_id, url: result.secure_url };
        }

        // Update user fields
        user.username = username || user.username;
        user.email = email || user.email;
        user.profilePicture = profilePicture;

        // Save updated user
        await user.save();

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("❌ Error during user profile update:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const verifyFirebaseToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];  // Extract the token
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      // Verify the Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;  // Store the decoded user info in request
      next();  // Proceed with the request
    } catch (error) {
      console.error('Error verifying Firebase token:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  };


module.exports = { register, login, user, updateProfile, verifyFirebaseToken };
