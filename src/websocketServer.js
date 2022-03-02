import fs from 'fs';
import path from 'path';
import clui from 'clui';
import WebSocketClient from 'websocket-as-promised';
import WebSocket from 'ws';
import { Buffer } from 'buffer';

import { Tags, ConsoleHelper } from './helpers/consoleHelper.js';
import InterruptHelper from './helpers/interruptHelper.js';
import Labeler from './labeler.js';
import Sanitizer from './sanitizer.js';
import TypeHelper from './helpers/typeHelper.js';

class WebsocketServer {
  #delay;
  #destination;
  #label;
  #servers;

  get delay() {
    return this.#delay;
  }

  get destination() {
    return this.#destination;
  }

  get label() {
    return this.#label;
  }

  get servers() {
    return this.#servers;
  }

  set delay(delay) {
    this.#delay = delay;
  }

  set destination(destination) {
    this.#destination = destination;
  }

  set label(label) {
    this.#label = label;
  }

  set servers(servers) {
    this.#servers = servers;
  }

  constructor(configuration) {
    if (
      !TypeHelper.isObject(configuration) &&
      !TypeHelper.isUndefinedOrNull(configuration)
    ) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `Server configuration must be a not null Object. Received: ${configuration}`
      );
      process.exit(1);
    }

    this.delay = configuration.delay;
    this.destination = configuration.destination;
    this.label = configuration.label;
    this.servers = configuration.servers;

    for (const server of this.servers) {
      const protocol = server.secured ? 'wss://' : 'ws://';

      if (server.endpoint === null || server.endpoint === undefined) {
        server.endpoint = '';
      }

      server.connection = new WebSocketClient(
        `${protocol}${server.host}:${server.port}/${server.endpoint}`,
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
    for (const server of this.servers) {
      const spinner = new clui.Spinner(
        `opening connection on ${server.name} WebSocket server... `
      );

      spinner.start();

      try {
        await server.connection.open();
        ConsoleHelper.printServerConnection(server.name);
      } catch (error) {
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `impossible to open connection on ${server.name} WebSocket server`,
          {
            error: error.message || null
          }
        );
        process.exit(1);
      }

      spinner.stop();

      const filename = server.name.toLowerCase().split(' ').join('_');

      try {
        server.stream = fs.createWriteStream(
          path.join(this.destination, `${filename}.json`)
        );
      } catch (error) {
        ConsoleHelper.printMessage(
          Tags.ERROR,
          `creating ${server.name}.json file failed`,
          {
            error: error.message || null
          }
        );
        process.exit(1);
      }
    }
    this.#write();
  }

  async #write() {
    const labeler = new Labeler();
    const sanitizer = new Sanitizer();

    let spinner;
    const pluralForm = this.servers.length > 1 ? 's' : '';

    if (!(this.delay === null)) {
      let value = this.delay;
      const delayDigits = this.delay.toString().length;

      spinner = new clui.Spinner(`writing to file${pluralForm}...`);
      spinner.start();

      for (const server of this.servers) {
        server.connection.onMessage.addListener(async data => {
          try {
            if (value > 0) {
              data = sanitizer.format(server, Buffer.from(data).toString());

              if (!(this.label === null)) {
                data = labeler.label(server, this.label, Buffer.from(data).toString());
              }

              await server.stream.write(data + '\n');
            }
          } catch (error) {
            ConsoleHelper.printMessage(
              Tags.ERROR,
              `writing to ${server.name}.json file failed`,
              {
                error: error.message || null
              }
            );
          }
        });
      }

      const interval = setInterval(async () => {
        if (value > 0) {
          const digits = value.toString().length;

          if (digits === delayDigits) {
            spinner.message(`writing to file${pluralForm}... ${value}s remaining`);
          } else if (digits < delayDigits) {
            let spaces = '';

            for (let i = 0; i < delayDigits - digits; ++i) {
              spaces = spaces + ' ';
            }

            spinner.message(
              `writing to file${pluralForm}... ${spaces}${value}s remaining`
            );
          } else {
            spinner.stop();

            ConsoleHelper.printMessage(
              Tags.ERROR,
              `an unexpected error occurs with recording delay`,
              null
            );

            process.exit(1);
          }
        } else {
          spinner.stop();
          this.#close(interval);

          ConsoleHelper.printMessage(Tags.OK, `recording complete`);

          process.exit(0);
        }

        value--;
      }, 1000);
    } else {
      spinner = new clui.Spinner(`writing to file${pluralForm}... (Ctrl+C to stop)`);
      spinner.start();

      for (const server of this.servers) {
        server.connection.onMessage.addListener(async data => {
          try {
            data = sanitizer.format(server, Buffer.from(data).toString());

            if (!(this.label === null)) {
              data = labeler.label(server, this.label, Buffer.from(data).toString());
            }

            await server.stream.write(data + '\n');
          } catch (error) {
            ConsoleHelper.printMessage(
              Tags.ERROR,
              `writing to ${server.name}.json file failed`,
              {
                error: error.message || null
              }
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

      for (const server of this.servers) {
        try {
          await server.stream.close();
          await server.connection.close();
        } catch (error) {
          ConsoleHelper.printMessage(
            Tags.ERROR,
            `closing ${server.name}.json file failed`,
            {
              error: error.message || null
            }
          );
          process.exit(1);
        }
      }
    } else {
      for await (const server of this.servers) {
        try {
          server.connection.close();
        } catch (error) {
          ConsoleHelper.printMessage(
            Tags.ERROR,
            `closing connection to ${server.name} failed`,
            {
              error: error.message || null
            }
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
              {
                error: error.message || null
              }
            );
            process.exit(1);
          }
        });
      }
    }
  }
}

export default WebsocketServer;
