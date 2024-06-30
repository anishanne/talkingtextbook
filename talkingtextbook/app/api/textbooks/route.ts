import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
	const { textbooksDB } = await connectToDatabase();
	const result = await textbooksDB.find().toArray();
	return NextResponse.json(result);
}
