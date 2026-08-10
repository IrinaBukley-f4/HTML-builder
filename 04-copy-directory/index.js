const fs = require('fs/promises');
const path = require('node:path');

const pathDir = path.join(path.dirname(__filename), 'files');
const pathCopyDir = path.join(path.dirname(__filename),'files-copy');

async function copyDir() {
  try {
    await fs.rm(pathCopyDir, { recursive: true, force: true });
    await copyFolder(pathDir, pathCopyDir);
    console.log('All files are copied and actualized!');
  } catch (error) {
    console.error(error.message);
  }
}

async function copyFolder(source, target) {
  await fs.mkdir(target, { recursive: true });
  const items = await fs.readdir(source, { withFileTypes: true });
  
  for (const item of items) {
    const sourcePath = path.join(source, item.name);
    const targetPath = path.join(target, item.name);
    
    if (item.isDirectory()) {
      await copyFolder(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}
copyDir();