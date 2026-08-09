const fs = require('fs');
const path = require('path');

const pathDir = path.join(path.dirname(__filename), 'files');
const pathCopyDir = path.join(path.dirname(__filename),'files-copy');

function init() {
  fs.mkdir(pathCopyDir,  (error) => {
    if (error) return console.error(error.message);
  });
}

function read(name, pathLink) {
  const fileLink = path.join(pathDir, name);  
  fs.readFile(fileLink, (err, data) => {
    if(err) return console.log(err.message);

    fs.writeFile(path.join(pathLink, name), data, (err) => {
      if(err) return console.log(err.message);
    });
  });
}

async function copyDir() {
  fs.access(pathCopyDir, fs.F_OK, (err) => {
    if (err) {
      init();
    }
  }); 

  try{
    const files = await fs.promises.readdir(pathDir);
    for(let file of files) {
      read(file, pathCopyDir);
    }

    const coppedFiles = await fs.promises.readdir(pathCopyDir);
    for(let coppedFile of coppedFiles ) {
      if(!files.includes(coppedFile)) {
        fs.unlink(path.join(pathCopyDir,coppedFile), (err) => {
          if(err) return console.log(err.message);
        } );
      }   
    }

    console.log('All files are copied and actualized!');
  } catch(error) {
    return console.error(error.message);
  }
} 
copyDir();