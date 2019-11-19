export type DebtItemInterface = {
  category: string;
  comment: string;
  fileName: string;
  id: string;
  type: string;
  price?: number;
};

export type PricerInterface = {
  getPrice: (debt: DebtItemInterface) => number;
};

export type DebtTypeInterface = {
  debtItems: DebtItemInterface[];
  debtScore: number;
  type: string;
  addDebtItem: (debtItem: DebtItemInterface) => void;
};

export type DebtInterface = {
  debtTypes: { [type: string]: DebtTypeInterface };
  debtScore: number;
  pricer: PricerInterface;
  addDebtItem: (debtItem: DebtItemInterface) => void;
  getDebtScoreByType: (type: string) => number;
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
  prices: PricesInterface;
  standard: number;
  ignorePaths: string[];
};
