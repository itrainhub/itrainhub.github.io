---
title: 利用 Express 搭建 Mock 服务器
category: engineering
tags: [nodejs, express, mock, mockjs]
key: engineering_express_mock_server
---

## 概述

目前很多公司已经实行前后端分离开发，前后端协作过程中，如果后端 `API` 接口未完成开发，就需要前端自己来模拟（`mock`）数据。

模拟数据的方式方法很多，可通过自建本地 `JSON` 文件、[RAP2](http://rap2.taobao.org/)、[JSON Server](https://www.npmjs.com/package/json-server) 等方式来实现。

本地自建 `JSON` 文件的方式比较适用于仅 `GET` 获取数据时，如果想要 `POST` 一些数据，那么就需要借助服务器环境了。`JSON Server` 可实现在本地搭建模拟数据的服务器，`RAP2` 是阿里妈妈前端团队出品的开源接口管理工具 `RAP` 第二代。

`mock` 数据作为前后端分离开发所需要掌握的必备技能，推荐使用在线版本的 `RAP2`，访问 [http://rap2.taobao.org/](http://rap2.taobao.org/)，结合 `Mock.js` 的语法，即可快速实现数据 `mock`，但偶尔 `RAP2` 服务器也会出现异常，并且 `RAP2` 在 `mock` 数据时也会有不灵活的地方，所以要获得更灵活更方便的 `mock` 数据，可以自己搭建适合自己的本地 `Mock` 服务器。

对于前端 `mock` 数据来说，更多的是在 `mock` 过程中，将前后端接口对接过程中的数据结构 `mock` 出来，至于数据内容其实不重要，通常通过随机生成数据内容的方式来完成即可，利用 `Mock.js` 语法可以很方便的生成随机数据。

本文主要介绍利用 `Express` 并结合 `Mock.js` 语法，来搭建本地的 `Mock` 服务器。

本文示例仓库地址：[mock-server](https://github.com/itrainhub/mock-server.git)

## 开工

### 准备工作

要使用 `Express`，必须确保本地已安装 `NodeJS` 的运行环境，由于使用 `Express` 开发时，会时常修改开发代码并即时测试，手动重启服务器较麻烦，可安装 `nodemon` 来监视文件的修改自动重新 `Express` 应用。

安装 `NodeJS`（略）。

安装 `nodemon`（已安装的忽略该步骤）：

```bash
$ npm i nodemon -g
```

创建工作目录：

```bash
$ mkdir mock-server
$ cd mock-server
```

 初始化 `package.json` 文件：

```bash
$ npm init -y
```

 向 `package.json` 文件中添加名为 `start` 的 `npm scripts`：

```json
{
  ......,
  "scripts": {
    "start": "nodemon app.js"
  },
	......
}
```

安装 `Express` 及 `Mock.js` 环境：

```bash
$ npm i express mockjs -S
```

### app.js

在项目根目录下创建 `app.js` 文件：

```js
// 引入模块
const express = require('express')
// 创建 Express 应用
const app = express()
// 请求数据处理
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// 启动服务器，监听 3000 端口
const server = app.listen(3000, 'localhost', () => {
  const { address, port } = server.address()
  console.log(`Server running at http://${address}:${port}`)
})
```

 引入使用的 `express` 模拟，创建出 `Express` 应用，由于通常在对服务器资源进行请求时会携带额外参数数据，所以利用 `express.json()` 和 `express.urlencoded()` 来对请求数据做处理。服务器启动后，在 `3000` 端口实现监听，可访问 `http://localhost:3000` 加资源路径进行资源请求。

### 路由设计

为方便各接口维护管理，单独创建 `mock` 目录来存放各接口文件。例如实现用户管理 `API` 的 `Mock`，在 `mock` 目录下创建 `users.js` 文件：

```js
// 引入模块
const express = require('express')
// 获取路由对象
const router = express.Router()
// GET 方式请求该 API
router.get('/', (req, res) => {
  console.log('get 请求')
  res.json({
    data: 'returnValue'
  })
})
// 导出当前定义的路由对象
module.exports = router
```

 由于各 `API` 接口单独进行维护，所以从 `Express ` 中获取路由对象后即可开始对 `API` 接口的 `GET`、`POST`、`PUT`、`DELETE` 等请求方式的请求及响应处理。

**修改 `app.js` 文件：**

```js
const express = require('express')
// 引入路由中间件
const usersRouter = require('./mock/users')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// 使用路由中间件
app.use('/api/v1/users', usersRouter)

const server = app.listen(3000, 'localhost', () => {
  const { address, port } = server.address()
  console.log(`Server running at http://${address}:${port}`)
})
```

###  添加 Mock.js 支持

当 `GET`  方式访问 `http://localhost:3000/api/v1/users` 接口时，返回所有用户的基本信息，可利用 `Mock.js` 的语法结构来实现用户数据的随机生成。由于各 `API` 接口均会向前端返回数据内容，并且同一个应用中，后端向前端所返回的数据在结构上应该保持一致性，所以可建立辅助函数来生成需要向前端返回的数据结构，在项目下创建 `utils` 目录并在该目录下新建 `index.js` 文件：

```js
// 引入模块
const Mock = require('mockjs')
// 生成成功数据的结构，data 是各不同
// 接口实际向前端返回的数据对象内容
exports.mock = data => {
  const result = Mock.mock({
    ...data
  })
  return {
    res_code: 0,
    res_error: '',
    res_body: {
      ...result
    }
  }
}
// 生成失败数据的结构，接收错误码和错误
// 消息参数
exports.error = (errno, errmsg) => {
  return {
    res_code: errno,
    res_error: errmsg,
    res_body: {}
  }
}
```

**修改 `mock/users.js` 文件：**

```js
import { mock } from '../utils'
// ......
router.get('/', (req, res, next) => {
  // 从请求中获取分页信息
  const { page = 1, pageSize = 20 } = req.query
  // 向响应流中写入 json 格式的 mock 数据
  res.json(mock({
    [`list|${pageSize}`]: [
      {
        'id|+1': (page - 1) * pageSize + 1,
        username: '@last(6,10)',
        nickname: '@ctitle(3,7)',
        avatar: '@img(64x64,@color,avatar)',
        birthday: '@date()',
        'sex|1': [0, 1],
        email: '@email',
        phone: '@string("number",11)',
        address: '@county(true)',
        createdAt: '@datetime()',
      },
    ],
    total: `@integer(${page * pageSize},300)`,
    page,
    pageSize,
  }))
})
```

利用 `Mock.js` 的语法实现随机数据的生成，如 `@email` 生成随机的 `Email` 地址，`@img` 生成随机的图片路径，`@date()` 生成随机的日期等，具体的 `Mock.js` 语法可参考[官方文档说明](http://mockjs.com/)。

### 启动服务器

在项目根目录下执行以下命令：

```bash
$ npm start
```

运行命令后，得到如下内容显示：

```bash
> mock-server@1.0.0 start /Users/isaac/Documents/mock-server
> nodemon app.js

[nodemon] 1.18.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node app.js`
Server running at http://127.0.0.1:3000
```

说明服务器已启动成功，并在 `3000` 端口等待用户请求。

### 接口测试

可利用 `Postman` 的图形化用户界面来测试刚创建好的接口，但 `Postman` 占用资源较多，特别是对某些性能较低的电脑可能导致处理效率大幅下降，所以本文使用 `VSCode` 扩展程序 `REST Client` 来测试接口。

在项目根下建立 `api.http` 文件：

```http
### 分页查询用户信息
GET http://localhost:3000/api/v1/users?page=3&pageSize=10 HTTP/1.1
```

返回测试结果：

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 2871
ETag: W/"b37-dQsHjMU2BnBPguTaBmglc4WE+oY"
Date: Sat, 04 Jul 2020 06:27:55 GMT
Connection: close

{
  "res_code": 0,
  "res_error": "",
  "res_body": {
    "list": [
      {
        "id": 21,
        "username": "Martin",
        "nickname": "律信全样",
        "avatar": "http://dummyimage.com/64x64/f279e6&text=avatar",
        "birthday": "2010-11-09",
        "sex": 0,
        "email": "y.ohcjbury@ugtqvdvmkq.tt",
        "phone": "17093872676",
        "address": "湖北省 十堰市 丹江口市",
        "createdAt": "2018-04-11 09:01:03"
      },
      ......
    ],
    "total": 202,
    "page": "3",
    "pageSize": "10"
  }
}
```

限于篇幅，将以上测试结果中数组部分仅保留一个对象的结构显示，则此可见，`Mock.js` 生成随机数据还是非常方便的。

## 小结

前后端分离开发时，`Mock` 数据作为前端必备技能之一，自建 `Mock` 服务器可以非常灵活地模拟后端接口，即使后端同事未完成接口开发，前端也可以按照自己的进度进行开发，再结合构建工具，可以很方便的判断开发环境和生产环境，并灵活切换 `Mock` 接口和真实接口，希望大家都能搭建属于自己的 `Mock` 服务器。