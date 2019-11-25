export type DebtItemInterface = {
  bugs: number;
  fileNames: string[];
  fixCost: number;
  id: string;
  numberOfChanges: number;
  numberOfOccurences: number;
  timeLost: number;
  addDebtItem: (debtItem: DebtItemInterface) => void;
};

export type DebtInterface = {
  debtTypes: { [type: string]: DebtItemInterface };
  addDebtItem: (debtItem: DebtItemInterface) => void;
};

export type DebtHistoryInterface = {
  debts: { [commitTime: string]: DebtInterface };
  addDebtInformation: (debt: DebtInterface, commitTime: string) => void;
};

export type CodeQualityInformationInterface = {
  debt: DebtInterface;
  commitDateTime: Date;
};

export type CodeQualityInformationHistoryInterface = {
  codeQualityInformationBag: CodeQualityInformationInterface[];
  addCodeQualityInformation: (codeQualityInformation: CodeQualityInformationInterface) => void;
};

export interface PricesInterface {
  [propName: string]: number;
}

export type ConfigInterface = {
  standard: number;
  ignorePaths: string[];
};
