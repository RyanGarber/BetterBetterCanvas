const commaner = require('commander');
const express = require('express');
const exec = require('child_process').exec;
const fs = require('fs');
const util = require('util');

const program = new commaner.Command();

program
    .command('start [port]')
    .action((port='random') => {
		if (port === 'random') port = Math.floor(Math.random() * (65535 - 1024)) + 1024;
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
            let timeout = null;
            fs.watch(__dirname, { recursive: true }, (event, file) => {
                if (['.git', '.vscode', 'node_modules', 'package-lock.json', 'index.user.js'].includes(file)) return;
                clearTimeout(timeout);
                timeout = setTimeout(async () => {
                    let js = await util.promisify(fs.readFile)('index.user.js', 'utf-8');
                    js = js[js.length - 1] === '\n' ? js.slice(0, -1) : (js + '\n');
                    await util.promisify(fs.writeFile)('index.user.js', js, 'utf-8');
                    console.log((js[js.length - 1] === '\n' ? 'Added' : 'Removed') + ' newline to trigger reload');
                }, 250);
            });
        });
    });

program.parse(process.argv);