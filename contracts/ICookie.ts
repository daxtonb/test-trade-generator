export interface ICookie {
  requestId: string;
  accountTradeCount: number;
  ticker: string;
  symbolId: string;
  brokerageId: string;
  accountIds: string[];
  tradeSide: string;
  quantityType: string;
  routingType: string;
  quantityMin: number;
  quantityMax: number;
  assetType: string;
  xRouteSetId: string;
}
