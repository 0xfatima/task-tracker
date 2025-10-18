const Groq = require("groq-sdk");
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompts =
  "You are a task divider. Break down the given task into smaller subtasks. " +
  "Return the response strictly in valid JSON format like this: " +
  "{ \"subtasks\": [\"step 1\", \"step 2\", \"step 3\"] }. Do NOT include any extra text.";

const llmTaskBreaker = async (req, res) => {
  console.log("✅ LLM Request received"); // Debug log

  try {
    const { description } = req.body;

    if (!description) {
      console.log("❌ Missing task description");
      return res
        .status(400)
        .json({ message: "Task description is required" });
    }

    console.log("🟢 Sending to Groq API:", description);

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompts },
        { role: "user", content: description },
      ],
      model: "llama-3.1-8b-instant",
      stream: false,
      response_format: { type: "json_object" },
    });

    console.log("🟢 LLM Raw Response:", completion.choices[0].message.content);

    const response_text = completion.choices[0].message.content || "";
    let subtasks;

    try {
  parsed = JSON.parse(response_text);
} catch (error) {
  console.warn("⚠️ Could not parse JSON, using raw response");
  parsed = { subtasks: [response_text] };
}
return res.json({ subtasks: parsed.subtasks || [] });
  } catch (error) {
    console.error("🔥 Error generating tasks:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate subtasks", error: error.message });
  }
};

module.exports = { llmTaskBreaker };
