const admin = require('firebase-admin');

// Load Firebase service account credentials
const serviceAccount = require('./serviceAccount.json'); // Replace with your actual file

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://jewelry-23dfd-default-rtdb.firebaseio.com/" // Replace with your Firebase project URL
});


const db = admin.firestore();

module.exports = { db, auth };
