import IDbEntities from '../contracts/database/IDbEntities';

function convertToSql<T extends object>(dbEntities: IDbEntities<T>) {
  if (!dbEntities || !dbEntities.entities || !dbEntities.entities.length) {
    return '';
  }

  return `INSERT INTO ${dbEntities.dbName}.${dbEntities.dbTableName}
  (${Object.keys(dbEntities.entities[0])
    .map((x) => x.substring(0, 1).toUpperCase() + x.substring(1))
    .reduce((prev, next) => prev + ', ' + next)})
    VALUES ${dbEntities.entities
      .map(
        (x) =>
          `(${Object.values(x)
            .map((y) => getValueAsSql(y))
            .reduce((prev, next) => prev + ', ' + next)})`
      )
      .reduce((prev, next) => prev + '\n, ' + next)};`;
}

function getValueAsSql(value: any): string {
  if (!value) {
    return 'NULL';
  } else if (typeof value === 'string') {
    return `'${value}'`;
  } else if (typeof value === 'number') {
    return value.toString();
  } else if (typeof value === 'boolean') {
    return value ? '1' : '0';
  } else if (value instanceof Date) {
    return `'${value.toLocaleDateString()}'`;
  } else {
    throw new Error(`Unanticipated SQL value: ${value}`);
  }
}

export default convertToSql;
