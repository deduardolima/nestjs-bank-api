import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountOrmEntity } from './infra/entities/account.orm.entity';
import { TransactionOrmEntity } from './infra/entities/transaction.orm.entity';
import { AccountRepository } from './infra/repositories/account/account.repository';


import { DepositUseCase, ResetStateUseCase, TransferUseCase, WithdrawUseCase } from './application/use-cases';
import { BankingController } from './infra/controllers/banking.controller';
import { TransactionRepository } from './infra/repositories/transaction/transaction-repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([AccountOrmEntity, TransactionOrmEntity]),
  ],
  controllers: [BankingController],
  providers: [
    AccountRepository,
    TransactionRepository,
    DepositUseCase,
    TransferUseCase,
    WithdrawUseCase,
    ResetStateUseCase

  ],
})
export class BankingModule { }