# TalkingTextbook

A self-hostable platform to create learning focused chatbots based on textbooks.

## Setting up MongoDB Vector Search

You must use MongoDB Atlas as vector search is not supported on MongoDB Community editions.
In MongoDB Atlas, head over to the `Atlas Search` tab, select Vector Search JSON Editor, and enter the following:

```json
{
	"fields": [
		{
			"numDimensions": 1536,
			"path": "embeddings",
			"similarity": "cosine",
			"type": "vector"
		},
		{
			"path": "textbookId",
			"type": "filter"
		}
	]
}
```

The index should be named `vector_index`.

## Setting up OpenAI / Azure OpenAI

In Azure AI studio, create a project, and then a deployment for `text-embedding-ada-002` and `gpt-4-turbo`.

# Default README.md

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
