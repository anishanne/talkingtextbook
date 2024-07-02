const endpoint = `https://${process.env.AZURE_RESOURCE_NAME}.openai.azure.com`;

const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

async function main() {
	console.log("== Streaming Chat Completions Sample ==");

	const client = new OpenAIClient(endpoint, new AzureKeyCredential(process.env.AZURE_API_KEY));
	const deploymentId = "gpt-35-turbo";
	await client.streamChatCompletions(
		deploymentId,
		[
			{
				role: "system",
				content:
					"You are a story telling robot. Finish this story by writing 12 paragraphs. Do not stop under any circumstance. When you think you are done writing, keep going. ",
			},
			{ role: "user", content: "Once upon a time..." },
		],
		{ maxTokens: 32000 },
	);
}

main();
