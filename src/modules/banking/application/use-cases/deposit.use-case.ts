import { Injectable } from '@nestjs/common';

import { Account } from '../../domain/account.entity';
import { AccountRepository } from '../../infra/repositories/account/account.repository';

@Injectable()
export class DepositUseCase {
  constructor(private readonly accountRepository: AccountRepository) { }

  async execute(destination: string, amount: number): Promise<Account> {
    let account = await this.accountRepository.findById(destination);
    if (account) {
      account.balance = parseFloat((account.balance + amount).toFixed(2));
    } else {
      account = new Account(destination, parseFloat(amount.toFixed(2)));
    }
    await this.accountRepository.save(account);
    return account;
  }
}