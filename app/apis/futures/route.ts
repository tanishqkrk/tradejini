import getAllSymbolData from "../../(helpers)/getAllData";

export async function GET() {
  const allData = await getAllSymbolData();
  const futureContractItem = allData.d.data[0];
  const futureContractData = futureContractItem.data.split("|").slice(1);
  const currencyFutureItem = allData.d.data[2];
  const currencyFutureData = currencyFutureItem.data.split("|").slice(1);
  const commodityFutureItem = allData.d.data[3];
  const commodityFutureData = commodityFutureItem.data.split("|").slice(1);
  // const futureContracts: FutureContractsItem[] = futureContractData.map(
  //   (item) => {
  //     const values = item.split(",");
  //     return {
  //       id: values[0],
  //       dispName: values[1],
  //       excToken: Number(values[2]),
  //       lot: Number(values[3]),
  //       tick: Number(values[4]),
  //       asset: values[5],
  //       freezeQty: Number(values[6]),
  //       weekly: values[7],
  //       undId: values[8],
  //     } as FutureContractsItem;
  //   },
  // );
  const dataMap = [
    ...commodityFutureData,
    ...futureContractData,
    ...currencyFutureData,
  ].reduce((map, item) => {
    const values = item.split(",");
    const key = values[1].split(" ").slice(0, 2).join(" ");
    if (!map.has(key)) {
      map.set(key, {
        id: values[0],
        dispName: values[1],
        excToken: Number(values[2]),
        lot: Number(values[3]),
        tick: Number(values[4]),
        asset: values[5],
        freezeQty: Number(values[6]),
        weekly: values[7],
        undId: values[8],
      });
    }
    return map;
  }, new Map());
  return Response.json({ data: Object.fromEntries(dataMap) });
}
