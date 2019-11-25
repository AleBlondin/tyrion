import { DebtItemInterface } from '../model/types';
import DebtItem from '../model/debtItem';

const DEBT_TAG = '@debt';
enum ACCEPTED_PROPERTIES {
  id = 'id',
  bugs = 'bugs',
  fixCost = 'fixCost',
  timeLost = 'timeLost',
}

/**
 * Parse the different elements in a debt line.
 * A debt line may have a comment at the end.
 *
 * @param line
 * @param fileName
 */
export const parseLineToDebtItem = (line: string, fileName: string): DebtItemInterface | null => {
  const debtTag = line.includes(DEBT_TAG);

  if (!debtTag) return null;

  const debtProperties: Partial<{ [propertyName in ACCEPTED_PROPERTIES]: string }> = line
    .split(' ')
    .filter(element => element.includes(':'))
    .reduce(
      (properties, element) => {
        const [property, value] = element.split(':');
        return ACCEPTED_PROPERTIES[property as ACCEPTED_PROPERTIES]
          ? { ...properties, [property]: value }
          : properties;
      },
      {} as Partial<{ [propertyName in ACCEPTED_PROPERTIES]: string }>,
    );

  const id = debtProperties.id;
  const bugs = debtProperties.bugs != null ? Number(debtProperties.bugs) : undefined;
  const fixCost = debtProperties.fixCost != null ? Number(debtProperties.fixCost) : undefined;
  const timeLost = debtProperties.timeLost != null ? Number(debtProperties.timeLost) : undefined;

  return new DebtItem({ fileNames: [fileName], id, bugs, fixCost, timeLost });
};
