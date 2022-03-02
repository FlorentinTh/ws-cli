import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';

import TypeHelper from './typeHelper.js';

export const Tags = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  OK: 'OK',
  WARN: 'WARN'
};

export class ConsoleHelper {
  static clear() {
    return clear();
  }

  static printAppTitle(title) {
    if (!TypeHelper.isString(title)) {
      this(Tags.ERROR, `title must be a string`);
      process.exit(1);
    }

    console.log(
      chalk.white(
        figlet.textSync(title, { horizontalLayout: 'fitted', font: 'Standard' })
      )
    );
  }

  static printAppDescription(description) {
    if (!TypeHelper.isString(description)) {
      this(Tags.ERROR, `description must be a string`);
      process.exit(1);
    }

    console.log(chalk.white(`\n${description}\n`));
  }

  static printServerConnection(serverName) {
    if (!TypeHelper.isString(serverName)) {
      this(Tags.ERROR, `serverName must be a string`);
      process.exit(1);
    }

    console.log(
      chalk.grey(`connection to ${serverName} WebSocket server`),
      chalk.grey('['),
      chalk.green('OK'),
      chalk.grey(']')
    );
  }

  static printMessage(tag, message, options = { error: null, eol: true }) {
    const defaultOptions = { error: null, eol: true };

    options = {
      ...defaultOptions,
      ...options
    };

    if (!TypeHelper.isString(message)) {
      this(Tags.ERROR, `message must be a string`);
      process.exit(1);
    }

    let errorMsg = '';

    if (!TypeHelper.isUndefinedOrNull(options.error)) {
      errorMsg = `Reason: ${options.error}`;
    }

    switch (tag) {
      case Tags.INFO:
        tag = chalk.cyan(tag);
        break;
      case Tags.ERROR:
        tag = chalk.red(tag);
        break;
      case Tags.OK:
        tag = chalk.greenBright(tag);
        break;
      case Tags.WARN:
        tag = chalk.yellowBright(tag);
        break;
      default:
        tag = chalk.cyan(Tags.INFO);
        break;
    }

    let output = options.eol ? '\n' : '';

    output += `${
      chalk.grey('[ ') +
      tag +
      chalk.grey(' ]') +
      chalk.white(`: ${message}. ${errorMsg}\n`)
    }`;

    console.log(output);
  }
}
