"use server";

import { connectToDatabase } from "./mongodb";
import { embed, embedMany } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { RecursiveCharacterTextSplitter, CharacterTextSplitter } from "langchain/text_splitter";
import { env } from "@/env";

const azure = createOpenAI({
	baseURL: "https://oai.helicone.ai/openai/deployments",
	headers: {
		"Helicone-Auth": `Bearer ${env.HELICONE_API_KEY}`,
		"Helicone-OpenAI-API-Base": `https://${env.AZURE_RESOURCE_NAME}.openai.azure.com`,
		"api-key": env.AZURE_API_KEY,
	},
});

export async function splitTextRecursively(text: string, chunkSize: number = 10, chunkOverlap: number = 1) {
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize,
		chunkOverlap,
	});
	return (await splitter.createDocuments([text])).map((chunk) => chunk.pageContent);
}

export async function splitTextCharacter(text: string, chunkSize: number = 10, chunkOverlap: number = 1) {
	const splitter = new CharacterTextSplitter({
		separator: " ",
		chunkSize,
		chunkOverlap,
	});
	return (await splitter.createDocuments([text])).map((chunk) => chunk.pageContent);
}

export async function train(id: string, chunks: string[]) {
	chunks = chunks.filter((chunk) => chunk.length > 0);
	const { textbookChunksDB } = await connectToDatabase();

	const { embeddings } = await embedMany({
		model: azure.embedding("text-embedding-ada-002"),
		values: chunks,
	});

	const finalInsert = chunks.map((text, index) => ({
		textbookId: id,
		text,
		embeddings: embeddings[index],
	}));

	await textbookChunksDB.insertMany(finalInsert);
}

export async function search(id: string, text: string, limit: number = 5) {
	const { textbookChunksDB } = await connectToDatabase();
	const { embedding: queryVector } = await embed({
		model: azure.embedding("text-embedding-ada-002"),
		value: text,
	});
	const pipeline = [
		{
			$vectorSearch: {
				index: "vector_index",
				filter: { textbookId: id },
				queryVector,
				path: "embeddings",
				numCandidates: 100,
				limit,
			},
		},
		{
			$project: {
				_id: 0,
				text: 1,
				score: {
					$meta: "vectorSearchScore",
				},
			},
		},
	];

	return textbookChunksDB.aggregate(pipeline).toArray();
}
