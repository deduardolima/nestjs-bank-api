import { Injectable } from '@nestjs/common';
import { Account } from '../../domain/account.entity';
import { AccountRepository } from '../../infra/repositories/account/account.repository';


@Injectable()
export class WithdrawUseCase {
  constructor(private readonly accountRepository: AccountRepository) { }

  async execute(origin: string, amount: number): Promise<Account | null> {
    const account = await this.accountRepository.findById(origin);

    if (!account || account.balance < amount) {
      return null;
    }

    account.balance = parseFloat((account.balance - amount).toFixed(2));
    await this.accountRepository.save(account);

    return account;
  }
}