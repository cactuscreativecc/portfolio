const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
    try {
        const result = await genAI.listModels();
        console.log("MODELS:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("ERROR LISTING MODELS:", error);
    }
}

listModels();
