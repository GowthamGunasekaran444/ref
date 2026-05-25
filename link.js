const fs = require('fs');
const path = require('path');

const pkgPath = path.join(
  __dirname,
  '../node_modules/antd/package.json'
);

if (!fs.existsSync(pkgPath)) {
  console.log('AntD package.json not found');
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

if (
  pkg.devDependencies &&
  pkg.devDependencies['jest-canvas-mock']
) {
  delete pkg.devDependencies['jest-canvas-mock'];

  fs.writeFileSync(
    pkgPath,
    JSON.stringify(pkg, null, 2)
  );

  console.log(
    'Removed jest-canvas-mock from antd package.json'
  );
} else {
  console.log(
    'jest-canvas-mock not found in antd package.json'
  );
}
