const fs = require('fs');
const path = require('path');
const projectPath = path.join(path.dirname(__filename),'project-dist');
const stylesPath = path.join(path.dirname(__filename),'styles');
const tamplatePath = path.join(path.dirname(__filename),'template.html');
const componentsPath = path.join(path.dirname(__filename),'components');
const assetsPath = path.join(path.dirname(__filename),'assets');

async function concatenateStyles() {
  fs.writeFile(path.join(projectPath, 'style.css'), '' , (err) => {
    if(err) return console.log(err.message);
  });
  
  const styleFiles = await fs.promises.readdir(stylesPath);
    
  for(let styleFile of styleFiles) {
    const stylePath = path.join(stylesPath, styleFile);
    const extention = path.extname(stylePath).slice(1);
    if(extention == 'css') {
      fs.readFile(stylePath, (err, data) => {
        if(err) return console.log(err.message);
        data = data + '\n';
        fs.appendFile(path.join(projectPath, 'style.css'), data , (err) => {
          if(err) return console.log(err.message);
        });
      });
    }
  }
}

async function updateIndex() {

  try {
    const templateData = await fs.promises.readFile(tamplatePath, 'utf-8');
    await fs.promises.writeFile(path.join(projectPath, 'index.html'), templateData);
  
    const components = await fs.promises.readdir(componentsPath);
    
    for(let component of components) {
      const fileName = path.parse(component).name; 
      const componentPath = path.join(componentsPath,component);
      const componetContent = await fs.promises.readFile(componentPath, 'utf-8');
  
      let regexp = new RegExp(`{{${fileName}}}`, 'g'); 
  
      const indexData = await fs.promises.readFile(path.join(projectPath, 'index.html'), 'utf-8');
      const result = indexData.replace(regexp, componetContent);
      await fs.promises.writeFile( path.join(projectPath, 'index.html'), result);
    }  
  } catch (error) {
    return console.log(error.message);
  }
}

function createDir(dirPath, dirName) {
  fs.access(path.join(dirPath, dirName), fs.F_OK, (err) => {
    if (err) {
      fs.mkdir(path.join(dirPath, dirName), (err) => {
        if(err) return console.log(err.message);
      });
    }
  });
}

function copyDir( ) {

  createDir(projectPath, 'assets');

  const assetsCopyPath = path.join(projectPath,'assets');

  async function copyFolder(sourcePath, targetPath) {  
    try {
      const files = await fs.promises.readdir(sourcePath);
    
      for( let file of files) {
        const filePath = path.join(sourcePath, file);
        const fileName = path.parse(file).name;
        const stats = await fs.promises.stat(filePath);
        const isDirectory = stats.isDirectory();
        const newSourcePath = path.join(sourcePath, fileName);
        const newTargetPath = path.join(targetPath, fileName);

        if(isDirectory) {
          createDir(targetPath, fileName);
          copyFolder(newSourcePath, newTargetPath);
        } else  {
          const oldFilePath = path.join(sourcePath, file);
          const newFilePath = path.join(targetPath, file);
          await fs.promises.copyFile( oldFilePath, newFilePath);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  copyFolder(assetsPath, assetsCopyPath);
}

function buildHTML () {
  fs.access(projectPath, fs.F_OK, (err) => {
    if (err) {
      fs.mkdir(projectPath, (err)=> {
        if(err) return console.log(err.message);
      });
    }
  }); 
  copyDir();
  concatenateStyles();
  updateIndex();
  console.log('Everything is ready to watch');
}

buildHTML();