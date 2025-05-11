import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Min } from 'class-validator';

export class WithdrawDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  accountId: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0.01)
  amount: number;
}