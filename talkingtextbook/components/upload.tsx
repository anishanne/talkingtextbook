"use client";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";

export default function FileUpload(setState) {
	return (
		<FilePond
			server={{
				process: "/api/upload",
				fetch: null,
				revert: null,
			}}
			onupdatefiles={(fileItems) => {
				console.log(fileItems[0]);
				// setState({
				// 	files: fileItems.map((fileItem) => fileItem.file),
				// });
			}}
		/>
	);
}
