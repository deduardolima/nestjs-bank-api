import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../../domain/account.entity';
import { AccountOrmEntity } from '../../entities/account.orm.entity';
import { IAccountRepository } from './account-repository.interface';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(AccountOrmEntity)
    private readonly repo: Repository<AccountOrmEntity>,
  ) { }

  async findById(accountId: string): Promise<Account | null> {
    const account = await this.repo.findOne({ where: { id: accountId } });
    return account ? new Account(account.id, account.balance) : null;
  }

  async save(account: Account): Promise<Account> {
    await this.repo.save({ id: account.id, balance: account.balance });
    return account;
  }

  async deleteAll(): Promise<void> {
    await this.repo.clear();
  }
}