import max from 'lodash/max';

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

  public getMaxEffectiveImpact() {
    return (
      max(
        Object.keys(this.debtTypes).map(debtType => this.debtTypes[debtType].getEffectiveImpact()),
      ) || 0
    );
  }

  public getMaxFutureImpact() {
    return (
      max(
        Object.keys(this.debtTypes).map(debtType => this.debtTypes[debtType].getFutureImpact()),
      ) || 0
    );
  }
}
