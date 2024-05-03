import CalculatorViews from "../../components/CalculatorViews";
import readSymbols from "./(helpers)/SymbolsHelper";

export default async function page() {
  const symbols = await readSymbols();
  // console.log("SS:", symbols);
  return (
    <div className="p-4 flex flex-col gap-16">
      <div className="flex justify-center w-full">
        <div className="text-xl font-bold text-center flex justify-center">
          Margin calculator
        </div>
        <div></div>
      </div>
      <CalculatorViews symbols={symbols}></CalculatorViews>
    </div>
  );
}
