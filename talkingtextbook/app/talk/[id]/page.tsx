"use client";

import { type CoreMessage } from "ai";
import { useEffect, useState } from "react";
import { getTextbook, updateModel } from "@/lib/serverActions";
import { continueConversation } from "@/lib/chat";
import { readStreamableValue } from "ai/rsc";
import { Textbook } from "@/types";
import Link from "next/link";
import Loading from "@/components/loading";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, Cog6ToothIcon } from "@heroicons/react/20/solid";
import UpdateTextbook from "@/components/editTextbook";

import { modelList } from "@/config";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Chat({ params }: { params: { id: string } }) {
	const [id, setId] = useState(params.id);
	const [textbook, setTextbook] = useState<Textbook | null>(null);
	const [openSettings, setOpenSettings] = useState(false);
	const [messages, setMessages] = useState<Array<CoreMessage & { model?: string }>>([
		{ role: "assistant", content: "Hello!", model: "" },
	]);
	const [input, setInput] = useState("");
	const [model, setModel] = useState("gpt-4o");

	useEffect(() => {
		getTextbook(params?.id).then(setTextbook);
		setId(params?.id);
	}, [params?.id]);

	useEffect(() => {
		if (textbook?.model) setModel(textbook.model);
	}, [textbook]);

	useEffect(() => {
		updateModel(id, model);
	}, [model]);

	return (
		<div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
			{textbook && (
				<div className="flex">
					<h1 className="text-2xl font-bold">{textbook.name} </h1>
					<Link href="/" className="mx-2 inline-block rounded-md bg-indigo-600 px-3 py-2 text-sm hover:bg-indigo-500">
						Go Home
					</Link>
					<Listbox value={model} onChange={setModel}>
						<div className="relative">
							<ListboxButton className="relative w-full cursor-default rounded-md bg-gray-800 py-1.5 pl-3 pr-10 text-left text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
								<span className="block min-w-20 truncate">{model}</span>
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
										<span className="block truncate font-normal group-data-[selected]:font-semibold">{model}</span>

										<span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
											<CheckIcon aria-hidden="true" className="h-5 w-5" />
										</span>
									</ListboxOption>
								))}
							</ListboxOptions>
						</div>
					</Listbox>
					<button
						onClick={() => {
							setOpenSettings(true);
						}}>
						<Cog6ToothIcon className="ml-2 h-8 w-8 hover:text-indigo-600" />
					</button>
				</div>
			)}
			{messages.map((m, i) => (
				<div
					key={i}
					className={
						"mt-2 flex whitespace-pre-wrap rounded-md p-2 " +
						(m.role === "user" ? "bg-blue-600 text-right" : "bg-gray-700")
					}>
					{m.role === "user" ? "User: " : `${m.model || "AI"}: `}
					{!m.content && <Loading />}
					{m.content as string}
				</div>
			))}

			<form
				onSubmit={async (e) => {
					e.preventDefault();
					const newMessages: CoreMessage[] = [
						...messages,
						{ content: input, role: "user" },
						{ role: "assistant", content: "" },
					];

					setMessages(newMessages);
					setInput("");

					const result = await continueConversation(
						newMessages.slice(0, newMessages.length - 1),
						params.id,
						textbook!!,
					);

					for await (const content of readStreamableValue(result)) {
						setMessages([
							...newMessages.slice(0, newMessages.length - 1),
							{
								role: "assistant",
								content: content as string,
								model,
							},
						]);
					}
				}}>
				<input
					className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-gray-600 bg-gray-700 p-2 shadow-xl"
					value={input}
					placeholder="Say something..."
					onChange={(e) => setInput(e.target.value)}
				/>
			</form>
			<UpdateTextbook open={openSettings} setOpen={setOpenSettings} id={id} textbook={textbook} />
		</div>
	);
}
