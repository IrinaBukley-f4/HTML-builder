const fs = require('node:fs').promises;
const path = require('node:path');

const pathDir = path.join(path.dirname(__filename), 'secret-folder');

async function parseDir() {
  try {
    const elems = await fs.readdir(pathDir);
    for( let elem of elems) {
      const elemPath = path.join(pathDir, elem);  
      const stats = await fs.stat(elemPath);
      if(stats.isFile()) {
        const elemName = path.parse(elem).name;
        const elemExtention = path.extname(elem).slice(1);
        const elemSize = stats.size / 1000;
        console.log(`${elemName} - ${elemExtention} - ${elemSize}kb`);
      }
    }
  } catch (error) {
    return console.error(error.message);  
  }
}
parseDir();