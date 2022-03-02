import path from 'path';

import CommandHelper from './helpers/commandHelper.js';
import QuestionsHelper from './helpers/questionsHelper.js';
import { Tags, ConsoleHelper } from './helpers/consoleHelper.js';
import ProgramHelper from './helpers/programHelper.js';
import WebsocketServer from './websocketServer.js';
import FileHelper from './helpers/fileHelper.js';

class WsCli {
  #appName;
  #argv;
  #label;

  get appName() {
    return this.#appName;
  }

  get argv() {
    return this.#argv;
  }

  get label() {
    return this.#label;
  }

  set argv(argv) {
    this.#argv = argv;
  }

  set label(label) {
    this.#label = label;
  }

  constructor() {
    this.#appName = path.basename(ProgramHelper.getPackageJson().name);
    this.#label = null;
  }

  async run() {
    ConsoleHelper.clear();
    ConsoleHelper.printAppTitle(this.appName);
    ConsoleHelper.printAppDescription(ProgramHelper.getPackageJson().description);

    const commandHelper = new CommandHelper();
    this.argv = commandHelper.argv;

    const validation = await commandHelper.validateOptions();

    if (!validation.error) {
      const serverList = commandHelper.serverList;

      const enableDelayAnswer = await QuestionsHelper.askEnableDelay();
      let delay = null;
      let timeInfo = '';

      if (enableDelayAnswer.enable) {
        const delayValueAnswer = await QuestionsHelper.askDelayValue();
        delay = delayValueAnswer.value;
        timeInfo += `${delay}s `;
      }

      const isLabelOption = commandHelper.isOptionSet('label');

      if (isLabelOption) {
        this.label = (await QuestionsHelper.askLabelValue()).label.trim();
      }

      let initRecordingFolder = await FileHelper.initRecordingFolder(this.label);

      if (!initRecordingFolder.status) {
        const overrideAnswer = await QuestionsHelper.askOverride();

        if (!overrideAnswer.override) {
          initRecordingFolder = await FileHelper.initRecordingFolder(this.label);
        }
      }

      const destination = initRecordingFolder.destination;

      ConsoleHelper.printMessage(
        Tags.INFO,
        `your ${timeInfo}recordings will be saved to ${path.join(
          path.resolve('./'),
          destination
        )}`
      );

      const serverAnswer = await QuestionsHelper.askForServer(serverList);
      const serverConfiguration = {
        delay,
        destination,
        label: this.label,
        servers: []
      };

      if (serverAnswer.websocket === 'All') {
        serverConfiguration.servers = serverList;
      } else {
        if (serverList.some(server => server.name === serverAnswer.websocket)) {
          serverConfiguration.servers.push(
            serverList.find(server => server.name === serverAnswer.websocket)
          );
        } else {
          ConsoleHelper.printMessage(
            Tags.ERROR,
            `No WebSocket server for ${serverAnswer.websocket} found.`
          );
          process.exit(1);
        }
      }

      const websocketServer = new WebsocketServer(serverConfiguration);
      await websocketServer.connect();
    } else {
      ConsoleHelper.printMessage(Tags.ERROR, validation.message);
      process.exit(1);
    }
  }
}

export default WsCli;
