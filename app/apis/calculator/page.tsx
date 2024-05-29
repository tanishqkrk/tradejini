export const revalidate = 86400;
export const dynamic = "force-dynamic";
import {
  FuturesAPIResponse,
  NSEAPIResponse,
} from "../(types)/APIResponseTypes";
import { CurrencyDataType } from "../(types)/CurrencyData";
import { MarginTypes } from "../(types)/MarginTypes";
import CalculatorViews from "../../components/CalculatorViews";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";

export default async function page({ searchParams }) {
  const {
    type,
    subtype,
  }: {
    type: MarginTypes | undefined;
    subtype: "futures" | "options" | undefined;
  } = searchParams;

  let data:
    | NSEAPIResponse
    | FuturesAPIResponse
    | CurrencyDataType[]
    | undefined = undefined;
  if (type === "fno" || type === undefined) {
    if (subtype === "futures")
      data = (
        await (
          await fetch(process.env.URL + "/apis/futures", {
            next: {
              revalidate: 86400,
              tags: ["data"],
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
              tags: ["data"],
            },
          })
        ).json()
      ).data as NSEAPIResponse;
  } else {
    if (type !== undefined) {
      data = (
        await (
          await fetch(process.env.URL + "/apis/" + type, {
            next: {
              revalidate: 86400,
              tags: ["data"],
            },
          })
        ).json()
      ).data as CurrencyDataType[];
      console.log("Why TF");
      console.log(data);
    }
  }

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
      <CalculatorViews data={data}></CalculatorViews>
    </div>
  );
}
