import getAllSymbolData from "../../(helpers)/getAllData";

export async function GET() {
  const allData = await getAllSymbolData();
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
        map.set(key, []);
      }

      map.get(key).push(Number(values[1].split(" ")[2])); // Add strike price as number
      return map;
    }, new Map());
  return Response.json({ data: Object.fromEntries(dataMap) });
}
