import { QuantityTypeId } from '../enums/QuantityTypeId';
import { TradeSideId } from '../enums/TradeSideId';
import IAccountTrade from '../IAccountTrade';
import IPendingMfAccountTrade from './IPendingMfAccountTrade';
import { v4 as uuidv4 } from 'uuid';
import convertQauntityType from '../../utilities/quantityTypeConverter';
import { QuantityType } from '../enums/QuantityType';
import convertSide from '../../utilities/sideConverter';
import { WorkflowRoute } from '../enums/WorkflowRoute';

export default class PendingMfAccountTrade implements IPendingMfAccountTrade {
  public pendingMfAccountTradeId: string;
  public accountId: string;
  public ticker: string;
  public symbolId: string;
  public brokerageId: string;
  public qtyType: QuantityTypeId;
  public cashOrderQty: number;
  public sharesQty: number;
  public specialHandling?: string;
  public sideId: TradeSideId;
  public currentAccountQty: number;
  public estDollarAmt: number;
  public estSharesAmt: number;
  public orderGeneratedTimestamp: Date;
  public accountHarvestRequestId?: string;
  public workflowRouteId: number;
  public createdBy: string;
  public createdOn: Date;
  public updatedBy?: string;
  public updatedOn?: Date;
  public executionRouteSetId?: string;

  constructor(accountTrade: IAccountTrade, executionRouteSetId?: string) {
    this.pendingMfAccountTradeId = uuidv4();
    this.orderGeneratedTimestamp = new Date();
    this.workflowRouteId = WorkflowRoute.flyer;
    this.createdBy = 'test';
    this.createdOn = this.orderGeneratedTimestamp;
    this.executionRouteSetId = executionRouteSetId;
    this.MapFrom(accountTrade);
  }

  private MapFrom(accountTrade: IAccountTrade) {
    this.accountId = accountTrade.accountId;
    this.ticker = accountTrade.ticker;
    this.symbolId = accountTrade.symbolId;
    this.brokerageId = accountTrade.brokerageId;
    this.qtyType = convertQauntityType(accountTrade.quantityType);
    this.sideId = convertSide(accountTrade.side);
    this.currentAccountQty = 0;

    if (accountTrade.quantityType == QuantityType.CASH) {
      this.cashOrderQty = accountTrade.quantity;
      this.sharesQty = 0;
      this.estDollarAmt = 0;
      this.estSharesAmt = 10;
    } else {
      this.cashOrderQty = 0;
      this.sharesQty = accountTrade.quantity;
      this.estDollarAmt = 10;
      this.estSharesAmt = 0;
    }
  }
}
