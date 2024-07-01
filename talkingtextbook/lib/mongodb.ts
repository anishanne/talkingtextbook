import { type Db, MongoClient } from "mongodb";
import { Textbook, TextbookChunk } from "@/types";
import { env } from "@/env";

export const clientPromise =
	env.NODE_ENV === "development" && globalThis.mongoClientPromise
		? globalThis.mongoClientPromise
		: new MongoClient(env.MONGODB_URI, {}).connect();

if (env.NODE_ENV === "development" && !globalThis.mongoClientPromise) globalThis.mongoClientPromise = clientPromise;

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
