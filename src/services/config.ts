import fs from 'fs';
import path from 'path';
import { ConfigInterface } from '../model/types';

export interface TyrionConfigInterface {
  ignorePath: string[];
}

export default class Config implements ConfigInterface {
  public readonly ignorePaths: string[];
  private readonly config: TyrionConfigInterface;

  public constructor(directoryPath: string) {
    const defaultConfigFile = fs.readFileSync(
      path.resolve(__dirname, '../../.tyrion-config.json'),
      'utf-8',
    );
    const defaultConfig = JSON.parse(defaultConfigFile);
    const projectConfigPath = directoryPath + '/.tyrion-config.json';

    if (fs.existsSync(projectConfigPath)) {
      const projectConfigFile = fs.readFileSync(projectConfigPath, 'utf-8');
      const projectConfig = JSON.parse(projectConfigFile.toString());

      this.config = Object.assign(defaultConfig, projectConfig) as TyrionConfigInterface;
    } else {
      this.config = defaultConfig as TyrionConfigInterface;
    }

    this.ignorePaths = this.config.ignorePath;
  }
}
