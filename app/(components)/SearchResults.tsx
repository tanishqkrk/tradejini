"use client";

import { CommodityFuturesItem } from "../(types)/CommodityFuturesItem";
import { CurrencyFuturesItem } from "../(types)/CurrencyFuturesItem";
import { FutureContractsItem } from "../(types)/FutureContractsItem";
import { NSEOptionsItem } from "../(types)/NSEOptionsItem";
import { useEffect, useState } from "react";

export default function SearchResults({
  data,
}: {
  data:
    | CommodityFuturesItem[]
    | NSEOptionsItem[]
    | undefined
    | FutureContractsItem[]
    | CurrencyFuturesItem[];
}) {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (selected) {
      fetch("/apis/getStrikePrices", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ symbol: selected }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
  }, [selected]);
  return (
    <>
      <input
        onChange={(e) => setInput(e.target.value)}
        type="text"
        className="text-2xl px-6 py-3 rounded-full border-2 border-white text-white bg-transparent"
      />
      <ul>
        {data && data.length > 0 && (
          <ul>
            {data
              .filter((x) =>
                x.dispName.toLowerCase().includes(input.toLowerCase()),
              )
              .slice(0, 50)
              .map((item) => (
                <li
                  onClick={() => {
                    setSelected(item.dispName);
                  }}
                  key={item.id}
                >
                  {item.dispName}
                </li>
              ))}
          </ul>
        )}
      </ul>
    </>
  );
}
