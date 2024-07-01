import { NextRequest, NextResponse } from "next/server"; // To handle the request and response
import { promises as fs } from "fs"; // To save the file temporarily
import { v4 as uuidv4 } from "uuid"; // To generate a unique filename
import PDFParser from "pdf2json"; // To parse the pdf

export async function POST(req: NextRequest) {
	const formData: FormData = await req.formData();
	const uploadedFiles = formData.getAll("filepond");
	let fileName = "";
	let parsedText = "";

	if (uploadedFiles && uploadedFiles.length > 0) {
		const uploadedFile = uploadedFiles[1];

		if (uploadedFile instanceof File) {
			fileName = uuidv4();
			const tempFilePath = `/tmp/${fileName}.pdf`;
			const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
			await fs.writeFile(tempFilePath, fileBuffer);
			const pdfParser = new (PDFParser as any)(null, 1);

			pdfParser.on("pdfParser_dataError", (errData: any) => console.log(errData.parserError));

			const parsedTextPromise = new Promise<string>((resolve) => {
				pdfParser.on("pdfParser_dataReady", () => {
					parsedText = (pdfParser as any).getRawTextContent();
					resolve(parsedText);
				});
			});

			pdfParser.loadPDF(tempFilePath);
			parsedText = await parsedTextPromise;
		}
	}

	return NextResponse.json({ fileName, parsedText });
}
