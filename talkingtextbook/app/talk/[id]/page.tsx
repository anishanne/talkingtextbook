"use client";

import { type CoreMessage } from "ai";
import { useEffect, useState } from "react";
import { getTextbook } from "@/lib/serverActions";
import { continueConversation } from "@/lib/chat";
import { readStreamableValue } from "ai/rsc";
import { Textbook } from "@/types";
import Link from "next/link";
import Loading from "@/components/loading";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Chat({ params }: { params: { id: string } }) {
	const [textbook, setTextbook] = useState<Textbook | null>(null);
	const [messages, setMessages] = useState<CoreMessage[]>([{ role: "assistant", content: "Hello!" }]);
	const [input, setInput] = useState("");
	useEffect(() => {
		getTextbook(params?.id).then(setTextbook);
	}, [params?.id]);
	return (
		<div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
			{textbook && (
				<div className="flex">
					<h1 className="text-2xl font-bold">{textbook.name} </h1>
					<Link href="/" className="ml-2 inline-block rounded-md bg-indigo-600 px-3 py-1.5 text-sm hover:bg-indigo-500">
						Go Home
					</Link>
				</div>
			)}
			{messages.map((m, i) => (
				<div
					key={i}
					className={
						"mt-2 flex whitespace-pre-wrap rounded-md p-2 " +
						(m.role === "user" ? "bg-blue-600 text-right" : "bg-gray-700")
					}>
					{m.role === "user" ? "User: " : "AI: "}
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

					const result = await continueConversation(newMessages);

					for await (const content of readStreamableValue(result)) {
						setMessages([
							...newMessages.slice(0, newMessages.length - 1),
							{
								role: "assistant",
								content: content as string,
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
		</div>
	);
}
