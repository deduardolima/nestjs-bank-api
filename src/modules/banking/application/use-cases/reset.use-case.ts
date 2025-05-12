import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../infra/repositories/account/account.repository';

@Injectable()
export class ResetStateUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) { }

  /**
   * Executa a limpeza de todas as contas.
   */
  async execute(): Promise<void> {
    await this.accountRepository.deleteAll();
  }
}