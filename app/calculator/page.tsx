import {
  FuturesAPIResponse,
  NSEAPIResponse,
} from "../(types)/APIResponseTypes";
import CalculatorViews from "../../components/CalculatorViews";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";

export default async function page({ searchParams }) {
  const {
    type,
  }: {
    type: "futures" | "options" | undefined;
  } = searchParams;

  let data: NSEAPIResponse | FuturesAPIResponse | undefined = undefined;
  if (type === "futures")
    data = (
      await (
        await fetch(process.env.URL + "/apis/futures", {
          next: {
            revalidate: 86400,
          },
        })
      ).json()
    ).data as FuturesAPIResponse;
  else
    data = (
      await (
        await fetch(process.env.URL + "/apis/nseoptions", {
          next: {
            revalidate: 86400,
          },
        })
      ).json()
    ).data as NSEAPIResponse;

  console.log("Data is :");
  console.log(data);
  return (
    <div className="flex -translate-y-8 flex-col gap-4 rounded-t-2xl bg-black p-4 pr-0 dark:bg-white">
      <div className="flex w-full justify-between">
        <div></div>
        <div className="flex justify-center text-center text-3xl font-semibold">
          Margin calculator
        </div>
        <div>
          <ThemeSwitcher />
        </div>
      </div>
      <CalculatorViews symbols={data}></CalculatorViews>
    </div>
  );
}
