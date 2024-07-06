"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { createTextbook, trainTextbook } from "@/lib/serverActions";
import FileUpload from "@/components/upload";
import { splitTextRecursively, train } from "@/lib/chunk";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loading";

import { modelList } from "@/config";

export default function CreateTextbook({ open, setOpen }) {
	const router = useRouter();

	const [status, setStatus] = useState(false);
	const [name, setName] = useState("");
	const [text, setText] = useState("");

	const create = async () => {
		setStatus("loading");
		const id = await createTextbook(name);
		const chunks = await splitTextRecursively(text, 1000, 100);
		await train(id, chunks);
		router.push(`/talk/${id}`);
	};

	return (
		<Dialog className="relative z-10" open={open} onClose={setOpen}>
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
			/>

			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
					<DialogPanel
						transition
						className="relative transform overflow-hidden rounded-lg bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
						<div>
							<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
								<DocumentPlusIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
							</div>
							<div className="mt-3 text-center sm:mt-5">
								<DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-100">
									Train a textbook!
								</DialogTitle>
								<div className="mt-2">
									<p className="text-sm text-gray-500">
										<div>
											<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-200">
												Textbook Name
											</label>
											<div className="mt-2">
												<input
													type="text"
													name="name"
													id="name"
													className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-gray-200 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
													placeholder="English 101"
													onChange={(e) => setName(e.target.value)}
												/>
											</div>
										</div>
										<div>
											<label htmlFor="file" className="mt-4 block text-sm font-medium leading-6 text-gray-100">
												Textbook Upload
											</label>
											<div className="mt-2">
												<FileUpload setText={setText} />
											</div>
											<span className="text-gray-200">
												{text.length > 0 && !status && `Processed! Read ${text.length.toLocaleString()} characters.`}
											</span>
										</div>
									</p>
								</div>
							</div>
						</div>
						<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
							<button
								type="button"
								className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:bg-indigo-600 sm:col-start-2"
								onClick={create}
								disabled={!name || !text || status}>
								{status ? <LoadingSpinner /> : "Create"}
							</button>
							<button
								type="button"
								className="mt-3 inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-700 hover:bg-gray-900 sm:col-start-1 sm:mt-0"
								onClick={() => setOpen(false)}
								data-autofocus>
								Cancel
							</button>
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
}
