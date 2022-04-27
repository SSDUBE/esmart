/* tslint:disable max-classes-per-file */
import {
  Constructor,
  Model,
  QueryBuilder,
  QueryContext,
  Transaction,
} from 'objection';

import { knex } from '../db';

Model.knex(knex);

export class BaseModel extends Model {
  public static query<CB extends Model>(
    this: Constructor<CB>,
    trxOrKnex?: Transaction
  ): QueryBuilder<CB> {
    const query = super.query(trxOrKnex);
    // @ts-ignore
    return query;
  }

  /**
   * Default tableName is class name with first character lowercased
   */
  // public static get tableName(): string {
  //   return this.name.slice(0, 1).toLocaleLowerCase() + this.name.slice(1);
  // }

  public readonly createdAt!: Date;

  public $beforeInsert(_queryContext: QueryContext) {
    // Allow created at to be set by user
    if (!this.createdAt) {
      // @ts-ignore
      this.createdAt = new Date();
    }
  }

  // public $beforeUpdate(_opt: any, queryContext: QueryContext) {
  //   if (!queryContext.user) {
  //     throw new Error(
  //       `$beforeUpdate: User missing from context: ${queryContext}.`
  //     );
  //   }
  // }
}
