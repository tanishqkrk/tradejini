import getAllSymbolData from "../../../../(helpers)/getAllData";
import { NSEOptionsItem } from "../../../../(types)/NSEOptionsItem";

export async function GET() {
  const allData = await getAllSymbolData();
  const nseOptionItem = allData.d.data[1];
  const nseOptionData = nseOptionItem.data.split("|").slice(1);
  const nseOptions: NSEOptionsItem[] = nseOptionData.map((item) => {
    const values = item.split(",");
    return {
      id: values[0],
      dispName: values[1],
      excToken: Number(values[2]),
      lot: Number(values[3]),
      tick: Number(values[4]),
      asset: values[5],
      freezeQty: Number(values[6]),
      weekly: values[7],
      undId: values[8],
    } as NSEOptionsItem;
  });
  const nseOptionsPE = nseOptions.filter((item) => item.id.slice(-2) === "PE");
  const nseOptionsDivided = nseOptionsPE.slice(
    Math.floor(nseOptionsPE.length / 4) + 1,
    Math.floor(nseOptionsPE.length / 2),
  );
  return Response.json({ data: nseOptionsDivided });
}
