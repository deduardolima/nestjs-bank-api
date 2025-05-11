export class Account {
  constructor(
    public readonly id: string,
    public balance: number = 0,
  ) { }

  deposit(amount: number) {
    if (amount <= 0) throw new Error('Deposit must be positive');
    this.balance += amount;
  }

  withdraw(amount: number) {
    if (amount > this.balance) throw new Error('Insufficient balance');
    this.balance -= amount;
  }
}