export const getGeminiResponse = async (userMessage, history) => {
  const API_KEY = "AIzaSyDD3kYMf-_HIwIFdUz3zi0eQvYi1hxTYls";

  // Format chat history for Gemini API
  const messages = [
    ...history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text }],
    })),
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  try {
    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,

      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 256,
          },
        }),
      }
    );

    // const data = await response.json();
    const data = await response.json();
console.log("Gemini API Raw Response:", data);

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.warn("No usable text response from Gemini:", data);
    }

    return reply || "Gemini gave no response.";
  } catch (err) {
    console.error("Gemini API Error:", err);
    return "Error: Failed to connect to Gemini.";
  }
};
