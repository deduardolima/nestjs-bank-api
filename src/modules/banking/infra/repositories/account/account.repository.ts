import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/modules/banking/domain/account.entity';
import { Repository } from 'typeorm';
import { AccountOrmEntity } from '../../entities/account.orm.entity';
import { IAccountRepository } from './account-repository.interface';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(AccountOrmEntity)
    private readonly repo: Repository<AccountOrmEntity>,
  ) { }

  /**
   * Busca uma conta pelo ID. Retorna null se não encontrar.
   */
  async findById(accountId: string): Promise<Account | null> {
    const account = await this.repo.findOne({ where: { id: accountId } });
    return account ? new Account(account.id, account.balance) : null;
  }

  /**
   * Salva ou atualiza uma conta.
   */
  async save(account: Account): Promise<Account> {
    await this.repo.save({ id: account.id, balance: account.balance });
    return account;
  }

  /**
   * Exclui todos os registros de contas.
   */
  async deleteAll(): Promise<void> {
    await this.repo.clear();
  }
}