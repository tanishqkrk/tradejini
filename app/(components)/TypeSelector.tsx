"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function TypeSelectorComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  function setType(type: string) {
    router.push(pathname + "?" + createQueryString("type", type));
  }
  function setCEPE(type: string) {
    router.push(pathname + "?" + createQueryString("optiontype", type));
  }
  return (
    <>
      <div className="flex flex-row items-center gap-x-5">
        <button
          onClick={() => setType("futurecontracts")}
          className="px-5 py-3 rounded-3xl bg-blue-500 text-white font-bold"
        >
          Future Contracts
        </button>
        <button
          className="px-5 py-3 rounded-3xl bg-blue-500 text-white font-bold"
          onClick={() => {
            setType("commodityfutures");
          }}
        >
          Commodity
        </button>
        <button
          onClick={() => {
            setType("currencyfutures");
          }}
          className="px-5 py-3 rounded-3xl bg-blue-500 text-white font-bold"
        >
          Currency Futures
        </button>
        <button
          onClick={() => setType("nseoptions")}
          className="px-5 py-3 rounded-3xl bg-blue-500 text-white font-bold"
        >
          NSE Options
        </button>
      </div>
      {searchParams.get("type") === "nseoptions" && (
        <div className="mt-8 flex flex-row gap-x-5">
          <button
            onClick={() => setCEPE("ce")}
            className={`px-8 py-3 rounded-2xl border-2 ${searchParams.get("optiontype") === "ce" ? "border-blue-500 text-blue-500" : "border-white text-white"} font-bold text-xl`}
          >
            CE
          </button>
          <button
            onClick={() => setCEPE("pe")}
            className={`px-8 py-3 rounded-2xl border-2 ${searchParams.get("optiontype") === "pe" ? "border-blue-500 text-blue-500" : "border-white text-white"} font-bold text-xl`}
          >
            PE
          </button>
        </div>
      )}
    </>
  );
}
