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
        revalidate: 10,
        tags: ["data"],
      },
    });
    const allData = (await req.json()) as APIResponseType;
    const nseOptionItem = allData.d.data[1];
    const nseOptionData = nseOptionItem.data.split("|").slice(1);
    // const nseOptions: NSEOptionsItem[] = nseOptionData
    //   .filter((_, idx) => !(idx & 1))
    //   .map((item) => {
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
    //     } as NSEOptionsItem;
    //   });
    const dataMap = nseOptionData
      .filter((_, idx) => !(idx & 1))
      .reduce((map, item) => {
        const values = item.split(",");
        const key = values[1].split(" ").slice(0, 2).join(" ");
        if (!map.has(key)) {
          map.set(key, {
            strikePrices: [],
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
        // map.get(key).push(Number(values[1].split(" ")[2])); // Add strike price as number
        const old = map.get(key);
        old.strikePrices.push(Number(values[1].split(" ")[2]));
        map.set(key, old);

        return map;
      }, new Map());
    return Response.json({ data: Object.fromEntries(dataMap) });
  } catch (e) {
    console.log("Error in GetALL");
    console.error(e);
    return Response.json({ error: e });
  }
}
