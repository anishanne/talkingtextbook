"use server";

import { connectToDatabase } from "./mongodb";

export async function getTextbooks() {
	const { textbooksDB } = await connectToDatabase();
	return textbooksDB.find().toArray();
}
