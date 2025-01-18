const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

exports.generateHopecoreVideo = async ({
  text,
  ttsAudioPath,
  backgroundMusic,
  backgroundVideo,
}) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, `../temp/output-${Date.now()}.mp4`);

    // Basic example that:
    // 1) Uses 'backgroundVideo' as the video
    // 2) Mixes TTS audio + backgroundMusic
    // 3) Potentially draws text (commented below)
    ffmpeg()
      .input(backgroundVideo) // index 0 -> video
      .input(ttsAudioPath) // index 1 -> TTS audio
      .input(backgroundMusic) // index 2 -> music
      .complexFilter(
        [
          {
            // Combine TTS + music
            filter: "amix",
            options: {
              inputs: 2, // TTS + music
              duration: "longest",
              dropout_transition: 2,
            },
            inputs: ["1:0", "2:0"],
            outputs: "mixedAudio",
          },

          // OPTIONAL: Overlay text with drawtext
          // {
          //   filter: 'drawtext',
          //   options: {
          //     fontfile: '/path/to/font.ttf',
          //     text: text,
          //     fontsize: 40,
          //     fontcolor: 'white',
          //     x: '(w-text_w)/2',
          //     y: '(h-text_h)/2'
          //   },
          //   inputs: '0:v',
          //   outputs: 'textOverlay'
          // }
        ],
        ["mixedAudio"]
      )
      .outputOptions("-map 0:v") // Take video from first input
      .outputOptions("-map [mixedAudio]") // Take the combined audio
      .outputOptions("-shortest") // Stop when shortest stream ends
      .save(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err));
  });
};
