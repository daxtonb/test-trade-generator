import { TradeSideId } from '../enums/TradeSideId';
import { WorkflowRoute } from '../enums/WorkflowRoute';
import IPendingAccountTrade from './IPendingAccountTrade';
import { v4 as uuidv4 } from 'uuid';
import IAccountTrade from '../IAccountTrade';
import convertSide from '../../utilities/sideConverter';

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
  public allocationTradeVolume: number;
  public isSent: boolean;
  public sentTime?: Date;
  public masterAccountId?: string;

  constructor(accountTrade: IAccountTrade, accountQuantity: number) {
    this.mapFrom(accountTrade);

    this.pendingAccountTradeId = uuidv4();
    this.batchBuildEventId = uuidv4();
    this.buildEventId = uuidv4();
    this.accountQuantity = accountQuantity;
    this.createdOn = new Date();
    this.workflowRouteId = WorkflowRoute.flyer;
    this.isApm = false;
    this.allocationTradeVolume = 0;
    this.isSent = false;
  }

  private mapFrom(accountTrade: IAccountTrade) {
    this.accountId = accountTrade.accountId;
    this.brokerageId = accountTrade.brokerageId;
    this.ticker = accountTrade.ticker;
    this.symbolId = accountTrade.symbolId;
    this.tradeQuantity = accountTrade.quantity;
    this.sideId = convertSide(accountTrade.side);
  }
}
