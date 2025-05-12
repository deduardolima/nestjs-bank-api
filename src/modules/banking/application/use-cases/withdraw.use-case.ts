import { Injectable } from '@nestjs/common';
import { Account } from '../../domain/account.entity';
import { AccountRepository } from '../../infra/repositories/account/account.repository';


@Injectable()
export class WithdrawUseCase {
  constructor(private readonly accountRepository: AccountRepository) { }

  async execute(origin: string, amount: number): Promise<Account | null> {
    const account = await this.accountRepository.findById(origin);

    if (!account) {
      return null;
    }

    if (account.balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    account.balance -= amount;
    await this.accountRepository.save(account);

    return account;
  }
}