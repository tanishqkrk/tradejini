import getAllSymbolData from "../../(helpers)/getAllData";

export async function POST(request: Request) {
  const { symbol } = await request.json();
  const allData = await getAllSymbolData();
  const nseOptionItem = allData.d.data[1];
  const nseOptionData = nseOptionItem.data.split("|").slice(1);
  const strikePrices = nseOptionData
    .filter((_, idx) => !(idx & 1))
    .map((x) => x.split(",")[1])
    .filter((x) => x.includes(symbol))
    .map((x) => Number(x.split(" ")[2]));
  console.log(strikePrices);
  // const strikePrices = Array.from(
  //   new Set(
  //     nseOptions
  //       .filter((x) => x.dispName.includes(symbol))
  //       .map((x) => Number(x.dispName.split(" ")[2])),
  //   ),
  // );
  return Response.json({ data: strikePrices });
}
