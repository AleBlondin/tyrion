import Table from 'cli-table';
import colors from 'colors';
import { DebtInterface } from '../model/types';

export const display = (debt: DebtInterface): void => {
  if (debt) {
    displayDebtSummary(debt);
  }
};

export const displayDebtSummary = (debt: DebtInterface): void => {
  let totalItems = 0;
  console.info(colors.green('\n ♻️♻️♻️ Debt Information ♻️♻️♻️'));

  const table = new Table({
    head: [
      colors.bold('Type'),
      colors.bold('Files'),
      colors.bold('Bugs'),
      colors.bold('Time lost'),
      colors.bold('Number of occurences'),
      colors.bold('Number of changes'),
      colors.bold('Fix cost'),
    ],
    colWidths: [50, 100, 10, 10, 10, 10, 10]
  });

  Object.keys(debt.debtTypes).forEach(type => {
    const {
      id,
      fileNames,
      bugs,
      fixCost,
      timeLost,
      numberOfOccurences,
      numberOfChanges,
    } = debt.debtTypes[type];
    table.push([id, fileNames, bugs, timeLost, numberOfOccurences, numberOfChanges, fixCost]);

    totalItems += 1;
  });

  table.push([
    colors.red(colors.bold('Total')),
    colors.red(colors.bold(totalItems + ' debt items')),
  ]);

  console.log(table.toString());
};
