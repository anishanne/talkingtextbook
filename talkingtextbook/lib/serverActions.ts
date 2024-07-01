"use server";

import { ObjectId } from "mongodb";
import { connectToDatabase } from "./mongodb";

export async function getTextbooks() {
	const { textbooksDB } = await connectToDatabase();
	const data = await textbooksDB.find().toArray();
	return data.map(({ _id, ...rest }) => ({ _id: _id.toString(), ...rest }));
}

export async function getTextbook(id: ObjectId) {
	const { textbooksDB } = await connectToDatabase();
	const data = await textbooksDB.findOne({ _id: id });
	if (!data) return null;
	const { _id, ...rest } = data;
	return { _id: _id.toString(), ...rest };
}

export async function createTextbook(name: string) {
	const { textbooksDB } = await connectToDatabase();
	const { insertedId } = await textbooksDB.insertOne({ name, created_at: new Date() });
	return insertedId.toString();
}
