---
title: 自定义 MVVM 库
category: framework
tags: [mvvm]
key: framework_customize_mvvm
---

## 概述

使用 Vue 有一段时间了，其响应式数据处理在很大程度上提高了项目编码效率，一直没有好好研究过其原理，趁最近疫情宅家的时间，研究整理并自定义了一个简单的 MVVM 库，算是加深对它的的理解吧。

本库借鉴 Vue.js 2.x 版本相关原理，需要一定的 JavaScript 基础，文中如果遇到不理解的地方可自行查阅相关文档。

本文代码片段仅是为作说明的部分代码，并不是完整代码，请 `clone` 本仓库到本地后对照参考。

## 准备

### Vue 双向绑定原理

Vue 采用数据劫持加发布-订阅模式（有说观察者模式-有待细致研究其差异）实现响应式数据处理，通过 `Object.defineProperty()` 来劫持数据的 `getter/setter`，当数据更新时触发 `setter` 以更新视图。

### Object.defineProperty()

`Object.defineProperty()` 用于在一个对象上定义新的属性，或是修改已有属性，它是 ES5 中无法被 shim 的一个特性，所以不能在 IE9 之前的浏览器中使用。先看一个示例：

```js
// 劫持数据方法
const observe = data => {
  if (!isObject(data)) return
  
  // 拦截处理 data 各属性
  Object.keys(data).forEach(key => {
    observeProperty(data, key, data[key])
  })
}

// 修改对象现有属性，设置 getter/setter
const observeProperty = (obj, key, value) => {
  // value 可能也是对象，继续劫持
  observe(value)
  // 处理 getter/setter
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() { // 获取属性值，如：stu.name
      return value
    },
    set(val) { // 设置属性值，如：stu.name = '张三'
      console.log('data changed: ', value, ' => ', val)
      value = val
    }
  })
}
```

上例仅是简单拦截普通对象，对数组暂时未做处理，简单测试一下：

```js
const stu = {
  id: 1,
  name: {
    first: '二',
    middle: '小',
    last: '王'
  }
}
observe(stu)
stu.id = 10
stu.name.last = '李'
console.log('修改后，id =', stu.id)
console.log('修改后，last =', stu.name.last)
```

运行结果打印如下：

```js
data changed:  1  =>  10
data changed:  王  =>  李
修改后，id = 10
修改后，last = 李
```

可以看到，当修改 `stu` 对象属性值时，会调用到对应属性的 `setter` 来更新数据，执行控制台输出。

### 跟踪变化

借用 Vue 官方给出的原理图，先来看一下：

![Vue官方图](/assets/images/2020-03-14/vue.png)

数据的 `getter/setter` 对用户是不可见的，但在内部它们可以让 Vue 跟踪依赖，当 `getter` 被访问时，会对 Watcher（可理解为订阅者）收集依赖，当 `setter` 被访问时，会通知 Watcher 变更以触发重新渲染视图。当然 Vue 使用了虚拟 DOM 树结构，为简化自定义 MVVM 库，本文暂不实现虚拟 DOM。

通过 Vue 源码分析，其响应式数据处理主要集中在 Data 处理、Watcher 和 渲染函数（需要解析指令等）上，它们之间的关系更细致的为：

![跟踪变化](/assets/images/2020-03-14/vue_self.jpg)

其中 `Observer` 类和 `Dep` 类并未在官方图中明示。

有了以上准备工作，下面来自定义一个简单的 MVVM 库。

## 思路

为更快的实现自定义 MVVM 库，先捋一下思路，思路清晰了，编码才能事半功倍。

MVVM 是在 View 更新时能自动更新 Model，Model 更新时也能自动更新 View，来达到响应式的目的，这是 View-Model 需要实现的主要功能。

View 更新时自动更新 Model 比较容易实现，通过监听事件来处理即可，比如绑定 `<input type="text">` 的 `input` 事件来更新数据。

Model 更新时如何自动更新 View 呢，下面来重点分析一下。

Model 更新时要自动更新 View，重点是需要知道数据改变了，只有知道数据改变了，那么接下来才能去通知更新视图。前边已经知道，可以利用 `Object.defineProperty()` 来为对象的属性设置 `setter` 属性描述符，当更新属性时，会调用 `setter` 来处理，那么就可以在 `setter` 中添加更新视图的方法，当监视到数据改变时通知更新视图。

当然实际应用中，可能不止一处两处视图需要更新，那么如何在当 Model 数据更新时，所有相关的 View 都能够更新，我们可以结合发布-订阅模式来处理。订阅者会订阅数据的更新，发布者在数据更新后会通知订阅者，让订阅者来更新视图。

在 View 中，我们需要定义一些指令（如：`x-html`、`x-text`）或是插值表达式（`{{ expression }}`）来关联 Model  的数据，该如何解析 View  中的这些特殊标记呢，还需要相应的解析器来完成。

综上，再结合 Vue.js 2.x 原理，思路整理如下所示：

![自定义库思路](/assets/images/2020-03-14/idea.jpg)

- 实现 `Observer`，完成数据劫持
- 定义 `Watcher`，实现订阅者功能
- 定义 `Dep`，作为数据更新的发布者，建立数据与订阅者之间的关系，通知更新
- 实现 `Parser`，用于解析自定义 MVVM 库中的指令、`{{exp}}` 插值表达式，并绑定订阅者更新视图的更新函数
- 定义 `ViewModel`，整合 `Observer` 与 `Parser`，形成 MVVM 库入口

## 开工

### 核心

#### Observer

`Observer` 监视数据的变化，需要完成数据劫持，前边已经介绍了 `Object.defineProperty()`，接下来正式开始定义 `Observer` 类：

```js
class Observer {
  constructor(data) {
    // TODO: 暂劫持普通对象劫持，数组劫持后续添加
    this.walk(data)
  }

  /**
   * 劫持对象各属性
   * @param obj 待劫持对象
   */
  walk = obj => {
    Object.keys(obj).forEach(key => {
      observeProperty(obj, key, obj[key])
    })
  }
}
```

先简化功能，只劫持普通对象，由于数组在开发过程中也是使用得非常频繁的对象，对数组的劫持与普通对象存在差异，所以目前暂不劫持，后期再迭代新增数组劫持。13 行中使用到 `observeProperty()` 方法，定义如下：

```js
const observeProperty = (obj, key, value) => {
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) // 属性不可改变，则不需要继续劫持
    return

  // 属性值也可能为对象，继续劫持
  observe(value)

  // 获取属性已定义的 getter/setter
  const getter = property.get
  const setter = property.set

  // 劫持属性，重写 getter/setter
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      // 有预定义的 getter，则调用 getter 方法获得返回值，否则使用已有属性值
      const val = getter ? getter.call(obj) : value
      // 返回属性值
      return val
    },
    set(val) {
      // 有预定义的 setter，则调用 setter 方法更新属性值，否则直接更新
      if (setter)
        setter.call(obj, val)
      else
        value = val
      // 设置新值可能为对象，劫持
      observe(value)
    }
  })
}
```

被劫持的属性值如果为对象或数组，则需要继续对属性值再做劫持，所以第 7 行及第 30 行调用 `observe()` 方法进行劫持处理，该方法定义如下：

```js
const observe = data => {
  // data 数据如果是对象则劫持处理
  return isObject(data) ? new Observer(data) : null
}
```

#### Watcher

`Watcher` 是数据更新的订阅者，它会订阅数据更新，绑定视图更新的函数，数据更新后完成更新视图的动作。先看类定义：

```js
/**
 * 订阅者，订阅数据的更新，数据更新后完成更新视图
 */
class Watcher {
  constructor(vm, expression, callback) {
    this.vm = vm // ViewModel 对象，挂载有数据
    this.expression = expression // 指令表达式或插值表达式
    this.callback = callback // 绑定的视图更新函数
    this.value = this.get() // 获取订阅数据的初始值
  }

  /**
   * 处理更新视图的方法
   */
  update = () => {
    // 更新后的数据
    const newValue = this.get()
    // 更新前的数据
    const oldValue = this.value
    // 如果更新前后数据一致，说明未更新数据，不需要更新视图
    if (newValue === oldValue)
      return
    // TODO: 调用回调函数更新视图
    // this.callback.call()

    // 保存更新后数据
    this.value = newValue
  }

  /**
   * 获取表达式表示的属性值
   */
  get = () => {
    const exps = this.expression.split('.')
    let vm = this.vm
    for (let i = 0, l = exps.length; i < l; i++) {
      if (!vm) return
      vm = vm[exps[i]]
    }
    return vm
  }
}
```

构造函数中的 `vm` 对象上挂载了劫持的数据，`expression` 为指令或 `{{ exp }}` 的表达式内容(如：`stu.name.middle`)。

`get()` 方法从劫持数据中获取到 `expression`  表达式所表示的属性值。

`update()` 方法调用绑定的视图更新回调函数 `callback` 执行视图更新操作，该回调函数结构将在解析指令时定义。

#### Dep

`Dep` 是订阅者收集器，是数据更新的发布者。一个 `Dep` 实例对应一个数据（一个被观察的对象属性或一个被观察的对象），一个数据可以被多个订阅者订阅，所以 Dep 维护一个队列，来保存订阅者。`Dep` 定义如下：

```js
// 全局编号
let uid = 0
/**
 * 数据更新的发布者
 */
class Dep {
  constructor() {
    this.id = uid++
    this.subs = []
  }

  /**
   * 添加订阅者到队列
   * @param sub 待添加的订阅者
   */
  addSub = sub => {
    this.subs.push(sub)
  }

  /**
   * 通知所有订阅者数据更新
   */
  notify = () => {
    this.subs.forEach(sub => sub.update())
  }

  /**
   * 收集订阅者
   */
  depend = () => {
    // TODO
  }
}
```

#### 添加 Observer、Watcher、Dep 三者联系

什么时候是收集订阅者（`Watcher`）的最佳时机呢？

在 `Watcher` 构造函数中，会先获取到订阅数据的初始值，以便在数据更新通知调用 `update()` 方法时能够比较数据值是否确实发生改变，由此说明在创建 `Watcher` 对象实例时就建立了订阅者与数据之间的联系。在获取订阅数据初始值时，会调用到对应数据的 `getter` 方法，那么可以考虑在对应的 `getter` 中来收集订阅者。

由于一个数据的更新可以被多个订阅者订阅，`Dep` 作为订阅者收集器，已经定义了队列用来保存订阅者，那么当添加订阅者时，如何知道 `getter` 是与具体的哪个 `Watcher` 关联呢？可以在 `Dep` 中定义一个静态属性用于缓存添加关联的 `Watcher`。

综上分析，先在 `Dep` 上添加静态属性：

```js
Dep.target = null
```

何时为 `Dep.target` 赋值呢？我们知道，创建 `Watcher` 对象时会到其订阅数据对应的 `getter` 中收集订阅者，那么需要在 `getter` 调用前为 `Dep.target` 赋值，在 `getter` 中才能知道所关联的 `Watcher` 是哪一个。

先完成 `observeProperty()` 方法的改进：

```js
const observeProperty = (obj, key, value) => {
  ......
+	const dep = new Dep()
  // 劫持属性，重写 getter/setter
  Object.defineProperty(obj, key, {
    ......
    get() {
+     // 收集订阅者
+		  if (Dep.target) { // 如果有关联的订阅者，则收集
+  		  dep.depend()
+  	  }
      // 有预定义的 getter，则调用 getter 方法获得返回值，否则使用已有属性值
      const val = getter ? getter.call(obj) : value
      ......
    },
    set(val) {
      ......
+     // 通知数据更新
+     dep.notify()
    }
  })
}
```

行前有 `+` 号的是改进时的新增代码，由于一个 `Dep` 对象与一个数据对应，第 3 行中创建 `Dep` 对象，利用闭包为每个数据维护自己的 `Dep`。在 `getter` 中添加收集订阅者的操作，`setter` 最后添加通知数据更新的代码。

接下来改进 `Watcher`，前面已经分析，创建 `Watcher` 对象时会获得订阅数据的初始值， 在调用 `getter` 时会判断是否存在 `Dep.target`，应在调用 `getter` 前为 `Dep.target` 赋值：

```js
class Watcher {
  constructor(vm, expression, callback) {
    this.vm = vm // ViewModel 对象，挂载有数据
    this.expression = expression // 指令表达式或插值表达式
    this.callback = callback // 绑定的视图更新函数
-   this.value = this.get() // 获取订阅数据的初始值
+   this.value = this.getValue() // 获取订阅数据的初始值
  }

+ /**
+  * 获取订阅数据当前值，每次都需要收集订阅者，
+  * 所以在实际获取属性值前设置 Dep.target
+  */
+ getValue = () => {
+   Dep.target = this
+   const value = this.get()
+   Dep.target = null
+   return value
+ }

  /**
   * 处理更新视图的方法
   */
  update = () => {
    // 更新后的数据
-   const newValue = this.get()
+   const newValue = this.getValue()
    ......
  }
  ......
}
```

利用 `Dep.target` 来缓存当前的 `Watcher` 对象，使用完后重置缓存即可（`Dep.target = null`）。`update()` 方法中获取更新后数据调用修改为 `getValue()` 方法。

由于每获取一次数据都会调用其 `getter` 来收集订阅者，所以同一订阅者可能重复订阅某数据。那么利用 `Dep` 对象的 `id` 属性来判断，如果 `Watcher` 对象已订阅某条数据更新，则不需要再次订阅。`Watcher` 可以继续改进，添加 `depIds` 属性和 `addDep()` 方法：

```js
class Watcher {
  constructor(vm, expression, callback) {
    ......
+   this.depIds = {} // 保存已被哪些 Dep 收集过
  }

  ......

+ /**
+  * 添加到 Dep 的队列中，订阅数据更新
+  * @param dep Dep 对象实例
+  */
+ addDep = dep => {
+   const id = dep.id
+   if (this.depIds.hasOwnProperty(id)) // 已订阅过，不需要重复订阅
+     return
+   // 未订阅，则添加到 Dep 队列中
+   dep.addSub(this)
+   this.depIds[id] = dep
+ }
}
```

最后完善 `Dep` 中的 `depend()` 方法：

```js
/**
 * 收集订阅者
 */
depend = () => {
  Dep.target && Dep.target.addDep(this)
}
```

至此，`Observer`、`Watcher`、`Dep`  三者间的联系建立完毕。

上文中提到，创建 `Watcher` 对象会收集订阅者，但是在哪儿创建的 `Watcher` 对象呢？继续往下看。

### 解析器

#### Parser

假如 `View` 中有如下一段片段：

```html
<div id="root">
  <span x-text="msg" />
  <div>
    {{ msg }}
  </div>
</div>
```

片段中的 `x-text="msg"` 和 `{{ msg }}` 需要被识别，利用相关数据实现渲染，该如何做到呢？ 这就需要解析器，来将视图中的所有指令及插值表达式解析成能够理解内容，然后渲染到真实的 `DOM` 中。

搭建 `Parser` 框架：

```js
/**
 * 解析器
 */
class Parser {
  constructor(vm) {
    this.vm = vm
    this.parseElement(vm.$el)
  }

  /**
   * 解析元素节点
   */
  parseElement = el => {
    
  }

  /**
   * 解析元素节点的所有属性
   */
  parseAttrs = el => {
    
  }

  /**
   * 解析文本节点
   */
  parseText = textNode => {
    
  }
}
```

**解析元素：**

```js
/**
 * 解析元素节点
 */
parseElement = el => {
  // 解析 el 节点的属性
  this.parseAttrs(el)
  // 解析 el 节点的所有孩子节点
  Array.from(el.childNodes).forEach(node => {
    // 判断是元素节点还是文本节点
    if (isElement(node)) { // 元素节点，继续递归解析
      this.parseElement(node)
    } else if (isText(node)) { // 文本节点
      this.parseText(node)
    }
  })
}
```

解析元素节点时，先解析属性(如果有的话)，然后看是否有孩子节点，如果有孩子节点，则每个孩子节点需要继续解析。孩子节点是元素时，可递归解析，如果是文本节点，调用解析文本节点的方法即可。

**解析属性：**

```js
/**
 * 解析元素节点的所有属性
 */
parseAttrs = el => {
  // 遍历所有属性，解析
  Array.from(el.attributes).forEach(attr => {
    // 属性名
    const name = attr.name
    // 如果属性名以 'x-' 开头，则是指令，需要解析处理，否则不予处理，继续遍历下一个属性
    if (!name.startsWith('x-')) 
      return
    // 指令名称
    const directive = name.slice(2)
    // 指令表达式
    const expression = attr.value
    // 判断是普通指令还是事件指令
    if (directive.startsWith('on')) { // 事件指令
      // TODO

    } else { // 普通指令
      // TODO
      
    }
    // 删除指令属性
    el.removeAttribute(name)
  })
}
```

每个属性都需要遍历解析，如果属性名以 `x-` 开头，则为指令，需要解析处理。如果指令名称以 `on` 开头，则是事件指令，需要执行事件处理的解析操作，如果不以 `on` 开头则是普通指令，执行普通指令的操作。事件指令和普通指令的处理稍后完成。

**解析文本：**

```js
/**
 * 解析文本节点
 */
parseText = node => {
  // 获取文本值
  const text = node.textContent
  // 插值表达式的正则
  const reg = /\{\{((?:.|\n)*?)\}\}/g
  // 将文本按插值语法分割
  const plainTexts = text.split(/\{\{(?:.|\n)*?\}\}/)
  const mustaches = []
  // 将原始文本及各插值表达式缓存起来，以便生成完整的文本内容
  const original = {plainTexts, mustaches}
  // 文本值中可能有多个插值表达式
  let index = 0
  let match
  while (match = reg.exec(text)) {
    // TODO
    
  }
}
```

在文本中如果有插值表达式，则需要对插值表达式解析处理。由于文本中可能有多个插值表达式，所以采用正则加循环遍历每个插值表达式的方式来处理。

#### 指令处理

下面来完成对指令及插值表达式的解析处理，本库暂时支持 `x-html`、`x-text`、`x-model`、`x-on` 指令和 `{{ exp }}` 插值表达式的解析 。定义辅助对象来完成处理：

```js
/**
 * 指令处理
 */
const DirectiveHandler = {
  /**
   * 分派普通指令
   */
  dispatch(node, vm, directive, expression) {
    // 获取处理函数名
    const fn = this[`process${capitalize(directive)}`]
    // 调用处理函数
    fn && fn(node, this.getVmValue(vm, expression))

    // 创建 Watcher 订阅者对象
    new Watcher(vm, expression, value => {
      fn && fn(node, value)
    })

    // 如果为 x-model 还需要绑定事件处理
    if (directive === 'model'){
      this.handleModel(node, vm, expression)
    }
  },

  /**
   * 处理文本
   */
  processText(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
  },

  /**
   * 处理 {{ exp }} 插值语法
   */
  processMustache(node, original, vm, expression, index) {
    let value = this.getVmValue(vm, expression)
    const { mustaches } = original
    mustaches[index] = typeof value === 'undefined' ? '' : value
    this.handleMustachText(node, original)
    new Watcher(vm, expression, (value, oldValue) => {
      mustaches[index] = typeof value === 'undefined' ? '' : value
      this.handleMustachText(node, original)
    })
  },

  /**
   * 处理插值文本
   */
  handleMustachText(node, original) {
    const { plainTexts, mustaches } = original
    let text = ''
    plainTexts.forEach((txt, i) => {
      mustache = typeof mustaches[i] === 'undefined' ? '' : mustaches[i]
      text += txt + mustache
    })
    node.textContent = text
  },

  /**
   * 处理 html 文本
   */
  processHtml(node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value
  },

  /**
   * 处理 model
   */
  processModel(node, value) {
    node.value = typeof value === 'undefined' ? '' : value
  },

  /**
   * x-model双向绑定，需要为元素添加 input 事件来处理
   */
  handleModel(node, vm, expression) {
    node.addEventListener('input', e => {
      const value = e.target.value
      this.setVmValue(vm, expression, value)
    }, false)
  },

  /**
   * 处理事件指令
   */
  processEvent(node, vm, directive, expression) {
    const eventType = directive.slice(3)
    const callback = vm.$methods[expression]
    node.addEventListener(eventType, callback.bind(vm), false)
  },

  /**
   * 从 vm 获取表达式所表示的数据值
   */
  getVmValue (vm, expression) {
    // 没有表达式，则结束查找
    if (expression.length === 0)
      return
    // expression 可能为类似 stu.name.last 的字符串
    const exps = expression.split('.')
    // 从 vm 对象下挂载的数据中查找满足 expression 的属性值
    for (let i = 0, l = exps.length; i < l; i++) {
      if (!vm) return
      vm = vm[exps[i]]
    }
    return vm
  },

  /**
   * 设置 vm 中挂载数据的值
   */
  setVmValue (vm, expression, value) {
    const exps = expression.split('.')
    for (let i = 0, l = exps.length; i < l; i++) {
      if (i < l - 1) {
        vm = vm[exps[i]]
      } else {
        vm[exps[i]] = value
      }
    }
  }
}
```

完善解析属性和解析文本代码片段中的 `TODO` 部分：

```js
// 判断是普通指令还是事件指令
if (directive.startsWith('on')) { // 事件指令
  DirectiveHandler.processEvent(el, this.vm, directive, expression)
} else { // 普通指令
  DirectiveHandler.dispatch(el, this.vm, directive, expression)
}
```

及

```js
while (match = reg.exec(text)) {
  // TODO
  DirectiveHandler.processMustache(node, original, this.vm, match[1].trim(), index++)
}
```

### ViewModel

最后来完成 `ViewModel` 的功能，整合已有功能，完成入口代码编写：

```js
class ViewModel {
  constructor(options) {
    options = Object.assign({}, defaultOptions, options)
    let { el, data, methods } = options
    this.$options = options
    this.$el = typeof el === 'string' ? document.querySelector(el) : el
    this.$data = data
    this.$methods = methods

    Object.keys(data).forEach(key => {
      _injectData(this, key)
    })

    observe(data)
    new Parser(this)
  }
}
```

创建 `ViewModel` 对象时接收选项参数，将选项中的 `el` 根元素、`data` 数据、`methods` 方法及 `options` 本身都挂载到 `ViewModel` 对象下，将 `data` 数据中各属性也直接挂载到 `ViewModel` 对象下，然后劫持数据，创建解析器对象，从根元素节点开始解析。

### 阶段性成果

以上我们就已经将这个自定义的简易 MVVM 库所需各个类创建完毕，接下来可以简单测试一下，`HTML` 片段：

```html
<div id="root">
  {{ msg }}
  <br>
  {{ success }}
  <br>
  <input type="text" x-model="msg" />
  <div>
    学生姓名：{{ stu.name.middle }} {{ stu.name.first }}，年龄：{{ stu.age }}
  </div>
  <button x-on:click="handle">按钮</button>
</div>
```

`JavaScript` 脚本：

```js
const vm = new ViewModel({
  el: '#root',
  data: {
    msg: 'hello',
    success: 'congratulations!!!',
    stu: {
      name: {
        first: '二',
        middle: '小',
        last: '王'
      },
      age: 18
    }
  },
  methods: {
    handle() {
      this.msg = 'changed'
    }
  }
})
```

效果：

![成果](/assets/images/2020-03-14/result.gif)





### 对数组的劫持处理

目前虽然可以简单运行，但是对于数组的劫持仍然还未处理，下面来实现数组劫持处理。

#### 为什么单独处理数组

先来看看数组的劫持为什么要和普通对象的劫持分开来进行。有如下示例代码片段：

```js
const observe = data => {
  Object.keys(data).forEach(key => {
    observeProperty(data, key, data[key])
  })
}

const observeProperty = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      console.log('获取数据')
      return value
    },
    set(val) {
      if (val === value) return
      console.log('数据即将更新：', value, '=>', val)
      value = val
    }
  })
}

const arr = [3, 'a', true]
observe(arr)

console.log('数组长度：', arr.length)
console.log('arr[0]:', arr[0])
arr[0] = 88
```

运行结果：

```js
数组长度： 3
获取数据
arr[0]: 3
数据即将更新： 3 => 88
```

可以看到，当获取和修改数组元素值时，仍然能够监测拦截到数据的访问呀，这是为什么呢？这是因为数组也是对象的一种，数组元素的访问和对象的属性访问是一样的，`arr[0]` 同 `arr['0']` 是一个意思，通过标识符 `'0'` 作为属性名，来访问对象 `arr` 中对应属性的值。因此，在数组对象中可以定义一个名为 `'0'` 的属性，然后拦截对数组中第一个元素的访问，这就是我们能够看到上述运行结果的原因。

接着再执行如下修改：

```js
arr[10] = 'test'
```

运行结果：

```js

```

控制台上没有任何的输出，再看看这时的数组长度和刚修改的元素值：

```js
console.log('数组长度：', arr.length)
console.log('arr[10]:', arr[10])
```

运行结果：

```js
数组长度： 11
arr[10]: test
```

Why?

当执行 `arr[10] = 'test'` 赋值语句时，是修改数组中下标编号为10(即第11个)的元素值，但数组初始长度为3，没有下标为10的元素，所以这时会自动向数组下标为10的位置添加一个新元素值。由于数组中元素是有序的，既然有了下标为10的元素，那么下标3-9也应该存在，只是还未给它们赋值，这些元素值为"空"而已，所以当获取数组长度时，显示为 `11`。

即然已向下标10的元素处添加了元素值，所以 `arr[10]` 也就能够访问到该下标处的元素值，打印显示到控制台上。

再仔细看看，有没有执行到 `getter/setter` 中的方法呢？如果有执行到，则控制台上还应该有：

```js
数据即将更新： undefined => 'test'
获取数据
```

类似这样的打印结果，而实际上并没有这些打印显示。那说明在当为 `arr[10] = 'test'` 赋值和获取打印 `arr[10]` 时，并未被拦截处理。

回过头去再看看，当执行 `observe(arr)` 时，彼时的 `arr` 数组中仅有三个元素，即仅对数组中初始的三个元素做了劫持，再新添加的元素并没有实现数据的劫持，所以不会有 `getter/setter` 中的执行过程。

如果需要让新增的元素也能被劫持处理，则需要重新调用 `observe(arr)` 来劫持数组元素。很明显这样并不现实，因为在这个库中并没有暴露 `observe()` 方法供用户使用(入口是 `ViewModel` 类)。数组是应用开发中经常使用到的结构，可能会频繁的对数组执行添加或删除元素的操作，如果你认为预先劫持所有可能的整数下标，那么对于非数字下标属性的添加或删除又如何处理呢（当然这又是另一个主题的讨论了）？

由此看来，像普通对象一样来对数组实现劫持是不现实的，所以需要重新处理数组的劫持。

#### 继承并重写数组的方法

数据劫持的主要目的，是当数据更新时，能够通知视图更新，既然通过数组元素直接赋值的方式劫持新增元素不现实，那么考虑通过数组的方法能不能实现呢。

来看一个元素的添加方法，比如 `push()` 方法，如果能够重写该方法使其在被调用时通知数据更新，不就达到了要劫持的目的了吗。但是如果直接修改 `Array.prototype` 中的 `push()` 方法，那么应用中那些不需要被劫持的数组又如何处理呢，并且也并不建议直接修改 JavaScript 中的内置对象，这时就可以使用继承的方式来处理了。

劫持数组是数组中元素变化时能够通知视图更新，那么那些不会改变原始数组的方法可以不用重写，只重写会改变原始数组的方法即可，这些方法有：`push/pop/unshift/shift/splice/sort/reverse`。

继承有很多方式，原型链继承、组合继承、拷贝式继承、ES6中的 `class` 语法糖等，这里选择原型链继承来实现。

```js
// 为对象定义属性
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    value,
    writable: true,
    configurable: true,
    enumerable: false
  })
}

// 数组 Array.prototype 的引用
const arrayProto = Array.prototype
// 创建基于 Array.prototype 为原型的对象，
// 被劫持的数组会修改原型链且以该对象为原型
const arrayMethods = Object.create(arrayProto)

// 变异方法（即调用这些方法会导致原始数组的修改）
const methodsToPatch = [
  'push',
  'pop',
  'unshift',
  'shift',
  'splice',
  'sort',
  'reverse'
]

// 重写变异方法
methodsToPatch.forEach(method => {
  // 原始方法
  const original = arrayProto[method]
  // 定义重写方法
  def(arrayMethods, method, function(...args) {
    // 在重写方法中调用原始实现数组元素操作
    const value = original.apply(this, args)
    // 如果是 push、unshift、splice 三个方法，可能会向数组中添加新元素
    // 添加的新元素需要再次被劫持，标记出添加的新元素
    let inserted
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
    }
    // 劫持新添加的元素
    if (inserted) {
      // TODO
    }

    // 通知数据更新
    // TODO

    // 返回原始方法调用返回的结果值
    return value
  })
})
```

劫持数组中新添加的元素及要通知数据更新，都和 `Observer` 相关，接下来更新 `Observer`。

#### 更新 Observer

`Observer` 中只先处理了普通对象的劫持，所以现在添加对数组的劫持：

```js
  constructor(data) {
+   this.dep = new Dep() // Dep对象，用于收集订阅者和通知更新
+   // 为 data 数据添加 '__ob__' 属性指向当前对象
+   def(data, '__ob__', this)
+   // 判断数据的类型
+   if (Array.isArray(data)) { // 劫持数组
+     // 修改 data 数组的原型链，即 data.__proto__ = arrayMethods
+     Object.setPrototypeOf(data, arrayMethods)
+     // 数组各元素可能也是对象或数组，继续劫持
+     this.observeArray(data)
+   } else { // 劫持普通对象
      this.walk(data)
+   }
  }
  
  ......
  
+ 
+ /**
+  * 劫持数组各元素
+  * @param arr 数组
+  */
+ observeArray(arr) {
+   for (let i = 0, l = arr.length; i < l; i++) {
+     observe(arr[i])
+   }
+ }
```

由于数组劫持时，原始数组变化时会重新劫持新添加的元素和通知数据更新，所以添加第 2 行和第 4 行的代码片段，现在回头去实现重写数组方法中 `TODO` 部分内容：

```js
......

+   // 获取为数组对象注入的 __ob__ 属性值（即 Observer 对象）
+   const ob = this.__ob__
    // 劫持新添加的元素
    if (inserted) {
-     // TODO
+     ob.observeArray(inserted)
    }
    // 通知数据更新
-   // TODO
+   ob.dep.notify()

......
```

下面可以测试一下，看是否能够处理数组的劫持：

```html
<!-- html片段 -->
<div>
  兴趣爱好有 {{ stu.hobbies.length }} 个
</div>
<button x-on:click="handleAddHobby">添加兴趣</button>
```

```js
/* js 片段 */
data: {
  stu: {
    hobbies: ['吃饭', '睡觉']
  }
},
methods: {
  handleAddHobby() {
    this.stu.hobbies.push('打豆豆')
  }
}
```

运行效果：

![数组劫持](/assets/images/2020-03-14/observe_array.gif)

初始数组的长度能够正确获得，但当点击添加兴趣爱好时，视图并未更新。

在重写的方法中打印一下看能不能调用到 `push()` 方法，从控制台的打印结果来看，是能够调用到的，那么问题就出现在订阅者是否真正订阅到数组的变化了，只有真正订阅到数组的变化，才能在调用 `ob.dep.depend()` 方法时通知订阅者更新视图。

#### 完善

分析一下 `Observer`，当劫持到 `stu.hobbies` 属性时，`observeProperty()` 方法中：

```js
// 属性值也可能为对象，继续劫持
observe(value) // observe(['吃饭', '睡觉'])
// 创建 Dep 对象
const dep = new Dep()
Object.defineProperty(obj, key, {
  ......,
  get() {
    // 收集订阅者
    if (Dep.target) {
      dep.depend()
    }
    // 有预定义的 getter，则调用 getter 方法获得返回值，否则使用已有属性值
    ......
  },
  set(val) {
    ......
    // 设置新值可能为对象，劫持
    observe(value)
    // 通知更新
    dep.notify()
  }
})
```

由于 `stu.hobbies` 属性的值为 `['吃饭', '睡觉']`，是数组结构，会继续劫持。然后创建 `Dep` 对象，该对象处于闭包结构内，能够收集订阅了 `stu.hobbies` 数据更新的订阅者，但订阅者仅会在修改 `stu.hobbies` 属性本身时才会接收到通知去更新视图，验证：

```js
handleAddHobby() {
  this.stu.hobbies = '测试是否修改stu.hobbies本身'
}
```

运行效果：

![修改属性本身](/assets/images/2020-03-14/observe_arr_prop.gif)

视图更新了，数字由之前数组的长度 2 更新为字符串的长度 19，由此可见当前确实是当修改 `stu.hobbies` 属性本身时才会更新视图，那如何使得修改 stu.hobbies 属性值(即数组)时也能更新视图呢？

在 `Observer` 中，我们为每个 `Observer` 都添加了 `dep` 属性，为劫持的对象添加了 `__ob__` 属性，当调用到数组重写后的 `push` 方法时，通过被劫持的数组对象本身拿到 `__ob__` (即关联的 `Observer` 对象)，然后调用到 `dep` 来获取 `Dep` 对象。很明显，`push()` 方法中的这个 `dep` 对象和 `observerProperty()` 方法中的 `dep` 不是同一个对象，所以订阅者并未订阅到对数组本身的修改。

再看看 `observe()` 方法，其调用后的返回值为 `Observer` 对象。`observe(['吃饭', '睡觉'])` 调用后返回的对象与劫持该对象时绑定的 `__ob__` 是同一个对象，那么利用 `observe(['吃饭', '睡觉'])` 返回对象的 `dep` 来收集订阅者是否可行呢？验证：

```js
// 属性值也可能为对象，继续劫持
let childOb = observe(value)
// 创建 Dep 对象
const dep = new Dep()
Object.defineProperty(obj, key, {
  ......,
  get() {
    // 收集订阅者
    if (Dep.target) {
      dep.depend()
      if (childOb) {
        childOb.dep.depend()
      }
    }
    // 有预定义的 getter，则调用 getter 方法获得返回值，否则使用已有属性值
    ......
  },
  set(val) {
    ......
    // 设置新值可能为对象，劫持
    childOb = observe(value)
    // 通知更新
    dep.notify()
  }
})
```

再次运行，效果：

![完善效果](/assets/images/2020-03-14/observer_array_success.gif)

现在看，当调用数组的 `push` 方法添加元素时，就能够拦截到数组的更新并通知更新视图了。

至此，自定义 MVVM 库中对数组的劫持就实现了。当然也还可能存在未测试到的 `bug`，留待后续解决。

## 扩展优化

### 复杂表达式解析

在对指令表达式和插值表达式解析时，目前还只支持类似 `stu.name` 这种结构的字符串解析，即以 `.` 分隔对象属性调用的表达式。如果有类似 `stu['name']` 、`stu.hobbies[0]` 或 `prod.price * prod.amount` 这样的复杂表达式，甚至于函数调用的表达式，如 `handleClick(stu.name)`，还不能解析并获取表达式运算结果，下面来优化完善对表达式的解析支持。

对以 `.` 分隔对象属性调用的表达式解析最简单，以 `.` 分割字符串后再迭代数组中每个属性名称，从根对象中一层层查找属性值即可，但复杂的表达式中还包含其它符号，如 `()`、`''`、`[]` 甚至是 `() => {}` 等，如果还是按照字符串分割的方式来处理，那什么时候是属性调用，什么时候是算术运算，什么时候又是函数调用就不好区分了。

此时可采取一个比较取巧的办法，就是将表达式的内容转换到一个函数内部去执行，通过函数的执行返回表达式的结果。示例：

```js
// 有表达式内容为 data['stu'].hobbies[0] 需要解析
const data = {
  stu: {
    hobbies: ['足球', '篮球', '乒乓球']
  }
}
let expression = 'data["stu"].hobbies[0]'
const fn = new Function(`return ${expression}`)
console.log('解析结果：', fn())
```

运行结果：

```js
解析结果： 足球
```

从运行结果中看到，可以正确获取到对应对象属性的值。

再来一个复杂点的示例，解析表达式 `prod['price'].original * prod.discount * prod['amount'] + freight * 1.2` 的运算结果， `prod` 和 `freight` 为 `data` 对象中的属性：

```js
// 有表达式内容为：prod['price'].original * prod.discount * prod['amount'] + freight * 1.2
const data = {
  prod: {
    price: {
      original: 99,
      cost: 9.9
    },
    discount: 0.7,
    amount: 8
  },
  freight: 10
}
```

要解析这个表达式，就必须从 `data` 中获取到 `prod` 和 `freight` 的属性值，但又不仅仅是简单的在 `prod` 和 `freight` 前加个 `data.`，如果表达式更复杂一些（比如表达式中还出现了类似 `new Date()` 这样的内容），那么什么时候加 `data.` 什么时候又不加，就又不好判断了。

这时如果有这样一个函数：

```js
const fn = ({prod, freight}) => {
  return prod['price'].original * prod.discount * prod['amount'] + freight * 1.2
}
```

`fn` 函数需要一个对象参数，解构对象中的 `prod` 与 `freight` 属性以供函数体内部使用，那么当调用 `fn` 函数时，传递 `data` 对象作为实际参数即可返回表达式运算结果。

由于 `data` 对象的结构和表达式内容每次解析时都可能不一样，那么接下来要做的就是动态生成这样的函数了：

```js
const createFunction = (data, expression) => {
  // 获取 data 对象中所有属性名称，作为构建返回函数的参数部分
  // 类似 {prod, freight} 这样的结构
  const params = `{${Object.keys(data).join(', ')}}`
  // 返回函数的主体
  const fnBody = `return ${expression}`
  // 创建函数并返回
  return new Function(params, fnBody)
}
```

完整示例：

```js
// 有表达式内容为：prod['price'].original * prod.discount * prod['amount'] + freight * 1.2
const data = {
  prod: {
    price: {
      original: 99,
      cost: 9.9
    },
    discount: 0.7,
    amount: 8
  },
  freight: 10
}
// 创建函数
const createFunction = (data, expression) => {
  // 获取 data 对象中所有属性名称，作为构建返回函数的参数部分
  // 类似 {prod, freight} 这样的结构
  const params = `{${Object.keys(data).join(', ')}}`
  // 返回函数的主体
  const fnBody = `return ${expression}`
  // 创建函数并返回
  return new Function(params, fnBody)
}

const expression = `prod['price'].original * prod.discount * prod['amount'] + freight * 1.2`
const fn = createFunction(data, expression)
console.log('表达式运算结果：', fn(data))
```

运行结果：

```js
表达式运算结果： 566.4
```

本 MVVMV 库解析表达式主要是在 `Parser` 和 `Watcher` 中使用到，接下来更新它们：

**Watcher**

`Watcher` 中原本只处理了简单表达式，前边已经分析过，如果是复杂的表达式，不适合用字符串分割的方式来处理，可以提供一个函数来执行表达式的运算。构造函数重构如下：

```js
constructor(vm, expOrFn, callback) {
  this.vm = vm // ViewModel 对象，挂载有数据
  this.callback = callback // 绑定的视图更新函数
  this.depIds = {} // 保存已被哪些 Dep 收集过
  // expOrFn: expression or function，简单表达式，使用字符串传递即可
  // 如果是复杂表达式，则传递函数，来获取表达式运算结果值
  if (typeof expOrFn === 'function') { // 函数
    this.getter = expOrFn
  } else { // 字符串
    this.getter = parsePath(expOrFn) // 解析字符串，生成获取表达式值的函数
    if (!this.getter) {
      this.getter = noop // 空函数
    }
  }
  this.value = this.get() // 获取订阅数据的初始值
}
```

`parsePath(param)` 函数定义如下：

```js
const parsePath = expression => {
  // 如果字符串中包含字母、数字、_、$、.之外的符号，则不是简单表达式
  if (/[^\w.$]/.test(expression)) return

  const exps = expression.split('.')
  // 返回用于获取 obj 对象中 expression 表达式属性值的函数
  return obj => {
    for (let i = 0, l = exps.length; i < l; i++) {
      if (!obj) return
      obj = obj[exps[i]]
    }

    return obj
  }
}
```

将原 `Watcher` 类中 `get()` 方法删除，将 `getValue()` 方法修改为 `get()` 方法：

```js
/**
 * 获取订阅数据当前值，每次需要收集订阅者
 */
get() {
  Dep.target = this
  const value = this.getter.call(this.vm, this.vm)
  Dep.target = null
  return value
}
```

**Parser**

指令处理时，视图初始化显示需要解析表达式，创建 `Watcher` 对象（绑定 `Watcher` 订阅者的视图更新函数）时需要判断表达式是简单还是复杂表达式以传递不同类型参数，修改如下：

```js
// 如果是复杂表达式，需要创建获取表达式值的函数
// 将表达式的计算结果值与生成的函数返回
genValueAndExpOrFn(vm, expression) {
  const getter = parsePath(expression)
  let expOrFn, value
  if (typeof getter === 'function') { // 以 '.' 分割字符串，简单表达式
    expOrFn = expression
    value = getter.call(vm, vm)
  } else { // 复杂表达式
    expOrFn = createFunction(vm, expression)
    value = expOrFn.call(vm, vm)
  }
  return {
    value,
    expOrFn
  }
},
// 分派普通指令
dispatch(node, vm, directive, expression) {
	......
  const { value, expOrFn } = this.genValueAndExpOrFn(vm, expression)
  fn && fn(node, value)
  new Watcher(vm, expOrFn, value => {
    fn && fn(node, value)
  })
	......
},
// 处理插值表达式
processMustache(node, original, vm, expression, index) {
  const { value, expOrFn } = this.genValueAndExpOrFn(vm, expression)
  ......
  new Watcher(vm, expOrFn, (value, oldValue) => {
    mustaches[index] = typeof value === 'undefined' ? '' : value
    this.handleMustachText(node, original)
  })
}
```

**ViewModel**

在表达式中还可能会调用到 `ViewModel` 选项中的方法来实现功能，如表达式内容为：`'reverseMsg()'`，在方法中又可能会调用到 `data` 中的数据实现业务，所以将 `ViewModel` 选项中的方法注入 `ViewModel` 对象本身，并且修改每个方法体内 `this` 的指向：

```js
// 向对象中注入方法
const _injectMethod = (obj, method) => {
  Object.defineProperty(obj, method, {
    value: (...args) => {
      const fn = obj.$options.methods[method]
      if (typeof fn === 'function') {
        return fn.apply(obj, args)
      }
    },
    writable: false,
    enumerable: true,
    configurable: false
  })
}

class ViewModel {
  constructor(options) {
    ......
    Object.keys(methods).forEach(method => {
      _injectMethod(this, method)
    })
    ......
  }
}
```

**效果测试**

{% raw %}
```html
<div id="root">
  <div>
    第一件商品
    <br>
    编号: {{ cart[0].id }},
    标题: {{ cart[0].title }},
    原价: {{ (cart[0].price.original).toFixed(2) }},
    折扣: {{ cart[0].discount }}
    <br>
    购物车商品总价格: {{ calcPayment().toFixed(2) }}
  </div>
</div>
<script>
  new ViewModel({
    el: '#root',
    data: {
      cart: [
        {
          id: 1,
          title: 'prod-1',
          price: {
            original: 99,
            cost: 9.9
          },
          discount: 0.8,
          amount: 1
        },
        {
          id: 2,
          title: 'prod-2',
          price: {
            original: 9.9,
            cost: 6.5
          },
          discount: 1,
          amount: 10
        }
      ]
    },
    methods: {
      calcPayment() {
        return this.cart.reduce((sum, prod) => (
          sum += prod.price.original * prod.discount * prod.amount
        ), 0)
      }
    }
  })
</script>
```
{% endraw %}

运行效果：

![复杂表达式测试效果](/assets/images/2020-03-14/expression.png)

## 总结

通过自定义 MVVM 库，不说完全明白 Vue 的所有设计思想，但对于如何利用数据劫持达到响应式更新视图的原理还是有了比较深刻的认识，同时对自身的原生 JavaScript 能力也是一次锻炼。其实网络上有非常多写得很好的关于 MVVM 原理及实现的文章，但可能真正的自己再重复"造轮子"之后理解会更深刻吧。

当然除了使用 `Object.defineProperty()` 的方式来劫持数据外，也可考虑使用 `Proxy` ，留作下一个专题研究吧。