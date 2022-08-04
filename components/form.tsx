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
import { AssetType } from '../contracts/enums/AssetType';
import PendingMfAccountTrade from '../contracts/database/PendinfMfAccountTrade';
import PendingMfAllocationTrade from '../contracts/database/PendingMfAllocationTrade';
import IPendingAccountTrade from '../contracts/database/IPendingAccountTrade';
import IPendingMfAccountTrade from '../contracts/database/IPendingMfAccountTrade';
import convertFromTradeRouting from '../utilities/tradeComplianceConverter';

export default () => {
  const [requestId, setRequestId] = React.useState(uuidv4());
  const [accountTradeCount, setAccountTradeCount] = React.useState(3);
  const [ticker, setTicker] = React.useState('TICK');
  const [symbolId, setSymbolId] = React.useState(uuidv4());
  const [brokerageId, setBrokerageId] = React.useState(uuidv4());
  const [accountIds, setAccountIds] = React.useState([]);
  const [tradeSide, setTradeSide] = React.useState(TradeSide.BUY);
  const [quantityType, setQuantityType] = React.useState(QuantityType.SHARES);
  const [routingType, setRoutingType] = React.useState(RoutingType.STP);
  const [quantityMin, setQuantityMin] = React.useState(3);
  const [quantityMax, setQuantityMax] = React.useState(5);
  const [assetType, setAssetType] = React.useState(AssetType.Equity);
  const [xRouteSetId, setXRouteSetId] = React.useState(uuidv4());

  if (accountIds.length > accountTradeCount) {
    setAccountIds(accountIds.slice(0, accountTradeCount));
  }

  for (let i = 0; i < accountTradeCount; i++) {
    if (!accountIds[i]) {
      accountIds[i] = uuidv4();
    }
  }

  const updateAccountId = (id: string, index: number) => {
    setAccountIds(
      accountIds.map((currId, currIndex) => (currIndex === index ? id : currId))
    );
  };

  const buildAccountTrades = (): IAccountTrade[] =>
    buildAccountTrade(
      requestId,
      routingType,
      ticker,
      symbolId,
      brokerageId,
      accountIds,
      tradeSide,
      quantityMin,
      quantityMax,
      quantityType,
      xRouteSetId
    );

  const [accountTrades, setAccountTrades] = React.useState(
    buildAccountTrades()
  );

  useEffect(() => {
    setAccountTrades(buildAccountTrades);
  }, [
    requestId,
    accountTradeCount,
    ticker,
    symbolId,
    brokerageId,
    accountIds,
    tradeSide,
    quantityType,
    routingType,
    quantityMin,
    quantityMax,
    assetType,
    xRouteSetId,
  ]);

  const sql: string = BuildSql(accountTrades, assetType, xRouteSetId);

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
      {accountIds.map((id: string, index: number) => (
        <TextInput
          label={`Account ID (${index + 1})`}
          value={id}
          onChange={(val) => updateAccountId(val, index)}
          key={index}
        />
      ))}
      <TextInput
        label="Execution Route Set Id"
        value={xRouteSetId}
        onChange={setXRouteSetId}
      />
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
      <OptionSelector
        label="Asset Type"
        options={AssetType}
        onChange={setAssetType}
        value={assetType}
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
        <label htmlFor="json">SQL (Trade Cache)</label>
        <textarea
          name="json"
          rows={10}
          cols={100}
          readOnly={true}
          value={sql}
        ></textarea>
      </div>
      <div className="input-group">
        <label htmlFor="json">JSON (Trade Compliance)</label>
        <textarea
          name="json"
          rows={10}
          cols={100}
          readOnly={true}
          value={JSON.stringify(convertFromTradeRouting(accountTrades))}
        ></textarea>
      </div>
      <div className="input-group">
        <label htmlFor="json">JSON (Trade Routing)</label>
        <textarea
          name="json"
          rows={10}
          cols={100}
          readOnly={true}
          value={JSON.stringify(accountTrades)}
        ></textarea>
      </div>
      <div className="input-group">
        <button onClick={() => setRequestId(uuidv4())}>Regenerate</button>
      </div>
    </div>
  );
};

function BuildSql(
  accountTrades: IAccountTrade[],
  assetType: AssetType,
  xRouteSetId?: string
) {
  const accountQuantity: number =
    accountTrades &&
    accountTrades.length &&
    accountTrades
      .map((x: IAccountTrade) => x.quantity)
      .reduce((prev: number, curr: number) => prev + curr);

  const pendingAccountTradeDbEntities: IDbEntities<
    PendingAccountTrade | PendingMfAccountTrade
  > = {
    dbName: 'db_trading1',
    dbTableName:
      assetType === AssetType.MutualFund
        ? 'PendingMfAccountTrade'
        : 'PendingAccountTrade',
    entities: accountTrades.map((x: IAccountTrade) =>
      assetType === AssetType.MutualFund
        ? new PendingMfAccountTrade(x)
        : new PendingAccountTrade(x, accountQuantity)
    ),
  };

  const pendingAllocationTradeDbEntities: IDbEntities<
    PendingAllocationTrade | PendingMfAllocationTrade
  > = {
    dbName: 'db_trading1',
    dbTableName:
      assetType === AssetType.MutualFund
        ? 'PendingMfAllocationTrade'
        : 'PendingAllocationTrade',
    entities: accountTrades
      .map((x: IAccountTrade, index: number) =>
        x.allocationTrades.map((y: IAllocationTrade) =>
          assetType === AssetType.MutualFund
            ? new PendingMfAllocationTrade(
                x,
                y,
                pendingAccountTradeDbEntities.entities[
                  index
                ] as IPendingMfAccountTrade
              )
            : new PendingAllocationTrade(
                x,
                y,
                pendingAccountTradeDbEntities.entities[
                  index
                ] as IPendingAccountTrade
              )
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
