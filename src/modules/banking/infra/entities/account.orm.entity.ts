import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'accounts', schema: 'banking' })
export class AccountOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'balance', type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
  })
  updatedAt: Date;
}