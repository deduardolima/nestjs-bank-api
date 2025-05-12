import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '../entities/transaction.orm.entity';

export class CreateTransactionDto {
  @ApiProperty({
    example: TransactionType.TRANSFER,
    enum: TransactionType,
    description: 'Tipo da transação: deposit, withdraw ou transfer'
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID da conta de destino' })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID da conta de origem' })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiProperty({ example: 250, description: 'Valor da transação' })
  @IsNumber()
  amount: number;
}