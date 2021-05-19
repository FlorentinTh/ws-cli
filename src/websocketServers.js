import inquirer from 'inquirer';
import Mock from './utils/mock.js';
import { Spinner } from 'clui';
import chalk from 'chalk';

export const serverList = [
  {
    name: 'RFID',
    host: '172.24.24.99',
    port: '6094'
  },
  {
    name: 'Energetic',
    host: '172.24.24.99',
    port: '6061'
  },
  {
    name: 'UWB',
    host: '172.24.24.122',
    port: '6017'
  }
];

export const askForServer = () => {
  const questions = [
    {
      type: 'list',
      name: 'websocket',
      message: 'select a WebSocket server:',
      choices: ['*', 'RFID', 'Energetic', 'UWB'],
      default: ['*']
    }
  ];

  return inquirer.prompt(questions);
};

export const connect = async server => {
  const spinner = new Spinner(
    `opening connection on ${server.name} WebSocket server... `
  );
  spinner.start();
  await Mock.sleep(5000);
  console.log(chalk.green('OK'));
  spinner.stop();
};
