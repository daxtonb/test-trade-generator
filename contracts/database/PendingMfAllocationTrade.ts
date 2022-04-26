import convertSide from '../../utilities/sideConverter';
import { TradeSideId } from '../enums/TradeSideId';
import IAccountTrade from '../IAccountTrade';
import IAllocationTrade from '../IAllocationTrade';
import IPendingMfAllocationTrade from './IPendingMfAllocationTrade';

export default class PendingMfAllocationTrade
  implements IPendingMfAllocationTrade
{
  pendingMfAccountTradeId: string;
  allocationId: string;
  quantity: number;
  sideId: TradeSideId;
  isApm: boolean;
  apmTradeId?: string;

  constructor(accountTrade: IAccountTrade, allocationTrade: IAllocationTrade) {
    this.allocationId = allocationTrade.allocationId;
    this.quantity = allocationTrade.quantity;
    this.sideId = convertSide(accountTrade.side);
    this.isApm = false;
  }
}
