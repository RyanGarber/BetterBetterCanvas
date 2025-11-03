const commaner = require('commander');
const express = require('express');
const exec = require('child_process').exec;

const program = new commaner.Command();

program
    .command('start [port]')
    .action((port=9080) => {
        const app = express();
        app.use(express.static(__dirname));
        app.listen(port, () => {
            console.log(`Script server started at http://localhost:${port}`);
            exec(`open -a "Firefox" "http://localhost:${port}/index.user.js"`);
            console.log('Script watcher opened in Firefox');
        });
    });

program.parse(process.argv);