"use client";

import { useCallback } from "react";
import FOForm from "./FOForm";
import {
  FuturesAPIResponse,
  NSEAPIResponse,
} from "../app/(types)/APIResponseTypes";
import { CurrencyDataType } from "../app/(types)/CurrencyData";
import { CommodityDataType } from "../app/(types)/CommodityData";
import { EquityFutureData } from "../app/(types)/EquityFutureData";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MarginTypes } from "../app/(types)/MarginTypes";
import EquityFuturesTable from "./EquityFuturesTable";
import CommodityTable from "./CommodityTable";
import CurrencyTable from "./CurrencyTable";
import { EquityData } from "../app/(types)/EquityData";
import EquityTable from "./EquityTable";

export default function CalculatorViews({
  data,
}: {
  data:
    | NSEAPIResponse
    | FuturesAPIResponse
    | undefined
    | CurrencyDataType[]
    | CommodityDataType[]
    | EquityData[]
    | EquityFutureData[];
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

  const type: MarginTypes = (searchParams.get("type") || "fno") as MarginTypes;

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center justify-center gap-12">
        <button
          className={`${
            type === "fno" ? "bg-[#19AC63] text-white" : "text-green-500"
          } rounded-lg p-3 font-semibold transition-all duration-150`}
          onClick={() => {
            router.push(
              pathname + "?" + createQueryString("type", "fno" as MarginTypes),
            );
          }}
        >
          F&O
        </button>
        <button
          className={`${
            type === "ef" ? "bg-[#19AC63] text-white" : "text-green-500"
          } rounded-lg p-3 font-semibold transition-all duration-150`}
          onClick={() => {
            router.push(
              pathname + "?" + createQueryString("type", "ef" as MarginTypes),
            );
          }}
        >
          Equity Futures
        </button>
        <button
          className={`${
            type === "comm" ? "bg-[#19AC63] text-white" : "text-green-500"
          } rounded-lg p-3 font-semibold transition-all duration-150`}
          onClick={() => {
            router.push(
              pathname + "?" + createQueryString("type", "comm" as MarginTypes),
            );
          }}
        >
          Commodity
        </button>
        <button
          className={`${
            type === "curr" ? "bg-[#19AC63] text-white" : "text-green-500"
          } rounded-lg p-3 font-semibold transition-all duration-150`}
          onClick={() => {
            router.push(
              pathname + "?" + createQueryString("type", "curr" as MarginTypes),
            );
          }}
        >
          Currency
        </button>
        <button
          className={`${
            type === "eq" ? "bg-[#19AC63] text-white" : "text-green-500"
          } rounded-lg p-3 font-semibold transition-all duration-150`}
          onClick={() => {
            router.push(
              pathname + "?" + createQueryString("type", "eq" as MarginTypes),
            );
          }}
        >
          Equity
        </button>
      </div>
      <div>
        {type === "fno" ? (
          <FOForm symbols={data as NSEAPIResponse | FuturesAPIResponse} />
        ) : type === "ef" ? (
          <EquityFuturesTable data={data as EquityFutureData[]} />
        ) : type === "comm" ? (
          <CommodityTable data={data as CommodityDataType[]} />
        ) : type === "curr" ? (
          <CurrencyTable data={data as CurrencyDataType[]} />
        ) : type === "eq" ? (
          <EquityTable data={data as EquityData[]} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
