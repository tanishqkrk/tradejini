"use client";

import { useState } from "react";
import { useEffect } from "react";

export default function FOForm({ symbols }) {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState([]);

  const [dropdown, setDropdown] = useState(false);

  const [loading, setLoading] = useState(false);

  function debounce(cb, delay = 1000) {
    setLoading(true);
    let timeout;
    return (...args) => {
      clearInterval(timeout);
      setLoading(false);
      timeout = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  }

  useEffect(() => {
    console.log("%cNORMAL------------", "color: limegreen; font-weight: 800");
    const search = debounce(() => {
      setResults(
        symbols?.filter((x) =>
          x.TradingSymbol.toLowerCase().includes(query.toLowerCase())
        )
      );
      console.log("%cDEBOUNCE", "color:red; font-weight: 800");
    });

    search();
  }, [query]);

  const [product, setProduct] = useState("Futures");

  const [type, setType] = useState("buy");

  console.log(type);
  return (
    <div className="px-12 flex items-center justify-between flex-col">
      <div className="flex items-center justify-between w-full">
        <div className="w-1/2 flex flex-col gap-12">
          <div className="flex items-center gap-12">
            <div className="flex flex-col gap-1 items-start">
              <span>Product</span>
              <select
                value={product}
                onChange={(e) => {
                  setProduct(e.target.value);
                }}
                className="p-2 w-64 rounded-lg border-2 border-black white text-black"
                type="text"
              >
                <option value="Futures">Futures</option>
                <option value="Options">Options</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 items-start relative">
              <span>Select Symbols</span>
              <input
                className="p-2 w-96 rounded-lg border-2 border-black bg-white text-black"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setDropdown(true);
                }}
              />
              {query !== "" && dropdown && (
                <div className="absolute h-64 w-96 overflow-y-scroll bg-white rounded-lg top-full dropdown shadow-lg p-3">
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    results
                      .filter((_, idx) => idx < 20)
                      .map((symbol) => (
                        <div
                          onClick={() => {
                            setDropdown(false);
                            setQuery(symbol.TradingSymbol);
                          }}
                          style={{}}
                          className="flex cursor-pointer items-center justify-between  "
                          key={symbol.Token}
                        >
                          <p className="">{symbol.TradingSymbol}</p>
                          <p className="text-sm text-gray-500">
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
            <div className="flex gap-3">
              <div className="flex  flex-col gap-1 items-start relative">
                <span>Option Price</span>
                <input
                  className="p-2  rounded-lg border-2 border-black bg-white text-black"
                  type="text"
                />
              </div>
              <div className="flex w- flex-col gap-1 items-start relative">
                <span>Strike Price</span>
                <input
                  className="p-2  rounded-lg border-2 border-black bg-white text-black"
                  type="text"
                />
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
              <input
                className="p-2 w-full rounded-lg border-2 border-black white text-black"
                type="text"
                value={0}
              />
            </div>
            <div className="">
              <div className="flex cursor-pointer  rounded-full  border-2 border-gray-300 w-48 justify-between">
                <label
                  className={`transition-all duration-150 w-1/2 text-center rounded-full p-2  border-2 border-transparent font-semibold  ${type === "buy" && "bg-green-200 text-green-700  border-green-700"}`}
                  for="buy"
                >
                  Buy
                </label>
                <label
                  className={`transition-all duration-150 w-1/2 text-center rounded-full p-2 border-2 border-transparent font-semibold   ${type === "sell" && "bg-red-200 text-red-700  border-red-700"}`}
                  for="sell"
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
            <div className="text-green-800 font-bold border-b-2 border-gray-200 p-5">
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
      <table className="table w-full rounded-t-lg">
        <thead className="bg-green-800 text-white">
          <tr className="divide-x-2 divide-gray-300">
            <th className="p-6">Symbol</th>
            <th className="p-6">Exchange</th>
            <th className="p-6">No. of Lots</th>
            <th className="p-6">Lot size</th>
            <th className="p-6">Status</th>
            <th className="p-6">Instrument</th>
            <th className="p-6">Span</th>
            <th className="p-6">Exposure</th>
            <th className="p-6">Total</th>
            <th className="p-6">Action</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}
