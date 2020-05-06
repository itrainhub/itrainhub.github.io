---
title: 使用 ES6 实现 TodoList
category: javascript
tags: [ES6, todolist]
key: javascript_es6_todolist
---

## 概述

随着前端技术的发展，2015年6月17日，`ECMA` 国际组织发布了 `ECMAScript` 的第六版，该版本正式名称为 `ECMAScript 2015`。自此，`ECMAScript` 每年都会发布一次新标准，目前 [ECMAScript 2020](https://tc39.es/ecma262/) 草案已经出炉。`ECMAScript 2015` 通常被称为 `ECMAScript 6` 或者简称 `ES6`，实际上现在很多时候我们也将 `ECMAScript 2015` 之后的版本都统称为 `ES6`。

本文主要是结合 `ES6` 来实现一个 `TodoList` 示例，不曾想将“简单的问题复杂化”了，那就顺便利用原生的方式封装一下，再顺便把 `React` 相关的基本原理简单实现一下。当然，虚拟 `DOM` 暂不在讨论之列。

[本文示例源码](https://github.com/itrainhub/isaac-es6-todolist)

## TodoList

本案例结合模块化与组件化思维来实现，利用 `webpack` 打包，可以按以下步骤运行示例项目：

```bash
# 克隆仓库
$ git clone https://github.com/itrainhub/isaac-es6-todolist.git

# 安装依赖
$ cd isaac-es6-todolist
$ npm i

# 运行
$ npm start
```

### 组件基类 Component

为增强组件的通用性，抽取出 `Component` 基类，以后自定义的组件继承 `Component` 即可：

```js
class Component {
  constructor(props) {
    this.props = props
    this.state = null
    this.el = null
  }

  /**
   * 修改 state
   * @param {*} state 修改后的 state
   */
  setState(state) {
    this.state = state
    // 状态修改后重新渲染
    const oldEl = this.el
    this.renderDOM()
    // 旧节点存在，则说明已在页面渲染，获取其父节点，否则还未渲染
    const container = oldEl && oldEl.parentNode
    if (!container )
      return
    // 在父节点中添加新节点，删除旧节点
    container.insertBefore(this.el, oldEl)
    container.removeChild(oldEl)
  }

  /**
   * 渲染DOM，生成节点，绑定事件
   */
  renderDOM() {
    this.el = createDOM(this.render()).firstElementChild
    Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach(key => {
      if (key.startsWith('on')) { // 事件方法
        const eventType = key.slice(2).toLowerCase() // 事件名称
        const callback = this[key] // 事件回调函数
        this.el.addEventListener(eventType, callback.bind(this), false)
      }
    })

    return this.el
  }
}
```

在基类中主要定义了三个属性和两个方法。

**属性说明**

`props` 是创建组件对象时传递给组件使用的属性集，`state` 是组件内部使用到的状态集，`el` 是组件渲染的 `DOM` 元素节点。

**方法说明**

`setState()` 方法是修改组件内部状态使用到的方法，因为修改组件内部状态后通常会涉及到视图更新，如果直接调用状态属性修改，则不会触发视图响应式更新。

`renderDOM()` 方法是生成 `DOM` 节点，为组件视图中的 `DOM` 元素绑定事件。方法中调用到组件对象的 `render()` 方法（该方法需要在子类中实现），通过 `render()` 方法来返回视图的 `html` 字符串文本。组件中的事件处理比较粗糙，遍历组件对象是中否有 `on` 开头的方法，有则注册事件监听，通过事件委派的方式来处理事件。

### 组件子类

#### TodoHeader

`TodoList` 的头部组件封装：

```js
class TodoHeader extends Component {
  defaultProps = {
    title: '待办事项列表',
    subtitle: '今日事今日毕，勿将今事待明日！'
  }

  render() {
    const { title, subtitle } = Object.assign({}, this.defaultProps, this.props)
    return (`
      <section class="hero is-dark">
        <div class="hero-body">
          <h1 class="title">${title}</h1>
          <h2 class="subtitle">${subtitle}</h2>
        </div>
      </section>
    `)
  }
}
```

`TodoHeader` 类继承 `Component` 基类，实现 `render()` 方法，返回头部视图静态 `html` 文本内容。

在 `TodoList` 的头部，设置了主标题与副标题，如果创建组件对象实例时未指定主/副标题文本内容，则使用 `defaultProps` 默认对象中的主/副标题文本。

#### TodoInput

`TodoList` 的添加待办事项输入部分：

```js
class TodoInput extends Component {
  // 添加待办事项
  addTodoItem() {
    console.log('添加待办事项')
  }

  // 点击按钮添加
  onClick(e) {
    const target = e.target
    if (target.classList.contains('btn-add-todo')) {
      this.addTodoItem()
    }
  }

  // 输入框回车添加
  onKeyDown(e) {
    const target = e.target
    if (target.classList.contains('input-todo-item') && e.keyCode === 13) {
      this.addTodoItem()
    }
  }

  /**
   * 重写 renderDOM() 方法，每次渲染时默认让输入框获得焦点
   */
  renderDOM() {
    this.el = super.renderDOM()
    setTimeout(() => {
      this.el.querySelector('.input-todo-item').focus()
    }, 0)
    return this.el
  }

  /**
   * 生成渲染html文本
   */
  render() {
    return (`
      <div class="field has-addons">
        <div class="control is-expanded">
          <input class="input input-todo-item is-info" type="text" placeholder="添加待办事项">
        </div>
        <div class="control">
          <a class="button is-info btn-add-todo">添加</a>
        </div>
      </div>
  `)
  }
}
```

类中的 `onClick()` 和 `onKeyDown()` 方法为事件处理方法，当点击添加按钮和在文本框中按回车键时，能够触发添加待办事项 `addTodoItem()` 方法的调用。

重写 `renderDOM()` 方法是为了让视图在渲染时能够默认使添加待办事项的文本框获得焦点，而不用每次点击鼠标来切换。

#### TodoItem

`TodoList` 的列表项组件，待办事项有多项时，重复渲染的 `dom` 结构是类似的，所以单独封装了一个组件：

```js
class TodoItem extends Component {
  state = {
    isEdit: false // 是否修改事项内容
  }

  edit() {
    this.setState({
      isEdit: true
    })
  }

  cancel() {
    this.setState({
      isEdit: false
    })
  }

  /**
   * 按钮点击事件处理：修改、删除待办事项
   * @param {*} e 事件event对象
   */
  onClick(e) {
    const target = e.target
    const classNames = target.classList
    if (classNames.contains('btn-update-todo-item')) { // 修改状态
      console.log('修改完成状态')
    } else if (classNames.contains('btn-delete-todo-item')) { // 删除
      console.log('删除待办事项')
    } else if (classNames.contains('txt-todo-item')) { // 点击事项文本，编辑，显示对应操作按钮
      this.edit()
      // 编辑文本框获得焦点
      setTimeout(() => this.el.querySelector('.input-edit-todo-item').select(), 0)
    } else if (classNames.contains('btn-save-todo-item')) { // 保存编辑待办事项
      console.log('保存编辑事项')
      this.cancel()
    } else if (classNames.contains('btn-cancel-edit')) { // 取消编辑
      this.cancel()
    }
  }

  /**
   * 文本框失去焦点，取消编辑，相当于 blur 事件，区别在于 blur 不冒泡而 focusout 冒泡
   * @param {*} e 事件event对象
   */
  onFocusOut(e) {
    const target = e.target
    if (target.classList.contains('input-edit-todo-item')) {
      const title = target.value
      // 内容未改变，则说明未修改事项，文本框失去焦点，还原显示
      if (title === this.props.title) {
        this.cancel()
      }
    }
  }

  /**
   * 编辑文本框中回车保存
   * @param {*} e
   */
  onKeydown(e) {
    const target = e.target
    if (target.classList.contains('input-edit-todo-item')) {
      if (e.keyCode === 13) {
        console.log('保存编辑事项')
        this.cancel()
      }
    }
  }

  /**
   * 生成待办事项内容部分html文本，如果是可编辑状态，则生成文本框，
   * 否则直接显示待办事项内容
   */
  _renderTodoItemText() {
    return (
      this.state.isEdit
      ?
      `
        <input class="input is-small input-edit-todo-item" value="待办事项-1">
      `
      :
      `
        <span>待办事项-1</span>
      `
    )
  }

  /**
   * 生成待办事项按钮部分html文本，如果是可编辑状态，则生成'保存/取消'按钮，
   * 否则生成'标记xxx/删除'按钮
   */
  _renderButtons() {
    return (
      this.state.isEdit
      ?
      `
        <button class="button btn-save-todo-item is-small is-info">保存</button>
        <button class="button btn-cancel-edit is-small">取消</button>
      `
      :
      `
        <button class="button btn-update-todo-item is-small is-info">标记为已完成</button>
        <button class="button btn-delete-todo-item is-small is-danger">删除</button>
      `
    )
  }

  render() {
    return (`
      <li class="panel-block">
        <div class="container columns is-vcentered">
          <div class="column is-8 txt-todo-item control">
            ${ this._renderTodoItemText() }
          </div>
          <div class="column is-4">
            ${ this._renderButtons() }
          </div>
        </div>
      </li>
    `)
  }
}
```

每项待办事项可以修改状态、删除、编辑文本、保存编辑及取消编辑。

编辑文本时显示输入框来接收修改后的待办事项文本内容，和非编辑状态时视图渲染有差异，所以创建组件内部使用的状态 `isEdit` 来标记当前是否为可编辑，当 `isEdit === true` 可编辑时，显示对应的文本框和按钮，否则直接显示待办事项文本和对应操作按钮，如 `_renderTodoItemText()` 和 `_renderButtons()` 方法所生成静态 `html` 文本。当调用 `setState()` 修改 `isEdit` 状态值时，会自动触发更新视图。

#### TodoList

`TodoList` 的列表显示组件：

```js
class TodoList extends Component {
  // 栏目信息（完成、未完成待办事项）
  sections = [
    {
      title: '未完成',
      className: 'list-uncompleted',
      isCompleted: false
    }, {
      title: '已完成',
      className: 'list-completed',
      isCompleted: true
    }
  ]

  /**
   * 渲染列表项
   * @param {*} todoList
   */
  _renderTodoItem() {
    // 两条测试数据
    const todoList = [
      {id: 1, title: 'hello', isCompleted: false}, 
      {id: 2, title: 'world', isCompleted: true}
    ]
    this.sections.forEach(section => {
      const { isCompleted, className } = section
      // 列表项父元素节点（完成/未完成）
      const wrapper = this.el.querySelector('.' + className)
      // 筛选完成/未完成待办事项
      const list = todoList.filter(todoItem => todoItem.isCompleted === isCompleted)
      if (list.length === 0) return
      // 清空父元素节点
      wrapper.innerHTML = ''
      // 循环渲染挂载待办事项
      list.forEach(item => {
        wrapper.appendChild(new TodoItem(todoItem).renderDOM())
      })
    })
  }

  /**
   * 重写 renderDOM() 方法
   */
  renderDOM() {
    this.el = super.renderDOM()
    this._renderTodoItem()

    return this.el
  }

  render() {
    return (`
      <div class="columns is-desktop">
        ${
          this.sections.map(section => (`
            <div class="column">
              <div class="panel">
                <p class="panel-heading">${section.title}</p>
                <ul class="${section.className}">
                  <li class="panel-block content">暂无</li>
                </ul>
              </div>
            </div>
          `)).join('')
        }
      </div>
    `)
  }
}
```

待办事项列表分两栏显示：未完成和已完成，重写 `renderDOM()` 方法，先生成 `TodoList` 组件的节点，再查找对应元素添加渲染列表项 `TodoItem` 节点。

#### App

整合 `TodoList` 各组件：

```js
class App extends Component {
  constructor(props) {
    super(props)
    this.registerComponent()
  }

  /**
   * 注册组件
   */
  registerComponent() {
    this.todoHeader = new TodoHeader({
      subtitle: '去日不可追，来日犹可期！'
    })
    this.todoInput = new TodoInput()
    this.todoList = new TodoList()
  }

  /**
   * 重写 renderDOM() 方法
   */
  renderDOM() {
    super.renderDOM()
    mount(this.todoHeader, this.el.querySelector('.todo-header'))
    mount(this.todoInput, this.el.querySelector('.todo-input'))
    mount(this.todoList, this.el.querySelector('.todo-list'))

    return this.el
  }

  render() {
    return `
      <div class="container">
        <div class="todo-header"></div>
        <div class="box todo-input" style="margin: 12px 0"></div>
        <div class="todo-list"></div>
      </div>
    `
  }
}
```

先注册各组件，创建对应对象实例，再重写 `renderDOM()` 方法，将各组件对象中的 `DOM` 元素节点挂载到对应的父节点下。

### 挂载页面

```js
// 页面html元素为：<div id="root"></div>
mount(
  new App(),
  document.querySelector('#root')
)
```

将整合后的组件节点挂载到静态页面渲染显示。

## 状态管理

整个 `TodoList` 各组件间可能会涉及数据共享，如在 `TodoInput` 组件中添加的待办事项需要在 `TodoList` 组件中使用并渲染，在 `TodoItem` 组件中修改的待办事项需要在 `TodoList` 组件中重新渲染，那如何来实现不同组件间的通信呢。一种办法是通过 `props` 属性来传递，本例比较简单，完全可以使用属性传递的方式来处理。可参考[https://github.com/itrainhub/isaac-es6-todolist/tree/876ded3552a01973c225f567b62acdd106f22a99](https://github.com/itrainhub/isaac-es6-todolist/tree/876ded3552a01973c225f567b62acdd106f22a99) 版本来实现。

除了通过 `props` 传递方式处理外，本示例继续优化了状态管理，借用 `Redux` 和 `react-redux` 的原理来实现组件间通信，代码解析如下。

### createStore

为了集中实现状态管理，先创建一个 `createStore()` 函数，用于统一创建 `store` 仓库：

```js
const createStore = reducer => {
  let state = null
  const listeners = []
  const getState = () => state
  const subscribe = (...listener) => listeners.push(...listener)
  const dispatch = action => {
    state = reducer(state, action)
    listeners.forEach(l => l())
  }
  dispatch({})

  return {
    getState,
    subscribe,
    dispatch
  }
}
```

`createStore()` 接受一个参数  `reducer`，返回一个包含 `getState()`、`subscribe()`、`dispatch()` 方法的对象。

之所以如此设计，是借用了 `Redux` 原理。`Redux` 可用三个基本原则来描述：单一数据源、`State` 只读、使用纯函数执行修改。

单一数据源是指应用的 `state` 被存储在一棵 `object tree` 中，并且这棵 `object tree` 只存在于唯一一个 `store` 中，所以定义 `createStore()` 方法来统一管理。

`State` 只读是指对 `state` 的修改应该集中管理，唯一修改 `state` 的方法就是触发 `action`。为避免 `state` 被任意修改，此处使用闭包，在 `createStore` 函数内部定义局部变量 `state` 来保存所有状态集，由于作用域链的关系，`state` 在函数体外部并不能直接调用到。函数体内部提供 `getState()` 方法来获取 `state` 状态数据，提供 `dispatch()` 方法来修改状态数据。`dispatch` 传递一个 `action` 作为参数，`action` 是一个用于描述已发生事件的普通对象，通常 `action` 对象有`type` 和 `payload` 两个属性， `type` 属性表示修改状态的操作类型，`payload` 表示有效载荷（即与修改状态相关的数据），如：

```js
{
  type: 'ADD_TODO_ITEM',
  payload: {
    id: 1,
    title: 'todo-item-1',
    isCompleted: false
  }
}
```

使用纯函数来执行修改。所谓纯函数，就是指返回值只依赖于它的参数，并且在执行过程中没有副作用的函数。`reducer()` 就是一个纯函数，它用来描述状态会如何变化。`reducer()` 会接收 `state` 与 `action` 两个参数，`state` 表示原始状态集，`action` 携带修改的操作类型与有效载荷。在 `reducer()` 函数体内会根据 `action.type` 执行状态更新，更新完毕后返回新的 `state`。

之所以 `reducer()` 要返回新的 `state` 是由于 `Redux` 需要不变性（immutability），在实际应用中，与那些可被随意篡改的数据相比，永远不变的数据更容易追踪，推导，可以让复杂的变化检测机制简单化。如果直接修改 `state` 中的状态数据，那么要跟踪变化就会变得困难了。本案例中使用对象深克隆的方式来修改状态数据，当然还有更好的方式如 [immutable.js](https://github.com/immutable-js/immutable-js)、[immer](https://github.com/immerjs/immer) 等库都可以实现不变性，这又是另一个专题的讨论了。

在 `createStore()` 中还利用观察者模式，来监听状态更新后的操作：

```js
const listeners = []
const subscribe = (...listener) => listeners.push(...listener)
const dispatch = action => {
  // ......
  listeners.forEach(l => l())
}
```

利用 `listeners` 数组保存所有监听器，定义 `subscribe()` 方法来注册监听，当 `dispatch()` 触发状态更新时，迭代所有监听器并调用执行，以达到处理状态更新后的操作。

### connect

`store` 是集中状态管理的仓库，可以将 `TodoList` 中的列表数据保存到 `store` 中，但要在组件间传递又如何处理呢，如果通过 `props` 来传递，那如果有跨层级的传递操作还是比较麻烦。在此利用全局 `context` 的方式来处理，创建 `store` 后将其存放到 `context` 中，在需要使用状态数据的组件中从 `context` 中获取即可。

在 `TodoList` 中会添加、修改、删除待办事项，这就涉及到状态的更新。在 `store` 中要实现状态更新，需要手动调用 `dispatch()` 方法，如果在状态更新时能够自动调用 `dispatch()` 来修改数据，并且状态更新后视图也能响应式更新就更方便了。

基于这些“更方便”的原因，定义连接函数 `connect()` 如下：

```js
const connect = (mapStateToProps, mapDispatchToProps) => WrappedComponent => {
  class Connect extends Component {
    constructor(props) {
      super(props)
      this.state = {
        allProps: []
      }
      this._updateProps()
      // 状态更新后自动更新视图渲染
      context.store.subscribe(this._updateProps.bind(this))
    }

    /**
     * 将 mapStateToProps、mapDispatchToProps 与 props 合并，传递给包装的组件
     */
    _updateProps() {
      const { store } = context
      // 将 mapStateToProps 返回对象中的状态映射为组件属性
      const stateProps = mapStateToProps ? mapStateToProps(store.getState()) : {}
      // 将 mapDispatchToProps 返回对象中的方法映射为组件属性
      // 这些方法将能实现自动调用 dispatch 修改状态
      let dispatchProps = null
      if (typeof mapDispatchToProps === 'function') {
        dispatchProps = mapDispatchToProps(store.dispatch)
      } else if (typeof mapDispatchToProps === 'object') {
        dispatchProps = {}
        Object.keys(mapDispatchToProps).forEach(item => {
          const actionCreator = mapDispatchToProps[item]
          const wrapper = (...args) => {
            const cb = actionCreator.apply(this, args)
            cb.call(this, store.dispatch)
          }
          dispatchProps[item] = wrapper
        })
      } else {
        dispatchProps = {}
      }
      // 修改组件内部 state 值
      // 修改后会触发更新视图操作
      this.setState({
        allProps: {
          ...stateProps,
          ...dispatchProps,
          ...this.props
        }
      })
    }

    /**
     * 重写 renderDOM()，返回包装组件对象渲染返回的 dom 元素
     */
    renderDOM() {
      this.el = new WrappedComponent(this.state.allProps).renderDOM()
      return this.el
    }
  }

  return Connect
}
```

这里有一个高阶组件的概念，所谓高阶组件，其实就是一个函数，传递一个组件作为参数，然后返回一个新的组件。这利用的是设计模式中的装饰者模式来实现的，为已有的被包装对象添加额外的功能，而又不改变被包装对象的结构。

`connect()` 函数的返回值就是一个高阶组件，将需要被包装的组件作为参数传递到高阶组件内部，然后在高阶组件内部处理后返回新的装饰组件。

`connect()` 函数接收两个参数，`mapStateToProps` 和 `mapDispatchToProps`，可以将 `store` 中的 `state` 和更新状态的方法（也可以叫 `actionCreator` ）映射为被包装组件的 `props` 以供被包装的组件对象直接使用。

`Connect` 类就是一个装饰类，继承自 `Component`，也是一个组件类。在 `_updateProps()` 方法中，将 `mapStateToProps` 和 `mapDispatchToProps` 返回对象中的属性与 `Connect` 接收到的 `props` 属性全部合并，调用 `setState()` 方法设置合并后的所有 `props`，然后在重写的 `renderDOM()` 方法中传递给被装饰对象 `new WrappedComponent(this.state.allProps)` 作为 `props` 使用。

`Connect` 类的构造函数中调用 `store.subscribe()` 来添加监听，当状态更新后能够自动更新视图。

### action

接下来创建更新状态使用到的 `action`，因为有多种更新操作，所以对应创建用于生成 `action` 对象并能够自动 `dispatch(action)` 的函数：

```js
const ActionTypes = {
  ADD_TODO_ITEM: 'ADD_TODO_ITEM',
  UPDATE_TODO_ITEM: 'UPDATE_TODO_ITEM',
  DELETE_TODO_ITEM: 'DELETE_TODO_ITEM',
  EDIT_TODO_ITEM: 'EDIT_TODO_ITEM'
}

let uid = 1

/**
 * 添加待办事项
 * @param {*} todoItemText 新增的待办事项文本
 */
const addTodoItemAction = todoItemText => dispatch => {
  dispatch({
    type: ActionTypes.ADD_TODO_ITEM,
    payload: {
      id: uid++,
      title: todoItemText,
      isCompleted: false
    }
  })
}

/**
 * 修改待办事项完成状态
 * @param {*} id
 */
const updateTodoItemAction = id => dispatch => {
  dispatch({
    type: ActionTypes.UPDATE_TODO_ITEM,
    payload: { id }
  })
}

/**
 * 删除待办事项
 * @param {*} id
 */
const deleteTodoItemAction = id => dispatch => {
  dispatch({
    type: ActionTypes.DELETE_TODO_ITEM,
    payload: { id }
  })
}

/**
 * 保存编辑的待办事项
 * @param {*} todoItem
 */
const editTodoItemAction = todoItem => dispatch => {
  dispatch({
    type: ActionTypes.EDIT_TODO_ITEM,
    payload: todoItem
  })
}
```

定义好 `action` 后，只要在需要更新状态的组件中结合 `connect()` 函数调用，就可以在被装饰的组件中从 `props` 中调用到这些方法来更新状态并自动更新视图了。

### reducer

`dispatch(action)` 会调用到 `reducer` 来实现状态更新，`reducer()` 是一个纯函数，定义如下：

```js
const reducer = (state, action) => {
  if (!state) return []
  const newState = cloneDeep(state)
  switch(action.type) {
    case ActionTypes.ADD_TODO_ITEM:
      newState.push(action.payload)
      return newState
    case ActionTypes.UPDATE_TODO_ITEM:
      return newState.map(todoItem => {
        if (todoItem.id === action.payload.id) {
          todoItem.isCompleted = !todoItem.isCompleted
        }
        return todoItem
      })
    case ActionTypes.DELETE_TODO_ITEM:
      return newState.filter(todoItem => todoItem.id !== action.payload.id)
    case ActionTypes.EDIT_TODO_ITEM:
      const { id } = action.payload
      return newState.map(item => {
        return item.id === id ? action.payload : item
      })
    default:
      return state
  }
}
```

`reducer()` 中如果 `state` 不存在，则初始化为数组，用于保存所有的 `TodoList` 待办事项，接着克隆原始 `state`，然后判断 `action.type` 具体是哪种修改动作，根据不同的动作完成状态修改，并返回修改后的新状态值。

## 仓库创建及状态更新

在 `index.js` 中调用 `createStore()` 来创建 `store`，将创建好的 `store` 保存到 `context` 中以便 `connect()` 时能够从 `context` 中获取到 `store`：

```js
// 状态仓库
const store = createStore(reducer)
// 保存到上下文中
context.set('store', store)
// 挂载渲染
mount(
  new App(),
  document.querySelector('#root')
)
```

当然还需要在 `TodoInput`、`TodoList`、`TodoItem` 组件中完成更新状态的操作。

以添加新待办事项为例：

```js
const mapDispatchToProps = {
  addTodoItemAction
}

@connect(null, mapDispatchToProps)
class TodoInput extends Component {
  // 添加待办事项
  addTodoItem() {
    const field = this.el.querySelector('.input-todo-item')
    const title = field.value
    this.props.addTodoItemAction(title)
  }
}
```

将 `action` 中的 `addTodoItemAction()` 与 `TodoInput` 组件 `connect` 连接起来，当实现添加待办事项功能时，调用 `this.props.addTodoItemAction(title)` 即可。

## 测试效果

最终完成效果如下图所示：

![效果](/assets/images/2020-03-18/result.gif)

