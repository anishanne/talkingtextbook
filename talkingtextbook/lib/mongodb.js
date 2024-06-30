import { MongoClient } from "mongodb";

export const clientPromise =
	process.env.NODE_ENV === "development" && globalThis.mongoClientPromise
		? globalThis.mongoClientPromise
		: new MongoClient(process.env.MONGODB_URI, {}).connect();

if (process.env.NODE_ENV === "development" && !globalThis.mongoClientPromise)
	globalThis.mongoClientPromise = clientPromise;

export async function connectToDatabase(dbName = "main") {
	const client = await clientPromise;
	const db = client.db(dbName);

	return {
		client,
		db,
		textbooksDB: db.collection("textbooks"),
		textbookChunksDB: db.collection("textbook_chunks"),
	};
}
