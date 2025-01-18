const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");

// POST /video/generate
router.post("/generate", videoController.generateVideo);

module.exports = router;
