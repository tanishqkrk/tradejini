import { CommodityFuturesItem } from "../(types)/CommodityFuturesItem";
import { CurrencyFuturesItem } from "../(types)/CurrencyFuturesItem";
import { FutureContractsItem } from "../(types)/FutureContractsItem";
import { NSEDisplayType } from "../(types)/NSEOptionsDisplay";
import CalculatorViews from "../../components/CalculatorViews";

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
    | NSEDisplayType[]
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
  return (
    <div className="p-4 flex flex-col gap-16">
      <div className="flex justify-center w-full">
        <div className="text-xl font-bold text-center flex justify-center">
          Margin calculator
        </div>
        <div></div>
      </div>
      <CalculatorViews symbols={data}></CalculatorViews>
    </div>
  );
}
