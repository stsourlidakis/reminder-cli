#!/usr/bin/env node

import notifier from 'node-notifier';
import yargsParser from 'yargs-parser';

const { mode, timeout, message } = yargsParser(process.argv.slice(2));

(mode === 'interval' ? setInterval : setTimeout)(
  function sendNotification(): void {
    notifier.notify({
      title: ' ',
      message,
      appID: ' ',
      icon: false,
    });
  },
  Number.parseInt(timeout, 10)
);
