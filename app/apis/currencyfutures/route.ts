import getAllSymbolData from "../../(helpers)/getAllData";
import { CurrencyFuturesItem } from "../../(types)/CurrencyFuturesItem";

export async function GET() {
  const allData = await getAllSymbolData();
  const currencyFutureItem = allData.d.data[2];
  const currencyFutureData = currencyFutureItem.data.split("|").slice(1);
  const currencyFutures: CurrencyFuturesItem[] = currencyFutureData.map(
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
        lotMulti: Number(values[9]),
      } as CurrencyFuturesItem;
    },
  );
  return Response.json({ data: currencyFutures });
}
