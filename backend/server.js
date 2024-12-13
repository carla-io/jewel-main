const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});