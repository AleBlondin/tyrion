import { DebtItemInterface, DebtInterface } from './types';

export default class Debt implements DebtInterface {
  public debtTypes: { [type: string]: DebtItemInterface } = {};

  public addDebtItem(debtItem: DebtItemInterface): void {
    const associatedDebtItem = this.debtTypes[debtItem.id];
    if (!associatedDebtItem) {
      this.debtTypes[debtItem.id] = debtItem;
      return;
    }

    associatedDebtItem.addDebtItem(debtItem);
  }
}
