import uuid from 'uuid';

import { DebtItemInterface } from './types';

export default class DebtItem implements DebtItemInterface {
  public bugs: number;
  public fileNames: string[];
  public fixCost: number;
  public id: string;
  public numberOfOccurences: number;
  public timeLost: number;

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
  }

  public addDebtItem(debtItem: DebtItemInterface) {
    this.fileNames = [...this.fileNames, ...debtItem.fileNames];
    this.bugs += debtItem.bugs;
    this.fixCost += debtItem.fixCost;
    this.numberOfOccurences += 1;
    this.timeLost += debtItem.timeLost;
  }
}
