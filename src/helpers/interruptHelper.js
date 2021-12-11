class InterruptHelper {
  static initWindowsInterrupt() {
    if (process.platform === 'win32') {
      const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.on('SIGINT', () => {
        rl.close();
        process.emit('SIGINT');
      });
    }
  }
}

export default InterruptHelper;
