"use server";

import { connectToDatabase } from "./mongodb";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { ObjectId } from "mongodb";

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
