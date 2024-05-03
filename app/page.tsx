import SearchResults from "./(components)/SearchResults";
import TypeSelectorComponent from "./(components)/TypeSelector";
import { CommodityFuturesItem } from "./(types)/CommodityFuturesItem";
import { CurrencyFuturesItem } from "./(types)/CurrencyFuturesItem";
import { FutureContractsItem } from "./(types)/FutureContractsItem";
import { NSEOptionsItem } from "./(types)/NSEOptionsItem";

export default async function Home({ searchParams }) {
  const {
    type,
    optiontype,
  }: {
    type:
      | "futurecontracts"
      | "commodityfutures"
      | "currencyfutures"
      | "nseoptions"
      | undefined;
    optiontype: "ce" | "pe" | undefined;
  } = searchParams;
  console.log(searchParams);
  let data:
    | CommodityFuturesItem[]
    | CurrencyFuturesItem[]
    | FutureContractsItem[]
    | NSEOptionsItem[]
    | undefined = undefined;
  if (type !== undefined)
    if (type === "nseoptions") {
      if (optiontype === "pe")
        data = [
          ...(
            await (
              await fetch(process.env.URL + "/apis/" + type + "/pe/1")
            ).json()
          ).data,
          ...(
            await (
              await fetch(process.env.URL + "/apis/" + type + "/pe/2")
            ).json()
          ).data,
          ...(
            await (
              await fetch(process.env.URL + "/apis/" + type + "/pe/3")
            ).json()
          ).data,
          ...(
            await (
              await fetch(process.env.URL + "/apis/" + type + "/pe/4")
            ).json()
          ).data,
        ];
      else if (optiontype === "ce")
        data = [
          ...(
            await (
              await fetch(process.env.URL + "/apis/" + type + "/ce/1")
            ).json()
          ).data,
          ...(
            await (
              await fetch(process.env.URL + "/apis/" + type + "/ce/2")
            ).json()
          ).data,
          ...(
            await (
              await fetch(process.env.URL + "/apis/" + type + "/ce/3")
            ).json()
          ).data,
          ...(
            await (
              await fetch(process.env.URL + "/apis/" + type + "/ce/4")
            ).json()
          ).data,
        ];
      else data = undefined;
    } else
      data = (await (await fetch(process.env.URL + "/apis/" + type)).json())
        .data;
  return (
    <main>
      <TypeSelectorComponent />
      {type && (type !== "nseoptions" || optiontype) && (
        <SearchResults data={data} />
      )}
    </main>
  );
}
