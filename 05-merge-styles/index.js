const fs = require('fs');
const path = require('path');

const projectPath = path.join(path.dirname(__filename), 'project-dist');
const stylesPath = path.join(path.dirname(__filename), 'styles');

async function concatenateStyles() {
  fs.writeFile(path.join(projectPath, 'bundle.css'), '' , (err) => {
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
        fs.appendFile(path.join(projectPath, 'bundle.css'), data , (err) => {
          if(err) return console.log(err.message);
        });
      });
    }
  }
}
concatenateStyles();