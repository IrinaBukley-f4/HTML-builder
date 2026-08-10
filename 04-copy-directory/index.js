const fs = require('fs/promises');
const path = require('node:path');

const pathDir = path.join(path.dirname(__filename), 'files');
const pathCopyDir = path.join(path.dirname(__filename),'files-copy');

async function copyDir() {
  try{
    await fs.mkdir(pathCopyDir, { recursive: true });
    const files = await fs.readdir(pathDir);
    for(let file of files) {
      const sourcePath = path.join(pathDir, file);
      const targetPath = path.join(pathCopyDir, file);
      await fs.copyFile(sourcePath, targetPath);
    }

    const coppedFiles = await fs.readdir(pathCopyDir);
    for(let coppedFile of coppedFiles ) {
      if(!files.includes(coppedFile)) {
        const filePath = path.join(pathCopyDir, copiedFile);
        await fs.unlink(filePath);
      }   
    }

    console.log('All files are copied and actualized!');
  } catch(error) {
    return console.error(error.message);
  }
} 
copyDir();