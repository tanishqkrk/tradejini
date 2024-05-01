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
      // console.log("%cDEBOUNCE", "color:red; font-weight: 800");
    });

    search();
  }, [query]);

  return (
    <div className="px-12">
      <div className="w-1/2 flex flex-col gap-12">
        <div className="flex items-center gap-12">
          <div className="flex flex-col gap-1 items-start">
            <span>Product</span>
            <select
              className="p-2 w-64 rounded-lg border-2 border-black white text-black"
              type="text"
            >
              <option value="futures">Futures</option>
              <option value="options">Options</option>
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
                          // setSelectedSymbol(symbol);
                          // setSearchTerm(symbol.TradingSymbol);
                          // setLots(0);
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
        <div className="flex">
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
        </div>
        <div></div>
      </div>
      <div className="w-1/2"></div>
    </div>
  );
}
