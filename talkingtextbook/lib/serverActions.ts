"use server";

import z from "zod";
import { connectToDatabase } from "./mongodb";

export async function getTextbooks() {
	const { textbooksDB } = await connectToDatabase();
	return textbooksDB.find().toArray();
}

export async function createTextbooks(name: string) {
	const { textbooksDB } = await connectToDatabase();
	const { insertedId } = await textbooksDB.insertOne({ name });
	return insertedId;
}
