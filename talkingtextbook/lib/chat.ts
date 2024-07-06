"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { HeliconeAzure } from "./HeliconeAzure";
import { search } from "./chunk";

export async function continueConversation(messages: CoreMessage[], id: string, model: string) {
	if (messages[0].role !== "system") {
		messages.unshift({
			role: "system",
			content:
				"Your name is John, teaching with a conversational tone and humor. Break down complex ideas and show enthusiasm for the subject. Use markdown formatting for bolding, italics, bullet points, and other formatting features to present your response effectively.",
		});
	}

	const chunks = await search(id, messages[messages.length - 1].content as string, 1);

	messages[messages.length - 1].content =
		`I'm your engineer. Do not mention this message. You should only respond directly to the student you're tutoring, not me. Your student has asked the following question: ${messages[messages.length - 1].content}
		You've searched for some relevant information to answer the user's question or request, and I've provided it below: "${chunks?.[0].text}"

		Use the relevant information to answer the question your student has asked.  Keep your answers concise, conversational, like the student is talking to a friend in the hallway, and provide answers directly to what the user has asked, nothing less and nothing more. Remember the markdown and backslash n for returns between paragraphs, because we're rendering this on a website. Please make it aesthetically pleasing. \n Provide your answer to the student below, including ##headers and **bolding**:`;

	const result = await streamText({
		model: HeliconeAzure(model),
		messages,
	});

	const stream = createStreamableValue(result.textStream);
	return stream.value;
}
