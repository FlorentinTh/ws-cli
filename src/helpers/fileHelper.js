import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import dayjs from 'dayjs';

import { ConsoleHelper, Tags } from './consoleHelper.js';
import ProgramHelper from './programHelper.js';
import TypeHelper from './typeHelper.js';
class FileHelper {
  static async isFileExists(filePath) {
    if (!TypeHelper.isString(filePath)) {
      ConsoleHelper.printMessage(Tags.ERROR, `File path is not valid`);
      process.exit(1);
    }

    try {
      await fs.promises.access(filePath);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      }

      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Error occurs while trying to access file: ${filePath}`
      );
      process.exit(1);
    }
  }

  static async isConfigurationFileValid(configurationFileJson) {
    if (!TypeHelper.isArray(configurationFileJson)) {
      ConsoleHelper.printMessage(Tags.ERROR, `Configuration file is a valid JSON file`);
      process.exit(1);
    }

    const configurationFileSchema = await fs.promises.readFile(
      path.join(ProgramHelper.getRootPath(), `src/schemas/conf.schema.json`),
      'utf8'
    );

    const ajv = new Ajv({ allErrors: true });
    addFormats(ajv);

    const validate = ajv.compile(JSON.parse(configurationFileSchema));
    const valid = validate(configurationFileJson);

    if (!valid) {
      return false;
    }

    return true;
  }

  static async initRecordingFolder(label) {
    const outputPath = path.join('.', ProgramHelper.getPackageJson().name + '_output');
    const folderName = label === null ? dayjs().format('YYYYMMDDHHmmss') : label;
    const destinationDirectory = path.join(outputPath, folderName);

    try {
      await fs.promises.access(destinationDirectory);
      return {
        status: false,
        destination: destinationDirectory
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        try {
          await fs.promises.mkdir(destinationDirectory, { recursive: true });
          return {
            status: true,
            destination: destinationDirectory
          };
        } catch (error) {
          ConsoleHelper.printMessage(
            Tags.ERROR,
            `creating directory ${destinationDirectory} failed`,
            {
              error: error.message || null
            }
          );
          process.exit(1);
        }
      } else {
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `try accessing directory ${destinationDirectory} failed`,
          {
            error: error.message || null
          }
        );
        process.exit(1);
      }
    }
  }
}

export default FileHelper;
