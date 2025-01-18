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
  }
};
