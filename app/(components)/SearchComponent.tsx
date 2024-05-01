"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SearchComponent() {
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

  const [input, setInput] = useState("");
  useEffect(() => {
    if (input !== "") {
      const debounceId = setTimeout(() => {
        router.push(pathname + "?" + createQueryString("name", input));
      }, 500);

      return () => {
        clearTimeout(debounceId);
      };
    }
  }, [input]);

  return (
    <div className="">
      <input
        onChange={(e) => setInput(e.target.value)}
        type="text"
        className="text-2xl px-6 py-3 rounded-full border-2 border-white text-white bg-transparent"
      />
    </div>
  );
}
