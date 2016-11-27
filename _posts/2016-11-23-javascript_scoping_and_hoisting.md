---
layout: post
title: 【翻译】JavaScript Scoping and Hoisting
date: 2016-11-23
category: JavaScript
tags: [javascript, hoisting, scope]
---

> 原文地址：[http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html)

你知道下面这段 JavaScript 代码执行后会 alert 输出什么值吗？

	var foo = 1;
	function bar() {
		if (!foo) {
			var foo = 10;
		}
		alert(foo);
	}
	bar();

如果答案是 "10" 令你感到惊讶的话，那么下面这个会让你更加困惑：

	var a = 1;
	function b() {
		a = 10;
		return;
		function a() {}
	}
	b();
	alert(a);

这次浏览器会 alert "1"。那么，这到底是怎么了？尽管它看起来有点奇怪、危险和令人疑惑，但事实上这正是这门语言的一个强大的和具有表现力的特性。我不知道对这种具体行为是否是有一个标准的名称，但是我喜欢用 “hoisting” 一词来描述。本文将尝试去解释这一机制，但是首先让我们对 JavaScript 的作用域做一些必要的了解。

## Scoping in JavaScript （JavaScript 作用域）##

作用域是一个 JavaScript 初学者最困惑的部分之一。事实上，不仅仅是初学者，我遇到过很多有经验的 JavaScript 程序员也不能完全理解作用域。JavaScript 的作用域如此令人困惑的原因是它看上去像是一个 C 系列的语言。请思考下面这段 C 语言程序：

	#include <stdio.h>
	int main() {
		int x = 1;
		printf("%d, ", x); // 1
		if (1) {
			int x = 2;
			printf("%d, ", x); // 2
		}
		printf("%d\n", x); // 1
	}

这段程序的输出是 1, 2, 1，这是因为 C 语言和其它的 C 系列语言有**块级作用域**。当进入一个块时，例如 if 语句块，可以在这个作用域中声明新的变量，而不会影响到外部作用域。但 JavaScript 中却不是这样的，在 firebug 中测试下列代码：

	var x = 1;
	console.log(x); // 1
	if (true) {
		var x = 2;
		console.log(x); // 2
	}
	console.log(x); // 2

这种情况下，firebug 中将显示 1, 2, 2，这是因为 JavaScript 有**函数级作用域**，这是和 C 系列语言根本上的区别。块，比如 if 语句块，并**不会**开辟新的作用域，只有函数才会创建新的作用域。

对于许多使用 C、C++、C#、或 Java 的程序员来说，这是意料之外并且不受欢迎的。幸运的是，由于 JavaScript 函数的灵活性，对这个问题也有一个解决方案。如果你非得在函数中创建一个临时的作用域，可以这样做：

	function foo() {
		var x = 1;
		if (x) {
			(function () {
				var x = 2;
				// some other code
			}());
		}
		// x is still 1.
	}

这种方法实际上是相当灵活的，并且能够用在任何你需要使用临时作用域的地方，不仅仅是在块中。但是，我强烈建议你花点时间真正地理解和欣赏一下 JavaScript 的作用域。它非常强悍，也是这门语言中我最喜欢的特性之一。如果你理解了作用域，也将更容易理解 hoisting（提升）。

## Declarations, Names, and Hoisting (声明，名称和提升) ##

In JavaScript, a name enters a scope in one of four basic ways:

在 JavaScript 中，一个名称进入作用域可通过以下四种基本途径：

1. **语言定义：**所有的作用域都默认包含 this 和 arguments;
2. **形式参数：**函数可以有命名的形参，其作用域为函数主体；
3. **函数声明：**诸如 function foo(){} 这种形式；
4. **变量声明：**采取 var foo; 这种形式。

函数声明和变量声明总是被 JavaScript 解释器隐式提升(“hoisted”)到包含它们的作用域的顶部，明显的，函数参数和语言自身定义的名称已经在顶部了。这意味着以下这段代码：

	function foo() {
		bar();
		var x = 1;
	}

实际上可以这样来解释：

	function foo() {
		var x;
		bar();
		x = 1;
	}

事实证明，包含声明的行是否执行过并不重要。下面这两个函数是等价的：

	function foo() {
		if (false) {
			var x = 1;
		}
		return;
		var y = 1;
	}
	function foo() {
		var x, y;
		if (false) {
			x = 1;
		}
		return;
		y = 1;
	}

注意到的是声明的赋值部分没有被提升，仅只有名称被提升了。这和函数的声明不同，函数声明中整个的函数体也都会被提升。但请记住，通常有两种方式来声明函数，考虑下面的 JavaScript 代码：

	function test() {
		foo(); // TypeError "foo is not a function"
		bar(); // "this will run!"
		var foo = function () { // function expression assigned to local variable 'foo'
			alert("this won't run!");
		}
		function bar() { // function declaration, given the name 'bar'
			alert("this will run!");
		}
	}
	test();

这种情况下，只有函数声明的方式会携带函数体提升到顶部。变量名 “foo” 被提升了，但主体被留在了执行时才赋值。（译者注：函数声明的方式会连函数体一起提升，而函数表达式中只会提升名称。）

以上就是关于提升的基础，也没有它表面看起来那么复杂和困惑吧。当然，这是 JavaScript，在某些特殊情况下，也是有些复杂的。

## Name Resolution Order (名称解析顺序) ##

需要记住的最重要的特例就是名称解析顺序。记住名称进入作用域中有四种方式，我在上边列出来的顺序就是它们的解析顺序。通常，如果已经定义了一个名称，它决不会被拥有另外属性的同名名称覆盖，这意味着函数声明优先级高于变量声明。这并不是说这个名称的赋值无效，仅仅是声明的部分会被忽略而已。也有一些例外：

*	内置名称 arguments 行为有些古怪，它似乎是在形参之后，函数声明之前被声明的。这意味着名称为 arguments 的形参比内置的 arguments 具有更高的优先级，即使这个形参 arguments 为 undefined。这是一个坏特性，请不要使用 arguments 作为形参名称。
*	在任何地方试图使用 this 这个标识符都将导致 SyntaxError(语法错误)，这是一个好的特性。
*	如果形参列表中有重复的名称，最后一个拥有更高的优先级，即使为 undefined。

## Named Function Expressions (命名函数表达式) ##

你可以在函数表达式中给函数定义名称，语法上就像函数声明一样。但这并不会使它成为一个函数声明，并且这个名称也不会被引入到作用域中，并且函数体也不会被提升 (hoisted)。这里有一些代码来说明我的意思：

	foo(); // TypeError "foo is not a function"
	bar(); // valid (合法的)
	baz(); // TypeError "baz is not a function"
	spam(); // ReferenceError "spam is not defined"
	
	var foo = function () {}; // anonymous function expression ('foo' gets hoisted)
	function bar() {}; // function declaration ('bar' and the function body get hoisted)
	var baz = function spam() {}; // 命令函数表达式（仅 "baz" 被提升，'spam' 不会引用到作用域中）
	
	foo(); // valid
	bar(); // valid
	baz(); // valid
	spam(); // ReferenceError "spam is not defined" （引用错误）

## How to Code With This Knowledge (如何使用这方面的知识编码) ##

现在你理解了作用域与提升，在 JavaScript 编码中意味着什么呢？最重要的是在声明变量时总是使用 var 语句来声明。我强烈建议你在每个作用域中都在最顶端使用一个 var 语句。如果你强迫自己这样做，你将决不会被提升相关的问题困扰，然而，这么做会使的跟踪当前作用域实际声明了哪些变量变得更加困难。我建立使用 JSLint 的 onevar 选项来强制这样做，如果你遵循了所有的建议，你的代码看起来就会是这样子的：

	/*jslint onevar: true [...] */
	function foo(a, b, c) {
	    var x = 1,
	    	bar,
	    	baz = "something";
	}

(译者注：JSLint 是一个历史悠久的 JavaScript 静态代码分析工具。[http://www.jslint.com/](http://www.jslint.com/))

## What the Standard Says (标准中的说法) ##

我发现经常直接翻阅 [ECMAScript Standard (pdf)](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf) 来理解这些东西是如何运作的很有用。下面是关于变量声明和作用域的一段引用（在旧版本的 12.2.2 这一节）：

>If the variable statement occurs inside a FunctionDeclaration, the variables are defined with function-local scope in that function, as described in section 10.1.3. Otherwise, they are defined with global scope (that is, they are created as members of the global object, as described in section 10.1.3) using property attributes { DontDelete }. Variables are created when the execution scope is entered. A Block does not define a new execution scope. Only Program and FunctionDeclaration produce a new scope. Variables are initialised to undefined when created. A variable with an Initialiser is assigned the value of its AssignmentExpression when the VariableStatement is executed, not when the variable is created.

我希望这篇文章能够给 JavaScript 程序员解决最容易困惑的问题之一一些启发。我尽可能彻底的避免引入更多的困扰，如果我有任何的错误或有大的疏漏，请让我知道。（完）