import { DetailLevel } from './enums/DetailLevel';
import { ExternalChannel } from './enums/ExternalChannel';

export default interface IExternalTrade {
  externalChannel: ExternalChannel;
  externalReferenceId: string;
  detailLevel: DetailLevel;
  detailObjectId: string;
}
