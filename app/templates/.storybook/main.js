const packageJson = require('../package.json')

const devDependencies = packageJson.devDependencies
const addons = []
for (const devDependency in devDependencies) {
  if (Object.prototype.hasOwnProperty.call(devDependencies, devDependency)) {
    if (/^@storybook\/addon-.*/.exec(devDependency)) {
      addons.push(devDependency)
    }
  }
}
console.log(addons)

module.exports = {
  addons: []
}
