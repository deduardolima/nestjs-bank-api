import { Injectable } from '@nestjs/common';

import { Account } from '../../domain/account.entity';
import { AccountRepository } from '../../infra/repositories/account/account.repository';

@Injectable()
export class DepositUseCase {
  constructor(private readonly accountRepository: AccountRepository) { }

  async execute(destination: string, amount: number): Promise<{ id: string; balance: number }> {
    let account = await this.accountRepository.findById(destination);

    if (!account) {
      account = new Account(destination, amount);
    } else {
      account.balance += amount;
    }

    await this.accountRepository.save(account);

    return { id: account.id, balance: account.balance };
  }
}