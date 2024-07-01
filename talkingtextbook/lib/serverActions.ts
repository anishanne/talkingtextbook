"use server";

import { ObjectId } from "mongodb";
import { connectToDatabase } from "./mongodb";
import { splitTextRecursively } from "./chunk";
import { train } from "./train";

export async function getTextbooks() {
	const { textbooksDB } = await connectToDatabase();
	return textbooksDB.find().toArray();
}
export async function getTextbook(id: ObjectId) {
	const { textbooksDB } = await connectToDatabase();
	return textbooksDB.findOne({ _id: id });
}

export async function createTextbook(name: string) {
	const { textbooksDB } = await connectToDatabase();
	const { insertedId } = await textbooksDB.insertOne({ name, created_at: new Date() });
	return insertedId.toString();
}

export async function trainTextbook(id: ObjectId, data: string) {
	const chunks = await splitTextRecursively(data);
	train(
		id,
		chunks.map((chunk) => chunk.pageContent),
	);
}
