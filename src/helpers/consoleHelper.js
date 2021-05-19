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
}

export default ConsoleHelper;
