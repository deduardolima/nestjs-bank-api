import { TransactionType } from "../infra/entities/transaction.orm.entity";

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly type: TransactionType,
    public readonly amount: number,
    public readonly createdAt: Date,
    public readonly destinationAccountId?: string,
  ) { }
}