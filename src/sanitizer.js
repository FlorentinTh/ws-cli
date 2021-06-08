import PostProcessing from './postProcessing';
import { Tags, ConsoleHelper } from './helpers/consoleHelper';

class Sanitizer extends PostProcessing {
  constructor(serverName) {
    if (serverName === null) {
      ConsoleHelper.printMessage(Tags.ERROR, `serverName cannot be null`);
      process.exit(1);
    }

    super(serverName);
  }
}

export default Sanitizer;
