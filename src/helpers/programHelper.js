import url from 'url';
import path from 'path';
import fs from 'fs';

class ProgramHelper {
  static getPackageJson() {
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, '..', '..', 'package.json');
    return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));
  }

  static getRootPath() {
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    return path.join(__dirname, `..`, `..`);
  }
}

export default ProgramHelper;
