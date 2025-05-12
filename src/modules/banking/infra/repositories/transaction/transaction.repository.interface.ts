import { Transaction } from "src/modules/banking/domain/transaction.entity";
import { TransactionType } from "../../entities/transaction.orm.entity";


export interface ITransactionRepository {
  create(data: {
    accountId: string;
    type: TransactionType;
    amount: number;
    createdAt?: Date;
    destinationAccountId?: string;
  }): Promise<Transaction>;

  findByAccount(accountId: string): Promise<Transaction[]>;
}