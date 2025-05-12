import { Test, TestingModule } from '@nestjs/testing';

import { Response } from 'express';
import { DepositUseCase, ResetStateUseCase, TransferUseCase, WithdrawUseCase } from 'src/modules/banking/application/use-cases';
import { BankingController } from 'src/modules/banking/infra/controllers/banking.controller';
import { TransactionType } from 'src/modules/banking/infra/entities/transaction.orm.entity';
import { AccountRepository } from 'src/modules/banking/infra/repositories/account/account.repository';

describe('BankingController', () => {
  let bankingController: BankingController;
  let depositUseCase: DepositUseCase;
  let withdrawUseCase: WithdrawUseCase;
  let transferUseCase: TransferUseCase;
  let resetStateUseCase: ResetStateUseCase;
  let accountRepository: AccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankingController],
      providers: [
        {
          provide: DepositUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: WithdrawUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: TransferUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ResetStateUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: AccountRepository,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
            deleteAll: jest.fn(),
          },
        },
      ],
    }).compile();

    bankingController = module.get<BankingController>(BankingController);
    depositUseCase = module.get<DepositUseCase>(DepositUseCase);
    withdrawUseCase = module.get<WithdrawUseCase>(WithdrawUseCase);
    transferUseCase = module.get<TransferUseCase>(TransferUseCase);
    resetStateUseCase = module.get<ResetStateUseCase>(ResetStateUseCase);
    accountRepository = module.get<AccountRepository>(AccountRepository);
  });

  class Account {
    constructor(public id: string, public balance: number) { }

    deposit(amount: number) {
      this.balance += amount;
    }

    withdraw(amount: number) {
      this.balance -= amount;
    }
  }

  it('POST /reset - deve retornar 200 OK', async () => {
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any as Response;

    await bankingController.resetState(res);

    expect(resetStateUseCase.execute).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('OK');
  });

  it('GET /balance', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;

    jest.spyOn(accountRepository, 'findById').mockResolvedValue(null);

    await bankingController.getBalance('1234', res);

    expect(accountRepository.findById).toHaveBeenCalledWith('1234');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(0);
  });

  it('POST /event (deposit) - Criar conta e retornar saldo', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;

    const mockAccount = new Account('100', 10);
    jest.spyOn(depositUseCase, 'execute').mockResolvedValue(mockAccount);

    await bankingController.handleEvent(
      res,
      {
        type: TransactionType.DEPOSIT,
        destination: '100',
        amount: 10,
      },
    );

    expect(depositUseCase.execute).toHaveBeenCalledWith('100', 10);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      destination: { id: '100', balance: 10 },
    });
  });

  it('POST /event (deposit) - Depósito em uma conta existente', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;

    const mockAccount = new Account('100', 20);
    jest.spyOn(depositUseCase, 'execute').mockResolvedValue(mockAccount);

    await bankingController.handleEvent(
      res,
      {
        type: TransactionType.DEPOSIT,
        destination: '100',
        amount: 10,
      },
    );

    expect(depositUseCase.execute).toHaveBeenCalledWith('100', 10);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      destination: { id: '100', balance: 20 },
    });
  });

  it('GET /balance - Deve retornar saldo de conta existente', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;

    const mockAccount = new Account('100', 20);

    jest.spyOn(accountRepository, 'findById').mockResolvedValue(mockAccount);

    await bankingController.getBalance('100', res);

    expect(accountRepository.findById).toHaveBeenCalledWith('100');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(20);
  });

  it('POST /event (withdraw)', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;

    jest.spyOn(withdrawUseCase, 'execute').mockResolvedValue(null);

    await bankingController.handleEvent(
      res,
      {
        type: TransactionType.WITHDRAW,
        origin: '200',
        amount: 10,
      },
    );

    expect(withdrawUseCase.execute).toHaveBeenCalledWith('200', 10);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(0);
  });

  it('POST /event (withdraw) - Saque de conta existente retorna saldo atualizado', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;

    const mockAccount = new Account('100', 15);

    jest.spyOn(withdrawUseCase, 'execute').mockResolvedValue(mockAccount);

    await bankingController.handleEvent(
      res,
      {
        type: TransactionType.WITHDRAW,
        origin: '100',
        amount: 5,
      },
    );

    expect(withdrawUseCase.execute).toHaveBeenCalledWith('100', 5);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      origin: { id: '100', balance: 15 },
    });
  });

  it('POST /event (transfer) - Transferência entre contas existentes', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;

    jest.spyOn(transferUseCase, 'execute').mockResolvedValue({
      originBalance: 0,
      destinationBalance: 15,
    });

    await bankingController.handleEvent(
      res,
      {
        type: TransactionType.TRANSFER,
        origin: '100',
        destination: '300',
        amount: 15,
      },
    );

    expect(transferUseCase.execute).toHaveBeenCalledWith('100', '300', 15);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      origin: { id: '100', balance: 0 },
      destination: { id: '300', balance: 15 },
    });
  });

  it('POST /event (transfer) - Transferência de conta inexistente retorna 404 e 0', async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;

    jest.spyOn(transferUseCase, 'execute').mockResolvedValue(null);

    await bankingController.handleEvent(
      res,
      {
        type: TransactionType.TRANSFER,
        origin: '200',
        destination: '300',
        amount: 15,
      },
    );

    expect(transferUseCase.execute).toHaveBeenCalledWith('200', '300', 15);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(0);
  });
});