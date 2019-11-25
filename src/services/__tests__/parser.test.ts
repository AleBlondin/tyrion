import { parseLine, parseLineToDebtItem } from '../parser';
import DebtItem from '../../model/debtItem';

const MOCKED_ID = 'mocked-id';
jest.mock('uuid', () => ({
  __esModule: true,
  default: () => MOCKED_ID,
}));

describe('parseLine', (): void => {
  it('should parse a debt comment with no explicit id field', () => {
    const debtCommentLine = '// @debt some-id fixCost:10 bugs:2 timeLost:250';

    const debtProperties = parseLine(debtCommentLine);
    expect(debtProperties).toEqual({
      id: 'some-id',
      fixCost: 10,
      bugs: 2,
      timeLost: 250,
    });
  });

  it('should parse a debt comment with an explicit id field', () => {
    const debtCommentLine = '// @debt id:some-id bugs:2 fixCost:10 timeLost:250';

    const debtProperties = parseLine(debtCommentLine);
    expect(debtProperties).toEqual({
      id: 'some-id',
      fixCost: 10,
      bugs: 2,
      timeLost: 250,
    });
  });

  it('should parse a debt comment with no id', () => {
    const debtCommentLine = '// @debt timeLost:250 fixCost:10 bugs:2';

    const debtProperties = parseLine(debtCommentLine);
    expect(debtProperties).toEqual({
      fixCost: 10,
      bugs: 2,
      timeLost: 250,
    });
  });
});

describe('parseLineToDebtItem', (): void => {
  it('should parse a debt comment with no explicit id field', () => {
    const debtCommentLine = '// @debt timeLost:250 fixCost:10 bugs:2';
    const fileName = 'file1.ts';

    const debt = parseLineToDebtItem(debtCommentLine, fileName);
    expect(debt).toEqual(
      new DebtItem({
        id: MOCKED_ID,
        fixCost: 10,
        bugs: 2,
        timeLost: 250,
        fileNames: [fileName],
      }),
    );
  });

  it('should parse a debt comment with an explicit id field', () => {
    const debtCommentLine = '// @debt some-id timeLost:250 fixCost:10 bugs:2';
    const fileName = 'file1.ts';

    const debt = parseLineToDebtItem(debtCommentLine, fileName);
    expect(debt).toEqual(
      new DebtItem({
        id: 'some-id',
        fixCost: 10,
        bugs: 2,
        timeLost: 250,
        fileNames: [fileName],
      }),
    );
  });
});
