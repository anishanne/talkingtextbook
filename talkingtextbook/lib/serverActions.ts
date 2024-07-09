"use server";

import { ObjectId } from "mongodb";
import { connectToDatabase } from "./mongodb";

export async function getTextbooks() {
	const { textbooksDB } = await connectToDatabase();
	const data = await textbooksDB.find().toArray();
	return data.map(({ _id, ...rest }) => ({ _id: _id.toString(), ...rest }));
}

export async function getTextbook(id: string) {
	const { textbooksDB } = await connectToDatabase();
	const data = await textbooksDB.findOne({ _id: new ObjectId(id) });
	if (!data) return null;
	const { _id, ...rest } = data;
	return { _id: _id.toString(), ...rest };
}

export async function createTextbook(name: string, model: string, chatPrompt: string, systemPrompt: string) {
	const { textbooksDB } = await connectToDatabase();
	const { insertedId } = await textbooksDB.insertOne({ name, model, systemPrompt, chatPrompt, created_at: new Date() });
	return insertedId.toString();
}

export async function updateTextbook(
	id: string,
	name: string,
	model: string,
	chatPrompt: string,
	systemPrompt: string,
) {
	const { textbooksDB } = await connectToDatabase();
	textbooksDB.updateOne(
		{ _id: new ObjectId(id) },
		{ $set: { name, model, systemPrompt, chatPrompt, created_at: new Date() } },
	);
}

export async function updateModel(id: string, model: string) {
	const { textbooksDB } = await connectToDatabase();
	await textbooksDB.updateOne({ _id: new ObjectId(id) }, { $set: { model } });
}
