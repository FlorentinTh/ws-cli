import yargs from 'yargs';

class CommandHelper {
  static get argv() {
    return yargs
      .usage(
        `Usage:
          $ ws-cli [options]`
      )
      .option('conf', {
        alias: 'c',
        describe: `Path of the YAML configuration file containing the list of the WebSocket servers`,
        type: 'string',
        demandOption: false,
        default: 'servers.yml'
      })
      .option('default', {
        alias: 'd',
        describe: `Automatically respond to questions with default values`,
        type: 'boolean',
        default: false,
        demandOption: false
      })
      .help('h')
      .alias('h', 'help')
      .option('label', {
        alias: 'l',
        describe: `Label output folder according to user entry instead of a timestamp by default`,
        type: 'boolean',
        default: false,
        demandOption: false
      })
      .version()
      .alias('v', 'version').argv;
  }

  static #searchOption(option) {
    if (process.argv.indexOf(option) > -1) {
      return true;
    }

    return false;
  }

  static isOptionSet(option) {
    if (this.#searchOption(`-${option}`) || this.#searchOption(`--${option}`)) {
      return true;
    }

    for (const aliasIndex in yargs.choices(option).parsed.aliases[option]) {
      const alias = yargs.choices(option).parsed.aliases[option][aliasIndex];

      if (this.#searchOption(`-${alias}`) || this.#searchOption(`--${alias}`)) {
        return true;
      }
    }

    return false;
  }
}

export default CommandHelper;
