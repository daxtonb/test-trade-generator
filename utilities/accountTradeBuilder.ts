import { QuantityType } from '../contracts/enums/QuantityType';
import { RoutingType } from '../contracts/enums/RoutingType';
import { TradeSide } from '../contracts/enums/TradeSide';
import IAccountTrade from '../contracts/IAccountTrade';
import { v4 as uuidv4 } from 'uuid';

const TRADE_SIDES = Object.entries(TradeSide);
const QUANTITY_TYPES = Object.entries(QuantityType);

export default (
  requestId: string,
  routingType: RoutingType,
  ticker: string,
  symbolId: string,
  brokerageId: string,
  accountIds: string[],
  tradeSide: TradeSide,
  quantityMin: number,
  quantityMax: number,
  quantityType: QuantityType,
  xRouteSetId: string
): IAccountTrade[] => {
  const accountTrades: IAccountTrade[] = [];

  for (let i = 0; i < accountIds.length; i++) {
    const accountTrade = buildAccountTrade(
      requestId,
      routingType,
      ticker,
      symbolId,
      brokerageId,
      accountIds[i],
      tradeSide,
      quantityMin,
      quantityMax,
      quantityType,
      xRouteSetId
    );

    setAllocationTrades(accountTrade);

    // Lazy way of handling flat trades.
    if (tradeSide === TradeSide.FLAT) {
      accountTrade.allocationTrades.push({
        ...accountTrade.allocationTrades[0],
        quantity: -accountTrade.quantity,
        side: TradeSide.SELL,
      });
      accountTrade.quantity = 0;
    }

    accountTrades.push(accountTrade);
  }

  return accountTrades;
};

function getRandomInt(min: number, max?: number): number {
  if (min === max) {
    return min;
  }

  if (!max) {
    return Math.floor(Math.random() * min);
  }

  min = Math.ceil(min);
  max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min) + min);
}

function buildAccountTrade(
  requestId: string,
  routingType: RoutingType,
  ticker: string,
  symbolId: string,
  brokerageId: string,
  accountId: string,
  tradeSide: TradeSide,
  quantityMin: number,
  quantityMax: number,
  quantityType: QuantityType,
  xRouteSetId: string
): IAccountTrade {
  const accountTrade: IAccountTrade = {
    requestId: requestId,
    routingType: routingType ?? RoutingType.STP,
    ticker: ticker,
    symbolId: symbolId,
    accountId: accountId,
    brokerageId: brokerageId,
    side: tradeSide,
    quantity: getRandomInt(quantityMin, quantityMax),
    quantityType: quantityType,
    fullRedeem: false,
    accountQuantityBuiltAt: 0,
    complianceAccountTradeId: undefined,
    executionRouteSetId: xRouteSetId,
    allocationTrades: [],
    lotTrades: [],
    externalReferences: [],
  };

  // If "mixed" was selected, tradeSide will be undefined. Assign this value randomly.
  if (!tradeSide) {
    accountTrade.side = TRADE_SIDES[getRandomInt(TRADE_SIDES.length)][1];
  }
  if (accountTrade.side == TradeSide.SELL) {
    accountTrade.quantity *= -1;
  }

  // If "mixed" was selected, quantityType will be undefined. Assign this value randomly.
  if (!quantityType) {
    accountTrade.quantityType =
      QUANTITY_TYPES[getRandomInt(QUANTITY_TYPES.length)][1];
  }

  return accountTrade;
}

function setAllocationTrades(accountTrade: IAccountTrade) {
  accountTrade.allocationTrades = [];

  let remainingQuantity = Math.abs(accountTrade.quantity);

  while (remainingQuantity) {
    let quantity = getRandomInt(1, remainingQuantity);

    accountTrade.allocationTrades.push({
      allocationId: uuidv4(),
      side:
        accountTrade.side === TradeSide.FLAT
          ? TradeSide.BUY
          : accountTrade.side,
      quantity: accountTrade.side == TradeSide.SELL ? -quantity : quantity,
    });

    remainingQuantity -= quantity;
  }
}
