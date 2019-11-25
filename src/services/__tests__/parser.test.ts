import { parseLineToDebtItem } from '../parser';

describe('parseLineToDebtItem', (): void => {
  it('should parse a debt comment', () => {
    const debtCommentLine = '// @debt fixCost:10 bug:2 timeLost:250';

    const debtItem = parseLineToDebtItem(debtCommentLine);
  });
});
