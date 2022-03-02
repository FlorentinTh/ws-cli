import { Tags, ConsoleHelper } from './helpers/consoleHelper.js';
import TypeHelper from './helpers/typeHelper.js';

class Sanitizer {
  format(server, message) {
    if (!TypeHelper.isString(server.name)) {
      ConsoleHelper.printMessage(Tags.ERROR, `server parameter must be a string`);
      process.exit(1);
    }

    if (!TypeHelper.isString(message)) {
      ConsoleHelper.printMessage(Tags.ERROR, `message parameter must be a string`);
      process.exit(1);
    }

    const json = JSON.parse(message);
    if (TypeHelper.isArray(json)) {

      let output = '';
      for (let i = 0; i < json.length; ++i) {
        if (i > 0) {
          output += `\n${JSON.stringify(json[i])}`;
        } else {
          output += JSON.stringify(json[i]);
        }
      }

      return output;
    }

    return message;
  }
}

export default Sanitizer;
