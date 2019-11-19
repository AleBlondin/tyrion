import DebtType from './debtType';
import { DebtItemInterface, PricerInterface, DebtTypeInterface, DebtInterface } from './types';

export default class Debt implements DebtInterface {
  public debtTypes: { [type: string]: DebtTypeInterface };
  public debtScore: number;
  public pricer: PricerInterface;

  public constructor(pricer: PricerInterface) {
    this.debtTypes = {};
    this.debtScore = 0;
    this.pricer = pricer;
  }

  public addDebtItem(debtItem: DebtItemInterface): void {
    this.debtScore += this.pricer.getPrice(debtItem);

    let debtType = this.debtTypes[debtItem.type];
    if (debtType) {
      debtType.addDebtItem(debtItem);
    } else {
      debtType = new DebtType(debtItem.type, this.pricer);
      debtType.addDebtItem(debtItem);
      this.debtTypes[debtItem.type] = debtType;
    }
  }

  public getDebtScoreByType(type: string): number {
    const pareto = this.debtTypes[type];
    return pareto ? pareto.debtScore : 0;
  }
}
