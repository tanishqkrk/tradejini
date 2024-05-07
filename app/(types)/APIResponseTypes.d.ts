export interface CommonAPIResponse {
  id: string;
  dispName: string;
  excToken: number;
  lot: number;
  tick: number;
  asset: number;
  freezeQty: number;
  weekly: string;
  undId: string;
}

export type FuturesAPIResponse = CommonAPIResponse & {
  strikePrices?: number[];
};

export type NSEAPIResponse = CommonAPIResponse & {
  strikePrices: number[];
};
