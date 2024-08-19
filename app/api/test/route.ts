import { search } from "@/lib/chunk";

export async function GET() {
	const results = await search("6683723a0c5e3bac2d87d0d2", "PostgreSQL superuser password");
	return Response.json({ data: results });
}
