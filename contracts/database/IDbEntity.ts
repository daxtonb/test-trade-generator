export default interface IDbEntities<T extends object> {
  dbName: string;
  dbTableName: string;
  entities: T[];
}
