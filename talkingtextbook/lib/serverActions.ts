"use server";

import z from "zod";
import { connectToDatabase } from "./mongodb";

export async function getTextbooks() {
	const { textbooksDB } = await connectToDatabase();
	return textbooksDB.find().toArray();
}

export async function createTextbooks() {
	const { textbooksDB } = await connectToDatabase();
	const { name } = z.object({ name: z.string() }).parse(await request.json());
	const { insertedId } = await textbooksDB.insertOne({ name });
	return insertedId;
}
