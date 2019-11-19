import { PricerInterface, DebtItemInterface, DebtTypeInterface } from './types';

export default class DebtType implements DebtTypeInterface {
  public debtItems: DebtItemInterface[];
  public type: string;

  public debtScore: number;
  private pricer: PricerInterface;

  public constructor(type: string, pricer: PricerInterface) {
    this.type = type;
    this.debtItems = new Array<DebtItemInterface>();
    this.debtScore = 0;
    this.pricer = pricer;
  }

  public addDebtItem(debtItem: DebtItemInterface): void {
    this.debtItems.push(debtItem);
    const debtScore = this.pricer.getPrice(debtItem);
    this.debtScore += debtScore;
  }
}
