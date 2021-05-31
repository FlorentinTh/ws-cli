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
    fs.mkdirSync(this.#destDir, { recursive: true });
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

  get destinationDirectory() {
    return this.#destDir;
  }
}

export default FileHelper;
