import fs from 'fs';
import path from 'path';

import inquirer from 'inquirer';
import { Spinner } from 'clui';
import chalk from 'chalk';
import WebSocketClient from 'websocket-as-promised';
import WebSocket from 'ws';

export const serverList = [
  {
    name: 'RFID',
    host: '127.0.0.1',
    port: '8080',
    secured: false
  },
  {
    name: 'Energetic',
    host: '172.24.24.99',
    port: '6061',
    secured: false
  },
  {
    name: 'UWB',
    host: '172.24.24.122',
    port: '6017',
    secured: false
  }
];

export class WebsocketServer {
  constructor(configuration) {
    if (!(configuration instanceof Object) && !(configuration === null)) {
      throw new Error('configuration must be a not null Object');
    }

    this._delay = configuration.delay;
    this._destination = configuration.destination;
    this._server = configuration.server;

    const _protocol = this._server.secured ? 'wss://' : 'ws://';

    this._client = new WebSocketClient(
      `${_protocol}${this._server.host}:${this._server.port}/`,
      {
        createWebSocket: url => new WebSocket(url),
        extractMessageData: event => event,
        packMessage: data => JSON.stringify(data),
        unpackMessage: data => JSON.parse(data)
      }
    );
  }

  static async _askEnableDelay() {
    const _questions = [
      {
        type: 'confirm',
        name: 'enable',
        message: 'do you want your record to be stopped after a fixed period of time?',
        default: false
      }
    ];

    return inquirer.prompt(_questions);
  }

  static async _askDelayValue() {
    const _questions = [
      {
        type: 'input',
        name: 'value',
        message: 'how long does the recording should last in seconds?',
        validate: input => {
          if (isNaN(input)) {
            return 'please enter a valid number greater than 0';
          }

          return true;
        }
      }
    ];

    return inquirer.prompt(_questions);
  }

  static async askForServer() {
    const _questions = [
      {
        type: 'list',
        name: 'websocket',
        message: 'select a WebSocket server:',
        choices: ['All', 'RFID', 'Energetic', 'UWB'],
        default: ['All']
      }
    ];
    return inquirer.prompt(_questions);
  }

  async connect() {
    const _spinner = new Spinner(
      `opening connection on ${this._server.name} WebSocket server... `
    );
    _spinner.start();

    try {
      await this._client.open();
      console.log(
        chalk.grey(`connection to ${this._server.name} WebSocket server`),
        chalk.grey('['),
        chalk.green('OK'),
        chalk.grey(']')
      );
    } catch (error) {
      console.log(chalk.grey('['), chalk.red(`ERROR`), chalk.grey(']'));
      process.exit();
    }

    _spinner.stop();

    try {
      const writeStream = fs.createWriteStream(
        path.join(this._destination, `${this._server.name}.json`)
      );

      let spinner;

      if (!(this._delay === null)) {
        let value = this._delay;

        spinner = new Spinner(`writing to file...`);
        spinner.start();

        const interval = setInterval(() => {
          value--;

          if (value > 0) {
            spinner.message(`writing to file... ${value}s remaining`);
            writeStream.write(`{"message": "data-${value}"}\n`);
          } else {
            spinner.stop();
            clearInterval(interval);

            writeStream.write('{"message": "complete"}\n');
            writeStream.end(async () => {
              writeStream.close();
              writeStream.addListener('close', async () => {
                await this._client.close();
                console.log(chalk.greenBright(`i recording complete`));
                process.exit();
              });
            });
          }
        }, 1000);
      } else {
        spinner = new Spinner(`writing to file... (ctrl+c to stop)`);
        spinner.start();

        writeStream.write('{"message": "data"}\n');

        process.stdin.resume();
        process.on('SIGINT', function () {
          writeStream.write('{"message": "complete"}\n');
          writeStream.end(async () => {
            writeStream.close();
            writeStream.addListener('close', async () => {
              await this._client.close();
              process.exit();
            });
          });
        });
      }

      // this._client.send(JSON.stringify({ event: 'subscribe', stocks: ['DP', 'H'] }));

      // this._client.onMessage.addListener(data => {
      //   writeStream.write(data);
      // });
    } catch (error) {
      console.log(chalk.grey('['), chalk.red(error), chalk.grey(']'));
      process.exit();
    }

    // const _recording = new Recording(this._destination, this._server);
  }
}
