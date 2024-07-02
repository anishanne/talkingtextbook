import type { MongoClient, ObjectId } from "mongodb";

declare global {
	// eslint-disable-next-line no-var, vars-on-top
	var mongoClientPromise: Promise<MongoClient>;
}

export interface Textbook {
	name: string;
	created_at: Date;
}

export interface TextbookChunk {
	textbookId: string;
	text: string;
	embeddings: number[];
}
