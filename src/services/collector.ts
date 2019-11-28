import Debt from '../model/debt';
import { Commit, TreeEntry } from 'nodegit';
import { HistoryEventEmitter } from 'nodegit/commit';
import dateHelper from '../utils/dateHelper';
import fs from 'fs';
import glob from 'glob';
import nodeGit from 'nodegit';

import pathHelper from '../utils/pathHelper';
import { ConfigInterface, DebtInterface } from '../model/types';
import { parseLineToDebtItem } from './parser';
import DebtHistory from '../model/debtHistory';

export default class Collector {
  public scanningPath: string;
  private readonly filter: string;
  private readonly ignorePaths: string[];

  public constructor(scanningPath: string, ignorePaths: string[] = [], filter: string = '') {
    this.scanningPath = scanningPath;
    this.filter = filter;
    this.ignorePaths = ignorePaths;
  }

  public static createFromConfig(
    scanningPath: string,
    filter: string,
    config: ConfigInterface,
  ): Collector {
    return new Collector(scanningPath, config.ignorePaths, filter);
  }

  public async collect(): Promise<DebtInterface> {
    const allNotHiddenFiles = this.scanningPath + '/**/*.*';
    const notHiddenFiles = glob.sync(allNotHiddenFiles, { nodir: true });
    const allHiddenFiles = this.scanningPath + '/**/.*';
    const hiddenFiles = glob.sync(allHiddenFiles, { nodir: true });

    const allFiles = notHiddenFiles.concat(hiddenFiles);
    const debt = new Debt();

    const targetedFiles = allFiles.filter(
      (path: string): boolean => !pathHelper.isFileMatchPathPatternArray(path, this.ignorePaths),
    );
    for (let fileName of targetedFiles) {
      const file = fs.readFileSync(fileName, 'utf-8');
      this.parseFile(file, fileName, debt);
    }

    return debt;
  }

  public async collectHistory(historyNumberOfDays: number) {
    const debtHistory = new DebtHistory();
    debtHistory.currentDebt = await this.collect();

    const gitPath = pathHelper.getGitRepositoryPath(this.scanningPath);
    const repository = await nodeGit.Repository.open(gitPath);
    const firstCommitOnMaster = await repository.getMasterCommit();
    const history = firstCommitOnMaster.history();
    const commits = await this.getRelevantCommit(firstCommitOnMaster, history, historyNumberOfDays);
    for (let commit of commits) {
      const debt = await this.collectDebtFromCommit(commit);
      debtHistory.addDebtInformation(debt, commit);
    }

    return debtHistory;
  }

  //TODO quality "Maximet: put the function navigating through the git history in a service"
  private async getRelevantCommit(
    firstCommit: Commit,
    history: HistoryEventEmitter,
    historyNumberOfDays: number,
  ): Promise<Commit[]> {
    return new Promise((resolve): void => {
      history.on('end', function(commits: Commit[]): void {
        // We select one commit per day, the first one we meet
        const startDate = firstCommit.date();
        const startDateTime = startDate.getTime();
        // @debt quality:variable "Maximet: We should create a const somewhere"

        const NUMBER_OF_DAYS_TO_BUILD_HISTORY = historyNumberOfDays * 24 * 3600000;
        const endDateTime = startDateTime - NUMBER_OF_DAYS_TO_BUILD_HISTORY;

        const relevantCommits = new Map<string, Commit>();
        for (let commit of commits) {
          if (commit.date().getTime() < endDateTime) {
            break;
          }

          const formattedDate = dateHelper.getDayMonthYearFormat(commit.date());
          const commitOfTheDay = relevantCommits.get(formattedDate);
          if (!commitOfTheDay) {
            relevantCommits.set(formattedDate, commit);
          }
        }
        return resolve(Array.from(relevantCommits.values()));
      });

      history.start();
    });
  }

  private async collectDebtFromCommit(commit: Commit): Promise<DebtInterface> {
    const debt = new Debt();
    const entries = await this.getFilesFromCommit(commit);
    for (let entry of entries) {
      await this.parseEntry(entry, debt);
    }

    return debt;
  }

  private async getFilesFromCommit(commit: Commit): Promise<TreeEntry[]> {
    return new Promise((resolve): void => {
      const tree = commit.getTree();
      tree.then(function(tree: nodeGit.Tree): void {
        const walker = tree.walk(true);
        const entryArray = Array<TreeEntry>();
        walker.on('entry', function(entry: TreeEntry): void {
          entryArray.push(entry);
        });

        walker.on('end', (): void => {
          return resolve(entryArray);
        });
        // Don't forget to call `start()`!
        walker.start();
      });
    });
  }

  private async parseEntry(entry: TreeEntry, debt: DebtInterface): Promise<void> {
    const those = this;
    return new Promise((resolve): void => {
      const blob = entry.getBlob();
      blob
        .then(function(blob): void {
          those.parseFile(String(blob), entry.path(), debt);
          resolve();
        })
        .catch((error): void => console.error('Error while parsing the blob of the file', error));
    });
  }

  private parseFile(file: string, fileName: string, debt: DebtInterface): void {
    const lines: string[] = file.split('\n').filter(line => this.isComment(line));

    for (let line of lines) {
      const debtItem = parseLineToDebtItem(line, fileName);
      if (debtItem) {
        debt.addDebtItem(debtItem);
      }
    }
  }

  /**
   * Check if the line is a comment
   * @param line
   */
  private isComment(line: string): boolean {
    const lineTrimmed = line.trim();
    const firstChar = lineTrimmed.charAt(0);

    return firstChar === '#' || firstChar === '*' || firstChar === '/';
  }
}
