import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsUUID, Min } from 'class-validator';
import { TransactionType } from '../entities/transaction.orm.entity';

export class CreateTransactionDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID da conta origem' })
  @IsUUID()
  accountId: string;

  @ApiProperty({
    example: TransactionType.TRANSFER,
    enum: TransactionType,
    description: 'Tipo da transação: deposit, withdraw ou transfer'
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 250, description: 'Valor da transação (mínimo 0.01)' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({
    example: '789e1234-f56d-34c2-b654-426614179999',
    description: 'ID da conta destino (necessário apenas para transferências)'
  })
  @IsUUID()
  destinationAccountId: string;
}