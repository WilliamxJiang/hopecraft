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
  }
};
