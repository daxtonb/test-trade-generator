import { TradeSide } from '../enums/TradeSide';
import { TradeSideId } from '../enums/TradeSideId';
import { WorkflowRoute } from '../enums/WorkflowRoute';
import IPendingAccountTrade from './IPendingAccountTrade';
import { v4 as uuidv4 } from 'uuid';
import IAccountTrade from '../IAccountTrade';

export default class PendingAccountTrade implements IPendingAccountTrade {
  public accountId: string;
  public brokerageId: string;
  public ticker: string;
  public symbolId: string;
  public pendingAccountTradeId: string;
  public batchBuildEventId: string;
  public buildEventId: string;
  public tradeQuantity: number;
  public accountQuantity: number;
  public sideId: TradeSideId;
  public taxLotHarvestEventId?: string;
  public createdOn: Date;
  public accountHarvestRequestId?: string;
  public workflowRouteId: WorkflowRoute;
  public isApm: boolean;
  public allocationTradeVolumne: number;
  public isSent: boolean;
  public sentTime?: Date;
  public masterAccountId?: string;

  constructor(accountTrade: IAccountTrade) {
    this.mapFrom(accountTrade);

    this.pendingAccountTradeId = uuidv4();
    this.batchBuildEventId = uuidv4();
    this.accountQuantity = 0;
    this.createdOn = new Date();
    this.workflowRouteId = WorkflowRoute.flyer;
    this.isApm = false;
    this.allocationTradeVolumne = 0;
    this.isSent = false;
  }

  private mapFrom(accountTrade: IAccountTrade) {
    this.accountId = accountTrade.accountId;
    this.brokerageId = accountTrade.brokerageId;
    this.ticker = accountTrade.ticker;
    this.symbolId = accountTrade.symbolId;
    this.tradeQuantity = accountTrade.quantity;

    switch (accountTrade.side) {
      case TradeSide.BUY:
        this.sideId = TradeSideId.Buy;
        break;
      case TradeSide.SELL:
        this.sideId = TradeSideId.Sell;
        break;
      default:
        throw new Error(`Unknown trade side: ${accountTrade.side}`);
    }
  }
}
