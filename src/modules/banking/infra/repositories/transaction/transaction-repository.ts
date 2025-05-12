import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/modules/banking/domain/transaction.entity';
import { Repository } from 'typeorm';
import { TransactionOrmEntity, TransactionType } from '../../entities/transaction.orm.entity';
import { ITransactionRepository } from './transaction.repository.interface';


@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly repo: Repository<TransactionOrmEntity>,
  ) { }

  async create(data: {
    accountId: string;
    type: TransactionType;
    amount: number;
    createdAt?: Date;
    destinationAccountId?: string;
  }): Promise<Transaction> {
    const entity = this.repo.create({
      ...data,
      createdAt: data.createdAt || new Date(),
    });
    const saved = await this.repo.save(entity);
    return new Transaction(
      saved.id,
      saved.accountId,
      saved.type,
      Number(saved.amount),
      saved.createdAt,
      saved.destinationAccountId,
    );
  }

  async findByAccount(accountId: string): Promise<Transaction[]> {
    const entities = await this.repo.find({ where: { accountId } });
    return entities.map(
      (e) =>
        new Transaction(
          e.id,
          e.accountId,
          e.type,
          Number(e.amount),
          e.createdAt,
          e.destinationAccountId,
        ),
    );
  }
}