import { QuantityType } from '../contracts/enums/QuantityType';
import { RoutingType } from '../contracts/enums/RoutingType';
import { TradeSide } from '../contracts/enums/TradeSide';
import IAccountTrade from '../contracts/IAccountTrade';
import { v4 as uuidv4 } from 'uuid';
import IAllocationTrade from '../contracts/IAllocationTrade';

interface IComplianceTrade {
  ticker: string;
  symbolId: string;
  tradeQuantity: number;
  side: string;
  quantityType: QuantityType;
  executionRouteSetId: string;
  routingType: string;
  accountTrades: IComplianceAccountTrade[];
}

interface IComplianceAccountTrade {
  pendingAccountTradeId: string;
  accountId: string;
  tradeQuantity: number;
  side: string;
  holdingQuantity: number;
  allocationTrades: IComplianceAllocationTrade[];
}

interface IComplianceAllocationTrade {
  allocationId: string;
  tradeQuantity: number;
  side: TradeSide;
}

export default function convertFromTradeRouting(
  accountTrades: IAccountTrade[]
): IComplianceTrade {
  if (!accountTrades || !accountTrades.length) {
    return {} as IComplianceTrade;
  }
  const {
    ticker,
    side,
    executionRouteSetId,
    routingType,
    symbolId,
    quantityType,
  } = accountTrades[0];
  let totalQuantity = 0;

  accountTrades.forEach((x) => (totalQuantity += x.quantity));

  return {
    ticker,
    symbolId,
    executionRouteSetId,
    side,
    tradeQuantity: totalQuantity,
    quantityType,
    routingType: getRoutingType(routingType),
    accountTrades: accountTrades.map((x) => convertFromAccountTrade(x)),
  };
}

function convertFromAccountTrade(
  accountTrade: IAccountTrade
): IComplianceAccountTrade {
  return {
    pendingAccountTradeId: uuidv4(),
    accountId: accountTrade.accountId,
    tradeQuantity: accountTrade.quantity,
    side: accountTrade.side,
    holdingQuantity: 0,
    allocationTrades: accountTrade.allocationTrades.map((x) =>
      convertFromAllocationTrade(x)
    ),
  };
}

function convertFromAllocationTrade(
  allocationTrade: IAllocationTrade
): IComplianceAllocationTrade {
  return {
    allocationId: allocationTrade.allocationId,
    tradeQuantity: allocationTrade.quantity,
    side: allocationTrade.side,
  };
}

function getRoutingType(routingType: RoutingType): string {
  switch (routingType) {
    case RoutingType.STP:
      return 'straightThroughProcessing';
    case RoutingType.HTE:
      return 'highTouchExecution';
    case RoutingType.Manual:
      return 'manual';
    default:
      throw new Error(`Unknown routing type ${routingType}`);
  }
}
