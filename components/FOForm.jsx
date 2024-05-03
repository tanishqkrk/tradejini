"use client";

import { useState } from "react";
import { useEffect } from "react";

export default function FOForm({ symbols }) {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState([]);

  const [selectedSymbol, setSelectedSymbol] = useState(undefined);
  const [dropdown, setDropdown] = useState(false);

  const [loading, setLoading] = useState(false);

  const [strikeprices, setStrikeprices] = useState(undefined); // number[]

  const [selectedPrice, setSelectedPrice] = useState(0)

  const [cepe, setcepe] = useState("ce");

  useEffect(() => {
    if (symbols) {
      setResults(
        symbols.filter((x) =>
          x.dispName.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, symbols]);

  useEffect(() => {
    if (selectedSymbol) {
      fetch("/apis/getStrikePrices", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ symbol: selectedSymbol }),
      })
        .then((res) => res.json())
        .then((data) => {
          setStrikeprices(data.data);
          setSelectedPrice(data.data[0])
        });
    }
  }, [selectedSymbol]);



  const [product, setProduct] = useState("Futures");

  const [type, setType] = useState("buy");

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
                            setSelectedSymbol(symbol.dispName)
                            setQuery(symbol.dispName);
                            setStrikeprices(undefined);
                            setSelectedPrice(undefined);
                          }}
                          style={{}}
                          className="flex cursor-pointer items-center justify-between  text-black"
                          key={symbol.dispName}
                        >
                          <p className="">{symbol.dispName}</p>
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
              <div className="flex w-full flex-col gap-1 items-start relative">
                <span>Strike Price</span>
                {strikeprices &&
                  <select name="strikeprice" className="w-96 rounded-md text-black py-3 px-2" value={selectedPrice} id="" onChange={(e) => setSelectedPrice(Number(e.target.value))}>
                    {strikeprices.map((item) =>
                      <option value={item} key={item}>{item}</option>
                    )}

                  </select>
                }
              </div>
              <div className="">
                <div className="flex w-full flex-col gap-1 items-start relative">

                  <span>Option Type</span>
                  <div className="flex cursor-pointer  rounded-full  border-2 border-gray-300 w-48 justify-between">
                    <label
                      className={`transition-all duration-150 w-1/2 text-center rounded-full p-2  border-2 border-transparent font-semibold  ${cepe === "ce" && "bg-green-200 text-green-700  border-green-700"}`}
                      htmlFor="cepe"
                    >
                      CE
                    </label>
                    <label
                      className={`transition-all duration-150 w-1/2 text-center rounded-full p-2 border-2 border-transparent font-semibold   ${cepe === "pe" && "bg-red-200 text-red-700  border-red-700"}`}
                      htmlFor="cepe"
                    >
                      PE
                    </label>
                  </div>
                  <div className="hidden">
                    <input
                      onChange={(x) => setcepe(x.target.value)}
                      value={"ce"}
                      type="radio"
                      id="ce"
                      name="cepe"
                    />
                  </div>
                  <div className="hidden">
                    <input
                      onChange={(x) => setcepe(x.target.value)}
                      value={"pe"}
                      type="radio"
                      id="pe"
                      name="cepe"
                    />
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
