---
layout: post
title: JavaScript 执行上下文
date: 2017-01-27
category: JavaScript
tags: [执行上下文]
---

## 1. 概要

在 JavaScript 执行过程中，可能经常遇到一些“奇怪”的行为，比如闭包为什么能将函数中局部变量的值一直保存在内存中以供在函数体外继续调用，不理解 JavaScript 为什么会这样工作。

很多时候，我们会认为 JavaScript 中有很多坑，那可能是我们对 JavaScript 的了解还不够深入，本文将对 JavaScript 中的执行上下文作简单的阐述，如有表达不准确之处还望指出，敬请谅解。

## 2. 执行上下文定义

每当控制到达 ECMAScript 可执行代码时，就会进入一个执行上下文。

执行上下文（Execution Context，简称 EC）是 ECMA-262 规范中用于代表和区分可执行代码的抽象概念。简单来说，执行上下文，就是代码的执行环境或是作用域。

标准中并没有从技术实现的角度来定义执行上下文的具体结构和类型，这是实现了标准的 ECMAScript 引擎所需要考虑的问题。

逻辑上来说，一系列活动的执行上下文组成了一个栈，全局上下文总是位于栈底，当前活动的执行上下文位于栈顶。当在不同的上下文之间进入和退出时，栈会被修改（压栈或弹栈）。

![函数代码](/images/posts/jsexecontext/ecstack.jpg)

## 3. 可执行代码类型

可执行代码类型和执行上下文的抽象概述相关，当提到代码类型时，在某些时候其实就是在说执行上下文。

例如，我们定义一个数组来描述执行上下文的栈结构：

	ECStack = [];
	
每当进入一个函数时（甚至该函数是被递归调用或是一个构造函数），都会产生一个压栈操作，内置的 eval 函数也不例外。

当代码在执行时，通常其执行环境被认为是以下之一：

*	全局代码 ---- 这个是默认的代码运行环境，一旦代码被载入，引擎最先进入的就是这个环境
* 	函数代码 ---- 当执行一个函数时，运行函数体中的代码
*  eval 代码 ---- 在内置函数 eval() 中运行的代码

**全局代码**

全局代码是不包含在任何函数中的代码，是在“程序”级别上被处理的：比如加载一个外部的 js 文件或内联的 js 代码。

在初始化的时候（程序开始），ECStack 如下所示：

	ECStack = [
		globalContext
	];

**函数代码**

一旦控制器进入函数代码，就会有新的元素会被压栈到 ECStack 中。需要注意的是，实体函数并不包含内部函数的代码。例如，执行下述代码：

	(function foo(i){
		if (i === 3) return;
		console.log(i);
		foo(++i);
	}(0));
	
之后，ECStack 被修改为：

	ECStack = [
		globalContext
		functionContext -- foo() i = 0
		functionContext -- foo() i = 1 递归调用
		functionContext -- foo() i = 2 递归调用
		functionContext -- foo() i = 3 递归调用
	];

每次函数返回，退出当前活动的执行上下文时，ECStack 就会被执行对应的退栈操作。待这些代码都执行完毕后，ECStack 栈中就只剩下一个执行上下文（globalContext），直到整个程序结束。

![函数代码](/images/posts/jsexecontext/es1.gif)

**eval 代码**

说到 eval 代码，就要提到一个调用上下文（calling context）的概念，比如，调用 eval() 函数时的上下文就是一个调用上下文，eval() 函数中执行的动作会影响到调用上下文。

示例：

	var x = 10;
	console.log("x = " + x); // 10
	eval("var x = 20;");
	(function(){
		eval("var x = 30;");
		console.log("x = " + x); // 30
	}());
	console.log("x = " + x); // 20
	
ECStack 变化如下：
	
	// 初始
	ECStack = [
		globalContext
	];
	
	// eval("var x = 20;"); 调用上下文是全局上下文，压栈
	ECStack.push(
		evalContext -- callingContext:globalContext
	);
	
	// eval() 调用结束，退出 eval 上下文，全局上下文中 x 被修改，退栈
	ECStack.pop();
	
	// (function(){}())，自执行函数被调用，压栈
	ECStack.push(
		functionContext
	);
	
	// eval("var x = 30;"); 调用上下文是函数上下文，压栈
	ECStack.push(
		evalContext -- callingContext:functionContext
	);
	
	// eval() 调用结束，退出 eval 上下文，函数上下文中定义 x，退栈
	ECStack.pop();
	
	// 自执行函数调用结束，退栈
	ECStack.pop();
	
旧版本的 SpiderMonkey 引擎中 eval() 可传第二个参数表示调用上下文，但这个参数不是标准的参数，所以 1.9.1（Firefox 3.5）以后版本中删除了该参数的使用。

正因为 eval 执行时会影响到其调用上下文，所以在非必要时尽量不要使用到 eval() 函数：

>  eval() is a dangerous function, which executes the code it's passed with the privileges of the caller. If you run eval() with a string that could be affected by a malicious party, you may end up running malicious code on the user's machine with the permissions of your webpage / extension. More importantly, third party code can see the scope in which eval() was invoked, which can lead to possible attacks in ways to which the similar Function is not susceptible.

## 4. 执行上下文创建过程

### 4.1 执行上下文详情

现在我们已经知道，每调用一次函数，一个新的执行上下文就会被创建，即函数每次执行时对应的执行上下文都是独一无二的，所以多次调用同一个函数会导致创建多个执行上下文。然而，在 JS 引擎中，这个执行上下文的创建却有 2 个阶段：

**1. 创建阶段**

发生在调用一个函数时，但在执行函数中任何代码之前：

*	创建作用域链
* 	创建变量、函数和参数
*  确定“this”的值

**2. 激活/代码执行阶段**

*	变量赋值，函数引用，解释/执行代码

可以将每个执行上下文看作是拥有 3 个属性的对象：

	executionContextObj = {
		'scopeChain': { /* variableObject + all parent execution context's variableObject */ },
		'variableObject': { /* function arguments / parameters, inner variable and function declarations */ },
		'this': {}
	}
	
### 4.2 激活/变量对象（Activation / Variable Object）

executionContextObj 对象是在函数被激活但实际函数被执行之前创建的，我们知道这是在执行上下文创建的第 1 个阶段--创建阶段。这时，解释器会扫描函数的参数、arguments、局部函数、局部变量以创建 executionContextObj 对象，扫描的结果成为 executionContextObj 对象的 variableObject 属性。

下面是关于解释器如何评估代码的描述：

1.	找到某些代码来调用函数
2.	在执行函数代码前，创建执行上下文
3. 进入创建阶段
	*	初始化作用域链
	* 	创建变量对象（variable object）
		-	创建 arguments 对象，检查上下文中的参数，初始化属性名与属性值
		-	扫描上下文中函数声明
			*	为找到的每一个函数，在 variableObject 对象中添加以精确的函数名命名的属性，属性值是指向该函数在内存中地址的一个引用
			* 	如果 variableObject 对象中函数名已存在，则引用值会被新值覆盖替换
		-	扫描上下文中变量声明
			*	为找到的每一个变量声明，在 variableObject 对象中创建一个变量名对应的属性，属性值初始化为 undefined
			* 	如果 variableObject 对象中变量名已存在，则不做任何事件继续向后扫描
	*	在上下文中确定“this”的值
4.	激活/代码执行阶段
	*	运行/解释函数，一行一行地执行函数中的代码，为变量赋值

### 4.3 示例

下面来看个示例及分析：

	function foo(i) {
		var a = 'hello';
		var b = function privateB() {

		};
		function c() {

		}
	}

	foo(22);
	
调用 `foo(22)` 时，创建阶段如下：

	fooExecutionContext = {
		scopeChain: { ... },
		variableObject: {
			arguments: {
				0: 22,
				length: 1
			},
			i: 22,
			c: pointer to function c()
			a: undefined,
			b: undefined
		},
		this: { ... }
	}
	
由此可见，在创建阶段，除了arguments、函数的声明、以及参数被赋予了具体的属性值外，其它的变量属性默认的都是 undefined。一旦创建阶段结束，接下来就进入代码执行阶段，这个阶段完成后，上述执行上下文对象如下:

	fooExecutionContext = {
		scopeChain: { ... },
		variableObject: {
			arguments: {
				0: 22,
				length: 1
			},
			i: 22,
			c: pointer to function c()
			a: 'hello',
			b: pointer to function privateB()
		},
		this: { ... }
	}
	
## 5. 再述 hoisting

我们可以在网上找到很多 JavaScript 中关于 hoisting 的定义说明：在函数中声明的变量以及函数，其作用域会提升到函数顶部。然而却没有解释说关于提升的详情，有了解释器如何创建活动对象的理论知识，我们就可以很轻易的分析出原因了。

我们再看下面的示例：

	​(function() {
		console.log(typeof foo); // function pointer
		console.log(typeof bar); // undefined

		var foo = 'hello',
			bar = function() {
				return 'world';
			};

		function foo() {
			return 'hello';
		}
	}());​
	
下面这些问题我们现在可以回答了：

**为什么我们能够在声明 foo 之前访问到它？**

根据创建阶段的流程，我们知道这个变量在代码执行阶段前就已经被创建了，因此当函数流开始执行时，foo 已经在活动对象中定义了。

**foo 被声明了两次，为什么显示的是 function 而不是 undefined 或 string？**

尽管 foo 被声明了两次，我们知道在创建阶段函数先于变量在活动对象中创建，如果在活动对象中已存在属性名，我们只需要跳过声明即可。

所以，`function foo()` 函数的引用先被添加到对象的属性上，当解释器到达 `var foo` 时，我们发现 foo 属性名已经存在，因此不再做任何操作就直接跳过了。

**为什么 bar 是 undefined？**

bar 是一个函数表达式，它实际上是一个变量，被赋予函数的值，我们知道在创建阶段，变量被添加到活动对象中，但其被初始化为 undefined，所以 bar 显示的值为 undefined。

## 6. 小结

希望本文的这些说明能够使大家对执行上下文有一定的认识，这些基本理论对于执行上下文相关的细节（诸如变量对象、作用域链等等）分析是非常必要的。

参考：

[What is the Execution Context & Stack in JavaScript?](http://davidshariff.com/blog/what-is-the-execution-context-in-javascript/)

[ECMA-262-3 in detail. Chapter 1. Execution Contexts.](http://dmitrysoshnikov.com/ecmascript/chapter-1-execution-contexts/)

[MDN eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)