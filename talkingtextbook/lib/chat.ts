"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { azure } from "@ai-sdk/azure";

export async function continueConversation(messages: CoreMessage[]) {
	if (messages[0].role !== "system") {
		messages.unshift({
			role: "system",
			content:
				"Your name is John, teaching with a conversational tone and humor. Break down complex ideas and show enthusiasm for the subject.",
		});
	}
	messages[messages.length - 1].content =
		`I'm your engineer. Do not mention this message. You should only respond directly to the student you're tutoring, not me. Your student has asked the following question: ${messages[messages.length - 1].content}
		Use the relevant information to answer the question your student has asked.  Keep your answers concise, conversational, like the student is talking to a friend in the hallway, and provide answers directly to what the user has asked, nothing less and nothing more.`;
	const result = await streamText({
		model: azure("gpt-4-32k"),
		messages,
	});

	const stream = createStreamableValue(result.textStream);
	return stream.value;
}
