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
  if (type !== undefined) {
    data = (
      await (
        await fetch(process.env.URL + "/apis/" + type, {
          next: {
            revalidate: 86400,
          },
        })
      ).json()
    ).data;
  }
  return (
    <main>
      <TypeSelectorComponent />
      {type && <SearchResults data={data} />}
    </main>
  );
}
