import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DepositUseCase, TransferUseCase, WithdrawUseCase } from '../../application/use-cases';
import { CreateTransactionDto, WithdrawDto } from '../dto';
import { DepositDto } from '../dto/deposit.dto';
import { AccountRepository } from '../repositories/account/account.repository';


@ApiTags('Banking')
@Controller('banking')
export class BankingController {
  constructor(
    private readonly depositUseCase: DepositUseCase,
    private readonly withdrawUseCase: WithdrawUseCase,
    private readonly transferUseCase: TransferUseCase,
    private readonly accountRepository: AccountRepository,
  ) { }

  @Post('deposit')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Realiza um depósito na conta' })
  @ApiBody({
    type: DepositDto,
    description: 'Dados para depósito',
  })
  @ApiResponse({ status: 200, description: 'Depósito realizado com sucesso.', schema: { example: 1000 } })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos.' })
  async deposit(@Body() depositDto: DepositDto) {
    try {
      await this.depositUseCase.execute(depositDto.accountId, depositDto.amount);
      const account = await this.accountRepository.findById(depositDto.accountId);
      return account?.balance ?? null;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Consulta saldo da conta' })
  @ApiParam({ name: 'id', description: 'ID da conta', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Saldo encontrado.', schema: { example: 1000 } })
  @ApiResponse({ status: 404, description: 'Conta não encontrada.' })
  async getBalance(@Param('id') id: string) {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }
    return account.balance;
  }

  @Post('withdraw')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Efetua saque em uma conta' })
  @ApiBody({
    type: WithdrawDto,
    description: 'Dados para saque',
  })
  @ApiResponse({ status: 200, description: 'Saque realizado com sucesso.', schema: { example: 700 } })
  @ApiResponse({ status: 400, description: 'Saque inválido.' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada.' })
  async withdraw(@Body() withdrawDto: WithdrawDto) {
    try {
      await this.withdrawUseCase.execute(withdrawDto.accountId, withdrawDto.amount);
      const account = await this.accountRepository.findById(withdrawDto.accountId);
      if (!account) {
        throw new NotFoundException('Conta não encontrada');
      }
      return account.balance;
    } catch (e) {
      if (e.message === 'Conta não encontrada') {
        throw new NotFoundException(e.message);
      }
      throw new BadRequestException(e.message);
    }
  }

  @Post('transfer')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Transfere valor entre contas' })
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Dados para transferência',
  })
  @ApiResponse({
    status: 200,
    description: 'Transferência realizada com sucesso.',
    schema: {
      example: { origin: 200, destination: 1500 },
    },
  })
  @ApiResponse({ status: 400, description: 'Falha na transferência.' })
  @ApiResponse({ status: 404, description: 'Conta origem ou destino não encontrada.' })
  async transfer(@Body() transferDto: CreateTransactionDto) {
    try {
      await this.transferUseCase.execute(
        transferDto.accountId,
        transferDto.destinationAccountId,
        transferDto.amount,
      );
      const origin = await this.accountRepository.findById(transferDto.accountId);
      const destination = await this.accountRepository.findById(transferDto.destinationAccountId);
      if (!origin || !destination) {
        throw new NotFoundException('Conta origem ou destino não encontrada');
      }
      return { origin: origin.balance, destination: destination.balance };
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }
}