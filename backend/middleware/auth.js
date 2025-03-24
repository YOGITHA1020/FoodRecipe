const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

    if (!token) {
        return res.status(403).json({ message: "Access Denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY); // Verify token with the correct key
        req.user = verified; // Attach verified user to the request object
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.error("Token verification failed:", error); // Log the error (useful for debugging)
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = verifyToken;
