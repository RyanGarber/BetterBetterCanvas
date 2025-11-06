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
            try {
                const commands = {darwin: 'open -a "Firefox"', win32: 'start Firefox', linux: 'nohup firefox'};
                exec(`${commands[process.platform]} "http://localhost:${port}/index.user.js"`);
            }
            catch (e) {
                console.error('Failed to open Firefox automatically. Open this URL to continue:');
                console.error(`http://localhost:${port}/index.user.js`);
            }
        });
    });

program.parse(process.argv);