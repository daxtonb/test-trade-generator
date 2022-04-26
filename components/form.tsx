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
import convertToSql from '../utilities/convertToSql';
import PendingAccountTrade from '../contracts/database/PendingAccountTrade';
import IDbEntities from '../contracts/database/IDbEntities';
import IAllocationTrade from '../contracts/IAllocationTrade';
import PendingAllocationTrade from '../contracts/database/PendingAllocationTrade';

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

  const sql: string = BuildSql(accountTrades);

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
        value={tradeSide}
        includeMixed
      />
      <OptionSelector
        label="Quantity Type"
        options={QuantityType}
        onChange={setQuantityType}
        value={quantityType}
        includeMixed
      />
      <OptionSelector
        label="Routing Type"
        options={RoutingType}
        onChange={setRoutingType}
        value={routingType}
      />
      <MinMaxInput
        label="Account Trade Quantity Range"
        minValue={quantityMin}
        maxValue={quantityMax}
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
              .map((x: IAccountTrade) => x.quantity)
              .reduce((prev: number, curr: number) => prev + curr)}{' '}
        </div>
      )}
      <div className="input-group">
        <label htmlFor="json">SQL</label>
        <textarea
          name="json"
          rows={10}
          cols={100}
          readOnly={true}
          value={sql}
        ></textarea>
      </div>
      <div className="input-group">
        <label htmlFor="json">JSON</label>
        <textarea
          name="json"
          rows={10}
          cols={100}
          readOnly={true}
          value={JSON.stringify(accountTrades)}
        ></textarea>
      </div>
    </div>
  );
};

function BuildSql(accountTrades: IAccountTrade[]) {
  const accountQuantity: number = accountTrades &&
  accountTrades.length &&
  accountTrades
    .map((x: IAccountTrade) => x.quantity)
    .reduce((prev: number, curr: number) => prev + curr);

  const pendingAccountTradeDbEntities: IDbEntities<PendingAccountTrade> = {
    dbName: 'db_trading1',
    dbTableName: 'PendingAccountTrade',
    entities: accountTrades.map(
      (x: IAccountTrade) => new PendingAccountTrade(x, accountQuantity)
    ),
  };

  const pendingAllocationTradeDbEntities: IDbEntities<PendingAllocationTrade> =
    {
      dbName: 'db_trading1',
      dbTableName: 'PendingAllocationTrade',
      entities: accountTrades
        .map((x: IAccountTrade) =>
          x.allocationTrades.map(
            (y: IAllocationTrade) => new PendingAllocationTrade(x, y)
          )
        )
        .reduce(
          (prev: PendingAllocationTrade[], next: PendingAllocationTrade[]) =>
            prev && [...prev, ...next]
        ),
    };

  const entities: IDbEntities<any>[] = [
    pendingAccountTradeDbEntities,
    pendingAllocationTradeDbEntities,
  ];
  let workingString = '';
  for (let entitiy of entities) {
    workingString += convertToSql(entitiy) + '\n\n';
  }

  return workingString.trim();
}
