"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import {
  CommonAPIResponse,
  FuturesAPIResponse,
  NSEAPIResponse,
} from "../app/(types)/APIResponseTypes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";

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
    (searchParams.get("type") as "futures" | "options") || "options",
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
  const [hoverIdx, setHoverIdx] = useState(-1);
  const hoverIdxRef = useRef(-1);
  useEffect(() => {
    hoverIdxRef.current = hoverIdx;
  }, [hoverIdx]);
  function keyDownEvent(evt: KeyboardEvent) {
    if (evt.code === "ArrowDown") {
      setHoverIdx((old) => (old + 1) % 10);
    } else if (evt.code === "ArrowUp") {
      setHoverIdx((old) => {
        if (old === 0) {
          return 9;
        } else {
          return old - 1;
        }
      });
    } else if (evt.code === "Enter") {
      console.log(hoverIdxRef.current);
      const results = Object.keys(symbols)
        .filter((key) => key.toLowerCase().includes(query.toLowerCase()))
        .reduce(
          (obj, key) => ({ ...obj, [key]: symbols[key] }),
          {} as NSEAPIResponse | FuturesAPIResponse,
        );

      console.log(results);
      const symbol = Object.keys(results)[hoverIdxRef.current];
      console.log(symbol);
      setQuery(symbol);
      setSelectedSymbol(symbol);
      if (product === "options")
        setSelectedPrice(
          symbols[symbol].strikePrices[
            Math.floor(symbols[symbol].strikePrices.length / 2)
          ],
        );
      setDropdown(false);
    } else if (evt.code === "Escape") {
      setDropdown(false);
      setQuery("");
    }
  }

  useEffect(() => {
    if (dropdown) {
      setHoverIdx(0);
      document.addEventListener("keydown", keyDownEvent);
    } else {
      document.removeEventListener("keydown", keyDownEvent);
    }
    return () => {
      document.removeEventListener("keydown", keyDownEvent);
    };
  }, [dropdown, query]);
  return (
    <div
      onClick={(_) => {
        setDropdown(false);
      }}
      className="mt-8 flex flex-col items-stretch justify-between pl-12"
    >
      <div className="grid w-full grid-cols-2 justify-between gap-x-20">
        <div className="flex h-full min-h-full flex-col justify-between gap-x-12 gap-y-5">
          <div className="flex items-center justify-start gap-x-16">
            <div className="flex flex-col items-start gap-1">
              <span className="font-semibold text-gray-500">Product</span>
              <div className="relative h-full w-full  rounded-lg bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] dark:from-zinc-400 dark:to-zinc-300">
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
                  className=" relative z-[99999999] w-72 rounded-lg border-2 border-black   bg-black p-2 dark:bg-white dark:text-black "
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
            <div className="relative flex flex-col items-start gap-1">
              <span className="font-semibold text-gray-500">
                Select Symbols
              </span>
              <div className="relative h-full w-full  rounded-lg bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] dark:from-zinc-400 dark:to-zinc-300">
                <input
                  className="relative z-[99999999] w-72 rounded-lg   border-2 border-black bg-black p-2 dark:bg-white dark:text-black"
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setDropdown(true);
                  }}
                />
              </div>
              {query !== "" && dropdown && Object.keys(results).length > 0 && (
                <div className="dropdown absolute top-[110%] z-[999999999999] h-64 w-72 overflow-y-scroll rounded-lg border-2  bg-zinc-800 p-3 text-white shadow-lg dark:bg-white dark:text-black ">
                  {Object.keys(results)
                    .filter((_, idx) => idx < 10)
                    .map((symbol, idx) => (
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
                        className={`flex cursor-pointer items-center justify-between ${hoverIdx === idx ? "bg-blue-500" : ""}`}
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
              <div className="relative flex w-72 flex-col items-start gap-1">
                <span className="font-semibold text-gray-500">
                  Strike Price
                </span>
                <div className="relative h-full w-fit  rounded-lg bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] dark:from-zinc-400 dark:to-zinc-300">
                  {selectedSymbol && selectedPrice !== undefined ? (
                    <select
                      name="strikeprice"
                      className="relative z-[99999999]  w-72 rounded-lg border-2  border-black bg-black p-2 dark:bg-white dark:text-black"
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
                    <select className="relative z-[99999999]  w-72 rounded-lg border-2  border-black bg-black p-2 dark:bg-white dark:text-black">
                      <option value="" hidden></option>
                    </select>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="w-fit font-semibold text-gray-500">Option Type</p>

                <div className="flex h-fit  w-48 cursor-pointer  justify-between rounded-full border-2 border-gray-300">
                  <label
                    className={`w-1/2 rounded-full border-2 border-transparent p-2 text-center  font-semibold transition-all duration-150  ${cepe === "CE" && "border-blue-500 bg-blue-200  text-blue-500"}`}
                    htmlFor="ce"
                  >
                    CE
                  </label>
                  <label
                    className={`w-1/2 rounded-full border-2 border-transparent p-2 text-center font-semibold transition-all duration-150   ${cepe === "PE" && "border-blue-500 bg-blue-200  text-blue-500"}`}
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
            <div className="flex w-72 flex-col justify-end gap-1">
              <span className="flex  w-full items-end justify-between">
                <p className="w-fit font-semibold text-gray-500">No. Of Lots</p>
              </span>
              <div className="relative flex h-full w-full flex-row items-center justify-between gap-x-3 rounded-lg dark:text-black">
                <div className="w-full rounded-lg bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] dark:from-zinc-400  dark:to-zinc-300">
                  <input
                    className="relative z-[99999999] w-full rounded-lg border-2 border-black  bg-black  p-2 py-3 dark:bg-white "
                    type="number"
                    value={lots === 0 ? "" : lots}
                    onChange={(e) => {
                      setLots(parseInt(e.target.value));
                    }}
                  />
                </div>
                <div className="flex w-36 flex-col items-end gap-1 overflow-ellipsis font-semibold">
                  <p className="w-full overflow-ellipsis text-nowrap rounded-lg border-2 border-green-700 bg-gray-200 p-1 text-[10px] text-green-700">
                    Lot Size: {selectedSymbol ? symbols[selectedSymbol].lot : 0}
                  </p>

                  <p className="w-full overflow-hidden overflow-ellipsis text-nowrap rounded-lg border-2 border-green-700 bg-gray-200 p-1 text-[10px] text-green-700">
                    Net Qty.:{" "}
                    {selectedSymbol && lots > 0
                      ? lots * symbols[selectedSymbol].lot
                      : ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-end gap-x-7">
              <div className="">
                <div className="flex w-48  cursor-pointer  justify-between rounded-full border-2 border-gray-300">
                  <label
                    className={`w-1/2 rounded-full border-2 border-transparent p-2 text-center  font-semibold transition-all duration-150  ${type === "buy" && "border-green-700 bg-green-200  text-green-700"}`}
                    htmlFor="buy"
                  >
                    Buy
                  </label>
                  <label
                    className={`w-1/2 rounded-full border-2 border-transparent p-2 text-center font-semibold transition-all duration-150   ${type === "sell" && "border-red-700 bg-red-200  text-red-700"}`}
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
              <div className="flex w-full flex-col-reverse items-end justify-start gap-3">
                <button
                  disabled={selectedSymbol === undefined || lots === 0}
                  onClick={() => {
                    addItem();
                  }}
                  className="disabled:cursor-no w-24 rounded-lg bg-[#19AC63] p-3 text-black disabled:bg-gray-500 dark:text-white"
                >
                  Add
                </button>

                <button
                  onClick={() => {
                    setSelectedPrice(0);
                    setLots(0);
                    setSelectedSymbol(undefined);
                    setQuery("");
                  }}
                  className="disabled:cursor-no w-24 rounded-lg bg-red-500 p-3 text-black disabled:bg-gray-500 dark:text-white"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          <div className="mt-5 flex w-[44rem] flex-row items-end gap-x-3">
            <div className="flex w-[44rem] flex-col gap-3 rounded-xl border-2 border-gray-200">
              <div className="px-5 pt-4 font-bold text-gray-400">
                Required Margin
              </div>
              <div className="grid grid-cols-3 gap-4 text-nowrap px-5 py-3">
                <div className="w-full rounded-xl border-2 border-[#e5e5e5] bg-[#f6f6f6] px-6 py-6 text-center">
                  <div className=" text-[#8b8b8b]">Span Margin</div>
                  <div className=" font-semibold text-green-600">
                    {formatter.format(totals.span)}
                  </div>
                </div>
                <div className="w-full rounded-xl border-2 border-[#e5e5e5] bg-[#f6f6f6] px-6 py-6 text-center">
                  <div className=" text-[#8b8b8b]">Exposure Margin</div>
                  <div className=" font-semibold text-green-600">
                    {formatter.format(totals.exposure)}
                  </div>
                </div>
                <div className="w-full rounded-xl border-2 border-[#e5e5e5] bg-[#f6f6f6] px-6 py-6 text-center">
                  <div className=" text-[#8b8b8b]">Total Margin</div>
                  <div className=" font-semibold text-green-600">
                    {formatter.format(totals.multi)}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-b-xl bg-[#cee9e2] p-5 text-[#276654]">
                <div className="text-xl font-semibold">Margin Benefit</div>
                <div className="text-2xl font-semibold">
                  {formatter.format(totals.benefit)}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="rounded-lg bg-white p-3 dark:bg-zinc-800 dark:text-white"
            >
              <img src="reset.png" alt="" className="h-[1.5em] dark:invert" />
            </button>
          </div>
        </div>
        <div className="max-h-[80vh] w-[50%] rounded-xl">
          <table className="flex max-w-[60vw] flex-row items-center justify-start overflow-x-auto rounded-l-3xl border-b-2 border-l-2 border-t-2 border-gray-200 bg-black dark:bg-white">
            <thead className="sticky left-0 top-0 z-30 flex flex-col rounded-l-3xl text-white/80 dark:text-[#8b8b8b]">
              <tr className="flex flex-col rounded-l-3xl font-normal">
                <th className="min-w-48 bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] font-normal dark:from-zinc-400 dark:to-zinc-300">
                  <p className="bg-zinc-800 py-4 dark:bg-white">Action</p>
                </th>
                <th className="min-w-48 bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] font-normal dark:from-zinc-400 dark:to-zinc-300">
                  <p className="bg-zinc-800 py-4 dark:bg-white">Exchange</p>
                </th>
                <th className="min-w-48 bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] font-normal dark:from-zinc-400 dark:to-zinc-300">
                  <p className="bg-zinc-800 py-4 dark:bg-white">Symbol</p>
                </th>
                <th className="min-w-48 bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] font-normal dark:from-zinc-400 dark:to-zinc-300">
                  <p className="bg-zinc-800 py-4 dark:bg-white">Strike</p>
                </th>
                <th className="min-w-48 bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] font-normal dark:from-zinc-400 dark:to-zinc-300">
                  <p className="bg-zinc-800 py-4 dark:bg-white">Lots</p>
                </th>
                <th className="min-w-48 bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] font-normal dark:from-zinc-400 dark:to-zinc-300">
                  <p className="bg-zinc-800 py-4 dark:bg-white">Instrument</p>
                </th>
                <th className="min-w-48 bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] font-normal dark:from-zinc-400 dark:to-zinc-300">
                  <p className="bg-zinc-800 py-4 dark:bg-white">Span</p>
                </th>
                <th className="min-w-48 bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] font-normal dark:from-zinc-400 dark:to-zinc-300">
                  <p className="bg-zinc-800 py-4 dark:bg-white">Exposure</p>
                </th>

                <th className="min-w-48 bg-gradient-to-t from-zinc-600 to-zinc-400 p-[2px] font-normal dark:from-zinc-400 dark:to-zinc-300">
                  <p className="bg-zinc-800 py-4 dark:bg-white">Total</p>
                </th>
              </tr>
            </thead>
            <tbody className="divide-x-green-200 flex flex-row divide-x border-r border-r-gray-200">
              {marginData.map((x) => (
                <tr
                  key={x.dispSymbol}
                  className="divide-x-gray-200 flex flex-col divide-y"
                >
                  <td className="grid place-items-center">
                    <button
                      onClick={() => {
                        setAdded((a) =>
                          a.filter((y) => y.dispSymbol !== x.dispSymbol),
                        );
                      }}
                      className="w-5 border-none py-3"
                    >
                      <img
                        src="/delete.svg"
                        className="h-[1.9em] invert-0 dark:invert"
                        alt=""
                      />
                    </button>
                  </td>
                  <td className="text-nowrap p-4 px-8 text-center">
                    <p>{x.exch === "NFO" ? "NSE" : x.exch}</p>
                  </td>
                  <td className="text-nowrap p-4 px-8 text-center">
                    {x.dispSymbol.split(" ").slice(0, 2).join(" ")}
                  </td>
                  <td className="text-nowrap p-4 px-8 text-center">
                    {x.instname.slice(0, 3) === "OPT"
                      ? `${x.dispSymbol.split(" ")[2].slice(0, -2)} ${x.dispSymbol.split(" ")[2].slice(-2)}`
                      : "N/A"}
                  </td>
                  <td
                    className={`text-nowrap p-4 px-8 text-center font-bold ${Number(x.netqty) > 0 ? "p-2 text-green-400 dark:text-green-700" : "p-2 text-red-400 dark:text-red-700"}`}
                  >
                    {Number(x.netqty) / x.lotSize}
                  </td>
                  <td className="text-nowrap p-4 px-8 text-center">
                    {x.instname.slice(0, 3) === "FUT" ? "Futures" : "Options"}
                  </td>
                  <td className="text-nowrap p-4 px-8 text-center">
                    {formatter.format(Number(x.span))}
                  </td>
                  <td className="text-nowrap p-4 px-8 text-center">
                    {formatter.format(Number(x.expo))}
                  </td>
                  <td className="text-nowrap p-4 px-8 text-center">
                    {formatter.format(Number(x.span) + Number(x.expo))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-row items-end justify-end pr-14 pt-5">
            <p className="rounded-xl bg-[#cee9e2] p-5 text-xl font-semibold text-[#276654]">
              Total Margin: &nbsp; {formatter.format(totals.total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
