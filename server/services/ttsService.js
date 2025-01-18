const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const path = require("path");

// If using Google Cloud, set the environment variable:
// GOOGLE_APPLICATION_CREDENTIALS=/path/to/service_account.json
const client = new textToSpeech.TextToSpeechClient();

exports.googleTts = async (text) => {
  try {
    const request = {
      input: { text },
      voice: { languageCode: "en-US", ssmlGender: "FEMALE" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await client.synthesizeSpeech(request);

    // Write audio to a file in the temp folder
    const audioPath = path.join(__dirname, `../temp/tts-${Date.now()}.mp3`);
    fs.writeFileSync(audioPath, response.audioContent, "binary");
    return audioPath;
  } catch (error) {
    console.error("Error in Google TTS:", error);
    throw error;
  }
};
