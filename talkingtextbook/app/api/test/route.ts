import { splitTextRecursively, splitTextCharacter } from "@/lib/chunk";

export async function GET() {
	const text =
		"Hello\n\nWorld\nIam cool.\nThis is a test of the chunking system. It should split this text into multiple chunks.";
	console.log({ recursive: await splitTextRecursively(text), character: await splitTextCharacter(text) });
	return Response.json({ recursive: await splitTextRecursively(text), character: await splitTextCharacter(text) });
}
