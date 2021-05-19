import path from 'path';

import inquirer from 'inquirer';
import { getDesktopFolder } from 'platform-folders';

import FileHelper from './helpers/fileHelper';

class Recording {
  constructor() {
    this._delay = null;
    this._outputPath = path.join(getDesktopFolder(), FileHelper.getCurrentDirectory());
  }

  get delay() {
    return this._delay;
  }

  get outputPath() {
    return this._outputPath;
  }

  set delay(delay) {
    this._delay = delay;
  }

  askEnableDelay() {
    const questions = [
      {
        type: 'confirm',
        name: 'enable',
        message: 'stop recording after a delay?',
        default: false
      }
    ];

    return inquirer.prompt(questions);
  }

  askDelayValue() {
    const questions = [
      {
        type: 'number',
        name: 'value',
        message: 'how long the recording must last (seconds)?'
      }
    ];

    return inquirer.prompt(questions);
  }
}

export default Recording;
