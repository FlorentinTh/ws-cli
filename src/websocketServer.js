import fs from 'fs';
import path from 'path';

import { Spinner } from 'clui';
import chalk from 'chalk';
import WebSocketClient from 'websocket-as-promised';
import WebSocket from 'ws';

import { Tags, ConsoleHelper } from './helpers/consoleHelper';
import Labelizer from './labelizer';

class WebsocketServer {
  #delay;
  #destination;
  #sanitize;
  #label;
  #servers;

  constructor(configuration) {
    if (!(configuration instanceof Object) && !(configuration === null)) {
      throw new Error('configuration must be a not null Object');
    }

    this.#delay = configuration.delay;
    this.#destination = configuration.destination;
    this.#sanitize = configuration.sanitize;
    this.#label = configuration.label;
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
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `impossible to open connection on ${server.name} WebSocket server`,
          error.message || null
        );
        process.exit(1);
      }

      spinner.stop();

      const filename = server.name.toLowerCase().split(' ').join('_');

      try {
        server.stream = fs.createWriteStream(
          path.join(this.#destination, `${filename}.json`)
        );
      } catch (error) {
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `creating ${server.name}.json file failed`,
          error.message || null
        );
        process.exit(1);
      }
    }
    this.#write();
  }

  async #write() {
    for (const server of this.#servers) {
      let spinner;
      const pluralForm = this.#servers.length > 1 ? 's' : '';

      let labelizer = null;
      if (!(server.label === null)) {
        labelizer = new Labelizer(server.name);
      }

      if (!(this.#delay === null)) {
        let value = this.#delay;

        spinner = new Spinner(`writing to file${pluralForm}...`);
        spinner.start();

        server.connection.onMessage.addListener(async data => {
          try {
            if (value > 0) {
              if (!(labelizer === null)) {
                data = labelizer.labelize(server.label, data);
              }

              await server.stream.write(data + '\n');
            }
          } catch (error) {
            ConsoleHelper.printMessage(
              Tags.ERROR,
              `writing to ${server.name}.json file failed`,
              error.message || null
            );
          }
        });

        const interval = setInterval(async () => {
          if (value > 0) {
            spinner.message(`writing to file${pluralForm}... ${value}s remaining`);
          } else {
            spinner.stop();
            clearInterval(interval);

            try {
              await server.stream.close();
              await server.connection.close();
            } catch (error) {
              ConsoleHelper.printMessage(
                Tags.ERROR,
                `closing ${server.name}.json file failed`,
                error.message || null
              );
              process.exit(1);
            }

            ConsoleHelper.printMessage(Tags.OK, `recording complete`);

            // if (this.#sanitize) {
            //   /**
            //    * TODO
            //    */
            // }

            process.exit(0);
          }
          value--;
        }, 1000);
      } else {
        spinner = new Spinner(`writing to file${pluralForm}... (ctrl+c to stop)`);
        spinner.start();

        server.connection.onMessage.addListener(async data => {
          try {
            if (!(labelizer === null)) {
              data = labelizer.labelize(server.label, data);
            }

            await server.stream.write(data + '\n');
          } catch (error) {
            ConsoleHelper.printMessage(
              Tags.ERROR,
              `writing to ${server.name}.json file failed`,
              error.message || null
            );
            process.exit(1);
          }
        });

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
              server.connection.close();

              server.stream.end(() => {
                try {
                  server.stream.close();
                } catch (error) {
                  ConsoleHelper.printMessage(
                    Tags.ERROR,
                    `closing ${server.name}.json file failed`,
                    error.message || null
                  );
                  process.exit(1);
                }
              });

              server.stream.addListener('close', async () => {
                try {
                  await server.connection.close();
                } catch (error) {
                  ConsoleHelper.printMessage(
                    Tags.ERROR,
                    `closing connection to ${server.name} WebSocket server failed`,
                    error.message || null
                  );
                  process.exit(1);
                }
              });
            }

            process.stdout.write('\n');
            ConsoleHelper.printMessage(Tags.OK, `recording complete`);

            // if (this.#sanitize) {
            /**
             * TODO
             */
            // }

            process.exit(0);
          } catch (error) {
            ConsoleHelper.printMessage(
              Tags.ERROR,
              `closing ${server.name}.json file failed`,
              error.message || null
            );

            process.exit(1);
          }
        });
      }
    }
  }
}

export default WebsocketServer;
