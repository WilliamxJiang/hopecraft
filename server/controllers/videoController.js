<<<<<<< HEAD
const gptService = require("../services/gptService");
const ttsService = require("../services/ttsService");
const videoService = require("../services/videoService");

exports.generateVideo = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // 1) Generate text from GPT
    const hopecoreText = await gptService.generateHopecoreText(prompt);

    // 2) Convert that text to speech
    const ttsFilePath = await ttsService.googleTts(hopecoreText);

    // 3) Merge TTS audio, background music, optional text overlays into a final video
    const videoPath = await videoService.generateHopecoreVideo({
      text: hopecoreText,
      ttsAudioPath: ttsFilePath,
      backgroundMusic: "assets/hopecoreMusic.mp3", // or your local path
      backgroundVideo: "assets/bg.mp4", // or your local path
    });

    // (Optional) Upload the video to S3 or return local path
    // const videoUrl = await someS3UploadFunction(videoPath);

    return res.json({
      success: true,
      hopecoreText,
      videoPath,
      // videoUrl: videoUrl, // if you implement uploading
    });
  } catch (error) {
    console.error("Error generating video:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while generating video." });
=======
const {
  getRandomClips,
  trimClips,
  combineClips,
} = require("../services/videoService");

/**
 * Generate a Hopecore video by combining trimmed random clips into a single video.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
exports.generateHopecoreVideo = async (req, res) => {
  try {
    // Extract parameters from the request body
    const { clipDuration = 5, totalDuration = 30 } = req.body; // Default: 5 seconds per clip, 30 seconds total
    const numClips = Math.ceil(totalDuration / clipDuration); // Calculate the number of clips needed

    console.log(
      `Generating a ${totalDuration}-second video using ${numClips} clips, each ${clipDuration} seconds long.`
    );

    // Step 1: Select random clips from the backgrounds folder
    const selectedClips = getRandomClips("../backgrounds", numClips);

    // Step 2: Trim each clip to the specified duration
    const trimmedClips = await trimClips(selectedClips, "./temp", clipDuration);

    // Step 3: Combine the trimmed clips into a single video
    const outputFilePath = "./temp/final-video.mp4";
    await combineClips({ clips: trimmedClips, outputFile: outputFilePath });

    // Step 4: Send the generated video to the client
    res.sendFile(outputFilePath, { root: "." });
  } catch (error) {
    console.error("Error generating Hopecore video:", error);
    res.status(500).json({ error: "Failed to generate video" });
  }
};

/**
 * Test endpoint to verify random clip selection.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
exports.testRandomClips = (req, res) => {
  try {
    // Select 3 random clips from the backgrounds folder
    const randomClips = getRandomClips("../backgrounds", 3);
    console.log("Selected random clips:", randomClips);

    // Respond with the selected clip paths
    res.json({ randomClips });
  } catch (error) {
    console.error("Error fetching random clips:", error);
    res.status(500).json({ error: "Failed to fetch random clips" });
>>>>>>> 36593c1e6a5d8b519b5f2d705c9c0d5ef9a40f94
  }
};
