const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.resolve(__dirname, '../node_modules/tinymce');
const targetDir = path.resolve(__dirname, '../public/tinymce');

// Copy TinyMCE assets
fs.copySync(
  path.join(sourceDir, 'skins'),
  path.join(targetDir, 'skins')
);

fs.copySync(
  path.join(sourceDir, 'themes'),
  path.join(targetDir, 'themes')
);

fs.copySync(
  path.join(sourceDir, 'icons'),
  path.join(targetDir, 'icons')
);

fs.copySync(
  path.join(sourceDir, 'plugins'),
  path.join(targetDir, 'plugins')
);

console.log('TinyMCE assets copied successfully!');
