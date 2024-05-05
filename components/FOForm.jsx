"use client";

import { useState } from "react";
import { useEffect } from "react";

export default function FOForm({ symbols }) {
  // console.log(symbols);
  const [query, setQuery] = useState("");

  const [results, setResults] = useState([]);

  const [selectedSymbol, setSelectedSymbol] = useState(undefined);
  const [dropdown, setDropdown] = useState(false);

  const [loading, setLoading] = useState(false);

  const [strikeprices, setStrikeprices] = useState(undefined); // number[]

  const [selectedPrice, setSelectedPrice] = useState(0);

  const [cepe, setcepe] = useState("ce");

  useEffect(() => {
    if (symbols) {
      setResults(
        Object.keys(symbols)
          .filter((key) => key.toLowerCase().includes(query.toLowerCase()))
          .reduce((obj, key) => {
            obj[key] = symbols[key];
            return obj;
          }, {})
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

  const [product, setProduct] = useState("Futures");

  const [type, setType] = useState("buy");

  const [added, setAdded] = useState([]);

  const [quantity, setQuantity] = useState(0);

  const [exchange, setExchange] = useState("NFO");

  const [lotSize, setLotSize] = useState(5400);

  function resetAll() {}

  function addItem() {
    if (selectedSymbol) {
      if (!added?.map((x) => x.selectedSymbol).includes(selectedSymbol)) {
        setAdded((x) => [
          ...x,
          {
            id: crypto.randomUUID(),
            product,
            selectedSymbol,
            quantity,
            exchange,
            type,
            lotSize,
            selectedPrice,
            cepe,
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
                    setProduct(e.target.value);
                  }}
                  className=" z-[99999999] p-2 w-72 rounded-lg border-2 border-black   bg-zinc-800 relative dark:bg-white dark:text-black "
                  type="text"
                >
                  <option className="" value="Futures">
                    Futures
                  </option>
                  <option className="" value="Options">
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
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    Object.keys(results)
                      .filter((_, idx) => idx < 20)
                      .map((symbol) => (
                        <div
                          onClick={() => {
                            console.log(symbol);
                            setDropdown(false);
                            setQuery(symbol);
                            setSelectedSymbol(symbol);
                            setExchange(symbol.Exchange || "NFO");
                          }}
                          style={{}}
                          className="flex cursor-pointer items-center justify-between  "
                          key={symbol}
                        >
                          <p className="">{symbol}</p>
                          <p className="text-sm text-red-500">
                            {symbol.Exchange}
                          </p>
                        </div>
                      ))
                  )}
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
                      {symbols[selectedSymbol].map((item) => (
                        <option value={item} key={item}>
                          {item}
                        </option>
                      ))}
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
                          setcepe(e.target.value);
                        }}
                        className="z-[99999999] p-2 w-72 rounded-lg border-2 border-black  bg-zinc-800 relative dark:bg-white dark:text-black "
                        type="text"
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
                  Lot Size: 5400
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
                  onChange={(x) => setType(x.target.value)}
                  value={"buy"}
                  type="radio"
                  id="buy"
                  name="type"
                />
              </div>
              <div className="hidden">
                <input
                  onChange={(x) => setType(x.target.value)}
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
                <div className="text-green-800 font-bold">0</div>
              </div>
              <div className="flex justify-between items-center w-full">
                <div>Exposure margin</div>
                <div className="text-green-800 font-bold">0</div>
              </div>
              <div className="flex justify-between items-center w-full">
                <div>Total margin</div>
                <div className="text-green-800 font-bold">0</div>
              </div>
            </div>
            <div className="flex justify-between items-center bg-green-800 p-5 rounded-b-lg">
              <div className="text-white">Margin Benifit</div>
              <div className="text-green-300 font-semibold">0</div>
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
          {added?.map((x) => {
            return (
              <tr>
                <td className="p-6 text-center">{x.selectedSymbol}</td>
                <td className="p-6 text-center">{x.exchange}</td>
                <td className="p-6 text-center">{x.quantity}</td>
                <td className="p-6 text-center">{x.lotSize}</td>
                <td className={`  p-6 text-center `}>
                  <div
                    className={`${x.type === "buy" ? "bg-green-900 dark:bg-green-400 dark:text-green-800 p-2 dark:border-green-800 border-green-200 border-2 text-green-200 rounded-lg" : "bg-red-900 p-2 border-red-200 border-2 text-red-200 rounded-lg"}`}
                  >
                    {x.type === "buy" ? "BUY" : "SELL"}
                  </div>
                </td>
                <td className="p-6 text-center">{"N/A"}</td>
                <td className="p-6 text-center">{"N/A"}</td>
                <td className="p-6 text-center">{"N/A"}</td>
                <td className="p-6 text-center">{"N/A"}</td>
                <td className="p-6 text-center">
                  <button
                    onClick={() => {
                      setAdded((a) => a.filter((y) => y.id !== x.id));
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
