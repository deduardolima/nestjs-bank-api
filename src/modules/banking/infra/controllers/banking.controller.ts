import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DepositUseCase, ResetStateUseCase, TransferUseCase, WithdrawUseCase } from '../../application/use-cases';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionType } from '../entities/transaction.orm.entity';
import { AccountRepository } from '../repositories/account/account.repository';


@Controller()
export class BankingController {
  constructor(
    private readonly depositUseCase: DepositUseCase,
    private readonly withdrawUseCase: WithdrawUseCase,
    private readonly transferUseCase: TransferUseCase,
    private readonly resetStateUseCase: ResetStateUseCase,
    private readonly accountRepository: AccountRepository,
  ) { }

  /**
   * Rota para resetar o estado da aplicação.
   * Responde com 'OK' em todos os casos.
   */
  @Post('/reset')
  @HttpCode(HttpStatus.OK)
  async resetState(@Res() res: Response): Promise<Response> {
    await this.resetStateUseCase.execute();
    return res.status(HttpStatus.OK).send('OK');
  }

  /**
   * Rota para consultar o saldo de uma conta.
   */
  @Get('/balance')
  async getBalance(
    @Query('account_id') accountId: string,
    @Res() res: Response,
  ): Promise<Response> {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      return res.status(HttpStatus.NOT_FOUND).json(0);
    }

    return res.status(HttpStatus.OK).json(account.balance);
  }

  /**
   * Manipulador de eventos: depósito, saque e transferência.
   */
  @Post('/event')
  async handleEvent(
    @Res() res: Response,
    @Body() body: CreateTransactionDto,
  ): Promise<Response> {
    const { type, destination, origin, amount } = body;

    try {
      switch (type) {
        case TransactionType.DEPOSIT: {
          if (!destination) {
            return res.status(HttpStatus.BAD_REQUEST).json({
              message: 'Destination ID is required for deposit transactions.',
            });
          }

          const result = await this.depositUseCase.execute(destination, amount);
          return res
            .status(HttpStatus.CREATED)
            .json({ destination: { id: destination, balance: result.balance } });
        }
        case TransactionType.WITHDRAW: {
          if (!origin) {
            return res.status(HttpStatus.BAD_REQUEST).json({
              message: 'Origin ID is required for withdraw transactions.',
            });
          }

          const result = await this.withdrawUseCase.execute(origin, amount);
          if (!result) {
            return res.status(HttpStatus.NOT_FOUND).json(0);
          }

          return res
            .status(HttpStatus.CREATED)
            .json({ origin: { id: origin, balance: result.balance } });
        }
        case TransactionType.TRANSFER: {
          if (!origin || !destination) {
            return res.status(HttpStatus.BAD_REQUEST).json({
              message: 'Both origin and destination IDs are required for transfer transactions.',
            });
          }

          const result = await this.transferUseCase.execute(
            origin,
            destination,
            amount,
          );
          if (!result) {
            return res.status(HttpStatus.NOT_FOUND).json(0);
          }

          return res.status(HttpStatus.CREATED).json({
            origin: { id: origin, balance: result.originBalance },
            destination: { id: destination, balance: result.destinationBalance },
          });
        }
        default:
          return res.status(HttpStatus.NOT_FOUND).json(0);
      }
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json(0);
    }
  }
}