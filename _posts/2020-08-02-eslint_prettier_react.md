---
title: 在 React 项目中整合 ESLint 与 Prettier
category: engineering
tags: [react, eslint, prettier]
key: engineering_eslint_prettier_react
---

##  概述

随着前端工程化越来越完善，应用开发越来越复杂，代码规范的问题也越来越受到大家的重视，特别是团队协作过程中的规范问题。

`ESLint` 是在 `ECMAScript/JavaScript` 代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误。本文主要整合 `React` 应用中 `ESLint` 与 `Prettier` 的使用。

本文案例仓库：[react-eslint-prettier](https://github.com/itrainhub/react-eslint-prettier.git)

## 创建项目

利用 `create-react-app` 脚手架创建 `React` 项目骨架结构：

```bash
$ npx create-react-app react-eslint-prettier
```

## ESLint

我们可以根据个人/团队的代码风格进行 `ESLint` 规则配置，也可以使用开源的配置方案，这里学习的是著名的独角兽公司 `Airbnb` 的前端编码规范，本文采用 `eslint-config-airbnb` 配置方案进行配置。

### 安装依赖

`eslint-config-airbnb` 依赖 `eslint`、`eslint-plugin-import`、`eslint-plugin-react`、`eslint-plugin-react-hooks` 和 `eslint-plugin-jsx-a11y`，所以先安装依赖包：

```bash
$ npm i eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y -D
```

### 创建配置文件

进入项目目录，在命令行下运行：

```bash
$ ./node_modules/.bin/eslint --init
```

所有配置项先选取默认配置即可。执行结束后，在项目根目录下生成 `.eslintrc.js` 文件：

```js
module.exports = {
    "env": {
        "browser": true,
        "es2020": true
    },
    "extends": [
        "airbnb"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
    }
};
```

将 `extends` 字段值修改为：`['airbnb']`，即使用 `airbnb` 前端规范。`rules` 字段中可以添加适合自己的规则，稍后完善（也可直接参考 `github` 的 `demo` 修改）。

## Prettier

借助 `ESLint` 可以校验代码基本规范，风格统一的代码对于团队来说非常重要，但个人编写时可能无法保证风格统一，这时可以选择使用 `Prettier` 在保存代码的时候，将代码格式化成统一的风格，同时也可降低了 `Code Review` 的成本。

下面我们来将 `ESLint` 与 `Prettier` 搭配使用。

1. 在 `VS Code` 扩展程序中搜索并安装 `ESLint` 和 `Prettier`
2. 打开 文件-首选项-设置 用户设置 打开 `settings.json` 文件：

```json
{
  "files.autoSave": "onFocusChange",
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.formatOnType": true,
  "eslint.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "prettier.printWidth": 80,
  "prettier.semi": false,
  "prettier.singleQuote": true,
  "prettier.trailingComma": "none"
}
```

这样当我们在保存文件的时候，就会自动格式化文件了。

也可以单独在项目根目录下创建 `.prettierrc.js` 文件而不需要在 `settings.json` 文件中配置 `Prettier` 配置项：

```js
// .prettierrc.js
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  trailingComma: 'none'
}
```

到这里，项目搭建及编辑器的设置已经完毕了，下面愉快的开发吧！