import PostProcessing from './postProcessing';
import { Tags, ConsoleHelper } from './helpers/consoleHelper';

class Labelizer extends PostProcessing {
  constructor(serverName = null) {
    if (serverName === null) {
      ConsoleHelper.printMessage(Tags.ERROR, `serverName cannot be null`);
      process.exit(1);
    }

    super(serverName);
  }

  labelize(label, message) {
    if (!Object.prototype.toString.call(message) === '[object String]') {
      ConsoleHelper.printMessage(Tags.ERROR, `Error message must be a string`);
      process.exit(1);
    }

    if (!Object.prototype.toString.call(label) === '[object String]') {
      ConsoleHelper.printMessage(Tags.ERROR, `Error message must be a string`);
      process.exit(1);
    }

    if (
      this.serverName === 'rfid' ||
      this.serverName === 'energetic' ||
      this.serverName === 'sensors'
    ) {
      return `{"label": ${label}, "data": ${message}}`;
    }

    console.log('HERE');
    return JSON.stringify({
      label: label,
      ...JSON.parse(message)
    });
  }
}

export default Labelizer;
