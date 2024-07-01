// @ts-check

const { z } = require("zod");

/* eslint sort-keys: "error" */
const envSchema = z.object({
	MONGODB_URI: z.string(),
	NODE_ENV: z.enum(["development", "test", "production"]),
	OPENAI_API_KEY: z.string(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
	console.error("❌ Invalid environment variables:", JSON.stringify(env.error.format(), null, 4));
	process.exit(1);
}

module.exports.env = env.data;
