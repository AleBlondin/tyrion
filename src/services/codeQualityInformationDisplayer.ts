import Table from 'cli-table';
import colors from 'colors';
import { DebtInterface } from '../model/types';

export default class CodeQualityInformationDisplayer {
  public static display(debt: DebtInterface): void {
    if (debt) {
      this.displayDebtSummary(debt);
    }
  }

  private static displayDebtSummary(debt: DebtInterface): void {
    let totalItems = 0;
    console.info(colors.green('\n ♻️♻️♻️ Debt Information ♻️♻️♻️'));

    const table = new Table({
      head: [
        colors.bold('Type'),
        colors.bold('Files'),
        colors.bold('Bugs'),
        colors.bold('Time lost'),
        colors.bold('Fix cost'),
      ],
    });

    Object.keys(debt.debtTypes).forEach(type => {
      const { id, fileNames, bugs, fixCost, timeLost } = debt.debtTypes[type];
      table.push([id, fileNames, fixCost, bugs, timeLost, fixCost]);

      totalItems += 1;
    });

    table.push([
      colors.red(colors.bold('Total')),
      colors.red(colors.bold(totalItems + ' debt items')),
    ]);

    console.log(table.toString());
  }
}
