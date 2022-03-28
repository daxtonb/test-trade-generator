import React, { useEffect } from 'react';
import { QuantityType } from '../contracts/enums/QuantityType';
import { TradeSide } from '../contracts/enums/TradeSide';
import IAccountTrade from '../contracts/IAccountTrade';
import MinMaxInput from './shared/minMaxInput';
import OptionSelector from './shared/optionSelector';
import { RoutingType } from '../contracts/enums/RoutingType';
import TextInput from './shared/textInput';
import buildAccountTrade from '../utilities/accountTradeBuilder';
import { v4 as uuidv4 } from 'uuid';

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

  const buildAccountTrades = (): IAccountTrade[] =>
    buildAccountTrade(
      accountTradeCount,
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