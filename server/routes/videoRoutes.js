const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");

<<<<<<< HEAD
// POST /video/generate
router.post("/generate", videoController.generateVideo);
=======
// POST /video/hopecore - Generate a full Hopecore video
router.post("/hopecore", videoController.generateHopecoreVideo);

// GET /video/test-clips - Test random video clip selection
router.get("/test-clips", videoController.testRandomClips);
>>>>>>> 36593c1e6a5d8b519b5f2d705c9c0d5ef9a40f94

module.exports = router;
