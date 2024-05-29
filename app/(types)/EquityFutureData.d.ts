export type EquityFutureData = {
  symbol: string;
  expiry: string | Date;
  lotSize: number;
  span: numer;
  exposure: numer;
  total: numer;
  totPerc: numer;
};
