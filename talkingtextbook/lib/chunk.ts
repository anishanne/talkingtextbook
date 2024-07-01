"use server";

import { connectToDatabase } from "./mongodb";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { ObjectId } from "mongodb";
import { RecursiveCharacterTextSplitter, CharacterTextSplitter } from "langchain/text_splitter";

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

export async function train(id: ObjectId, chunks: string[]) {
	const { textbookChunksDB } = await connectToDatabase();

	const { embeddings } = await embedMany({
		model: openai.embedding("text-embedding-3-small"),
		values: chunks,
	});

	const finalInsert = chunks.map((text, index) => ({
		textbookId: id,
		text,
		embeddings: embeddings[index],
	}));

	await textbookChunksDB.insertMany(finalInsert);
}
