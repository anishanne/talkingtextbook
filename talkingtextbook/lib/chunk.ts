import { RecursiveCharacterTextSplitter, CharacterTextSplitter } from "langchain/text_splitter";

export async function splitTextRecursively(text: string, chunkSize: number = 10, chunkOverlap: number = 1) {
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize,
		chunkOverlap,
	});
	return await splitter.createDocuments([text]);
}

export async function splitTextCharacter(text: string, chunkSize: number = 10, chunkOverlap: number = 1) {
	const splitter = new CharacterTextSplitter({
		separator: " ",
		chunkSize,
		chunkOverlap,
	});
	return await splitter.createDocuments([text]);
}
