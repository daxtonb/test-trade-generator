import { TradeSide } from '../contracts/enums/TradeSide';
import { TradeSideId } from '../contracts/enums/TradeSideId';

export default function convertSide(tradeSide: TradeSide): TradeSideId {
  switch (tradeSide) {
    case TradeSide.BUY:
      return TradeSideId.Buy;
    case TradeSide.SELL:
      this.sideId = TradeSideId.Sell;
      break;
    default:
      throw new Error(`Unknown trade side: ${tradeSide}`);
  }
}
