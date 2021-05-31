import yargs from 'yargs';

class OptionsHelper {
  static get options() {
    return yargs
      .usage('Usage: ws-cli [OPTIONS]')
      .option('configuration', {
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
      .help()
      .option('no-sanitize', {
        describe: `Disable default sanitization of both first and last seconds of recording`,
        type: 'boolean',
        default: false,
        demandOption: false
      })
      .option('label', {
        alias: 'l',
        describe: `Label output folder according to user entry instead of a timestamp by default`,
        type: 'boolean',
        default: false,
        demandOption: false
      })
      .version().argv;
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

export default OptionsHelper;
