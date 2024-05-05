import { CommodityFuturesItem } from "../(types)/CommodityFuturesItem";
import { CurrencyFuturesItem } from "../(types)/CurrencyFuturesItem";
import { FutureContractsItem } from "../(types)/FutureContractsItem";
import { NSEDisplayType } from "../(types)/NSEOptionsDisplay";
import CalculatorViews from "../../components/CalculatorViews";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";

export default async function page({ searchParams }) {
  const {
    type,
    optiontype,
  }: {
    type:
      | "futurecontracts"
      | "commodityfutures"
      | "currencyfutures"
      | "nseoptions"
      | undefined;
    optiontype: "ce" | "pe" | undefined;
  } = searchParams;

  let data:
    | CommodityFuturesItem[]
    | CurrencyFuturesItem[]
    | FutureContractsItem[]
    | undefined = undefined;
  if (type !== undefined) {
    data = (
      await (
        await fetch(process.env.URL + "/apis/" + type, {
          next: {
            revalidate: 86400,
          },
        })
      ).json()
    ).data;
  } else {
    data = (
      await (
        await fetch(process.env.URL + "/apis/nseoptions", {
          next: {
            revalidate: 86400,
          },
        })
      ).json()
    ).data;
  }
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
