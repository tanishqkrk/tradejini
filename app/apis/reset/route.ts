import { revalidateTag } from "next/cache";
export async function GET() {
  revalidateTag("data");
  return Response.json({ data: "Revalidated!" });
}
