import { connectToDatabase } from "@/lib/mongodb";
import type { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: NextRequest) {
	const { textbookChunksDB } = await connectToDatabase();
	const { id, chunks } = z
		.object({ id: z.instanceof(ObjectId), chunks: z.string().array() })
		.parse(await request.json());

	const { embeddings } = await embedMany({
		model: openai.embedding("text-embedding-3-small"),
		values: chunks,
	});

	const finalInsert = chunks.map((chunk, index) => ({
		textbookId: id,
		chunk,
		embedding: embeddings[index],
	}));

	await textbookChunksDB.insertMany(finalInsert);

	return NextResponse.json({ success: true });
}
