const fs = require('fs/promises');
const path = require('path');
const projectPath = path.join(path.dirname(__filename), 'project-dist');
const stylesPath = path.join(path.dirname(__filename), 'styles');
const tamplatePath = path.join(path.dirname(__filename), 'template.html');
const componentsPath = path.join(path.dirname(__filename), 'components');
const assetsPath = path.join(path.dirname(__filename), 'assets');

async function concatenateStyles() {
  try {
    await fs.writeFile(path.join(projectPath, 'style.css'), '');
    
    const styleFiles = await fs.readdir(stylesPath);
    
    for (const styleFile of styleFiles) {
      const stylePath = path.join(stylesPath, styleFile);
      const extension = path.extname(stylePath).slice(1);
      
      if (extension === 'css') {
        const data = await fs.readFile(stylePath, 'utf-8');
        await fs.appendFile(path.join(projectPath, 'style.css'), data + '\n');
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function updateIndex() {
  try {
    const templateData = await fs.readFile(tamplatePath, 'utf-8');
    await fs.writeFile(path.join(projectPath, 'index.html'), templateData);
    
    const components = await fs.readdir(componentsPath);
    
    for (const component of components) {
      const fileName = path.parse(component).name;
      const componentPath = path.join(componentsPath, component);
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      
      const regexp = new RegExp(`{{${fileName}}}`, 'g');
      const indexData = await fs.readFile(path.join(projectPath, 'index.html'), 'utf-8');
      const result = indexData.replace(regexp, componentContent);
      await fs.writeFile(path.join(projectPath, 'index.html'), result);
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function createDir(dirPath, dirName) {
  const fullPath = path.join(dirPath, dirName);
  try {
    await fs.access(fullPath);
  } catch {
    await fs.mkdir(fullPath);
  }
}

async function copyFolder(sourcePath, targetPath) {
  try {
    const files = await fs.readdir(sourcePath);
    
    for (const file of files) {
      const filePath = path.join(sourcePath, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isDirectory()) {
        await createDir(targetPath, file);
        await copyFolder(filePath, path.join(targetPath, file));
      } else {
        await fs.copyFile(filePath, path.join(targetPath, file));
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function copyDir() {
  await createDir(projectPath, 'assets');
  const assetsCopyPath = path.join(projectPath, 'assets');
  await copyFolder(assetsPath, assetsCopyPath);
}

async function buildHTML() {
  try {
    await createDir(path.dirname(projectPath), 'project-dist');
    await copyDir();
    await concatenateStyles();
    await updateIndex();
    console.log('Everything is ready to watch');
  } catch (error) {
    console.log(error.message);
  }
}

buildHTML();