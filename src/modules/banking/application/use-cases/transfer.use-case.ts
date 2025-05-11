import { Injectable } from '@nestjs/common';
import { TransactionType } from '../../infra/entities/transaction.orm.entity';
import { AccountRepository } from '../../infra/repositories/account/account.repository';
import { TransactionRepository } from '../../infra/repositories/transaction/transaction-repository';

@Injectable()
export class TransferUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly transactionRepository: TransactionRepository,
  ) { }

  async execute(fromAccountId: string, toAccountId: string, amount: number) {
    if (fromAccountId === toAccountId) {
      throw new Error('Cannot transfer to the same account');
    }
    const fromAccount = await this.accountRepository.findById(fromAccountId);
    const toAccount = await this.accountRepository.findById(toAccountId);

    if (!fromAccount || !toAccount) {
      throw new Error('Account not found');
    }
    if (fromAccount.balance < amount) {
      throw new Error('Insufficient funds');
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await this.accountRepository.save(fromAccount);
    await this.accountRepository.save(toAccount);

    await this.transactionRepository.create({
      accountId: fromAccountId,
      type: TransactionType.TRANSFER,
      amount,
      destinationAccountId: toAccountId,
    });
  }
}