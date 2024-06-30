import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<div key="1" className="flex min-h-screen flex-col bg-gray-900">
			<header className="flex items-center justify-between bg-gray-800 px-4 py-6 shadow-md">
				<div className="flex items-center">
					<h1 className="text-2xl font-bold text-indigo-500">Talking Textbook</h1>
				</div>
			</header>
			<main className="flex flex-grow flex-col items-center justify-center bg-gray-800 p-4">
				<h2 className="mb-4 text-3xl font-semibold text-indigo-300">
					RAG Chat powered by MongoDB Vector Search + LangChain
				</h2>
				<div className="grid grid-cols-2 gap-2">
					<button className="inline-flex h-10 items-center justify-center rounded-md border-2 border-indigo-500 bg-indigo-500 px-8 text-sm font-medium text-gray-900 shadow transition-colors hover:border-indigo-400 hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600">
						View Textbooks
					</button>
					<Link
						className="inline-flex h-10 items-center justify-center rounded-md border-2 border-indigo-600 px-8 text-sm font-medium text-indigo-600 shadow transition-colors hover:border-indigo-400 hover:bg-indigo-400 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-600"
						href="/create">
						Create Textbook
					</Link>
				</div>
			</main>
		</div>
	);
}
