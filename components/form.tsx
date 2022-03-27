import React from 'react';
import { QuantityType } from '../contracts/enums/QuantityType';
import { TradeSide } from '../contracts/enums/TradeSide';
import IAccountTrade from '../contracts/IAccountTrade';
import MinMaxInput from './shared/minMaxInput';
import OptionSelector from './shared/optionSelector';
import { v4 as uuidv4 } from 'uuid';
import { RoutingType } from '../contracts/enums/RoutingType';
import TextInput from './shared/textInput';

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

  const buildAccountTrades = (): IAccountTrade[] => {
    const accountTrades: IAccountTrade[] = [];
    const tradeSides = Object.entries(TradeSide);
    console.log(tradeSides);
    for (let i = 0; i < accountTradeCount; i++) {
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
        accountTrade.side =
          tradeSides[getRandomInt(tradeSides.length, tradeSides.length)[1]];
      }
      if (accountTrade.side == TradeSide.SELL) {
        accountTrade.quantity *= -1;
      }

      accountTrades.push(accountTrade);
    }

    return accountTrades;
  };

  const [accountTrades, setAccountTrades] = React.useState(
    buildAccountTrades()
  );

  const handleInput = (value: any, handler: (value: any) => void) => {
    handler(value);
    setAccountTrades(buildAccountTrades());
  };

  return (
    <div>
      <TextInput
        label="Account Trade Count"
        value={accountTradeCount}
        onChange={(x) => handleInput(x, setAccountTradeCount)}
      />
      <TextInput
        label="Ticker"
        value={ticker}
        onChange={(x) => handleInput(x, setTicker)}
      />
      <TextInput
        label="Symobl ID"
        value={symbolId}
        onChange={(x) => handleInput(x, setSymbolId)}
      />
      <TextInput
        label="Brokerage ID"
        value={brokerageId}
        onChange={(x) => handleInput(x, setBrokerageId)}
      />
      <TextInput
        label="Account ID"
        value={accountId}
        onChange={(x) => handleInput(x, setAccountId)}
      />
      <OptionSelector
        label="Trade Side"
        options={TradeSide}
        onChange={(x) => handleInput(x, setTradeSide)}
        includeMixed
      />
      <OptionSelector
        label="Quantity Type"
        options={QuantityType}
        onChange={(x) => handleInput(x, setQuantityType)}
        includeMixed
      />
      <OptionSelector
        label="Routing Type"
        options={RoutingType}
        onChange={(x) => handleInput(x, setRoutingType)}
      />
      <MinMaxInput
        label="Quantity"
        minDefault={quantityMin}
        maxDefault={quantityMax}
        onMinChange={(x) => handleInput(x, setQuantityMin)}
        onMaxChange={(x) => handleInput(x, setQuantityMax)}
      />
      <div>Request ID: {requestId}</div>
      {accountTrades && (
        <div>
          Total Quantity:{' '}
          {accountTrades
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

function getRandomInt(min: number, max: number): number {
  if (min === max) {
    return min;
  }

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min + 1);
}
