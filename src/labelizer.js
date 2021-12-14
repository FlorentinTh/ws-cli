import { Tags, ConsoleHelper } from './helpers/consoleHelper';
import Liara from './LIARA';

class Labelizer {
  labelize(server, label, message) {
    if (!(Object.prototype.toString.call(server) === '[object Object]')) {
      ConsoleHelper.printMessage(Tags.ERROR, `server parameter must be a string`);
      process.exit(1);
    }

    if (!(Object.prototype.toString.call(message) === '[object String]')) {
      ConsoleHelper.printMessage(Tags.ERROR, `message parameter must be a string`);
      process.exit(1);
    }

    if (!(Object.prototype.toString.call(label) === '[object String]')) {
      ConsoleHelper.printMessage(Tags.ERROR, `label parameter must be a string`);
      process.exit(1);
    }

    const serverUrl = `${server.host}:${server.port}`;

    if (Liara.checkServer(serverUrl)) {
      return `{"data": ${message}}`;
    }

    return JSON.stringify({
      label: label,
      ...JSON.parse(message)
    });
  }
}

export default Labelizer;
