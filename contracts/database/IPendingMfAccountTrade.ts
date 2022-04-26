import { QuantityTypeId } from '../enums/QuantityTypeId';
import { TradeSideId } from '../enums/TradeSideId';

export default interface IPendingMfAccountTrade {
  pendingMfAccountTradeId: string;
  accountId: string;
  ticker: string;
  symbolId: string;
  brokerageId: string;
  qtyType: QuantityTypeId;
  cashOrderQty: number;
  sharesQty: number;
  specialHandling?: string;
  sideId: TradeSideId;
  currentAccountQty: number;
  estDollarAmt: number;
  estSharesAmt: number;
  orderGeneratedTimestamp: Date;
  accountHarvestRequestId?: string;
  workflowRouteId: number;
  createdBy: string;
  createdOn: Date;
  updatedBy?: string;
  updatedOn?: Date;
}
