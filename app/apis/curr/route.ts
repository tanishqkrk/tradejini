import xlsx from "node-xlsx";
import { kv } from "@vercel/kv";

export async function GET() {
  const data = await kv.get("curr");
  return Response.json({ data });
}

export async function POST(request: Request) {
  try {
    // const workSheetsFromFile = xlsx.parse(
    //   `/home/bl4z3/Work/tradejini-tanishq/app/apis/curr/cds.xlsx`,
    // );
    const form = await request.formData();
    const file = form.get("file") as File;
    if (!file) return Response.json({ message: "failure" });
    const buffer = await file.arrayBuffer();
    const workSheetsFromFile = xlsx.parse(buffer);
    const data = workSheetsFromFile[0].data.slice(2).map((item) => ({
      symbol: (item[1] as string).trimEnd(),
      expDate: item[2],
      lotSize: Number(item[3]),
      span: item[4],
      exposure: item[5],
      total: item[6],
      totPerc: item[7],
    }));
    await kv.set("curr", data);
    await kv.set("lastupdatedcurr", new Date().toLocaleString("en-GB"));

    return Response.json(data);
  } catch (e) {
    console.log("Error in XLSX");
    console.error(e);
    return Response.json({ error: e });
  }
}
