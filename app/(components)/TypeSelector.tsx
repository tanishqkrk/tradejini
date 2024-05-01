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

  return (
    <div className="flex flex-row items-center gap-x-5">
      <button className="px-5 py-3 rounded-3xl bg-blue-500 text-white font-bold">
        NSE Futures
      </button>
      <button
        className="px-5 py-3 rounded-3xl bg-blue-500 text-white font-bold"
        onClick={() => {
          router.push(
            pathname + "?" + createQueryString("type", "commodityfutures"),
          );
        }}
      >
        Commodity
      </button>
      <button className="px-5 py-3 rounded-3xl bg-blue-500 text-white font-bold"></button>
      <button className="px-5 py-3 rounded-3xl bg-blue-500 text-white font-bold"></button>
    </div>
  );
}
