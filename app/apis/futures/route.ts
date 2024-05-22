export const revalidate = 10;

const URL =
  "https://pre-prod.tradejini.com/spa/services/api.php/symbol_store?version=0";
type APIResponseType = {
  status: "ok" | "not ok";
  d: {
    version: number;
    updated: boolean;
    data: [
      APIDataItem<"FutureContracts">,
      APIDataItem<"NSEOptions">,
      APIDataItem<"CurrencyFuture">,
      APIDataItem<"CommodityFuture">,
    ];
  };
};
type APIDataItem<T> = {
  data: string;
  sortOrder: number;
  name: T;
  idFormat: string;
};

export async function GET() {
  try {
    const req = await fetch(URL, {
      next: {
        revalidate: 86400,
        tags: ["data"],
      },
    });
    const allData = (await req.json()) as APIResponseType;
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
  } catch (e) {
    console.log("Error in GetALL");
    console.error(e);
    return Response.json({ error: e });
  }
}
