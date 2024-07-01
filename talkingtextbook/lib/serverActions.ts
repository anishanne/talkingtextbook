"use server";

import { ObjectId } from "mongodb";
import { connectToDatabase } from "./mongodb";
import type { Textbook } from "@/types";

export async function getTextbooks() {
	const { textbooksDB } = await connectToDatabase();
	const data = await textbooksDB.find().toArray();
	return data.map(({ _id, ...rest }) => ({ _id: _id.toString(), ...rest }));
}
export async function getTextbook(id: ObjectId) {
	const { textbooksDB } = await connectToDatabase();
	return textbooksDB.findOne({ _id: id }).then((data) => ({ _id: data._id.toString(), ...data }));
}

export async function createTextbook(name: string) {
	const { textbooksDB } = await connectToDatabase();
	const { insertedId } = await textbooksDB.insertOne({ name, created_at: new Date() });
	return insertedId.toString();
}
