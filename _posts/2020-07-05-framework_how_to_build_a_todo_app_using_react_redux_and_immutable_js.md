---
title: 【翻译】如何使用 React、Redux 和 Immutable.js 构建 Todo 应用
category: framework
tags: [react, redux, immutable, todo]
key: framework_how_to_build_a_todo_app_using_react_redux_and_immutable_js
---

 原文：[https://www.sitepoint.com/how-to-build-a-todo-app-using-react-redux-and-immutable-js/](https://www.sitepoint.com/how-to-build-a-todo-app-using-react-redux-and-immutable-js/)

作者： [Dan Prince](https://www.sitepoint.com/author/dprince)               发布时间：2017.09.13

`React` 使用组件的方式和单向数据流使它非常适合用户界面结构的描述，然而，用于处理状态的工具故意保持得很简单——这是为了提醒我们，`React` 只是传统的 `Model-View-Controller` 体系结构中的 `View`。

没有什么可以阻止我们仅使用 `React` 来构建大型应用，但是我们很快就会发现，为了保持代码的简洁，我们需要在其它位置去管理应用的状态。

尽管没有官方解决方案来处理应用状态，但是有些库特别适合 `React` 的范例，在本文中，我们就将 `React` 与两个这样的库配对，并使用它们来构建一个简单的应用程序。

## Redux

`Redux` 是一个轻量级的库，充当应用程序状态管理的容器，它结合了 `Flux` 和 `Elm` 的想法。我们可以使用Redux来管理任何类型的应用状态，只要遵循以下条件：

1. 我们的状态保存在唯一的 `store` 中
2. 变化来自 `actions`（行动）而不是 `mutations`（突变）（译者注：`mutations` 意指直接修改引用所指向的值）

`Redux` 中 `store` 的核心是一个函数，这个函数接收当前应用的状态（`state`）和一个动作（`action`）参数，并将它们组合以创建出新的状态，我们称这个函数为 **reducer**。

`React` 组件负责将 `action` 发送到 `store`，然后 `store` 告诉组件何时需要重新渲染。

## ImmutableJS

由于 `Redux` 不允许以 `mutate` （突变）方式更改状态，因此通过使用 `Immutable` （不可变）数据结构对状态进行建模可以强制执行此操作。

`ImmutableJS` 为我们提供了许多具有可变接口的不可变数据结构，它们的有效实现受到了 `Clojure` 和 `Scala` 中的实现的启发。（译者注：`Clojure` 是 `Lisp` 编程语言编程语言在 `Java` 平台上的现代、动态及函数式方言；`Scala` 是一门多范式的编程语言，设计初衷是要集成面向对象编程和函数式编程的各种特性。）

## Demo

我们将使用 `React` 结合 `Redux` 和 `ImmutableJS` 来构建一个简单的待办事项列表，允许我们添加待办事项，并在完成和未完成之间切换。

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="SitePoint" data-slug-hash="bpxapd" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="How to Build a Todo App Using React, Redux, and Immutable.js">
  <span>See the Pen <a href="https://codepen.io/SitePoint/pen/bpxapd">
  How to Build a Todo App Using React, Redux, and Immutable.js</a> by SitePoint (<a href="https://codepen.io/SitePoint">@SitePoint</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

该示例代码仓库：[https://github.com/sitepoint-editors/immutable-redux-todo](https://github.com/sitepoint-editors/immutable-redux-todo)

## 安装

我们将从创建项目文件夹并使用 `npm init` 初始化 `package.json` 文件开始，然后，安装所需的依赖项：

```bash
$ npm install --save react react-dom redux react-redux immutable
$ npm install --save-dev webpack babel-core babel-loader babel-preset-es2015 babel-preset-react
```

我们将使用 `JSX` 和 `ES2015`，因此使用 `Babel` 编译代码，并将其作为 `Webpack` 模块捆绑过程的一部分。

首先，创建 `webpack.config.js` 配置文件并添加 `Webpack` 配置：

```js
module.exports = {
  entry: './src/app.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: { presets: [ 'es2015', 'react' ] }
      }
    ]
  }
};
```

最后，我们在 `package.json` 添加一个 `npm` 脚本来编译代码：

```json
"script": {
  "build": "webpack --debug"
}
```

每次代码编译时，我们都需要运行 `npm run build` 来实现编译。

## React 和组件

在我们实现任何组件之前，创建一些虚拟数据会有所帮助，这有助于我们了解需要使用哪些组件来渲染：

```js
const dummyTodos = [
  { id: 0, isDone: true,  text: 'make components' },
  { id: 1, isDone: false, text: 'design actions' },
  { id: 2, isDone: false, text: 'implement reducer' },
  { id: 3, isDone: false, text: 'connect components' }
];
```

这个应用中，我们只需要两个 `React` 组件：`<Todo />` 和 `<TodoList />`。

```jsx
// src/components.js

import React from 'react';

export function Todo(props) {
  const { todo } = props;
  if(todo.isDone) {
    return <strike>{todo.text}</strike>;
  } else {
    return <span>{todo.text}</span>;
  }
}

export function TodoList(props) {
  const { todos } = props;
  return (
    <div className='todo'>
      <input type='text' placeholder='Add todo' />
      <ul className='todo__list'>
        {todos.map(t => (
          <li key={t.id} className='todo__item'>
            <Todo todo={t} />
          </li>
        ))}
      </ul>
    </div>
  );
}
```

此时，我们可以通过在项目文件夹中创建一个 `index.html` 文件并使用以下布局结构来测试这些组件（您可以在 [GitHub](https://github.com/sitepoint-editors/immutable-redux-todo/blob/master/style.css) 上找到一个简单的样式表）：

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="style.css">
    <title>Immutable Todo</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="bundle.js"></script>
  </body>
</html>
```

我们还将需要一个应用程序入口点 `src/app.js`：

```jsx
// src/app.js

import React from 'react';
import { render } from 'react-dom';
import { TodoList } from './components';

const dummyTodos = [
  { id: 0, isDone: true,  text: 'make components' },
  { id: 1, isDone: false, text: 'design actions' },
  { id: 2, isDone: false, text: 'implement reducer' },
  { id: 3, isDone: false, text: 'connect components' }
];

render(
  <TodoList todos={dummyTodos} />,
  document.getElementById('app')
);
```

使用 `npm run build` 编译代码，然后在浏览器中访问 `index.html` 文件，并确保它可以正常工作。

## Redux 和 Immutable

现在我们已经可以看到界面了，接下来就可以开始考虑其背后的 `state`。我们的虚拟数据是一个很好的起点，可以轻松地将其转换为 `ImmutableJS` 集合：

```js
import { List, Map } from 'immutable';

// 译者注：
// List 类似于原生 JavaScript 中的 Array，
// Map 类似于原生 JavaScript 中的普通对象
// 利用 List 和 Map 可以轻松的将 JavaScript
// 中的数组和对象转换为 Immutable Data

const dummyTodos = List([
  Map({ id: 0, isDone: true,  text: 'make components' }),
  Map({ id: 1, isDone: false, text: 'design actions' }),
  Map({ id: 2, isDone: false, text: 'implement reducer' }),
  Map({ id: 3, isDone: false, text: 'connect components' })
]);
```

`ImmutableJS` 映射与 `JavaScript` 对象的工作方式不同，因此我们需要对组件进行一些细微调整：任何以前通过属性调用访问的地方（例如 `todo.id`）需要替换为方法调用的方式（`todo.get('id')`）。

## 设计 Actions

现在我们已经弄清楚了数据结构，可以开始考虑对其进行更新的操作（`actions`）。在这种情况下，我们只需要执行两项操作（`action`）：一项为添加新的待办事项，另一项为切换现有的待办事项。

让我们定义一些函数（译者注：我们可以将这些函数称为 `action creator`）来创建这些 `action`：

```js
// src/actions.js

// 生成唯一的 ids
const uid = () => Math.random().toString(34).slice(2);

export function addTodo(text) {
  return {
    type: 'ADD_TODO',
    payload: {
      id: uid(),
      isDone: false,
      text: text
    }
  };
}

export function toggleTodo(id) {
  return {
    type: 'TOGGLE_TODO',
    payload: id
  }
}
```

每个 `action` 只是一个具有类型（`type`）和有效负载（`payload`）属性的 `JavaScript` 对象。`type` 属性可帮助我们决定以后处理 `action` 时如何处理 `payload`。

## 设计 Reducer

我们已经知道了 `state` （状态）的数据结构以及对其进行更新的 `action`，就可以构建 `reducer` 了，提醒一下，`reducer` 是一个函数，它接受一个 `state` 和一个 `action` 作为参数，然后使用它们来计算新的 `state`。

这是我们 `reducer` 函数的初始结构：

```js
// src/reducer.js

import { List, Map } from 'immutable';

const init = List([]);

export default function(todos=init, action) {
  switch(action.type) {
    case 'ADD_TODO':
      // …
    case 'TOGGLE_TODO':
      // …
    default:
      return todos;
  }
}
```

处理 `ADD_TODO` 动作非常简单，因为可以使用 `.push()` 方法，该方法将返回一个新的 `List` 对象，并在末尾附加 `todo` 对象：

```js
case 'ADD_TODO':
  return todos.push(Map(action.payload));
```

注意，在将 `todo` 对象追加到 `List` 之前，我们还应将其转换为 `immutable` 的 `Map` 对象。

我们需要处理的更复杂的操作是 `TOGGLE_TODO`：

```js
case 'TOGGLE_TODO':
  return todos.map(t => {
    if(t.get('id') === action.payload) {
      return t.update('isDone', isDone => !isDone);
    } else {
      return t;
    }
  });
```

使用 `.map()` 方法遍历列表，并找到 `id` 与操作匹配的待办事项。然后调用 `.update()` 方法，该方法传递一个 `key` 和一个 `updater` 函数，返回更新后的新副本。`update()` 方法将指定 `key` 的值替换为 `updater` 函数的返回值，而 `updater` 函数又以 `key` 的初始值作为参数传递（译者注：即 `updater` 函数以`key` 的初始值作为参数，在函数主体内可能基于该 `key` 值运算生成新的结果，然后返回生成的结果，再经由 `update()` 方法调用时以 `updater` 函数生成的结果替换 `Map` 对象的 `key` 值）。

查看文字版本的示例可能会有所帮助：

```js
const todo = Map({ id: 0, text: 'foo', isDone: false });
todo.update('isDone', isDone => !isDone);
// => { id: 0, text: 'foo', isDone: true }
```

## 将一切连接起来

现在我们已经准备好了 `Actions` 和 `Reducer`，可以创建一个 `store` 并将其连接到我们的 `React` 组件中：

```jsx
// src/app.js

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { TodoList } from './components';
import reducer from './reducer';

const store = createStore(reducer);

render(
  <TodoList todos={store.getState()} />,
  document.getElementById('app')
);
```

我们需要使组件知道 `store`，将使用 `react-redux` 来简化此过程，它使我们能够创建可感知包装组件的存储感知（`store-aware`）容器，而无需更改原始的实现。

我们将需要在 `<TodoList />` 组件外放置一个容器，让我们来看看它是什么样的：

```js
// src/containers.js

import { connect } from 'react-redux';
import * as components from './components';
import { addTodo, toggleTodo } from './actions';

export const TodoList = connect(
  function mapStateToProps(state) {
    // …
  },
  function mapDispatchToProps(dispatch) {
    // …
  }
)(components.TodoList);
```

我们使用 `connect` 函数创建容器，调用 `connect()` 函数时传递了两个函数参数：`mapStateToProps()` 和 `mapDispatchToProps()`。

`mapStateToProps()` 函数将 `store` 的当前状态（`state`）作为参数（在示例中是待办事项列表 `todos`），返回值是一个对象，该对象描述了从 `state` 到包装组件的 `props` 的映射：

```js
function mapStateToProps(state) {
  return { todos: state };
}
```

比起这种方式，直接形象化的在包装好的 `React` 组件实例上绑定属性更有帮助（译者注：`connect()` 中调用 `mapStateToProps()` 方法相当于如下示例的意思）：

```jsx
<TodoList todos={state} />
```

我们还需要提供一个 `mapDispatchToProps()` 函数，该函数会传递 `store` 的 `dispatch()` 方法，以便我们可以使用它来调度 `action creator` 所创建的 `action`：

```js
function mapDispatchToProps(dispatch) {
  return {
    addTodo: text => dispatch(addTodo(text)),
    toggleTodo: id => dispatch(toggleTodo(id))
  };
}
```

再次，形象化的在包装好的 `React` 组件实例上绑定这些方法可能更有帮助：

```jsx
<TodoList todos={state}
  addTodo={text => dispatch(addTodo(text))}
  toggleTodo={id => dispatch(toggleTodo(id))} />
```

现在，我们已将组件映射到 `action creators`，可以从事件处理程序中调用它们：

```jsx
export function TodoList(props) {
  const { todos, toggleTodo, addTodo } = props;

  const onSubmit = (event) => {
    const input = event.target;
    const text = input.value;
    const isEnterKey = (event.which == 13);
    const isLongEnough = text.length > 0;

    if(isEnterKey && isLongEnough) {
      input.value = '';
      addTodo(text);
    }
  };

  const toggleClick = id => event => toggleTodo(id);

  return (
    <div className='todo'>
      <input type='text'
         className='todo__entry'
         placeholder='Add todo'
         onKeyDown={onSubmit} />
      <ul className='todo__list'>
        {todos.map(t => (
          <li key={t.get('id')}
            className='todo__item'
            onClick={toggleClick(t.get('id'))}>
            <Todo todo={t.toJS()} />
          </li>
        ))}
      </ul>
    </div>
  );
}
```

容器将自动订阅 `store` 中的更改，并且一旦映射的属性发生更改，它们就会重新渲染包装的组件。

最后，我们需要使用 `<Provider />` 组件使容器知道 `store`：

```jsx
// src/app.js

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducer';
import { TodoList } from './containers';
//                          ^^^^^^^^^^

const store = createStore(reducer);

render(
  <Provider store={store}>
    <TodoList />
  </Provider>,
  document.getElementById('app')
);
```

## 总结

不可否认，`React` 和 `Redux` 周围的生态系统可能非常复杂，并且对初学者构成学习障碍，但好消息是，几乎所有这些概念都是可以移植的。我们仅仅才接触到 `Redux` 架构的表面，但是我们已经看到足够多的知识来帮助我们开始学习 `Elm` 架构，或者选择像 `Om` 或 `Re-frame` 这样的 `ClojureScript` 库。同样地，我们只看到了一小部分不可变数据的可能性，但是现在我们有了更好的条件来开始学习诸如 `Clojure` 或 `Haskell` 这样的语言。

无论您是只是探索 `Web` 应用程序开发中的状态，还是整日编写 `JavaScript`，基于 `action` 的体系结构和 `immutable data` 的经验都已成为开发者的一项重要技能，并且现在是学习这些基础知识的好时机。