import path from 'path';
import fs from 'fs';

import dayjs from 'dayjs';
import yaml from 'js-yaml';

import ConsoleHelper from './consoleHelper';

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
          ConsoleHelper.printError(`creating directory ${this.#destDir} failed`, error);
          process.exit();
        }
      } else {
        ConsoleHelper.printError(
          `try accessing directory ${this.#destDir} failed`,
          error
        );
        process.exit();
      }
    }
  }

  static get currentDirectory() {
    return path.basename(process.cwd());
  }

  static async getServerList(filePath) {
    try {
      const serverListFile = await fs.promises.readFile(filePath, 'utf-8');
      return yaml.load(serverListFile);
    } catch (error) {
      ConsoleHelper.printError(
        `reading WebSocket servers configuration file failed`,
        error
      );
      process.exit();
    }
  }
}

export default FileHelper;
