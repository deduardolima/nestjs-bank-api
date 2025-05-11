import { Account } from "../../../domain/account.entity";

export interface IAccountRepository {
  findById(accountId: string): Promise<Account | null>;
  save(account: Account): Promise<Account>;
  deleteAll(): Promise<void>;
}