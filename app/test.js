const helpers = require('yeoman-test')
const path = require('path')

describe('btc:app', () => {
  it('generates the files', async () => {
    const result = await helpers
      .run(path.resolve(__dirname, './index.js'))
      .withOptions({
        isTest: true,
        name: 'test',
        skipEnd: true
      })
      .on('ready', data => {
        expect(data.options.isTest).toEqual(true)
        expect(data.options.name).toEqual('test')
        expect(data.options.skipEnd).toEqual(true)
      })
    result.assertFile('.babelrc.json')
    result.assertFile('.gitignore')
    result.assertFile('.prettierignore')
    result.assertFile('.storybook/main.js')
    result.assertFile('package.json')
    result.assertFile('rollup.config.js')
    result.assertFile('src/index.js')
    result.assertFile('src/test.js')
  })
})
