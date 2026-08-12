const fs = require('fs/promises');
const path = require('node:path');
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

async function syncFolder(sourcePath, targetPath) {
  try {
    await fs.mkdir(targetPath, { recursive: true });
    
    const sourceItems = await fs.readdir(sourcePath, { withFileTypes: true });
    const targetItems = await fs.readdir(targetPath, { withFileTypes: true });
    
    const sourceNames = sourceItems.map(item => item.name);
    const targetNames = targetItems.map(item => item.name);
    
    for (const targetName of targetNames) {
      if (!sourceNames.includes(targetName)) {
        const targetItemPath = path.join(targetPath, targetName);
        await fs.rm(targetItemPath, { recursive: true, force: true });
      }
    }
    
    for (const item of sourceItems) {
      const sourceItemPath = path.join(sourcePath, item.name);
      const targetItemPath = path.join(targetPath, item.name);
      
      if (item.isDirectory()) {
        await syncFolder(sourceItemPath, targetItemPath);
      } else {
        await fs.copyFile(sourceItemPath, targetItemPath);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function copyDir() {
  const assetsCopyPath = path.join(projectPath, 'assets');
  await syncFolder(assetsPath, assetsCopyPath);
}

async function buildHTML() {
  try {
    await fs.mkdir(projectPath, { recursive: true });
    await copyDir();
    await concatenateStyles();
    await updateIndex();
    console.log('Everything is ready to watch');
  } catch (error) {
    console.log(error.message);
  }
}

buildHTML();