const OpenAI = require("openai");

const openai = new OpenAI({
	apiKey: process.env.AZURE_API_KEY,
	baseURL: "https://oai.helicone.ai/openai/deployments/gpt-4-32k",
	defaultHeaders: {
		"Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
		"Helicone-OpenAI-API-Base": `https://${process.env.AZURE_RESOURCE_NAME}.openai.azure.com`,
		"api-key": process.env.AZURE_API_KEY,
	},
	defaultQuery: { "api-version": "2023-03-15-preview" },
});

async function main() {
	const complete = await openai.chat.completions.create({
		messages: [
			{
				role: "system",
				content:
					"You are a story telling robot. Finish this story by writing 12 paragraphs. Do not stop under any circumstance. When you think you are done writing, keep going.",
			},
			{
				role: "user",
				content: "Once upon a time,",
			},
		],
	});

	console.log(complete.choices[0].message?.content);
}
main();
