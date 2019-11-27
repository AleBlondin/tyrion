import uuid from 'uuid';

import { DebtItemInterface } from './types';

const BUGS_FACTOR_IN_EFFECTIVE_IMPACT = 10;
const TIME_LOST_FACTOR_IN_EFFECTIVE_IMPACT = 1;

export default class DebtItem implements DebtItemInterface {
  public bugs: number;
  public fileNames: string[];
  public fixCost: number;
  public id: string;
  public numberOfOccurences: number;
  public timeLost: number;
  public numberOfChanges: number;

  public constructor({
    id,
    fileNames,
    fixCost = 1,
    bugs = 0,
    timeLost = 0,
  }: {
    id?: string;
    fileNames: string[];
    fixCost?: number;
    bugs?: number;
    timeLost?: number;
  }) {
    this.id = id || uuid();
    this.fileNames = fileNames;
    this.fixCost = fixCost;
    this.bugs = bugs;
    this.timeLost = timeLost;
    this.numberOfOccurences = 1;
    this.numberOfChanges = 0;
  }

  public addDebtItem(debtItem: DebtItemInterface) {
    this.fileNames = [...this.fileNames, ...debtItem.fileNames];
    this.bugs += debtItem.bugs;
    this.fixCost += debtItem.fixCost;
    this.numberOfOccurences += 1;
    this.timeLost += debtItem.timeLost;
  }

  public getEffectiveImpact() {
    return (
      this.timeLost * TIME_LOST_FACTOR_IN_EFFECTIVE_IMPACT +
      this.bugs * BUGS_FACTOR_IN_EFFECTIVE_IMPACT
    );
  }

  public getFutureImpact() {
    return this.numberOfOccurences * (this.numberOfChanges + 1);
  }
}
