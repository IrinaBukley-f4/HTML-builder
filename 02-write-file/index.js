const { stdin, stdout } = process;
const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, 'text.txt');

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '');
}

stdout.write('Hi, enter text to save it in a file! \n');

stdin.on('data', data => {
  const input = data.toString().trim();
  
  if (input === 'exit' || input.endsWith('exit')) {
    stdout.write('Bye-bye!\n');
    process.exit();
  } else {
    fs.appendFile(filePath, input + '\n', (error) => {
      if (error) console.error(error.message);
    });
  }
});

process.on('SIGINT', () => {
  stdout.write('\nThanks! Bye!\n');
  process.exit();
});