import SearchComponent from "./(components)/SearchComponent";
import TypeSelectorComponent from "./(components)/TypeSelector";
import { CommodityFuturesItem } from "./(types)/CommodityFuturesItem";
import { CurrencyFuturesItem } from "./(types)/CurrencyFuturesItem";
import { FutureContractsItem } from "./(types)/FutureContractsItem";
import { NSEOptionsItem } from "./(types)/NSEOptionsItem";

export default async function Home({ searchParams }) {
  const {
    type,
    name,
  }: {
    type:
      | "futurecontracts"
      | "commodityfutures"
      | "currencyfutures"
      | "nseoptions"
      | undefined;
    name: string | undefined;
  } = searchParams;
  console.log(searchParams);
  let data:
    | CommodityFuturesItem[]
    | CurrencyFuturesItem[]
    | FutureContractsItem[]
    | NSEOptionsItem[] = [];
  if (type !== undefined)
    if (type === "nseoptions") {
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
    } else
      data = (await (await fetch(process.env.URL + "/apis/" + type)).json())
        .data;
  return (
    <main>
      <TypeSelectorComponent />
      <SearchComponent />
      {type !== undefined && (
        <ul>
          {data
            .slice(0, 50)
            .filter((x) =>
              x.dispName.toLowerCase().includes(name?.toLowerCase()),
            )
            .map((item) => (
              <li key={item.id}>{item.dispName}</li>
            ))}
        </ul>
      )}
    </main>
  );
}
