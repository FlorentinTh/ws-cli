import path from 'path';
import fs from 'fs';

import dayjs from 'dayjs';

class FileHelper {
  constructor(outputPath) {
    const _timestamp = dayjs().format('YYYYMMDDHHmmss');
    this._destDir = path.join(outputPath, _timestamp);

    fs.mkdirSync(this._destDir, { recursive: true });
  }

  static get currentDirectory() {
    return path.basename(process.cwd());
  }

  get destinationDirectory() {
    return this._destDir;
  }
}

export default FileHelper;
