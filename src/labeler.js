import { Tags, ConsoleHelper } from './helpers/consoleHelper.js';
import TypeHelper from './helpers/typeHelper.js';

class Labeler {
  label(server, label, message) {
    if (!TypeHelper.isString(server.name)) {
      ConsoleHelper.printMessage(Tags.ERROR, `server parameter must be a string`);
      process.exit(1);
    }

    if (!TypeHelper.isString(label)) {
      ConsoleHelper.printMessage(Tags.ERROR, `label parameter must be a string`);
      process.exit(1);
    }

    if (!TypeHelper.isString(message)) {
      ConsoleHelper.printMessage(Tags.ERROR, `message parameter must be a string`);
      process.exit(1);
    }

    return JSON.stringify({
      ...JSON.parse(message),
      label
    });
  }
}

export default Labeler;
