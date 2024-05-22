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

export default async function getAllSymbolData() {
  try {
    const req = await fetch(URL, {
      next: {
        revalidate: 86400,
      },
    });
    const res = (await req.json()) as APIResponseType;
    return res;
  } catch (e) {
    console.log("Error in GetALL");
    console.error(e);
  }
}
