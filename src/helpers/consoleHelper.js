import clear from 'clear';
import chalk from 'chalk';
import figlet from 'figlet';

class ConsoleHelper {
  static clear() {
    return clear();
  }

  static printAppTitle(title) {
    return console.log(
      chalk.white(figlet.textSync(title, { horizontalLayout: 'fitted' }))
    );
  }

  static printAppDescription() {
    return console.log(
      chalk.white(
        `This CLI allows you to record data from every WebSocket available in the LIARA laboratory.\n`
      )
    );
  }
}

export default ConsoleHelper;
