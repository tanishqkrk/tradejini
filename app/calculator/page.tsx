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
  if (type === "options")
    data = (
      await (
        await fetch(process.env.URL + "/apis/nseoptions", {
          next: {
            revalidate: 86400,
          },
        })
      ).json()
    ).data as NSEAPIResponse;
  else
    data = (
      await (
        await fetch(process.env.URL + "/apis/futures", {
          next: {
            revalidate: 86400,
          },
        })
      ).json()
    ).data as FuturesAPIResponse;

  console.log("Data is :");
  console.log(data);
  return (
    <div className="p-4 flex flex-col gap-16 bg-black dark:bg-white -translate-y-8 rounded-t-2xl">
      <div className="flex justify-between w-full">
        <div></div>
        <div className="text-3xl font-semibold text-center flex justify-center">
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
