import readline from 'readline';

class InterruptHelper {
  static initWindowsInterrupt() {
    if (process.platform === 'win32') {
      const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readLine.on('SIGINT', () => {
        readLine.close();
        process.emit('SIGINT');
      });
    }
  }
}

export default InterruptHelper;
