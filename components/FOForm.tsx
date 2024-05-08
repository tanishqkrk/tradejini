"use client";

import { useCallback, useState } from "react";
import { useEffect } from "react";
import {
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

  function symbolNameConverter(
    selectedSymbol: string,
    cepe: string,
    strikePrice: number,
  ) {
    const [year, monthIndex, day] = symbols[selectedSymbol].id
      .split("_")[3]
      .split("-");
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
    return `${symbols[selectedSymbol].id.split("_")[1]}${formattedDay}${monthName}${year.slice(-2)}${cepe[0]}${strikePrice}`;
  }

  const [query, setQuery] = useState("");

  const [results, setResults] = useState<NSEAPIResponse | FuturesAPIResponse>();

  const [selectedSymbol, setSelectedSymbol] = useState<string | undefined>(
    undefined,
  );
  const [dropdown, setDropdown] = useState(false);

  const [selectedPrice, setSelectedPrice] = useState(0);

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

  useEffect(() => {
    console.log("RESULTS");
    console.log(results);
  }, [results]);

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

  const [quantity, setQuantity] = useState(0);

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

          data.forEach((item, idx) => {
            if (idx === data.length - 1) {
              console.log(item);
              tot.multi = Number(item.d.expo) + Number(item.d.span);
              tot.benefit = Math.abs(tot.span + tot.exposure - tot.multi);
            } else {
              newArr.push({ ...item.d, ...added[idx] });
              tot.span += Number(item.d.span);
              tot.exposure += Number(item.d.expo);
            }
          });
          tot.total = tot.span + tot.exposure;
          console.log(newArr);
          setMarginData(newArr);
          setTotals(tot);
        },
      );
    }
  }, [added]);

  const [marginData, setMarginData] = useState<MarginData[]>([]);

  function addItem() {
    if (selectedSymbol) {
      if (
        !added.find(
          (x) =>
            x.dispSymbol ===
            symbolNameConverter(selectedSymbol, cepe, selectedPrice),
        )
      ) {
        setAdded((x) => [
          ...x,
          {
            prd: "M",
            exch: symbols[selectedSymbol].id.split("_")[2],
            symname: symbols[selectedSymbol].id.split("_")[1],
            instname: symbols[selectedSymbol].id.split("_")[0],
            exd: convertDate(symbols[selectedSymbol].id.split("_")[3]),
            netqty: String(
              (type === "sell" ? -1 : 1) *
                symbols[selectedSymbol].lot *
                quantity,
            ),
            exc_id: crypto.randomUUID(),
            dispSymbol: symbolNameConverter(
              selectedSymbol,
              cepe,
              selectedPrice,
            ),
            // symbols[selectedSymbol].id.split("_")[1] +
            // convertDate(symbols[selectedSymbol].id.split("_")[3]).replaceAll(
            //   "-",
            //   "",
            // ) +
            // cepe[0] +
            // String(selectedPrice),
            lotSize: symbols[selectedSymbol].lot,
            dispQty: String(symbols[selectedSymbol].lot),
            strprc: String(symbols[selectedSymbol].id.split("_")[4]),
            optt: String(symbols[selectedSymbol].id.split("_")[5]),
          },
        ]);
        setSelectedPrice(0);
        setSelectedSymbol(undefined);
        setQuery("");
      } else {
        alert("SELECT A DIFFERENT SYMBOL");
      }
    } else {
      alert("SELECT A SYMBOL");
    }
  }

  return (
    <div className="px-12 flex items-center justify-between flex-col gap-12">
      <div className="flex items-center justify-between w-full">
        <div className="w-1/2 flex flex-col gap-12">
          <div className="flex items-center gap-12">
            <div className="flex flex-col gap-1 items-start">
              <span>Product</span>

              <div className="relative w-full h-full  bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] rounded-lg dark:to-zinc-300 dark:from-zinc-400">
                <select
                  value={product}
                  onChange={(e) => {
                    router.push(
                      pathname +
                        "?" +
                        createQueryString("type", e.target.value),
                    );
                    setProduct(e.target.value);
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
              <span>Select Symbols</span>
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
              {query !== "" && dropdown && (
                <div className="absolute h-64 w-96 overflow-y-scroll bg-zinc-800 text-white dark:text-black dark:bg-white border-2  rounded-lg top-[110%] dropdown shadow-lg p-3 z-[999999999999] ">
                  {Object.keys(results)
                    .filter((_, idx) => idx < 20)
                    .map((symbol) => (
                      <div
                        onClick={() => {
                          console.log(symbol);
                          setDropdown(false);
                          setQuery(symbol);
                          setSelectedSymbol(symbol);
                          if (product === "options")
                            setSelectedPrice(symbols[symbol].strikePrices[0]);
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
          {product === "Options" && (
            <div className="flex items-center gap-12">
              <div className="w-72 flex  flex-col gap-1 items-start relative">
                <span>Strike Price</span>
                <div className="relative w-fit h-full  bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] rounded-lg dark:to-zinc-300 dark:from-zinc-400">
                  {selectedSymbol ? (
                    <select
                      name="strikeprice"
                      className="z-[99999999] p-2  rounded-lg border-2 border-black  w-72 bg-zinc-800 relative dark:bg-white dark:text-black"
                      value={selectedPrice}
                      id=""
                      onChange={(e) => setSelectedPrice(Number(e.target.value))}
                    >
                      {symbols[selectedSymbol].strikePrices.map(
                        (item: number) => (
                          <option value={item} key={item}>
                            {item}
                          </option>
                        ),
                      )}
                    </select>
                  ) : (
                    <select
                      name="strikeprice"
                      className="z-[99999999] p-2  rounded-lg border-2 border-black w-72  bg-zinc-800 relative dark:bg-white dark:text-black"
                      id=""
                    >
                      <option value="Loading"></option>
                    </select>
                  )}
                </div>
              </div>
              <div className="">
                <div className=" flex w-full flex-col gap-1 items-start relative">
                  <span>Option Type</span>
                  <div className="flex cursor-pointer justify-between">
                    <div className="relative w-fit h-full  bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] rounded-lg dark:to-zinc-300 dark:from-zinc-400">
                      <select
                        value={cepe}
                        onChange={(e) => {
                          setcepe(e.target.value as typeof cepe);
                        }}
                        className="z-[99999999] p-2 w-72 rounded-lg border-2 border-black  bg-zinc-800 relative dark:bg-white dark:text-black "
                      >
                        <option className="" value="CE">
                          CE
                        </option>
                        <option className="" value="PE">
                          PE
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1 items-start w-96">
              <span className="flex  justify-between items-center w-full">
                <p className="w-fit">Net Quantity (Lots: 1000)</p>{" "}
                <p className="bg-gray-200 border-2 p-1 rounded-lg text-sm w-fit border-green-700 text-green-700">
                  Lot Size: {selectedSymbol ? symbols[selectedSymbol].lot : 0}
                </p>
              </span>
              <div className="relative w-full h-full  bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] rounded-lg dark:to-zinc-300 dark:from-zinc-400">
                <input
                  className="z-[99999999] p-2 w-full rounded-lg border-2 border-black   bg-zinc-800 relative dark:bg-white dark:text-black "
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(parseInt(e.target.value));
                  }}
                />
              </div>
            </div>
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
          </div>
        </div>

        <div className="w-1/2 p-12">
          <div className="flex flex-col gap-3 border-2 border-gray-200 rounded-lg">
            <div className="text-green-400 font-bold border-b-2 border-gray-200 p-5">
              Required Margin
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center w-full">
                <div>Span margin</div>
                <div className="text-green-800 font-bold">{totals.span}</div>
              </div>
              <div className="flex justify-between items-center w-full">
                <div>Exposure margin</div>
                <div className="text-green-800 font-bold">
                  {totals.exposure}
                </div>
              </div>
              <div className="flex justify-between items-center w-full">
                <div>Total margin</div>
                <div className="text-green-800 font-bold">{totals.multi}</div>
              </div>
            </div>
            <div className="flex justify-between items-center bg-green-800 p-5 rounded-b-lg">
              <div className="text-white">Margin Benefit</div>
              <div className="text-green-300 font-semibold">
                {totals.benefit}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-start items-center w-full">
        <button
          onClick={() => {
            addItem();
          }}
          className="bg-[#19AC63] p-3 rounded-lg w-28 text-black dark:text-white"
        >
          Add
        </button>
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="bg-zinc-800 p-3 rounded-lg w-28 dark:text-white"
        >
          Reset All
        </button>
      </div>
      <div className="w-[90vw]   overflow-auto rounded-xl max-h-[80vh]">
        <table className="table   bg-zinc-800 dark:bg-white    rounded-xl">
          <thead className="bg-[#1A6A55] rounded-xl text-white border-radius sticky top-0">
            <tr className="divide-x-2 divide-gray-300 rounded-xl">
              <th className="min-w-48 py-4 rounded-tl-lg">Symbol</th>
              <th className="min-w-48 py-4">Exchange</th>
              <th className="min-w-48 py-4">No. of Lots</th>
              <th className="min-w-48 py-4">Lot size</th>
              <th className="min-w-48 py-4">Status</th>
              <th className="min-w-48 py-4">Instrument</th>
              <th className="min-w-48 py-4">Span</th>
              <th className="min-w-48 py-4">Exposure</th>
              <th className="min-w-48 py-4">Total</th>
              <th className="min-w-48 py-4 rounded-tr-lg">Action</th>
            </tr>
          </thead>
          {marginData.map((x) => {
            return (
              <tr>
                <td className="p-6 text-center">{x.dispSymbol}</td>
                <td className="p-6 text-center">{x.exch}</td>
                <td className="p-6 text-center">
                  {Math.abs(Number(x.netqty) / x.lotSize)}
                </td>
                <td className="p-6 text-center">{x.lotSize}</td>
                <td className={`  p-6 text-center `}>
                  <div
                    className={`${Number(x.netqty) > 0 ? "bg-green-900 dark:bg-green-400 dark:text-green-800 p-2 dark:border-green-800 border-green-200 border-2 text-green-200 rounded-lg" : "bg-red-900 p-2 border-red-200 border-2 text-red-200 rounded-lg"}`}
                  >
                    {Number(x.netqty) > 0 ? "BUY" : "SELL"}
                  </div>
                </td>
                <td className="p-6 text-center">{x.instname}</td>
                <td className="p-6 text-center">{x.span}</td>
                <td className="p-6 text-center">{x.expo}</td>
                <td className="p-6 text-center">
                  {Number(x.span) + Number(x.expo)}
                </td>
                <td className="p-6 text-center">
                  <button
                    onClick={() => {
                      setAdded((a) =>
                        a.filter((y) => y.dispSymbol !== x.dispSymbol),
                      );
                    }}
                  >
                    <img src="/delete.svg" alt="" />
                  </button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
}
