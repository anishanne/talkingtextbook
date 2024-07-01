"use client";

import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";

export default function FileUpload({ setText }: { setText: (text: string) => void }) {
	return (
		<FilePond
			server={{
				process: {
					url: "./api/upload",
					onload: (response) => {
						setText(response);
						return response.fileName;
					},
				},
				fetch: null,
				revert: null,
			}}
		/>
	);
}
