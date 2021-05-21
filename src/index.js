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

  ConsoleHelper.printAppTitle(process.env.npm_package_name);
  ConsoleHelper.printAppDescription();

  const enableDelayAnswer = await WebsocketServer.askEnableDelay();

  let delay = null;
  let timeInfo = '';

  if (enableDelayAnswer.enable) {
    const delayValueAnswer = await WebsocketServer.askDelayValue();
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
    destination: destination,
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
      console.log(chalk.red(`No WebSocket server for ${serverAnswer.websocket} found.`));
    }
  }

  const websocketServer = new WebsocketServer(serverConfiguration);
  await websocketServer.connect();
})();
