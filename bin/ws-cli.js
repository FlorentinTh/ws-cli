#!/usr/bin/env node

import WsCli from '../src/WsCli.js';

(async () => {
  const wsCli = new WsCli();
  await wsCli.run();
})();
