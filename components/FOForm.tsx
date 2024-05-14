"use client";

import { useEffect, useCallback, useState } from "react";
import {
  CommonAPIResponse,
  FuturesAPIResponse,
  NSEAPIResponse,
} from "../app/(types)/APIResponseTypes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type MarginData = {
  dispQty: string;
  dispSymbol: string;
  exc_id: string;
  exch: string;
  exd: Date | string;
  expo: string;
  expo_trade: string;
  instname: string;
  lotSize: number;
  netqty: string;
  prd: string;
  request_time: Date;
  span: string;
  span_trade: string;
  stat: string;
  symname: string;
};

function convertDate(date: string) {
  const [year, monthIndex, day] = date.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[Number(monthIndex) - 1].toUpperCase();
  const formattedDay = String(day).padStart(2, "0");
  return `${formattedDay}-${monthName}-${year}`;
}

export default function FOForm({
  symbols,
}: {
  symbols: NSEAPIResponse | FuturesAPIResponse;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const [query, setQuery] = useState("");

  const [results, setResults] = useState<NSEAPIResponse | FuturesAPIResponse>(
    symbols,
  );

  const [selectedSymbol, setSelectedSymbol] = useState<string | undefined>(
    undefined,
  );
  const [dropdown, setDropdown] = useState(false);

  const [selectedPrice, setSelectedPrice] = useState<number | undefined>(
    undefined,
  );

  const [cepe, setcepe] = useState<"CE" | "PE">("CE");

  useEffect(() => {
    if (symbols) {
      setResults(
        Object.keys(symbols)
          .filter((key) => key.toLowerCase().includes(query.toLowerCase()))
          .reduce(
            (obj, key) => ({ ...obj, [key]: symbols[key] }),
            {} as NSEAPIResponse | FuturesAPIResponse,
          ),
      );
    }
  }, [query, symbols]);

  // useEffect(() => {
  //   if (selectedSymbol) {
  //     fetch("/apis/getStrikePrices", {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       method: "POST",
  //       body: JSON.stringify({ symbol: selectedSymbol }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setStrikeprices(data.data);
  //         setSelectedPrice(data.data[0]);
  //       });
  //   }
  // }, [selectedSymbol]);

  const [product, setProduct] = useState<"futures" | "options">(
    (searchParams.get("type") as "futures" | "options") || "futures",
  );

  useEffect(() => {
    setTotals({
      span: 0.0,
      exposure: 0.0,
      total: 0.0,
      benefit: 0.0,
      multi: 0.0,
    });
    setQuery("");
    setResults({} as CommonAPIResponse);
    setSelectedPrice(0);
    setSelectedSymbol(undefined);
  }, [product]);
  const [type, setType] = useState<"buy" | "sell">("buy");

  const [added, setAdded] = useState<
    {
      prd: string;
      exch: string;
      symname: string;
      instname: string;
      exd: string | Date;
      netqty: string;
      exc_id: string;
      dispSymbol: string;
      lotSize: number;
      dispQty: string;
      strprc: string;
      optt: string;
    }[]
  >([]);

  const [lots, setLots] = useState(0);

  const [totals, setTotals] = useState({
    span: 0.0,
    exposure: 0.0,
    total: 0.0,
    benefit: 0.0,
    multi: 0.0,
  });

  useEffect(() => {
    // console.log(addedSymbols);
    const URL =
      "https://pre-prod.tradejini.com/spa/services/api.php/span_calc/";
    if (added.length > 0) {
      const promisesArray = added.map((item) =>
        fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            actid: "DUMMY",
            pos: JSON.stringify([item]),
          }),
        }).then((res) => res.json()),
      );
      promisesArray.push(
        fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            actid: "DUMMY",
            pos: JSON.stringify(added),
          }),
        }).then((res) => res.json()),
      );
      Promise.all(promisesArray).then(
        (
          data: {
            status: "ok" | "not ok";
            d: {
              request_time: Date;
              stat: string;
              span: string;
              expo: string;
              span_trade: string;
              expo_trade: string;
            };
          }[],
        ) => {
          const newArr: MarginData[] = [];
          const tot = {
            span: 0.0,
            exposure: 0.0,
            total: 0.0,
            benefit: 0.0,
            multi: 0.0,
          };
          console.log("Data");
          console.log(data);
          data.forEach((item, idx) => {
            if (idx === data.length - 1) {
              tot.span = Number(item.d.span);
              tot.exposure = Number(item.d.expo);
              tot.multi = Number(item.d.expo) + Number(item.d.span);
              tot.benefit = tot.total - tot.multi;
            } else {
              newArr.push({ ...item.d, ...added[idx] });
              tot.total += Number(item.d.span) + Number(item.d.expo);
            }
          });
          setMarginData(newArr);
          setTotals(tot);
        },
      );
    }
  }, [added]);

  const [marginData, setMarginData] = useState<MarginData[]>([]);

  function addItem() {
    if (selectedSymbol) {
      if (!added.find((x) => x.dispSymbol === selectedSymbol)) {
        setAdded((x) => [
          ...x,
          {
            prd: "M",
            exch: symbols[selectedSymbol].id.split("_")[2],
            symname: symbols[selectedSymbol].id.split("_")[1],
            instname: symbols[selectedSymbol].id.split("_")[0],
            exd: convertDate(symbols[selectedSymbol].id.split("_")[3]),
            netqty: String(
              (type === "sell" ? -1 : 1) * symbols[selectedSymbol].lot * lots,
            ),
            exc_id: crypto.randomUUID(),
            dispSymbol: `${selectedSymbol} ${product === "futures" ? "FUT" : selectedPrice + cepe}`,
            // symbols[selectedSymbol].id.split("_")[1] +
            // convertDate(symbols[selectedSymbol].id.split("_")[3]).replaceAll(
            //   "-",
            //   "",
            // ) +
            // cepe[0] +
            // String(selectedPrice),
            lotSize: symbols[selectedSymbol].lot,
            dispQty: String(symbols[selectedSymbol].lot),
            strprc: String(selectedPrice),
            optt: cepe.toUpperCase(),
          },
        ]);
        setSelectedPrice(0);
        setLots(0);
        setSelectedSymbol(undefined);
        setQuery("");
      } else {
        alert("SELECT A DIFFERENT SYMBOL");
      }
    } else {
      alert("SELECT A SYMBOL");
    }
  }

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",

    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="pl-12 flex items-center justify-between flex-col mt-5">
      <div className="flex items-center justify-between w-full gap-x-20">
        <div className="w-[40%] flex flex-col gap-x-12 gap-y-5">
          <div className="flex items-center gap-x-12">
            <div className="flex flex-col gap-1 items-start">
              <span className="text-gray-500 font-semibold">Product</span>
              <div className="relative w-full h-full  bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] rounded-lg dark:to-zinc-300 dark:from-zinc-400">
                <select
                  value={product}
                  onChange={(e) => {
                    router.push(
                      pathname +
                        "?" +
                        createQueryString("type", e.target.value),
                    );
                    setProduct(e.target.value as "futures" | "options");
                  }}
                  className=" z-[99999999] p-2 w-72 rounded-lg border-2 border-black   bg-zinc-800 relative dark:bg-white dark:text-black "
                >
                  <option className="" value="futures">
                    Futures
                  </option>
                  <option className="" value="options">
                    Options
                  </option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-start relative">
              <span className="text-gray-500 font-semibold">
                Select Symbols
              </span>
              <div className="relative w-full h-full  bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] rounded-lg dark:to-zinc-300 dark:from-zinc-400">
                <input
                  className="z-[99999999] p-2 w-72 rounded-lg border-2 border-black   bg-zinc-800 relative dark:bg-white dark:text-black "
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setDropdown(true);
                  }}
                />
              </div>
              {query !== "" && dropdown && Object.keys(results).length > 0 && (
                <div className="absolute h-64 w-72 overflow-y-scroll bg-zinc-800 text-white dark:text-black dark:bg-white border-2  rounded-lg top-[110%] dropdown shadow-lg p-3 z-[999999999999] ">
                  {Object.keys(results)
                    .filter((_, idx) => idx < 20)
                    .map((symbol) => (
                      <div
                        onClick={() => {
                          setDropdown(false);
                          setQuery(symbol);
                          setSelectedSymbol(symbol);
                          if (product === "options")
                            setSelectedPrice(
                              symbols[symbol].strikePrices[
                                Math.floor(
                                  symbols[symbol].strikePrices.length / 2,
                                )
                              ],
                            );
                        }}
                        style={{}}
                        className="flex cursor-pointer items-center justify-between  "
                        key={symbol}
                      >
                        <p className="">{symbol}</p>
                        <p className="text-sm text-red-500">
                          {results[symbol].id.split("_")[2]}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          {product === "options" && (
            <div className="flex items-end gap-x-12">
              <div className="w-72 flex  flex-col gap-1 items-start relative">
                <span className="text-gray-500 font-semibold">
                  Strike Price
                </span>
                <div className="relative w-fit h-full  bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] rounded-lg dark:to-zinc-300 dark:from-zinc-400">
                  {selectedSymbol && selectedPrice !== undefined ? (
                    <select
                      name="strikeprice"
                      className="z-[99999999] p-2  rounded-lg border-2 border-black  w-72 bg-zinc-800 relative dark:bg-white dark:text-black"
                      value={selectedPrice}
                      id=""
                      onChange={(e) => setSelectedPrice(Number(e.target.value))}
                    >
                      {symbols[selectedSymbol].strikePrices?.map(
                        (item: number) => (
                          <option value={item} key={item}>
                            {item}
                          </option>
                        ),
                      )}
                    </select>
                  ) : (
                    <select className="z-[99999999] p-2  rounded-lg border-2 border-black  w-72 bg-zinc-800 relative dark:bg-white dark:text-black">
                      <option value="" hidden></option>
                    </select>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="w-fit text-gray-500 font-semibold">Option Type</p>

                <div className="flex cursor-pointer  rounded-full  border-2 border-gray-300 w-48 justify-between">
                  <label
                    className={`transition-all duration-150 w-1/2 text-center rounded-full p-2  border-2 border-transparent font-semibold  ${cepe === "CE" && "bg-blue-200 text-blue-500  border-blue-500"}`}
                    htmlFor="ce"
                  >
                    CE
                  </label>
                  <label
                    className={`transition-all duration-150 w-1/2 text-center rounded-full p-2 border-2 border-transparent font-semibold   ${cepe === "PE" && "bg-blue-200 text-blue-500  border-blue-500"}`}
                    htmlFor="pe"
                  >
                    PE
                  </label>
                </div>
                <div className="hidden">
                  <input
                    onChange={() => {
                      setcepe("CE");
                    }}
                    value={"CE"}
                    type="radio"
                    id="ce"
                    name="cepe"
                  />
                </div>
                <div className="hidden">
                  <input
                    onChange={(_) => {
                      setcepe("PE");
                    }}
                    value={"PE"}
                    type="radio"
                    id="pe"
                    name="cepe"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex items-end justify-start gap-x-12">
            <div className="flex flex-col gap-1 items-start w-72">
              <span className="flex  justify-between items-center w-full">
                <p className="w-fit text-gray-500 font-semibold">No. Of Lots</p>
                <p className="bg-gray-200 border-2 p-1 rounded-lg text-sm w-fit border-green-700 text-green-700">
                  Lot Size: {selectedSymbol ? symbols[selectedSymbol].lot : 0}
                </p>
              </span>
              <div className="relative w-full h-full p-[2px] rounded-lg items-center justify-between flex flex-row gap-x-3">
                <input
                  className="z-[99999999] p-2 rounded-lg border-2 border-black   bg-zinc-800 relative dark:bg-white dark:text-black w-3/4"
                  type="number"
                  value={lots === 0 ? "" : lots}
                  onChange={(e) => {
                    setLots(parseInt(e.target.value));
                  }}
                />
                <p className="text-nowrap font-semibold">
                  {selectedSymbol && lots > 0
                    ? lots * symbols[selectedSymbol].lot
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-end gap-x-4">
              <div className="">
                <div className="flex cursor-pointer  rounded-full  border-2 border-gray-300 w-48 justify-between">
                  <label
                    className={`transition-all duration-150 w-1/2 text-center rounded-full p-2  border-2 border-transparent font-semibold  ${type === "buy" && "bg-green-200 text-green-700  border-green-700"}`}
                    htmlFor="buy"
                  >
                    Buy
                  </label>
                  <label
                    className={`transition-all duration-150 w-1/2 text-center rounded-full p-2 border-2 border-transparent font-semibold   ${type === "sell" && "bg-red-200 text-red-700  border-red-700"}`}
                    htmlFor="sell"
                  >
                    Sell
                  </label>
                </div>
                <div className="hidden">
                  <input
                    onChange={() => {
                      setType("buy");
                    }}
                    value={"buy"}
                    type="radio"
                    id="buy"
                    name="type"
                  />
                </div>
                <div className="hidden">
                  <input
                    onChange={(_) => {
                      setType("sell");
                    }}
                    value={"sell"}
                    type="radio"
                    id="sell"
                    name="type"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-start items-end w-full">
                <button
                  disabled={selectedSymbol === undefined || lots === 0}
                  onClick={() => {
                    addItem();
                  }}
                  className="bg-[#19AC63] p-3 rounded-lg w-24 text-black dark:text-white disabled:bg-gray-500 disabled:cursor-no"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="bg-zinc-800 p-3 rounded-lg w-24 dark:text-white"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
          <div className="">
            <div className="flex flex-col gap-3 border-2 border-gray-200 rounded-2xl">
              <div className="text-gray-400 font-bold px-5 pt-4">
                Required Margin
              </div>
              <div className="px-5 py-3 grid grid-cols-3 gap-4">
                <div className="text-center bg-[#f6f6f6] rounded-xl border-[#e5e5e5] border-2 w-full py-6">
                  <div className="text-[#8b8b8b] text-xl">Span Margin</div>
                  <div className="text-green-600 text-xl font-semibold">
                    {formatter.format(totals.span)}
                  </div>
                </div>
                <div className="text-center bg-[#f6f6f6] rounded-xl border-[#e5e5e5] border-2 w-full py-6">
                  <div className="text-[#8b8b8b] text-xl">Exposure Margin</div>
                  <div className="text-green-600 text-xl font-semibold">
                    {formatter.format(totals.exposure)}
                  </div>
                </div>
                <div className="text-center bg-[#f6f6f6] rounded-xl border-[#e5e5e5] border-2 w-full py-6">
                  <div className="text-[#8b8b8b] text-xl">Total Margin</div>
                  <div className="text-green-600 text-xl font-semibold">
                    {formatter.format(totals.multi)}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-[#145243] p-5 rounded-b-lg">
                <div className="text-white text-xl font-semibold">
                  Margin Benefit
                </div>
                <div className="text-green-600 text-2xl font-semibold">
                  {formatter.format(totals.benefit)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[55%] rounded-xl max-h-[80vh]">
          <table className="bg-zinc-800 dark:bg-white rounded-l-3xl flex flex-row items-center justify-start border-gray-200 border-2 max-w-[60vw] overflow-x-auto">
            <thead className="bg-[#1A6A55] rounded-l-3xl text-white border-radius sticky top-0 left-0 flex flex-col z-30">
              <tr className="rounded-l-3xl font-normal flex flex-col">
                <th className="min-w-48 font-normal py-4">Action</th>
                <th className="min-w-48 font-normal py-4">Exchange</th>
                <th className="min-w-48 font-normal py-4">Symbol</th>
                <th className="min-w-48 font-normal py-4">Strike</th>
                <th className="min-w-48 font-normal py-4">Lots</th>
                <th className="min-w-48 font-normal py-4">Instrument</th>
                <th className="min-w-48 font-normal py-4">Span</th>
                <th className="min-w-48 font-normal py-4">Exposure</th>
                <th className="min-w-48 font-normal py-4">Total</th>
              </tr>
            </thead>
            <tbody className="flex flex-row divide-x divide-x-gray-200 border-r border-r-gray-200">
              {marginData.map((x) => (
                <tr
                  key={x.dispSymbol}
                  className="flex flex-col divide-y divide-x-gray-200"
                >
                  <td className="grid place-items-center">
                    <button
                      onClick={() => {
                        setAdded((a) =>
                          a.filter((y) => y.dispSymbol !== x.dispSymbol),
                        );
                      }}
                      className="w-5 py-3 border-none"
                    >
                      <img
                        src="/delete.svg"
                        className="invert-0 h-[1.5em] dark:invert"
                        alt=""
                      />
                    </button>
                  </td>
                  <td className="p-4 px-8 text-nowrap text-center">
                    <p>{x.exch === "NFO" ? "NSE" : x.exch}</p>
                  </td>
                  <td className="p-4 px-8 text-nowrap text-center">
                    {x.dispSymbol.split(" ").slice(0, 2).join(" ")}
                  </td>
                  <td className="p-4 px-8 text-nowrap text-center">
                    {x.instname.slice(0, 3) === "OPT"
                      ? `${x.dispSymbol.split(" ")[2].slice(0, -2)} ${x.dispSymbol.split(" ")[2].slice(-2)}`
                      : "N/A"}
                  </td>
                  <td
                    className={`p-4 px-8 text-center text-nowrap font-bold ${Number(x.netqty) > 0 ? "dark:text-green-700 p-2 text-green-400 rounded-lg" : "p-2 text-red-400 dark:text-red-700 rounded-lg"}`}
                  >
                    {Number(x.netqty) / x.lotSize}
                  </td>
                  <td className="p-4 px-8 text-center text-nowrap">
                    {x.instname.slice(0, 3) === "FUT" ? "Futures" : "Options"}
                  </td>
                  <td className="p-4 px-8 text-center text-nowrap">
                    {formatter.format(Number(x.span))}
                  </td>
                  <td className="p-4 px-8 text-center text-nowrap">
                    {formatter.format(Number(x.expo))}
                  </td>
                  <td className="p-4 px-8 text-center text-nowrap">
                    {formatter.format(Number(x.span) + Number(x.expo))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex pt-5 pr-6 flex-row justify-end items-end">
            <p className="p-5 bg-[#cee9e2] font-semibold text-[#276654] text-xl rounded-xl">
              Total Margin: &nbsp; {formatter.format(totals.total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
