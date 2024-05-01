import SearchComponent from "./(components)/SearchComponent";
import TypeSelectorComponent from "./(components)/TypeSelector";
import { CommodityFuturesItem } from "./(types)/CommodityFuturesItem";

export default async function Home({ searchParams }) {
  const {
    type,
    name,
  }: { type: "commodityfutures" | undefined; name: string | undefined } =
    searchParams;
  console.log(searchParams);
  const commodityFutures: CommodityFuturesItem[] = (
    await (await fetch(process.env.URL + "/apis/commodityfutures")).json()
  ).data;
  return (
    <main>
      <TypeSelectorComponent />
      <SearchComponent />
      {type !== undefined && (
        <ul>
          {(type === "commodityfutures" ? commodityFutures : commodityFutures)
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
