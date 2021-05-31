import inquirer from 'inquirer';

class QuestionsHelper {
  static async askEnableDelay() {
    const questions = [
      {
        type: 'confirm',
        name: 'enable',
        message: 'Do you want your record to be stopped after a fixed period of time?',
        default: false
      }
    ];

    return inquirer.prompt(questions);
  }

  static async askOverride() {
    const questions = [
      {
        type: 'confirm',
        name: 'override',
        message: 'Do you want to override previous record with the same label?',
        default: false
      }
    ];

    return inquirer.prompt(questions);
  }

  static async askDelayValue() {
    const questions = [
      {
        type: 'input',
        name: 'value',
        message: 'How long does the recording should last in seconds?',
        validate: input => {
          if (isNaN(input) || input <= 0) {
            return 'Please enter a valid number greater than 0';
          }

          return true;
        }
      }
    ];

    return inquirer.prompt(questions);
  }

  static async askLabelValue() {
    const questions = [
      {
        type: 'input',
        name: 'label',
        message: 'Enter a label : ',
        validate: input => {
          if (!Object.prototype.toString.call(input) === '[object String]') {
            return 'Please enter a valid string input';
          }

          return true;
        }
      }
    ];

    return inquirer.prompt(questions);
  }

  static async askForServer(serverList) {
    const servers = [];

    for (const server of serverList) {
      servers.push(server.name);
    }

    const questions = [
      {
        type: 'list',
        name: 'websocket',
        message: 'Select a WebSocket server:',
        choices: ['All', ...servers],
        default: ['All']
      }
    ];
    return inquirer.prompt(questions);
  }
}

export default QuestionsHelper;
