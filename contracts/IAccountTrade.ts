import { QuantityType } from './enums/QuantityType';
import { RoutingType } from './enums/RoutingType';
import { TradeSide } from './enums/TradeSide';
import IAllocationTrade from './IAllocationTrade';
import IExternalTrade from './IExternalTrade';
import ILotTrade from './ILotTrade';

export default interface IAccountTrade {
  requestId: string;
  routingType: RoutingType;
  ticker: string;
  symbolId: string;
  accountId: string;
  brokerageId: string;
  side: TradeSide;
  quantity: number;
  quantityType: QuantityType;
  fullRedeem: boolean;
  accountQuantityBuiltAt: number;
  complianceAccountTradeId?: string;
  allocationTrades: IAllocationTrade[];
  lotTrades: ILotTrade[];
  externalReferences: IExternalTrade[];
  executionRouteSetId: string;
}
