const fs = require('fs/promises');
const path = require('node:path');

const projectPath = path.join(path.dirname(__filename), 'project-dist');
const stylesPath = path.join(path.dirname(__filename), 'styles');

async function concatenateStyles() {
  try {
    await fs.mkdir(projectPath, { recursive: true });
    await fs.writeFile(path.join(projectPath, 'bundle.css'), '');
    
    const styleFiles = await fs.readdir(stylesPath);
    let bundleContent = '';
    
    for (const styleFile of styleFiles) {
      const stylePath = path.join(stylesPath, styleFile);
      const extension = path.extname(stylePath).slice(1);
      
      if (extension === 'css') {
        const data = await fs.readFile(stylePath, 'utf-8');
        bundleContent += data + '\n';
      }
    }
    
    await fs.writeFile(path.join(projectPath, 'bundle.css'), bundleContent);
    console.log('Styles merged successfully!');
  } catch (error) {
    console.error(error.message);
  }
}
concatenateStyles();