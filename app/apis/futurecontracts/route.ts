import getAllSymbolData from "../../(helpers)/getAllData";
import { FutureContractsItem } from "../../(types)/FutureContractsItem";

export async function GET() {
  const allData = await getAllSymbolData();
  const futureContractItem = allData.d.data[0];
  const futureContractData = futureContractItem.data.split("|").slice(1);
  const futureContracts: FutureContractsItem[] = futureContractData.map(
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
      } as FutureContractsItem;
    },
  );
  return Response.json({ data: futureContracts });
}
