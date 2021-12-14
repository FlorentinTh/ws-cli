import { Tags, ConsoleHelper } from './helpers/consoleHelper';
import Liara from './LIARA';

class Sanitizer {
  format(server, message) {
    if (!(Object.prototype.toString.call(server) === '[object Object]')) {
      ConsoleHelper.printMessage(Tags.ERROR, `server parameter must be a string`);
      process.exit(1);
    }

    if (!(Object.prototype.toString.call(message) === '[object String]')) {
      ConsoleHelper.printMessage(Tags.ERROR, `message parameter must be a string`);
      process.exit(1);
    }

    const serverUrl = `${server.host}:${server.port}`;

    if (Liara.checkServer(serverUrl)) {
      return `{"data": ${message}}`;
    }
    return message;
  }
}

export default Sanitizer;
