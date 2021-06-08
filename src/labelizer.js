import { Tags, ConsoleHelper } from './helpers/consoleHelper';

class Labelizer {
  labelize(server, label, message) {
    if (!Object.prototype.toString.call(server) === '[object String]') {
      ConsoleHelper.printMessage(Tags.ERROR, `server parameter must be a string`);
      process.exit(1);
    }

    if (!Object.prototype.toString.call(message) === '[object String]') {
      ConsoleHelper.printMessage(Tags.ERROR, `message parameter must be a string`);
      process.exit(1);
    }

    if (!Object.prototype.toString.call(label) === '[object String]') {
      ConsoleHelper.printMessage(Tags.ERROR, `label parameter must be a string`);
      process.exit(1);
    }

    if (server === 'rfid' || server === 'energetic' || server === 'sensors') {
      return `{"label": ${label}, "data": ${message}}`;
    }

    return JSON.stringify({
      label: label,
      ...JSON.parse(message)
    });
  }
}

export default Labelizer;
