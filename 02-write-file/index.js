const {stdin, stdout} = process;
const fs = require('node:fs');
const path = require('node:path');

function start() {
  const pathFile = 'text.txt';
  fs.access(pathFile, fs.constants.F_OK, (err) => {
    if(err) {
      fs.writeFile(
        path.join(__dirname, 'text.txt'),
        '',
        (error) => {
          if(error) throw err;
        }
      );
    }
  });
}
start();

stdout.write('Hi, enter text to safe it in a file! \n');

stdin.on('data', data=> {
  process.on('SIGINT', () => {
    stdout.write('Thanks! Bye!');
    process.exit();
  });
  let str = data.toString().trim();
  const isExit = str.includes('exit') && (str.indexOf('exit') == str.length - 4);

  if(isExit) {
    stdout.write('Bye-bye!');
    process.exit();
  } else {
    str = str + '\n';
    fs.appendFile(path.join(__dirname, 'text.txt'), str, (error) => {
      if (error) return console.error(error.message);
    });
  }
});