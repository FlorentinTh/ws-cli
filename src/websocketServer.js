import fs from 'fs';
import path from 'path';

import inquirer from 'inquirer';
import { Spinner } from 'clui';
import chalk from 'chalk';
import WebSocketClient from 'websocket-as-promised';
import WebSocket from 'ws';

import ConsoleHelper from './helpers/consoleHelper';

export const serverList = [
  {
    name: 'RFID',
    host: '127.0.0.1',
    port: '8080',
    secured: false
  },
  {
    name: 'Energetic',
    host: '127.0.0.1',
    port: '8081',
    secured: false
  },
  {
    name: 'UWB',
    host: '127.0.0.1',
    port: '8082',
    secured: false
  }
];

export class WebsocketServer {
  #delay;
  #destination;
  #servers;

  constructor(configuration) {
    if (!(configuration instanceof Object) && !(configuration === null)) {
      throw new Error('configuration must be a not null Object');
    }

    this.#delay = configuration.delay;
    this.#destination = configuration.destination;
    this.#servers = configuration.servers;

    for (const server of this.#servers) {
      const protocol = server.secured ? 'wss://' : 'ws://';

      server.connection = new WebSocketClient(
        `${protocol}${server.host}:${server.port}/`,
        {
          createWebSocket: url => new WebSocket(url),
          extractMessageData: event => event,
          packMessage: data => JSON.stringify(data),
          unpackMessage: data => JSON.parse(data)
        }
      );
    }
  }

  static async askEnableDelay() {
    const questions = [
      {
        type: 'confirm',
        name: 'enable',
        message: 'do you want your record to be stopped after a fixed period of time?',
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
        message: 'how long does the recording should last in seconds?',
        validate: input => {
          if (isNaN(input) || input <= 0) {
            return 'please enter a valid number greater than 0';
          }

          return true;
        }
      }
    ];

    return inquirer.prompt(questions);
  }

  static async askForServer() {
    const questions = [
      {
        type: 'list',
        name: 'websocket',
        message: 'select a WebSocket server:',
        choices: ['All', 'RFID', 'Energetic', 'UWB'],
        default: ['All']
      }
    ];
    return inquirer.prompt(questions);
  }

  async connect() {
    for (const server of this.#servers) {
      const spinner = new Spinner(
        `opening connection on ${server.name} WebSocket server... `
      );
      spinner.start();

      try {
        await server.connection.open();
        console.log(
          chalk.grey(`connection to ${server.name} WebSocket server`),
          chalk.grey('['),
          chalk.green('OK'),
          chalk.grey(']')
        );
      } catch (error) {
        console.log(chalk.grey('['), chalk.red(`ERROR`), chalk.grey(']'));
        process.exit();
      }

      spinner.stop();

      try {
        server.stream = fs.createWriteStream(
          path.join(this.#destination, `${server.name}.json`)
        );
      } catch (error) {
        ConsoleHelper.printError(`creating ${server.name}.json file failed`, error);
        process.exit();
      }
    }
    this.#write();
  }

  async #write() {
    for (const server of this.#servers) {
      let spinner;
      const pluralForm = this.#servers.length > 1 ? 's' : '';

      if (!(this.#delay === null)) {
        let value = this.#delay;

        spinner = new Spinner(`writing to file${pluralForm}...`);
        spinner.start();

        const interval = setInterval(async () => {
          value--;

          if (value > 0) {
            spinner.message(`writing to file${pluralForm}... ${value}s remaining`);

            try {
              server.stream.write(`{"message": "data-${value}"}\n`);
            } catch (error) {
              ConsoleHelper.printError(
                `writing to ${server.name}.json file failed`,
                error
              );
            }
          } else {
            spinner.stop();
            clearInterval(interval);

            try {
              server.stream.write('{"message": "complete"}\n');
              server.stream.close();
              await server.connection.close();
            } catch (error) {
              ConsoleHelper.printError(`closing ${server.name}.json file failed`, error);
            }

            console.log(chalk.greenBright(`i recording complete`));
            process.exit();
          }
        }, 1000);
      } else {
        spinner = new Spinner(`writing to file${pluralForm}... (ctrl+c to stop)`);
        spinner.start();

        try {
          server.stream.write('{"message": "data"}\n');
        } catch (error) {
          ConsoleHelper.printError(`writing to ${server.name}.json file failed`, error);
        }

        if (process.platform === 'win32') {
          const rl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
          });

          rl.on('SIGINT', () => {
            process.emit('SIGINT');
          });
        }

        process.on('SIGINT', async () => {
          try {
            for await (const server of this.#servers) {
              server.stream.write('{"message": "complete"}\n', async () => {
                server.stream.end(() => {
                  try {
                    server.stream.close();
                  } catch (error) {
                    ConsoleHelper.printError(
                      `closing ${server.name}.json file failed`,
                      error
                    );
                  }
                });

                server.stream.addListener('close', async () => {
                  try {
                    await server.connection.close();
                  } catch (error) {
                    ConsoleHelper.printError(
                      `closing connection to ${server.name} WebSocket server failed`,
                      error
                    );
                  }
                });
              });
            }

            process.stdout.write('\n');
            console.log(chalk.greenBright(`i recording complete`));
            process.exit();
          } catch (error) {
            ConsoleHelper.printError(`closing ${server.name}.json file failed`, error);
          }
        });
      }
    }

    /**
     * Usage example :
     *   this.#client.send(JSON.stringify({ event: 'subscribe', stocks: ['DP', 'H'] }));
     *   this.#client.onMessage.addListener(data => {
     *     writeStream.write(data);
     *   });
     */
  }
}
