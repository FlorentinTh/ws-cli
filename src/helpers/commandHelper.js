import fs from 'fs';
import yargs from 'yargs';
import yaml from 'js-yaml';

import { hideBin } from 'yargs/helpers';
import FileHelper from './fileHelper.js';
import ProgramHelper from './programHelper.js';
import TypeHelper from './typeHelper.js';
import { ConsoleHelper, Tags } from './consoleHelper.js';

class CommandHelper {
  #yargs;
  #serverList;

  get argv() {
    return this.#yargs
      .usage(
        `Usage:
          $ ws-cli [options]`
      )
      .option('conf', {
        alias: ['c', 'C'],
        describe: `Path of the YAML configuration file containing the list of the WebSocket servers`,
        type: 'string',
        demandOption: false,
        default: './servers.yml'
      })
      .help('h')
      .alias('h', ['H', 'help'])
      .option('label', {
        alias: ['l', 'L'],
        describe: `Label output folder according to the user entry instead of a timestamp by default and add the provided label to the data`,
        type: 'boolean',
        default: false,
        demandOption: false
      })
      .version(ProgramHelper.getPackageJson().version)
      .alias('v', ['V', 'version']).argv;
  }

  get serverList() {
    return this.#serverList;
  }

  constructor() {
    this.#yargs = yargs(hideBin(process.argv));
  }

  #searchOption(option) {
    if (process.argv.indexOf(option) > -1) {
      return true;
    }

    return false;
  }

  isOptionSet(option) {
    if (this.#searchOption(`-${option}`) || this.#searchOption(`--${option}`)) {
      return true;
    }

    const aliases = this.#yargs.choices(option).parsed.aliases[option];

    for (const aliasIndex in aliases) {
      const alias = aliases[aliasIndex];

      if (this.#searchOption(`-${alias}`) || this.#searchOption(`--${alias}`)) {
        return true;
      }
    }

    return false;
  }

  async validateOptions() {
    const argv = this.argv;

    if (argv._.length > 0) {
      return { error: true, message: `Unexpected parameter: ${argv._[0]}` };
    }

    const configurationFilePath = argv.conf;

    if (this.isOptionSet('conf')) {
      if (!TypeHelper.isString(configurationFilePath)) {
        return { error: true, message: 'Output path must be a valid string' };
      }
    }

    const isConfigurationFileAccessible = await FileHelper.isFileExists(
      configurationFilePath
    );

    if (!isConfigurationFileAccessible) {
      return { error: true, message: 'File describing servers to connect to not found' };
    }

    const configurationFileYaml = await fs.promises.readFile(
      configurationFilePath,
      'utf8'
    );
    const configurationFileJson = yaml.load(configurationFileYaml);
    const isConfigurationFileValid = await FileHelper.isConfigurationFileValid(
      configurationFileJson
    );

    if (!isConfigurationFileValid) {
      ConsoleHelper.printMessage(Tags.ERROR, `Configuration file is not valid`);
      process.exit(1);
    }

    this.#serverList = configurationFileJson;

    return { error: false, message: 'OK' };
  }
}

export default CommandHelper;
