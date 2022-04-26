import { TradeSideId } from '../enums/TradeSideId';

export default interface PendingAllocationTrade {
  pendingAccountTradeId: string;
  ticker: string;
  allocationId: string;
  tradeQuantity: number;
  allocationQuantity: number;
  sideId: TradeSideId;
  autoTraderAccountTradeQueueId?: string;
  apmTradeId?: string;
  notes?: string;
  createdOn: Date;
  modelId: string;
}
