export type NSEAPIResponse = {
  [key: string]: {
    strikePrices: number[];
    id: string;
    dispName: string;
    excToken: number;
    lot: number;
    tick: number;
    asset: number;
    freezeQty: number;
    weekly: string;
    undId: string;
  };
};
