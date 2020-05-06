---
title: ES5 严格模式
category: javascript
tags: [javascript, ES5]
key: javascript_strict
---

## 1. 概述

严格模式，顾名思义，就是使 JavaScript 在更严格的条件下运行，这是在 ECMAScrpit 5 中提出的新标准。

设立严格模式主要的目的有以下几个：

*	消除 JavaScript 语法的一些不合理、不严谨之处，减少一些怪异行为；
*	消除代码运行的一些不安全之处，保证代码运行的安全；
*	提高编译器效率，增加运行速度；
*	为未来新版本的 JavaScript 做好铺垫。

严格模式体现了 JavaScript 更合理、更安全、更严谨的发展方向。目前，除了 IE6-9 外，其它浏览器均已支持 ES5 严格模式。

ES5 严格模式是限制性更强的 JavaScript 变体，它与常规 JavaScript 的语义不同，其分析更为严格。同样的代码，在正常模式下能够运行，但在严格模式下则可能不能运行。

## 2. 使用

严格模式的使用很简单，只有在代码首部加入字符串 "use strict" 即可。它有两种应用场景，一种是全局模式，一种是局部模式。

### 2.1 全局模式

将 "use strict" 放在脚本文件的第一行，则整个脚本都将以严格模式运行。如：

```html
<script type="text/javascript">
	"use strict";

	var global = 100;
	console.log("严格模式下，变量 global = " + global);
</script>
```

### 2.2 局部模式

将 "use strict" 放在函数内的第一行，使整个函数以严格模式运行。如：

```html
<script type="text/javascript">
	function test(){
		"use strict";
		var local = 60;
		console.log("严格模式下的变量：local = " + local);
	}

	test();
</script>
```

### 2.3 自执行函数模式

全局模式不利于代码文件合并，可能在全局模式下发生作用域污染等问题，所以我们可以采用匿名函数自执行的方式，将整个文件放在一个立即执行的匿名函数中。如：

```html
<script type="text/javascript">
	〜function{
		"use strict";
		var local = 60;
		console.log("严格模式下的变量：local = " + local);
	}();
</script>
```

### 2.4 注意

"use strict" 的位置是很讲究的，必须在首部。首部是指其前面没有任何有效 JavaScript 代码。

以下格式是无效格式，不会触发严格模式：

```javascript
var i = 10;
"use strict"
global = 15;
```

或
	
```javascript
function test(){
	var i = 10;
	"use strict"
	local = 15;
}
```

在 "use strict" 前存在有效 JavaScript 代码片段 `var i = 10;`。

```javascript
;"use strict"
global = 15;
```

或
	
```javascript
function test(){
	;
	"use strict"
	local = 15;
}
```

在 "use strict" 前存在分号（表示空语句的意思），不会触发严格模式的运行。

但在 "use strict" 前有注释内容是可以的，因为注释本身不是有效的 JavaScript 代码，仅起到解释说明作用。如：

```javascript
// 严格模式
"use strict"
global = 15;
```

这时在浏览器中执行会提示错误信息。

## 3. 执行限制

### 3.1 必须显式声明全局变量

正常模式中，如果一个变量没有声明就直接赋值，默认为全局变量，但在严格模式中不允许这种用法，即全局变量必须显式声明再赋值使用。

```html
<script type="text/javascript">
	"use strict";

	var array = [1,2,3,4,5];

	for (i = 0; i < array.length; i++){
		console.log(array[i]);
	}
</script>
```

使用 var 定义了一个数组，然后使用简单 for 循环来遍历迭代数组中每个元素，但循环变量 i 没有使用 var 定义，Safari 中运行结果提示：

```javascript
ReferenceError: Can't find variable: i
```

因此，**严格模式下变量都必须使用 var 声明后再使用。**

### 3.2 禁止使用 with

正常模式下，我们可以使用 with 将代码的作用域设置到一个特定的作用域中，如：

```html
<script type="text/javascript">
	with(console) {
		log("hello");
		time("id");
		for(var i = 0; i < 1000; i++){
			log(i);
		}
		timeEnd("id");
	}
</script>
```

使用 with 的目的是为了简化多次编写访问同一对象的工作，上例在 with 语句块中都访问到了 console 对象的方法，所以在调用如 console.log()、console.time() 方法时省略了 console 的书写。

在代码中加入严格模式使用后，Safari 中执行显示：

```javascript
SyntaxError: 'with' statements are not valid in strict mode.
```

### 3.3 创建 eval 作用域

正常模式下，JavaScript 有两种作用域：全局作用域与函数作用域，在严格模式下可创建第三种作用域：eval 作用域。

```html
<script type="text/javascript">
	var i = 10;
	eval("var i = 800;");
	console.log("i = " + i);
</script>
```

正常模式下，执行结果显示:

```javascript
i = 800
```

加上 "use strict" 后，再次执行，显示结果：

```javascript
i = 10
```

正常模式下，eval 处于全局作用域时，修改了全局变量 i 的值。严格模式下，eval 语句本身就是一个作用域，不再能够生成全局变量了，它所生成的变量只能用于 eval 内部，所以在 eval() 执行结束后再次打印 i 的值未发生修改。

### 3.4 禁止 this 指向全局对象

```html
<script type="text/javascript">
	window.name = "全局 window 对象的 name 属性";
	function test(){
		console.log(this.name);
	}
	test();
</script>
```

正常模式下，执行结果为：

```javascript
全局 window 对象的 name 属性
```

严格模式下：

```html
<script type="text/javascript">
	window.name = "全局 window 对象的 name 属性";
	function test(){
		"use strict"
		console.log(this);
		console.log(this.name);
	}
	test();
</script>
```

Safari 中执行结果：

```javascript
undefined
TypeError: undefined is not an object (evaluating 'this.name')
```

严格模式下，this 的值为 undefined，所以用它调用 name 属性就报错了。

当然，如果是构造函数，我们使用 new 调用构造函数，函数中的 this 仍指向所创建的对象。

### 3.5 禁止在函数内部遍历调用栈

在正常模式下，当一个叫 fun 的函数正在被调用的时候，fun.caller 是最后一个调用 fun 的函数，而且 fun.arguments 包含调用 fun 时用的形参。这两个扩展接口对于“安全” JavaScript 而言都是有问题的，因为他们允许“安全的”代码访问“专有”函数和他们的（通常是没有经过保护的）形参。如果 fun 在严格模式下，那么 fun.caller 和 fun.arguments 都是不可删除的属性，而且在存值、取值时都会报错：

```html
<script type="text/javascript">
	function fun(){
		"use strict"
		fun.caller;
		fun.arguments;
	}
	fun();
</script>
```

执行：

```javascript
TypeError: 'arguments', 'callee', and 'caller' cannot be accessed in strict mode.
```

### 3.6 禁止删除声明变量

严格模式下无法删除使用 var 声明的变量。如：

```html
<script type="text/javascript">
	"use strict"
	var i = 10;
	delete i;
</script>
```

执行报错：
	
```javascript
SyntaxError: Cannot delete unqualified property 'i' in strict mode.
```

只有 configurable 设置为 true 的对象属性，才能被删除。删除对象的属性：

```html
<script type="text/javascript">
	"use strict"
	var stu = Object.create(null, {
		name : {
			value : "小明",
			configurable : true
		},
		age : {
			value : 18,
			configurable : false
		}
	});

	delete stu.name;
	console.log(stu.name);
	delete stu.age;
	console.log(stu.age);
</script>
```

configurable 设置为 true 的 name 属性可以被删除，设置为 false 的 age 属性不能被删除，报 `TypeError: Unable to delete property.` 错误。

### 3.7 禁止八进制表示法

正常模式下，数字以 0 开头表示是八进制的数字，如 `010` 表示的是十进制数字 8，但在严格模式下会报错：

```html
<script type="text/javascript">
	"use strict"
	var i = 010;
	console.log(i);
</script>
```

报错为：

```javascript
SyntaxError: Decimal integer literals with a leading zero are forbidden in strict mode
```

### 3.8 arguments 限制

**arguments 不能通过程序语法被绑定(be bound)或赋值**。以下的所有尝试将引起语法错误：

```javascript
"use strict";
arguments++;
var obj = { set p(arguments) { } };
try { } catch (arguments) { }
function arguments() { }
var f = new Function("arguments", "'use strict'; return 17;");
```

**严格模式下，参数的值不会随 arguments 对象的值的改变而变化**。在正常模式下，对于第一个参数是 arg 的函数，对 arg 赋值时会同时赋值给 arguments[0]，反之亦然（除非没有参数，或者 arguments[0] 被删除）。严格模式下，函数的 arguments 对象会保存函数被调用时的原始参数。arguments[i] 的值不会随与之相应的参数的值的改变而变化，同名参数的值也不会随与之相应的 arguments[i] 的值的改变而变化。

```html
<script type="text/javascript">
	function f(a){
		"use strict";
		a = 42;
		return [a, arguments[0]];
	}
	var pair = f(17); // [42, 17]
	console.log(pair);
</script>
```

**不再支持 arguments.callee**。正常模式下，arguments.callee 指向当前正在执行的函数。这个作用很小：直接给执行函数命名就可以了！此外，arguments.callee 十分不利于优化，例如内联函数，因为 arguments.callee 会依赖对非内联函数的引用。在严格模式下，arguments.callee 是一个不可删除属性，而且赋值和读取时都会抛出异常：

```html
<script type="text/javascript">
	"use strict";
	var fn = function() {
		return arguments.callee;
	};
	fn();
</script>
```

### 3.9 显式报错

严格模式下，下列情形将显式报错：
	
尝试**对一个对象的只读属性进行赋值，报错**。

```html
<script type="text/javascript">
	"use strict"
	var obj = Object.create(null, {
		info : {
			value : "基本信息",
			writable : false
		}
	});

	delete obj.info;
</script>
```

尝试**对一个仅使用 getter 方法读取的属性进行赋值，报错**。

```html
<script type="text/javascript">
	"use strict"
	var obj = {
		get value() {return this.v;}
	};

	obj.value = "another";
</script>
```

**对阻止扩展的对象添加新属性，报错**。

```html
<script type="text/javascript">
	"use strict"
	var obj = {name:"小明"};
	Object.preventExtensions(obj);
	obj.age = 18;
</script>
```

**删除系统内置属性，报错**。

```html
<script type="text/javascript">
	"use strict"
	delete Array.prototype;
</script>
```

**密封/冻结的对象不可删除，否则报错**。

```html
<script type="text/javascript">
	"use strict"
	var obj = {
		name:"小明",
		age:18
	}

	Object.seal(obj); // 密封
	Object.freeze(obj); // 冻结
	delete obj.name;
</script>
```

**函数有重名参数，报错**，正常模式中，后出现参数覆盖先出现的参数。

```html
<script type="text/javascript">
	function test(a,b,a){
		"use strict"
		console.log(a);
	}
</script>
```

**对象有重名的属性，报错。但这个问题在 ES6 中已经不复存在了。**

```html
<script type="text/javascript">
	"use strict"
	var obj = {
		name: "小明",
		name: "xiaoming"
	};
</script>
```

### 3.10 为未来 ES 版本铺路

#### 3.10.1 保留字

在严格模式中一部分字符变成了保留的关键字。这些字符包括implements, interface, let, package, private, protected, public, static和yield。在严格模式下，你不能再用这些名字作为变量名或者形参名：

```html
<script type="text/javascript">
	function package(protected){ // !!!
		"use strict";
		var implements; // !!!

		interface: // !!!
		while (true)
		{
			break interface; // !!!
		}
	}

	function private() { } // !!!

	function fun(static) { 'use strict'; } // !!!
</script>
```

ES5 还保留了 class, enum, export, extends, import 和 super 关键字。

####  3.10.2 函数必须在顶层声明

**严格模式禁止了不在脚本或者函数层面上的函数声明**。在浏览器的普通代码中，在“所有地方”的函数声明都是合法的。这并不在 ES5 规范中（甚至是 ES3）！这是一种针对不同浏览器中不同语义的一种延伸。未来的 ECMAScript 版本很有希望制定一个新的，针对不在脚本或者函数层面进行函数声明的语法。在严格模式下禁止这样的函数声明对于将来ECMAScript版本的推出扫清了障碍：

```html
<script type="text/javascript">
	"use strict"
	if (true){
		function f() {console.log("hello");}
		f();
	}
</script>
```

这种禁止放到严格模式中并不是很合适，因为这样的函数声明方式从 ES5 中延伸出来的。但这是 ECMAScript 委员会推荐的做法，浏览器就实现了这一点。

## 4. 浏览器的严格模式

主流浏览器现在都实现了严格模式，但是不要盲目的依赖它，因为市场上仍然有大量的浏览器版本只部分支持严格模式或者根本就不支持（比如 IE10 之前的版本）。严格模式改变了语义。依赖这些改变可能会导致没有实现严格模式的浏览器中出现问题或者错误。谨慎地使用严格模式，通过检测相关代码的功能保证严格模式不出问题。最后，记得在支持或者不支持严格模式的浏览器中测试代码。如果只在不支持严格模式的浏览器中测试，那么在支持的浏览器中就很有可能出问题，反之亦然。

## 5. 小结

*	禁止使用保留字
* 	函数中的 this 为 undefined
*  原始方法中的 this 不会强制转换为对象
*  原始访问器中的 this 不会强制转换为对象
*  使用八进制导致语法错误
*  对不可解析的标识符赋值导致引用错误
*  为 eval 或 arguments 赋值导致语法错误
*  为只读属性赋值导致类型错误
*  绑定 eval 或 argumens 导致语法错误
*  arguments.caller 被移除或导致类型错误
*  arguments.callee 导致类型错误
*  (function(){}).caller 和 (function(){}).arguments 导致类型错误
*  arguments 未映射
*  eval() 创建 eval 作用域
*  删除绑定是导致语法错误
*  删除不可配置属性导致类型错误
*  使用 with 导致语法错误
*  重复的参数名导致语法错误
*  具有匹配名称和参数的函数表达式有效

> 参考
> 
> [http://kangax.github.io/compat-table/es5/](http://kangax.github.io/compat-table/es5/)
> 
> [https://developer.mozilla.org/en-US/docs/Web/JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)