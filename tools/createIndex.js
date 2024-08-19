const { MongoClient } = require("mongodb");

// connect to your Atlas deployment
const uri = "MONGODBURI";
const client = new MongoClient(uri);
async function run() {
	try {
		const database = client.db("main");
		const collection = database.collection("textbook_chunks");

		// define your Atlas Vector Search index
		const index = {
			name: "VectorNew",
			type: "vectorSearch",
			definition: {
				fields: [
					{
						type: "vector",
						numDimensions: 1536,
						path: "embeddings",
						similarity: "euclidean",
					},
					{
						type: "filter",
						path: "textbookId",
					},
				],
			},
		};
		const result = await collection.createSearchIndex(index);
		console.log(result);
	} finally {
		await client.close();
	}
}
run().catch(console.dir);
