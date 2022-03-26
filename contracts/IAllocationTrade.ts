import { TradeSide } from './enums/TradeSide';

export default interface IAllocationTrade {
  allocationId: string;
  quantity: number;
  side: TradeSide;
}
