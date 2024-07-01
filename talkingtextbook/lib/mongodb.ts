import { type Db, MongoClient } from "mongodb";
import { Textbook, TextbookChunk } from "@/types";

export const clientPromise =
	process.env.NODE_ENV === "development" && globalThis.mongoClientPromise
		? globalThis.mongoClientPromise
		: new MongoClient(process.env.MONGODB_URI, {}).connect();

if (process.env.NODE_ENV === "development" && !globalThis.mongoClientPromise)
	globalThis.mongoClientPromise = clientPromise;

export async function connectToDatabase(dbName = "main") {
	const client = await clientPromise;
	const db = client.db(dbName) as Db;

	return {
		client,
		db,
		textbooksDB: db.collection<Textbook>("textbooks"),
		textbookChunksDB: db.collection<TextbookChunk>("textbook_chunks"),
	};
}
