"use client";

import { useCallback, useState } from "react";
import FOForm from "./FOForm";
import { CurrencyFuturesItem } from "../app/(types)/CurrencyFuturesItem";
import { FutureContractsItem } from "../app/(types)/FutureContractsItem";
import { CommodityFuturesItem } from "../app/(types)/CommodityFuturesItem";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function CalculatorViews({
  symbols,
}: {
  symbols:
    | CommodityFuturesItem[]
    | CurrencyFuturesItem[]
    | FutureContractsItem[]
    | undefined;
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

  const [view, setView] = useState(0);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-center items-center gap-12">
        <button
          className={`${
            view === 0 && "bg-theme text-white"
          } p-3 rounded-lg font-semibold transition-all duration-150`}
          onClick={() => {
            setView(0);
            router.push(
              pathname + "?" + createQueryString("type", "nseoptions"),
            );
          }}
        >
          F&O
        </button>
        <button
          className={`${
            view === 1 && "bg-theme text-white"
          } p-3 rounded-lg font-semibold transition-all duration-150`}
          onClick={() => {
            setView(1);
          }}
        >
          Equity Futures
        </button>
        <button
          className={`${
            view === 2 && "bg-theme text-white"
          } p-3 rounded-lg font-semibold transition-all duration-150`}
          onClick={() => {
            setView(2);
          }}
        >
          Comodity
        </button>
        <button
          className={`${
            view === 3 && "bg-theme text-white"
          } p-3 rounded-lg font-semibold transition-all duration-150`}
          onClick={() => {
            setView(3);
          }}
        >
          Currency
        </button>
        <button
          className={`${
            view === 4 && "bg-theme text-white"
          } p-3 rounded-lg font-semibold transition-all duration-150`}
          onClick={() => {
            setView(4);
          }}
        >
          Equity
        </button>
      </div>
      <div>
        {view === 0 ? (
          <FOForm symbols={symbols} />
        ) : view === 1 ? (
          <div></div>
        ) : view === 2 ? (
          <div></div>
        ) : view === 3 ? (
          <div></div>
        ) : view === 4 ? (
          <div></div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
