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

  const systemInstruction = {
    role: "user",
    parts: [{ 
      text: "You are Mr. Pasindu, a study assistant. Your purpose is to help students with academic subjects. Respond ONLY to study-related questions. For non-study queries: 1. Politely decline 2. Remind about your study purpose 3. Ask for study questions. Keep non-study responses under 15 words. Study topics include: Math, Science, Languages, History, and exam preparation." 
    }]
  };

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

    return reply || "I can only answer study-related questions right now.";
  } catch (err) {
    console.error("Gemini API Error:", err);
    return "Error: Failed to connect to study assistant.";
  }
};
