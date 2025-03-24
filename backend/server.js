const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectiondDb");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// Connect to database
connectDb();

const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors({ origin: "*", credentials: true }));

// Middleware to parse JSON & FormData
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files (images)
app.use('/images', express.static('public/images'));

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Log requests (for debugging)
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

// Routes
app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// Start server
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
