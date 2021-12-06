import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';

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
    console.log(
      chalk.white(
        figlet.textSync(title, { horizontalLayout: 'fitted', font: 'Standard' })
      )
    );
  }

  static printAppDescription() {
    console.log(
      chalk.white(
        `\nThis CLI allows you to record data from every WebSocket available in the LIARA laboratory.\n`
      )
    );
  }

  static printMessage(tag, message, error = null) {
    if (!Object.prototype.toString.call(message) === '[object String]') {
      this.printMessage(Tags.ERROR, `Error message must be a string`);
      process.exit(1);
    }

    let errorMsg = '';

    if (!(error === null)) {
      errorMsg = `Reason: ${error}`;
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
        break;
    }

    console.log(
      chalk.grey('\n['),
      tag,
      chalk.grey(']'),
      chalk.white(`: ${message}. ${errorMsg}\n`)
    );
  }
}
