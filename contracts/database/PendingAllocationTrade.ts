import { TradeSideId } from '../enums/TradeSideId';
import IAccountTrade from '../IAccountTrade';
import IPendingAllocationTrade from './IPendingAllocationTrade';
import { v4 as uuidv4 } from 'uuid';
import IAllocationTrade from '../IAllocationTrade';
import convertSide from '../../utilities/sideConverter';

export default class PendingAllocationTrade implements IPendingAllocationTrade {
  public pendingAccountTradeId: string;
  public allocationId: string;
  public ticker: string;
  public tradeQuantity: number;
  public allocationQuantity: number;
  public sideId: TradeSideId;
  public autoTraderAccountTradeQueueId?: string;
  public apmTradeId?: string;
  public notes?: string;
  public createdOn: Date;
  public modelId: string;

  constructor(accountTrade: IAccountTrade, allocationTrade: IAllocationTrade) {
    this.pendingAccountTradeId = uuidv4();
    this.createdOn = new Date();
    this.modelId = '0e347207-2cd4-4874-b7c4-9be4aee65660'; // can this be random?
    this.mapFrom(accountTrade, allocationTrade);
  }

  private mapFrom(
    accountTrade: IAccountTrade,
    allocationTrade: IAllocationTrade
  ) {
    this.allocationId = allocationTrade.allocationId;
    this.ticker = accountTrade.ticker;
    this.tradeQuantity = accountTrade.quantity;
    this.allocationQuantity = allocationTrade.quantity;
    this.sideId = convertSide(accountTrade.side);
  }
}
