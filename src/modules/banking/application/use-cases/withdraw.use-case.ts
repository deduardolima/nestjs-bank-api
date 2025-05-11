import { Injectable } from '@nestjs/common';
import { TransactionType } from '../../infra/entities/transaction.orm.entity';
import { AccountRepository } from '../../infra/repositories/account/account.repository';
import { TransactionRepository } from '../../infra/repositories/transaction/transaction-repository';


@Injectable()
export class WithdrawUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly transactionRepository: TransactionRepository,
  ) { }

  async execute(accountId: string, amount: number) {
    const account = await this.accountRepository.findById(accountId);
    if (!account) throw new Error('Account not found');
    if (account.balance < amount) throw new Error('Insufficient funds');

    account.balance -= amount;
    await this.accountRepository.save(account);

    await this.transactionRepository.create({
      accountId,
      type: TransactionType.WITHDRAW,
      amount,
    });
  }
}