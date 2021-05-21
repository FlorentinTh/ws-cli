import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';

class ConsoleHelper {
  static clear() {
    return clear();
  }

  static printAppTitle(title) {
    console.log(chalk.white(figlet.textSync(title, { horizontalLayout: 'fitted' })));
  }

  static printAppDescription() {
    console.log(
      chalk.white(
        `This CLI allows you to record data from every WebSocket available in the LIARA laboratory.\n`
      )
    );
  }

  static printError(message, error) {
    console.log(
      chalk.grey('['),
      chalk.red(`error`),
      chalk.grey(']'),
      chalk.white(`: ${message}. Reason: ${error}`)
    );
  }
}

export default ConsoleHelper;
