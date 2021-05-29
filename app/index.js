const Generator = require('yeoman-generator')
const packageJson = require('../package.json')

module.exports = class extends Generator {
  constructor(args, opts, features) {
    super(args, opts, features)
    this.option('name', { type: String })
    this.option('isTest', {type: Boolean})
    this.option('skipEnd', {type: Boolean})
    this.project = { ...this.options }
  }

  end() {
    if (!this.options.skipEnd) {
      this.spawnCommand('npx', ['sort-package-json'])
    }
  }

  async prompting() {
    if (!this.options.name) {
      this.project = await this.prompt([
        {
          default: this.options.name,
          message: 'name',
          name: 'name',
          type: 'input'
        }
      ])
    }
  }

  async writing() {
    this.fs.copy(this.templatePath(), this.destinationPath())
    this.fs.copy(
      this.templatePath('.storybook/'),
      this.destinationPath('.storybook/')
    )

    const devDependencies = [
      '@babel/cli',
      '@babel/core',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-transform-arrow-functions',
      '@babel/plugin-transform-block-scoping',
      '@babel/plugin-transform-destructuring',
      '@babel/plugin-transform-modules-commonjs',
      '@babel/plugin-transform-parameters',
      '@babel/plugin-transform-react-jsx',
      '@babel/plugin-transform-regenerator',
      '@babel/plugin-transform-runtime',
      '@babel/plugin-transform-template-literals',
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/runtime',
      '@rollup/plugin-babel',
      '@rollup/plugin-commonjs',
      '@rollup/plugin-node-resolve',
      '@storybook/addon-a11y',
      '@storybook/addon-actions',
      '@storybook/addon-knobs',
      '@storybook/addon-viewport',
      '@storybook/cli',
      '@storybook/react',
      '@testing-library/react',
      '@testing-library/react-hooks',
      '@testing-library/jest-dom',
      'babel-jest',
      'core-js',
      'husky',
      'identity-obj-proxy',
      'jest',
      'node-sass',
      'prettier',
      'react',
      'react-dom',
      'rollup',
      'rollup-plugin-sass',
      'rollup-plugin-terser',
      'sass-loader'
    ]

    const babelPlugins = devDependencies.filter(p =>
      /^@babel\/plugin.*/.exec(p)
    )

    if (!this.options['isTest']) {
      await this.addDevDependencies(devDependencies)
    }

    const babelSettings = {
      plugins: babelPlugins,
      presets: [
        [
          '@babel/preset-env',
          {
            forceAllTransforms: true,
            modules: false
          }
        ],
        '@babel/preset-react'
      ]
    }

    this.fs.extendJSON(this.destinationPath('.babelrc.json'), babelSettings)

    const projectSettings = {
      author: packageJson.author,
      files: ['dist/'],
      jest: {
        moduleNameMapper: {
          '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
          '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`
        },
        setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
        transform: {
          '^.+\\.jsx?$': 'babel-jest'
        }
      },
      main: 'dist/index.js',
      name: this.project.name,
      prettier: packageJson.prettier,
      scripts: {
        build: 'rollup -c ./rollup.config.js',
        prebuild: 'npx rimraf ./dist/',
        test: 'jest'
      }
    }

    this.fs.extendJSON(this.destinationPath('package.json'), projectSettings)

    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
    )

    this.fs.copyTpl(
      this.templatePath('.prettierignore'),
      this.destinationPath('.prettierignore')
    )
  }
}
