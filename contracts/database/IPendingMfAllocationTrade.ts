import { TradeSideId } from '../enums/TradeSideId';

export default interface PendingMfAllocationTrade {
  pendingMfAccountTradeId: string;
  allocationId: string;
  quantity: number;
  sideId: TradeSideId;
  isApm: boolean;
  apmTradeId?: string;
}
