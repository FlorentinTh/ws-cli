import { basename } from 'path';

class FileHelper {
  static getCurrentDirectory() {
    return basename(process.cwd());
  }
}

export default FileHelper;
