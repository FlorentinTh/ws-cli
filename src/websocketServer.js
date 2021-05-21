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
  #server;
  #client;
  #multiple;

  constructor(configuration) {
    if (!(configuration instanceof Object) && !(configuration === null)) {
      throw new Error('configuration must be a not null Object');
    }

    this.#delay = configuration.delay;
    this.#destination = configuration.destination;
    this.#server = configuration.server;
    this.#multiple = configuration.multiple;

    const protocol = this.#server.secured ? 'wss://' : 'ws://';

    this.#client = new WebSocketClient(
      `${protocol}${this.#server.host}:${this.#server.port}/`,
      {
        createWebSocket: url => new WebSocket(url),
        extractMessageData: event => event,
        packMessage: data => JSON.stringify(data),
        unpackMessage: data => JSON.parse(data)
      }
    );
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
    const spinner = new Spinner(
      `opening connection on ${this.#server.name} WebSocket server... `
    );
    spinner.start();

    try {
      await this.#client.open();
      console.log(
        chalk.grey(`connection to ${this.#server.name} WebSocket server`),
        chalk.grey('['),
        chalk.green('OK'),
        chalk.grey(']')
      );
    } catch (error) {
      console.log(chalk.grey('['), chalk.red(`ERROR`), chalk.grey(']'));
      process.exit();
    }

    spinner.stop();
    this.#record();
  }

  async #record() {
    let writeStream;
    try {
      writeStream = fs.createWriteStream(
        path.join(this.#destination, `${this.#server.name}.json`)
      );
    } catch (error) {
      ConsoleHelper.printError(`creating ${this.#server.name}.json file failed`, error);
      process.exit();
    }

    let spinner;

    const pluralForm = this.#multiple ? 's' : '';

    if (!(this.#delay === null)) {
      let value = this.#delay;

      spinner = new Spinner(`writing to file${pluralForm}...`);
      spinner.start();

      const interval = setInterval(() => {
        value--;

        if (value > 0) {
          spinner.message(`writing to file${pluralForm}... ${value}s remaining`);

          try {
            writeStream.write(`{"message": "data-${value}"}\n`);
          } catch (error) {
            ConsoleHelper.printError(
              `writing to ${this.#server.name}.json file failed`,
              error
            );
          }
        } else {
          spinner.stop();
          clearInterval(interval);

          try {
            writeStream.write('{"message": "complete"}\n');
          } catch (error) {
            ConsoleHelper.printError(
              `writing to ${this.#server.name}.json file failed`,
              error
            );
          }

          writeStream.end(async () => {
            try {
              writeStream.close();
            } catch (error) {
              ConsoleHelper.printError(
                `closing ${this.#server.name}.json file failed`,
                error
              );
            }

            writeStream.addListener('close', async () => {
              try {
                await this.#client.close();
              } catch (error) {
                ConsoleHelper.printError(
                  `closing connection to ${this.#server.name} WebSocket server failed`,
                  error
                );
              }

              console.log(chalk.greenBright(`i recording complete`));
              process.exit();
            });
          });
        }
      }, 1000);
    } else {
      spinner = new Spinner(`writing to file${pluralForm}... (ctrl+c to stop)`);
      spinner.start();

      try {
        writeStream.write('{"message": "data"}\n');
      } catch (error) {
        ConsoleHelper.printError(
          `writing to ${this.#server.name}.json file failed`,
          error
        );
      }

      process.stdin.resume();
      process.on('SIGINT', () => {
        try {
          writeStream.write('{"message": "complete"}\n');
        } catch (error) {
          ConsoleHelper.printError(
            `writing to ${this.#server.name}.json file failed`,
            error
          );
        }

        writeStream.end(async () => {
          try {
            writeStream.close();
          } catch (error) {
            ConsoleHelper.printError(
              `closing ${this.#server.name}.json file failed`,
              error
            );
          }

          writeStream.addListener('close', async () => {
            try {
              await this.#client.close();
            } catch (error) {
              ConsoleHelper.printError(
                `closing connection to ${this.#server.name} WebSocket server failed`,
                error
              );
            }

            process.exit();
          });
        });
      });
    }

    /**
     * Usage example :
     */
    // this.#client.send(JSON.stringify({ event: 'subscribe', stocks: ['DP', 'H'] }));
    // this.#client.onMessage.addListener(data => {
    //   writeStream.write(data);
    // });
  }
}
