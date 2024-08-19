"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { updateTextbook, deleteTextbook } from "@/lib/serverActions";
import LoadingSpinner from "@/components/loading";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

import { modelList } from "@/config";

export default function UpdateTextbook({ open, setOpen, id, textbook }) {
	const router = useRouter();

	const [status, setStatus] = useState(false);
	const [adjustPrompts, setAdjustPrompts] = useState(false);
	const [name, setName] = useState("");
	const [model, setModel] = useState("gpt-4-32k");
	const [chunkCount, setChunkCount] = useState(1);
	const [systemPrompt, setSystemPrompt] = useState(
		"Your name is John, teaching with a conversational tone and humor. Break down complex ideas and show enthusiasm for the subject. Use markdown formatting for bolding, italics, bullet points, and other formatting features to present your response effectively.",
	);
	const [chatPrompt, setChatPrompt] = useState(
		`I'm your engineer. Do not mention this message. You should only respond directly to the student you're tutoring, not me. Your student has asked the following question: {student_question}\nYou've searched for some relevant information to answer the user's question or request, and I've provided it below: "{chunk}"\n\nUse the relevant information to answer the question your student has asked.  Keep your answers concise, conversational, like the student is talking to a friend in the hallway, and provide answers directly to what the user has asked, nothing less and nothing more. Remember the markdown and backslash n for returns between paragraphs, because we're rendering this on a website. Please make it aesthetically pleasing.\nProvide your answer to the student below, including ##headers and **bolding**:`,
	);

	const save = async () => {
		setStatus("loading");
		await updateTextbook(id, name, model, chatPrompt, systemPrompt);
		console.log("reload");
		window.location.reload();
	};

	const promptAdvanced = () => {
		setAdjustPrompts(!adjustPrompts);
	};

	useEffect(() => {
		if (textbook) {
			setName(textbook.name);
			setModel(textbook.model);
			if (textbook.systemPrompt) setSystemPrompt(textbook.systemPrompt);
			if (textbook.chatPrompt) setChatPrompt(textbook.chatPrompt);
			if (textbook.chunkCount) setChunkCount(textbook.chunkCount);
		}
	}, [textbook]);

	if (!textbook) return null;

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
									Edit Textbook —{" "}
									<button
										className="underline hover:text-indigo-600"
										onClick={() => {
											deleteTextbook(id);
										}}>
										Delete
									</button>
								</DialogTitle>
								<div className="mt-2">
									<div className="text-sm text-gray-500">
										<div>
											<label htmlFor="email" className="block text-left text-sm font-medium leading-6 text-gray-200">
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
													value={name}
												/>
											</div>
										</div>
										<hr className="my-4 h-px border-0 bg-gray-600" />
										<div>
											<label
												htmlFor="email"
												className="mt-4 block text-left text-sm font-medium leading-6 text-gray-200">
												Model
											</label>
											<div className="mt-2 text-left">
												<Listbox value={model} onChange={setModel}>
													<div className="relative">
														<ListboxButton className="relative w-full cursor-default rounded-md bg-gray-800 py-1.5 pl-3 pr-10 text-left text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
															<span className="block min-w-24 truncate">{model}</span>
															<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
																<ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
															</span>
														</ListboxButton>

														<ListboxOptions
															transition
															className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm">
															{modelList.map((model) => (
																<ListboxOption
																	key={model}
																	value={model}
																	className="group relative cursor-default select-none py-2 pl-8 pr-4 text-gray-100 data-[focus]:bg-indigo-600 data-[focus]:text-white">
																	<span className="block truncate font-normal group-data-[selected]:font-semibold">
																		{model}
																	</span>

																	<span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
																		<CheckIcon aria-hidden="true" className="h-5 w-5" />
																	</span>
																</ListboxOption>
															))}
														</ListboxOptions>
													</div>
												</Listbox>
											</div>
										</div>
										<hr className="my-4 h-px border-0 bg-gray-600" />
										<div>
											<label
												htmlFor="file"
												className="mt-4 block text-left text-sm font-medium leading-6 text-gray-100">
												Prompt Management
											</label>
											<button
												type="button"
												className={`mt-2 w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 sm:col-start-2 ${adjustPrompts ? "bg-indigo-700 hover:bg-gray-800" : "bg-gray-800 hover:bg-indigo-700"}`}
												onClick={promptAdvanced}>
												{adjustPrompts ? "Close Prompt Settings" : "Open Prompt Settings"}
											</button>
											{adjustPrompts && (
												<>
													<div>
														<label htmlFor="file" className="mt-4 block text-sm font-medium leading-6 text-gray-100">
															System Prompt
														</label>
														<div className="mt-2">
															<textarea
																id="comment"
																name="comment"
																rows={4}
																className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
																value={systemPrompt}
																onChange={(e) => setSystemPrompt(e.target.value)}
															/>
														</div>
													</div>
													<div>
														<label htmlFor="file" className="mt-4 block text-sm font-medium leading-6 text-gray-100">
															Chat Prompt
														</label>
														<div className="mt-2">
															<textarea
																id="comment"
																name="comment"
																rows={4}
																className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
																value={chatPrompt}
																onChange={(e) => setChatPrompt(e.target.value)}
															/>
														</div>
													</div>
													<div>
														<label
															htmlFor="email"
															className="mt-4 block text-left text-sm font-medium leading-6 text-gray-200">
															Chunk Count
														</label>
														<div className="mt-2">
															<input
																type="number"
																name="chunkCount"
																id="chunkCount"
																className="block w-full rounded-md border-0 bg-gray-800 py-1.5 text-gray-200 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
																placeholder="1"
																value={chunkCount}
																min={1}
																max={10}
																onChange={(e) => setChunkCount(e.target.value)}
															/>
														</div>
													</div>
												</>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						{(!chatPrompt.includes("{student_question}") || !chatPrompt.includes("{chunk}")) && (
							<div className="rounded-md bg-yellow-50 p-4">
								<div className="flex">
									<div className="flex-shrink-0">
										<ExclamationTriangleIcon aria-hidden="true" className="h-5 w-5 text-yellow-400" />
									</div>
									<div className="ml-3">
										<h3 className="text-sm font-medium text-yellow-800">Chat Prompt Issue</h3>
										<div className="mt-2 text-sm text-yellow-700">
											<p>
												The following variables need to be included in the chat prompt:
												<br />- <code>{"{student_question}"}</code>{" "}
												{chatPrompt.includes("{student_question}") ? "✅" : "❌"}
												<br />- <code>{"{chunk}"}</code> {chatPrompt.includes("{chunk}") ? "✅" : "❌"}
											</p>
										</div>
									</div>
								</div>
							</div>
						)}

						<div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
							<button
								type="button"
								className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:bg-indigo-600 sm:col-start-2"
								onClick={save}
								disabled={
									!name ||
									!model ||
									!systemPrompt ||
									!chatPrompt ||
									!chunkCount ||
									!chatPrompt.includes("{student_question}") ||
									!chatPrompt.includes("{chunk}") ||
									status ||
									(name === textbook.name &&
										model === textbook.model &&
										systemPrompt === textbook.systemPrompt &&
										chatPrompt === textbook.chatPrompt &&
										chunkCount === textbook.chunkCount)
								}>
								{status ? <LoadingSpinner /> : "Save"}
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
