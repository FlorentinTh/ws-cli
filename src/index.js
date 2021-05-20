import path from 'path';

import chalk from 'chalk';
import { getDesktopFolder } from 'platform-folders';

import FileHelper from './helpers/fileHelper';

import ConsoleHelper from './helpers/consoleHelper';
import { serverList, WebsocketServer } from './websocketServer';

const OUTPUT_PATH = path.join(
  getDesktopFolder(),
  FileHelper.currentDirectory + '_output'
);

(async () => {
  ConsoleHelper.clear();
  ConsoleHelper.printAppTitle('ws-cli');
  ConsoleHelper.printAppDescription();

  const _enableDelayAnswer = await WebsocketServer._askEnableDelay();

  let delay = null;
  let timeInfo = '';

  if (_enableDelayAnswer.enable) {
    const delayValueAnswer = await WebsocketServer._askDelayValue();
    delay = delayValueAnswer.value;
    timeInfo += `${delay}s`;
  }

  const fileHelper = new FileHelper(OUTPUT_PATH);
  const destination = fileHelper.destinationDirectory;

  console.log(
    chalk.greenBright('i'),
    chalk.cyan(`your ${timeInfo} recordings will be saved to ${destination}`)
  );

  const serverAnswer = await WebsocketServer.askForServer();
  const serverConfiguration = {
    delay: delay,
    destination: destination
  };

  if (serverAnswer.websocket === 'All') {
    for (const server of serverList) {
      serverConfiguration.server = server;
      const websocketServer = new WebsocketServer(serverConfiguration);
      await websocketServer.connect();
    }
  } else {
    if (serverList.some(server => server.name === serverAnswer.websocket)) {
      serverConfiguration.server = serverList.find(
        server => server.name === serverAnswer.websocket
      );

      const websocketServer = new WebsocketServer(serverConfiguration);
      await websocketServer.connect();
    } else {
      console.log(chalk.red(`No WebSocket server for ${serverAnswer.websocket} found.`));
    }
  }
})();
