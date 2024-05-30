"use client";
import { useState } from "react";
import { EquityFutureData } from "../app/(types)/EquityFutureData";

export default function EquityFuturesTable({
  data,
}: {
  data: EquityFutureData[];
}) {
  const [query, setQuery] = useState("");
  if (data)
    return (
      <div className="grid w-full place-items-center px-20">
        <div className="flex w-full flex-row items-baseline justify-center gap-x-5">
          <input
            type="text"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            value={query}
            placeholder="Search"
            className="mt-5 w-1/4 rounded-3xl border-2 border-gray-500 bg-black px-8 py-4 text-white placeholder:font-semibold placeholder:text-white dark:bg-white dark:text-black placeholder:dark:text-black"
          />
          <button
            onClick={() => {
              setQuery("");
            }}
            className="rounded-lg bg-white p-1 dark:bg-zinc-800 dark:text-white"
          >
            <img src="reset.png" alt="" className="h-6 dark:invert" />
          </button>
        </div>
        <table className="relative mt-20 h-full max-h-[40vh] w-full overflow-y-auto rounded-3xl bg-black dark:bg-white ">
          <thead className="sticky left-0 top-0 z-30 rounded-t-3xl border-b-2 border-gray-200 text-white/80 dark:text-[#8b8b8b]">
            <tr className="relative rounded-t-3xl font-normal">
              <th className="min-w-40 rounded-tl-3xl  font-normal">
                <p className="rounded-tl-2xl bg-zinc-800 py-3 dark:bg-[#f6f6f6]">
                  Contract
                </p>
              </th>
              <th className="min-w-40   font-normal ">
                <p className="bg-zinc-800 py-3 dark:bg-[#f6f6f6]">Span</p>
              </th>
              <th className="min-w-40   font-normal ">
                <p className="bg-zinc-800 py-3  dark:bg-[#f6f6f6]">Exposure</p>
              </th>
              <th className="min-w-40   font-normal ">
                <p className="bg-zinc-800 py-3  dark:bg-[#f6f6f6]">
                  Total Margin
                </p>
              </th>
              <th className="min-w-40   rounded-tr-3xl font-normal">
                <p className="rounded-tr-3xl bg-zinc-800 py-3  dark:bg-[#f6f6f6]">
                  Total Margin %
                </p>
              </th>
            </tr>
          </thead>
          <tbody className="w-full border-b border-t">
            {data
              ?.filter((item) =>
                item.symbol.toLowerCase().includes(query.toLowerCase()),
              )
              .map((x) => (
                <tr
                  key={x.symbol + x.expiry}
                  className="h-full min-h-full border-b-2 border-l-2 border-r-2 border-b-gray-200 border-r-gray-200"
                >
                  <td className="flex flex-col gap-y-1 text-nowrap  p-[14px] px-8 text-center">
                    <div className="flex flex-row items-baseline gap-x-3">
                      <h5 className="font-semibold">{x.symbol}</h5>
                      <h5 className="text-sm">{x.expiry.toString()}</h5>
                    </div>
                    <div className="flex flex-row items-baseline gap-x-3">
                      <h5 className="">Lot Size</h5>
                      <h5 className="text-sm">{x.lotSize}</h5>
                    </div>
                  </td>
                  <td className="text-nowrap  p-[14px] px-8 text-center">
                    {x.span}
                  </td>
                  <td className="text-nowrap  p-[14px] px-8 text-center">
                    {x.exposure}
                  </td>
                  <td className="text-nowrap  p-[14px] px-8 text-center">
                    {x.total}
                  </td>
                  <td className="text-nowrap  p-[14px] px-8 text-center">
                    {x.totPerc}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  return <></>;
}
