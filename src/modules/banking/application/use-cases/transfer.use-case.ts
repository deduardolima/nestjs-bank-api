import { Injectable } from '@nestjs/common';
import { Account } from '../../domain/account.entity';
import { AccountRepository } from '../../infra/repositories/account/account.repository';

@Injectable()
export class TransferUseCase {
  constructor(private readonly accountRepository: AccountRepository) { }

  async execute(
    origin: string,
    destination: string,
    amount: number
  ): Promise<{ originBalance: number, destinationBalance: number } | null> {
    const originAccount = await this.accountRepository.findById(origin);
    let destinationAccount = await this.accountRepository.findById(destination);

    if (!originAccount || originAccount.balance < amount) {
      return null;
    }

    if (!destinationAccount) {
      destinationAccount = new Account(destination, 0);
    }

    originAccount.balance -= amount;
    destinationAccount.balance += amount;

    await this.accountRepository.save(originAccount);
    await this.accountRepository.save(destinationAccount);

    return {
      originBalance: parseFloat(originAccount.balance.toFixed(2)),
      destinationBalance: parseFloat(destinationAccount.balance.toFixed(2)),
    };
  }
}