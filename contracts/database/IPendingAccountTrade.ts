import { TradeSideId } from '../enums/TradeSideId';
import { WorkflowRoute } from '../enums/WorkflowRoute';

export default interface IPendingAccountTrade {
  pendingAccountTradeId: string;
  batchBuildEventId: string;
  buildEventId: string;
  ticker: string;
  symbolId: string;
  brokerageId: string;
  tradeQuantity: number;
  accountQuantity: number;
  sideId: TradeSideId;
  taxLotHarvestEventId?: string;
  createdOn: Date;
  accountHarvestRequestId?: string;
  workflowRouteId: WorkflowRoute;
  isApm: boolean;
  allocationTradeVolumne: number;
  isSent: boolean;
  sentTime?: Date;
  masterAccountId?: string;
}
