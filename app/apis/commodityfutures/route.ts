import getAllSymbolData from "../../(helpers)/getAllData";
import { CommodityFuturesItem } from "../../(types)/CommodityFuturesItem";

export async function GET() {
  const allData = await getAllSymbolData();
  const commodityFutureItem = allData.d.data[3];
  const commodityFutureData = commodityFutureItem.data.split("|").slice(1);
  const commodityFutures: CommodityFuturesItem[] = commodityFutureData.map(
    (item) => {
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
        trdUnit: values[9],
      } as CommodityFuturesItem;
    },
  );
  return Response.json({ data: commodityFutures });
}
