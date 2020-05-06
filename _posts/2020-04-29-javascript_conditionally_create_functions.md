---
title: 有条件的创建函数
category: javascript
tags: [function, hoisting, scope]
key: javascript_conditionally_create_functions
---

## 缘起

本文始于同事在群里提出的一道技术问题：

```js
var a = 0
if (true) {
  a = 1
  function a() {}
  function b() {}
  var c = 3
  a = 21
  b = 2
  c = 4
}
console.log(a, b, c)
```

在 `Chrome` 浏览器中执行结果为：

```js
1 ƒ b() {} 4
```

即打印结果中，`a` 为 1，`b` 为函数 `f b() {}`，`c` 为 4。

![why](/assets/images/2020-04-29/why.jpg)

结合作用域和变量提升（[【翻译】JavaScript Scoping and Hoisting](/2016/11/javascript_scoping_and_hoisting/)）的分析，不是应该结果为 `a===21 b===2 c===4` 吗？

不行，换个浏览器试试，在 `Safari` 中的执行结果：

```js
21 – 2 – 4
```

WHAT???

两个浏览器执行结果居然不一致，`Safari` 中才是我预期的结果，这是为啥呢？

## 分析

查阅相关文档，原来在 `ECMAScript2015` 之前，由于不存在语法上的块级作用域，所以 `ECMAScript` 规范并未定义在块级作用域中声明函数，即函数只能在顶层作用域和函数作用域中声明，所以这样的写法应该是非法的：

```js
if (true) {
  function a() {}
}
```

然而大多数浏览器实际上是没有遵守这个规范的，而到了 `ECMAScript2015` 中，由于有了语法上块级作用域的存在，函数就可以在块级作用域中声明，但这样的函数定义行为就和以前的不兼容了，所以为了保证兼容性，在 [`ecma-262` 附录 `B.3.3`](https://www.ecma-international.org/ecma-262/10.0/index.html#sec-block-level-function-declarations-web-legacy-compatibility-semantics) 中说明了对这种形式的函数声明的支持是一个允许的扩展，大多数浏览器中对 `ECMAScript` 的实现都允许这样写，也允许在不同的浏览器中有自己的行为方式。

分析本文开始的代码片段，可以发现存在 `if` 语句块，不同浏览器中结果不同的分歧应该出现在 `if` 语句块内部的块级作用域中。

### 有条件的创建函数

引用 `MDN` 中关于 [函数声明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function) 的 `Conditionally created functions` 说明：

> Functions can be conditionally declared, that is, a function statement can be nested within an `if` statement, however the results are inconsistent across implementations and therefore this pattern should not be used in production code. For conditional function creation, use function expressions instead.

函数允许被有条件的声明，也就是说一个函数声明可以内嵌在 `if` 语句块中，但是，这种声明方式在不同的浏览器里可能导致的结果是不一致的。**因此，不应该在生产环境代码中使用这种声明方式，应该使用函数表达式来代替。**

看个简单示例：

```js
var hoisted = 'a' in this
console.log(`'a' name ${hoisted ? 'is' : 'is not'} hoisted. typeof a is ${typeof a}`)
if (true) {
  function a() {}
}
```

运行结果：

```js
// In Chrome
'a' name is hoisted. typeof a is undefined

// In Safari
'a' name is hoisted. typeof a is function
```

`Chrome` 浏览器与 `Safari` 浏览器的结果显示，名称 `a` 都提升到了顶层作用域中，但在 `Chrome` 中 `a` 类型为 `undefined`，而 `Safari` 中 `a` 的类型为 `function`，这应该是由于不同浏览器对 `ECMAScript` 实现的差异导致的。

将 `if` 的条件表达式修改为 `false` 再来看看：

```js
var hoisted = 'a' in this
console.log(`'a' name ${hoisted ? 'is' : 'is not'} hoisted. typeof a is ${typeof a}`)
if (false) {
  function a() {}
}
```

运行结果：

```js
// In Chrome
'a' name is hoisted. typeof a is undefined

// In Safari
'a' name is hoisted. typeof a is function
```

与条件表达式为 `true` 时结果一致，由此看来，条件表达式的结果并不会影响变量提升。对于 `Safari` 浏览器来说，不管条件表达式结果如何，`a` 都会提升为全局函数，那条件结构的存在就并无意义了。**因此，不应该在生产环境代码中使用这种声明方式，应该使用函数表达式来代替。**

要实现有条件的创建函数，即仅在条件满足的情况下才创建函数，应该使用函数表达式的方式来定义函数：

```js
var a
if (false) {
  a = function() {}
}
```

### 调试

下面我们来调试一下本文开始的代码片段：

```js
var a = 0
if (true) {
  a = 1
  function a() {}
  function b() {}
  var c = 3
  a = 21
  b = 2
  c = 4
}
console.log(a, b, c)
```

在上述代码的第1条语句行号前打上断点，然后单步执行，观察在单步执行过程中作用域中变量的变化过程。

#### Chrome 浏览器

刷新页面，代码在断点位置处暂停下来，准备执行断点所在行的语句，此时暂不向下执行，先观察作用域情况。

首先在顶层全局作用域中，我们观察到如下图所示变量：

![chrome_1](/assets/images/2020-04-29/chrome_1.png)

在全局作用域中，有三个自定义的变量 `a`、`b`、`c`，由于还未执行到赋值语句就已经能看到全局作用域中存在这三个变量名称，所以应该是变量提升到作用域顶部的原因。再看看变量 `b`，在 `if` 语句块内部首先是函数声明所定义出来的变量，而目前全局作用域中 `b` 的值为 `undefined`，说明仅提升了变量名称，并未提升函数主体，这一点和以前的函数声明提升有矛盾，应该是块级作用域中函数声明写法的锅（目前仅从表象上分析，未深入预编译过程的分析）。

单步执行：

```js
var a = 0
```

为全局变量 `a` 赋值为 `0`，略过截图。

单步执行：

```js
if (true) {
```

判断条件表达式为 true，进入 `if` 语句块中，暂停，观察作用域：

![chrome_2](/assets/images/2020-04-29/chrome_2.png)

此时在作用域中多出一个块级作用域，该块级作用域中有两个变量：`a` 和 `b`，二者均为函数结构，分析可知应该是 `if` 语句块中函数声明方式定义的 `a` 和 `b` 两个函数被提升到块级作用域的顶部导致的。此时全局作用域中 `a`、`b`、`c` 暂未受影响。

单步执行：

```js
a = 1
```

为变量 `a` 赋值，上一步中我们看到，在全局作用域和块级作用域中都存在同名变量 `a`，那么现在 `a = 1` 是如何赋值的呢？看下图：

![chrome_3](/assets/images/2020-04-29/chrome_3.png)

此时仅块级作用域中 `a` 的值改变，而全局作用域中 `a` 值未改变，说明块级作用域中的同名变量 `a` 隐藏了全局作用域中的变量 `a`。

单步执行：

```js
function a() {}
```

按理说由于函数声明提升，`function a() {}` 已被提升到块级作用域的顶部，这一步应该跳过才对，但在 `Chrome` 浏览器中，仍然执行了这一步（有些许"诡异"，有没有哪位亲研究过 `V8` 引擎的，还望不吝赐教）。那么这一步到底执行后有什么不同呢，看下图：

![chrome_4](/assets/images/2020-04-29/chrome_4.png)

全局作用域中变量 `a` 的值由 `0` 变为了 `1`，说明在执行这一步时，将块级作用域中 `a` 的值赋给了全局作用域的的变量 `a`，即可理解为 `window.a = a`。

单步执行：

```js
function b() {}
```

由上一步得出的结果来推断，这步执行应该是将块级作用域中 `b` 的值赋值给全局作用域中的 `b`：

![chrome_5](/assets/images/2020-04-29/chrome_5.png)

全局作用域中的变量 `b` 此时被赋值为函数，但它与块级作用域中的 `b` 函数是否是同一个函数呢，可监视 `window.b === b` 来查看：

![chrome_watch](/assets/images/2020-04-29/chrome_watch.png)

单步执行：

```js
var c = 3
```

由于显式使用 `var` 声明了变量 `c`，其已被提升到顶层全局作用域中，前边我们也看到，在块级作用域中并不存在变量 `c`，所以这一步赋值操作是为全局变量 `c` 赋值为 `3`：

![chrome_6](/assets/images/2020-04-29/chrome_6.png)

单步执行：

```js
a = 21
```

为块级作用域中变量 `a` 赋值为 `21`，截图略。

单步执行：

```js
b = 2
```

为块级作用域中变量 `b` 赋值为 `2`，截图略。

单步执行：

```js
c = 4
```

为全局作用域中变量 `c` 赋值为 `4`，截图略。

至此，`if` 语句块执行结束，块级作用域结束，释放块级作用域内变量引用：

![chrome_7](/assets/images/2020-04-29/chrome_7.png)

全局作用域中 `a`、`b`、`c` 三个变量值最终结果如上图所示，所以 `console.log(a, b, c)` 结果为：

![chrome_result](/assets/images/2020-04-29/chrome_result.png)

#### Safari 浏览器

下面来看 `Safari` 浏览器中的调试过程。

类似 `Chrome` 浏览器中的调试，在 `Safari` 中也采用单步执行并观察变量变化的过程来分析。

刷新页面，在第1条语句的断点处暂停，观察全局作用域：

![safari_1](/assets/images/2020-04-29/safari_1.png)

可以看到，由于变量提升，`a`、`b`、`c` 都提升到全局作用域的最顶部，并且 `a`、`b` 两个函数边同函数主体也都一并提升到了全局作用域顶部来。

单步执行：

```js
var a = 0
```

为全局变量 `a` 赋值为 `0`，截图略。

单步执行：

```js
if (true) {
```

判断条件为 `true`，则进入 `if` 语句块执行：

![safari_2](/assets/images/2020-04-29/safari_2.png)

不同于 `Chrome` 浏览器，`Safari` 中此时并未创建块级作用域，所以 `if` 语句块内部对变量的赋值及修改都是针对全局作用域中的变量进行的。

单步执行：

```js
a = 1
```

修改全局作用域中 `a` 的值为 `1`，截图略。

由于 `function a(){}` 与 `function b() {}` 已被提升到全局作用域顶部，所以这两步直接跳过。

单步执行：

```js
var c = 3
```

为全局变量 `c` 赋值为 `3`，截图略。

单步执行：

```js
a = 21
```

为全局变量 `a` 赋值为 `21`，截图略。

单步执行：

```js
b = 2
```

为全局变量 `b` 赋值为 `2`，截图略。

单步执行：

```js
c = 4
```

为全局变量 `c` 赋值为 `4`，截图略。

至此，`if` 语句块执行结束：

![safari_3](/assets/images/2020-04-29/safari_3.png)

全局作用域中 `a`、`b`、`c` 三个变量值最终结果如上图所示，所以 `console.log(a, b, c)` 结果为：

![safari_result](/assets/images/2020-04-29/safari_result.png)

## 小结

由于实际开发中较少用到有条件的创建函数，所以当出现类似代码时，可能正好踩到相应知识体系的坑中，庆幸的是官方也不推荐使用函数声明的方式来有条件的创建函数，如果在生产环境中确实需要**有条件的创建函数**，那么**使用函数表达式来代替函数声明的写法**。