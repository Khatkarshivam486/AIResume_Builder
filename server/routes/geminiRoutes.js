const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { enhanceSection } = require("../controllers/geminiController");

// Gemini AI enhancement route - requires authentication
router.post("/", authenticateToken, enhanceSection);

module.exports = router;