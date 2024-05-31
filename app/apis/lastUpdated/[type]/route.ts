import { kv } from "@vercel/kv";
import { MarginTypes } from "../../../(types)/MarginTypes";

export async function GET(
  request: Request,
  { params }: { params: { type: MarginTypes } },
) {
  const data = await kv.get("lastupdated" + params.type);
  if (data) return Response.json({ lastUpdated: data });
  else return Response.json({ lastUpdated: "Never" });
}
