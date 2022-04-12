import React from 'react';
import PendingAccountTrade from '../contracts/database/PendingAccountTrade';
import IAccountTrade from '../contracts/IAccountTrade';

type Props = {
  accountTrades: IAccountTrade[];
};

export default ({ accountTrades }: Props) => {
  const pendingAccountTrades = accountTrades.map(
    (accountTrade) => new PendingAccountTrade(accountTrade)
  );

};
