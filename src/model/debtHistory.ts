import { Commit } from 'nodegit';

import { DebtHistoryInterface, DebtInterface } from './types';
import Debt from './debt';

export default class DebtHistory implements DebtHistoryInterface {
  public debts: { [commitHash: string]: DebtInterface };
  public commits: {
    [commitHash: string]: number;
  };

  public constructor() {
    this.commits = {};
    this.debts = {};
  }

  public addDebtInformation(debt: DebtInterface, commit: Commit): void {
    this.debts[commit.sha()] = debt;
    this.commits[commit.sha()] = commit.time();
  }

  public getLatestCommitHash(): string | null {
    const commitHashs = Object.keys(this.commits);

    if (!commitHashs) return null;
    console.log({ commitHashs });

    return commitHashs.sort((hash1, hash2) => this.commits[hash2] - this.commits[hash1])[0];
  }

  public getAggregatedDebt(): DebtInterface {
    let aggregatedDebt = new Debt();
    const latestCommitHash = this.getLatestCommitHash();
    console.log({ latestCommitHash });
    if (!latestCommitHash) return aggregatedDebt;

    const { [latestCommitHash]: latestDebt, ...commitsToAggregate } = this.debts;
    aggregatedDebt = Object.assign(latestDebt);

    Object.keys(commitsToAggregate).forEach(commitTime => {
      const debtTypes = this.debts[commitTime].debtTypes;
      Object.keys(debtTypes).forEach(debtType => {
        const existingDebtType = aggregatedDebt.debtTypes[debtType];
        if (existingDebtType) {
          existingDebtType.numberOfChanges += 1;
        }
      });
    });
    console.log({ aggregatedDebt });

    return aggregatedDebt;
  }
}
