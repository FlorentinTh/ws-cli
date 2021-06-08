import { Tags, ConsoleHelper } from './helpers/consoleHelper';

class Sanitizer {
  format(server, message) {
    if (!Object.prototype.toString.call(server) === '[object String]') {
      ConsoleHelper.printMessage(Tags.ERROR, `server parameter must be a string`);
      process.exit(1);
    }

    if (!Object.prototype.toString.call(message) === '[object String]') {
      ConsoleHelper.printMessage(Tags.ERROR, `message parameter must be a string`);
      process.exit(1);
    }

    if (server === 'rfid' || server === 'energetic' || server === 'sensors') {
      return `{"data": ${message}}`;
    }
  }
}

export default Sanitizer;
