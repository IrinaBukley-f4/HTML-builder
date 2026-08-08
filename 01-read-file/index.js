const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(file, 'UTF-8');
let str = '';

stream.on('data', elem => str += elem);
stream.on('error', error => console.log("Error", error.message));
stream.on('end', () => console.log(str));