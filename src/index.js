#!/usr/bin/env node

import path from 'path';

import chalk from 'chalk';
import { getDesktopFolder } from 'platform-folders';

import FileHelper from './helpers/fileHelper';
import OptionsHelper from './helpers/optionsHelper';
import QuestionsHelper from './helpers/questionsHelper';
import ConsoleHelper from './helpers/consoleHelper';
import { WebsocketServer } from './websocketServer';

const OUTPUT_PATH = path.join(
  getDesktopFolder(),
  FileHelper.currentDirectory + '_output'
);

(async () => {
  ConsoleHelper.clear();
  ConsoleHelper.printAppTitle(FileHelper.currentDirectory);
  ConsoleHelper.printAppDescription();

  const options = OptionsHelper.options;

  const serverListFilePath = !OptionsHelper.isOptionSet('configuration')
    ? `./${options.configuration}`
    : options.configuration;

  const serverList = await FileHelper.getServerList(serverListFilePath);

  const enableDelayAnswer = OptionsHelper.isOptionSet('yes')
    ? false
    : await QuestionsHelper.askEnableDelay();

  let delay = null;
  let timeInfo = '';

  if (enableDelayAnswer.enable) {
    const delayValueAnswer = await QuestionsHelper.askDelayValue();
    delay = delayValueAnswer.value;
    timeInfo += `${delay}s`;
  }

  const labelOption = OptionsHelper.isOptionSet('label');
  let label = null;

  if (labelOption) {
    label = (await QuestionsHelper.askAnnotationLabel()).label.trim();
  }

  const fileHelper = new FileHelper(OUTPUT_PATH, label);
  const destination = fileHelper.destinationDirectory;

  console.log(
    chalk.greenBright('i'),
    chalk.cyan(`your ${timeInfo} recordings will be saved to ${destination}`)
  );

  const serverAnswer = await QuestionsHelper.askForServer(serverList);
  const serverConfiguration = {
    delay: delay,
    destination: destination,
    sanitize: OptionsHelper.isOptionSet('no-sanitize'),
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
