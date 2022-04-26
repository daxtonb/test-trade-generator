import { QuantityType } from '../contracts/enums/QuantityType';
import { QuantityTypeId } from '../contracts/enums/QuantityTypeId';

export default function convertQauntityType(
  quantityType: QuantityType
): QuantityTypeId {
  switch (quantityType) {
    case QuantityType.CASH:
      return QuantityTypeId.Cash;
    case QuantityType.SHARES:
      return QuantityTypeId.Shares;
    default:
      throw new Error(`Unknown quantity type: ${quantityType}`);
  }
}
