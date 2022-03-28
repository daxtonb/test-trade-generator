import React, { useEffect } from 'react';
import { QuantityType } from '../contracts/enums/QuantityType';
import { TradeSide } from '../contracts/enums/TradeSide';
import IAccountTrade from '../contracts/IAccountTrade';
import MinMaxInput from './shared/minMaxInput';
import OptionSelector from './shared/optionSelector';
import { v4 as uuidv4 } from 'uuid';
import { RoutingType } from '../contracts/enums/RoutingType';
import TextInput from './shared/textInput';
import IAllocationTrade from '../contracts/IAllocationTrade';
import textInput from './shared/textInput';

export default () => {
  const requestId = uuidv4();
  const [accountTradeCount, setAccountTradeCount] = React.useState(3);
  const [ticker, setTicker] = React.useState('TICK');
  const [symbolId, setSymbolId] = React.useState(uuidv4());
  const [brokerageId, setBrokerageId] = React.useState(uuidv4());
  const [accountId, setAccountId] = React.useState(uuidv4());
  const [tradeSide, setTradeSide] = React.useState(TradeSide.BUY);
  const [quantityType, setQuantityType] = React.useState(QuantityType.SHARES);
  const [routingType, setRoutingType] = React.useState(RoutingType.STP);
  const [quantityMin, setQuantityMin] = React.useState(3);
  const [quantityMax, setQuantityMax] = React.useState(5);
  const [allocationTradeMax, setallocationTradeMax] = React.useState(5);

  const buildAccountTrades = (): IAccountTrade[] => {
    const accountTrades: IAccountTrade[] = [];

    for (let i = 0; i < accountTradeCount; i++) {
      const accountTrade = buildAccountTrade(
        requestId,
        routingType,
        ticker,
        symbolId,
        brokerageId,
        accountId,
        tradeSide,
        quantityMin,
        quantityMax,
        quantityType
      );

      accountTrade.allocationTrades = buildAllocationTrades(
        accountTrade,
        allocationTradeMax
      );

      accountTrades.push(accountTrade);
    }

    return accountTrades;
  };

  const [accountTrades, setAccountTrades] = React.useState(
    buildAccountTrades()
  );

  useEffect(() => {
    setAccountTrades(buildAccountTrades);
  }, [
    accountTradeCount,
    ticker,
    symbolId,
    brokerageId,
    accountId,
    tradeSide,
    quantityType,
    routingType,
    quantityMin,
    quantityMax,
    allocationTradeMax,
  ]);

  return (
    <div>
      <TextInput
        label="Account Trade Count"
        value={accountTradeCount}
        onChange={setAccountTradeCount}
      />
      <TextInput label="Ticker" value={ticker} onChange={setTicker} />
      <TextInput label="Symobl ID" value={symbolId} onChange={setSymbolId} />
      <TextInput
        label="Brokerage ID"
        value={brokerageId}
        onChange={setBrokerageId}
      />
      <TextInput label="Account ID" value={accountId} onChange={setAccountId} />
      <OptionSelector
        label="Trade Side"
        options={TradeSide}
        onChange={setTradeSide}
        includeMixed
      />
      <OptionSelector
        label="Quantity Type"
        options={QuantityType}
        onChange={setQuantityType}
        includeMixed
      />
      <OptionSelector
        label="Routing Type"
        options={RoutingType}
        onChange={setRoutingType}
      />
      <MinMaxInput
        label="Account Trade Quantity Range"
        minDefault={quantityMin}
        maxDefault={quantityMax}
        onMinChange={setQuantityMin}
        onMaxChange={setQuantityMax}
      />
      <TextInput
        label="Max Sleeve Count"
        value={allocationTradeMax}
        onChange={setallocationTradeMax}
      />
      <div>Request ID: {requestId}</div>
      {accountTrades && (
        <div>
          Total Quantity:{' '}
          {accountTrades &&
            accountTrades.length &&
            accountTrades
              .map((x) => x.quantity)
              .reduce((prev, curr) => prev + curr)}{' '}
        </div>
      )}
      <div className="input-group">
        <label htmlFor="json">JSON</label>
        <textarea
          name="json"
          rows={50}
          cols={100}
          readOnly={true}
          value={JSON.stringify(accountTrades)}
        ></textarea>
      </div>
    </div>
  );
};

const TRADE_SIDES = Object.entries(TradeSide);
const QUANTITY_TYPES = Object.entries(QuantityType);

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
  quantityType: QuantityType
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
    allocationTrades: [],
    lotTrades: [],
    externalReferences: [],
  };

  // Randomly select trade side
  if (!tradeSide) {
    accountTrade.side = TRADE_SIDES[getRandomInt(TRADE_SIDES.length)][1];
  }
  if (accountTrade.side == TradeSide.SELL) {
    accountTrade.quantity *= -1;
  }

  if (!quantityType) {
    accountTrade.quantityType =
      QUANTITY_TYPES[getRandomInt(QUANTITY_TYPES.length)][1];
  }

  return accountTrade;
}

function buildAllocationTrades(
  accountTrade: IAccountTrade,
  countMax: number
): IAllocationTrade[] {
  const allocationTrades: IAllocationTrade[] = [];
  const count = getRandomInt(countMax);
  let remainingQuantity = accountTrade.quantity;

  for (let i = 0; i < count; i++) {
    const allocationTrade: IAllocationTrade = {
      allocationId: uuidv4(),
      quantity: 0,
      side: accountTrade.side,
    };
    if (remainingQuantity == 0) {
      break;
    } else if (i == count - 1) {
      allocationTrade.quantity = remainingQuantity;
    } else {
      const percent = getRandomInt(10, 60) / 100;

      allocationTrade.quantity = Math.floor(percent * remainingQuantity) ?? 1;
      remainingQuantity -= allocationTrade.quantity;
    }

    allocationTrades.push(allocationTrade);
  }

  return allocationTrades;
}
