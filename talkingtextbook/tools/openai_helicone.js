const OpenAI = require("openai");

const openai = new OpenAI({
	apiKey: process.env.AZURE_API_KEY,
	baseURL: "https://oai.helicone.ai/openai/deployments/gpt-35-turbo",
	defaultHeaders: {
		"Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
		"Helicone-OpenAI-API-Base": `https://${process.env.AZURE_RESOURCE_NAME}.openai.azure.com`,
		"api-key": process.env.AZURE_API_KEY,
		"Helicone-Cache-Enabled": "false",
		"Helicone-User-Id": "testing-anish",
	},
	defaultQuery: { "api-version": "2023-03-15-preview" },
});

async function main() {
	console.log("Requesting");
	await openai.chat.completions.create({
		messages: [
			{
				role: "system",
				content: `You are a story telling tutor. Your job is to help students write really long stories! Finish this particular story by writing at atleast 15 paragraphs. Do not stop under any circumstance. When you think you are done writing, keep going. Until you run out of breath, keep on going.`,
			},
			{
				role: "user",
				content: "Once upon a time,",
			},
		],
	});

	console.log("Finished!");
}
main();

setInterval(main, 333); // 3 times a second
