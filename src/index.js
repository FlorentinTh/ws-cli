import chalk from 'chalk';

import ConsoleHelper from './helpers/consoleHelper';

import Recording from './recording';
import * as websocketServers from './websocketServers';

(async () => {
  ConsoleHelper.clear();
  ConsoleHelper.printAppTitle('ws-cli');

  const serverAnswer = await websocketServers.askForServer();
  const servers = websocketServers.serverList;

  let rec = 'recording';
  if (serverAnswer.websocket === '*') {
    rec += 's';

    for (const server of servers) {
      await websocketServers.connect(server);
    }
  } else {
    if (servers.some(server => server.name === serverAnswer.websocket)) {
      const server = servers.find(server => server.name === serverAnswer.websocket);
      await websocketServers.connect(server);
    } else {
      console.log(chalk.red(`No WebSocket server for ${serverAnswer.websocket} found.`));
    }
  }

  const recording = new Recording();

  const enableDelayAnswer = await recording.askEnableDelay();

  let timeInfo = '';

  if (enableDelayAnswer.enable) {
    const delayValueAnswer = await recording.askDelayValue();

    recording.delay = delayValueAnswer.value;

    timeInfo += `${recording.delay}s `;
  }

  console.log(
    chalk.greenBright('i'),
    chalk.cyan(`your ${timeInfo}${rec} will be saved to ${recording.outputPath}`)
  );
})();
