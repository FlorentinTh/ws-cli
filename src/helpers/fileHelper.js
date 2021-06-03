import path from 'path';
import fs from 'fs';

import dayjs from 'dayjs';
import yaml from 'js-yaml';

import { Tags, ConsoleHelper } from './consoleHelper';

class FileHelper {
  #destDir;

  constructor(outputPath, label) {
    const folderName = label === null ? dayjs().format('YYYYMMDDHHmmss') : label;
    this.#destDir = path.join(outputPath, folderName);
  }

  get destinationDirectory() {
    return this.#destDir;
  }

  async init() {
    try {
      await fs.promises.access(this.#destDir);
      return false;
    } catch (error) {
      if (error.code === 'ENOENT') {
        try {
          await fs.promises.mkdir(this.#destDir, { recursive: true });
          return true;
        } catch (error) {
          ConsoleHelper.printMessage(
            Tags.ERROR,
            `creating directory ${this.#destDir} failed`,
            error.message || null
          );
          process.exit(1);
        }
      } else {
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `try accessing directory ${this.#destDir} failed`,
          error.message || null
        );
        process.exit(1);
      }
    }
  }

  static async isConfigurationFileExists(filePath) {
    if (!Object.prototype.toString.call(filePath) === '[object String]') {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Configuration file path argument must be a string`
      );
      process.exit(1);
    }

    try {
      await fs.promises.access(filePath);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      }
    }
  }

  static async getServerList(filePath) {
    try {
      const serverListFile = await fs.promises.readFile(filePath, 'utf-8');
      return yaml.load(serverListFile);
    } catch (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `reading WebSocket servers configuration file failed`,
        error.message || null
      );
      process.exit(1);
    }
  }
}

export default FileHelper;
