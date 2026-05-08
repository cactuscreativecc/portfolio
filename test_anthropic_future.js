const Anthropic = require("@anthropic-ai/sdk");
require('dotenv').config({ path: '.env.local' });

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const models = [
    "claude-4-7-opus-20260416",
    "claude-4-6-sonnet-20260217",
    "claude-4-5-haiku-20251015",
    "claude-4-haiku-20251015",
    "claude-sonnet-4-6",
    "claude-haiku-4-5",
    "claude-opus-4-7"
];

async function test() {
    for (const model of models) {
        try {
            console.log(`Testing ${model}...`);
            const response = await anthropic.messages.create({
                model: model,
                max_tokens: 10,
                messages: [{ role: "user", content: "Hi" }],
            });
            console.log(`✅ ${model} works!`);
            return;
        } catch (e) {
            console.log(`❌ ${model} failed: ${e.message}`);
        }
    }
}

test();
