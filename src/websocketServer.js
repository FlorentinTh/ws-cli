import fs from 'fs';
import path from 'path';

import { Spinner } from 'clui';
import chalk from 'chalk';
import WebSocketClient from 'websocket-as-promised';
import WebSocket from 'ws';

import { Tags, ConsoleHelper } from './helpers/consoleHelper';
import InterruptHelper from './helpers/interruptHelper';
import Labelizer from './labelizer';
import Sanitizer from './sanitizer';

class WebsocketServer {
  #delay;
  #destination;
  #label;
  #servers;

  constructor(configuration) {
    if (!(configuration instanceof Object) && !(configuration === null)) {
      throw new Error('configuration must be a not null Object');
    }

    this.#delay = configuration.delay;
    this.#destination = configuration.destination;
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
    const labelizer = new Labelizer();
    const sanitizer = new Sanitizer();

    let spinner;
    const pluralForm = this.#servers.length > 1 ? 's' : '';

    if (!(this.#delay === null)) {
      let value = this.#delay;

      spinner = new Spinner(`writing to file${pluralForm}...`);
      spinner.start();

      for (const server of this.#servers) {
        server.connection.onMessage.addListener(async data => {
          try {
            if (value > 0) {
              if (!(this.#label === null)) {
                data = labelizer.labelize(server, this.#label, data);
              } else {
                data = sanitizer.format(server, data);
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
      }

      const interval = setInterval(async () => {
        if (value > 0) {
          spinner.message(`writing to file${pluralForm}... ${value}s remaining`);
        } else {
          spinner.stop();
          this.#close(interval);

          ConsoleHelper.printMessage(Tags.OK, `recording complete`);
          process.exit(0);
        }

        value--;
      }, 1000);
    } else {
      spinner = new Spinner(`writing to file${pluralForm}... (Ctrl+C to stop)`);
      spinner.start();

      for (const server of this.#servers) {
        server.connection.onMessage.addListener(async data => {
          try {
            if (!(this.#label === null)) {
              data = labelizer.labelize(server, this.#label, data);
            } else {
              data = sanitizer.format(server, data);
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
      }

      InterruptHelper.initWindowsInterrupt();

      process.on('SIGINT', async () => {
        this.#close();

        process.stdout.write('\n');
        ConsoleHelper.printMessage(Tags.OK, `recording complete`);

        process.exit(0);
      });
    }
  }

  async #close(intervalId = null) {
    if (!(intervalId === null)) {
      clearInterval(intervalId);

      for (const server of this.#servers) {
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
      }
    } else {
      for await (const server of this.#servers) {
        try {
          server.connection.close();
        } catch (error) {
          ConsoleHelper.printMessage(
            Tags.ERROR,
            `closing connection to ${server.name} failed`,
            error.message || null
          );
          process.exit(1);
        }

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
      }
    }
  }
}

export default WebsocketServer;
