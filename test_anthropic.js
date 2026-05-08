const Anthropic = require("@anthropic-ai/sdk");
require('dotenv').config({ path: '.env.local' });

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const models = [
    "claude-3-7-sonnet-20250219",
    "claude-3-5-sonnet-20241022",
    "claude-3-5-sonnet-20240620",
    "claude-3-5-haiku-20241022",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
    "claude-2.1",
    "claude-2.0",
    "claude-instant-1.2"
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
