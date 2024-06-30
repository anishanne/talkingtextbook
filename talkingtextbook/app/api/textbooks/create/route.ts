import { connectToDatabase } from "@/lib/mongodb";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
	const { textbooksDB } = await connectToDatabase();
	const { name } = z.object({ name: z.string() }).parse(await request.json());
	const { insertedId } = await textbooksDB.insertOne({ name });
	return NextResponse.json({ id: insertedId });
}
