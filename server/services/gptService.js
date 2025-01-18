const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Make sure OPENAI_API_KEY is in your .env
});
const openai = new OpenAIApi(configuration);

exports.generateHopecoreText = async (userPrompt) => {
  const systemPrompt =
    "You are an uplifting script generator in a Hopecore style.";
  const userMessage = `User is sad about: ${userPrompt}. Generate a short, comforting message in Hopecore style.`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error in GPT:", error);
    throw error;
  }
};
