import path from 'path';

import FileHelper from './helpers/fileHelper';
import CommandHelper from './helpers/commandHelper';
import QuestionsHelper from './helpers/questionsHelper';
import { Tags, ConsoleHelper } from './helpers/consoleHelper';
import { WebsocketServer } from './websocketServer';

const APP_NAME = path.basename(process.argv[1]);
const HOME_FOLDER = require('os').homedir();
const OUTPUT_PATH = path.join(HOME_FOLDER, APP_NAME + '_output');

async function initRecordingFolder(labelOption) {
  let label = null;

  if (labelOption) {
    label = (await QuestionsHelper.askLabelValue()).label.trim();
  }

  const fileHelper = new FileHelper(OUTPUT_PATH, label);
  const init = await fileHelper.init();

  if (!init) {
    const overrideAnswer = await QuestionsHelper.askOverride();

    if (!overrideAnswer.override) {
      return initRecordingFolder(labelOption);
    }
  }

  return fileHelper.destinationDirectory;
}

export async function cli() {
  ConsoleHelper.clear();
  ConsoleHelper.printAppTitle(APP_NAME);
  ConsoleHelper.printAppDescription();

  const argv = CommandHelper.argv;

  const serverListFilePath = !CommandHelper.isOptionSet('conf')
    ? `./${argv.conf}`
    : argv.conf;

  const configurationFileExists = await FileHelper.isConfigurationFileExists(
    path.normalize(serverListFilePath)
  );

  if (!configurationFileExists) {
    ConsoleHelper.printMessage(
      Tags.ERROR,
      `File describing servers to connect to not found`
    );
    process.exit(1);
  }

  const serverList = await FileHelper.getServerList(serverListFilePath);

  const enableDelayAnswer = CommandHelper.isOptionSet('yes')
    ? false
    : await QuestionsHelper.askEnableDelay();

  let delay = null;
  let timeInfo = '';

  if (enableDelayAnswer.enable) {
    const delayValueAnswer = await QuestionsHelper.askDelayValue();
    delay = delayValueAnswer.value;
    timeInfo += `${delay}s`;
  }

  const labelOption = CommandHelper.isOptionSet('label');
  const destination = await initRecordingFolder(labelOption);

  ConsoleHelper.printMessage(
    Tags.INFO,
    `your ${timeInfo} recordings will be saved to ${destination}`
  );

  const serverAnswer = await QuestionsHelper.askForServer(serverList);
  const serverConfiguration = {
    delay: delay,
    destination: destination,
    sanitize: CommandHelper.isOptionSet('no-sanitize'),
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
    }
  }

  const websocketServer = new WebsocketServer(serverConfiguration);
  await websocketServer.connect();
}
