---
layout: post
title: let 与 const 命令
date: 2016-12-17
category: JavaScript
tags: [JavaScript, ES6]
---

## 1. 块级作用域

在 ES6 之前，作用域有两种：全局作用域和函数作用域。正是因为这两种作用域，JavaScript 中出现了 “变量提升（hoisting）” 这一概念。如：

	<script type="text/javascript">
		function test(){
			console.log(i);
			var i = 5;
		}

		test();
	</script>
	
执行结果显示：`undefined` 。之所以为 undefined 是因为变量提升的关系：进入函数执行前，先将所有 var 声明的变量名称提升到顶部，即相当于先声明了变量，然后再执行向控制台输出的操作，由于仅只提升了变量的声明名称部分，赋值部分仍放到向控制台输出后才执行，所以控制台上显示 `undefined`。

ES6 的出现为我们提供了“块级作用域”，类似于 C、JAVA 中的块级作用域。以前如果要在 JavaScript 中使用块级作用域， 通常是通过 IIFE（Immediately Invoked Function Expression）立即执行的匿名函数来实现的，有了块级作用域后，IIFE 就不再是必要的了。

	<script type="text/javascript">
		// IIFE写法
		(function () {
			var tmp = 25;
			// ...
		}());

		// 块级作用域写法
		{
			let tmp = 25;
			// ...
		}
	</script>
	
ES6 也规定，函数本身的作用域，在其所在的块级作用域之内。

示例：

	<script type="text/javascript">
		function fn(){
			console.log("outer...");
		}

		(function(){
			if (false){
				function fn(){
					console.log("inner...");
				}
			}

			fn();
		})();
	</script>
	
在 ES5 中，上述代码会得到 `inner...` 的打印结果，但在 ES6 中，Safari 执行报错：`TypeError: fn is not a function. (In 'fn()', 'fn' is undefined)` fn 未定义，不是函数。这是因为 ES5 中声明提升的存在，不管是否进入 if 语句块，函数都会提升到顶部，而在 ES6 中支持的是块级作用域，未进入 if 语句块执行，所以函数声明不会执行。

## 2. let

ES6 新增了 let 命令，用来声明变量。它的用法类似于 var，但是所声明的变量，只在 let 命令所在的代码块内有效。

语法：

	let var1 [= value1] [, var2 [= value2]] [, ..., varN [= valueN]];
	
示例：

	<script type="text/javascript">
		var array = [1, 2, 3, 4, 5];
		for (let i = 0; i < array.length; i++){
			console.log(array[i]);
		}
		console.log("循环结束后，i = " + i); // ReferenceError: Can't find variable: i
	</script>
	
上面的代码中，for 循环中使用 let 定义了变量 i，在 for 循环代码块内使用 i 可以正常获得值，但在循环结束后再打印 i 值时，则提示引用错误：不能查找变量 i。这表明，let 声明的变量只在它所在的代码块中有效。

阅读如下代码：

	<script type="text/javascript">
		var arr = [];

		for (var i = 0; i < 5; i++){
			var j = i;
			arr[i] = function(){
				console.log(j);
			}
		}

		for(i = 0; i < 5; i++){
			arr[i]();
		}
	</script>
	
结果显示 5 次打印的数字都为：4。因为使用 var 定义变量 j，其作用域是全局的，所以最后打印出来的值都是 4。

将代码修改如下：

	<script type="text/javascript">
		var arr = [];

		for (var i = 0; i < 5; i++){
			let j = i;
			arr[i] = function(){
				console.log(j);
			}
		}

		for(i = 0; i < 5; i++){
			arr[i]();
		}
	</script>
	
打印结果：

	0
	1
	2
	3
	4
	
因为使用 let 定义变量 j，其作用域是块级的，相当于对每个数组元素都有自己独立的一个变量 j 值使用，所以最终打印结果显示连续变化的数字。

阅读下面的代码：

	<script type="text/javascript">
		function test(){
			console.log(i);
			let i = 5;
		}

		test();
	</script>
	
执行结果报错：`ReferenceError: Cannot access uninitialized variable.` 不能访问未初始化的变量。可见，let 并没有像 var 一样出现变量声明提升的现象，在声明变量前就使用会导致引用错误。

但是说 let 没有变量提升的特性，也不太对，再看下面的代码：

	<script type="text/javascript">
		var i = 100;

		function test(){
			console.log(i);
			let i = 5;
		}

		test();
	</script>
	
Safari 中执行结果显示：`ReferenceError: Cannot access uninitialized variable.` 仍然是不能访问变量 i 的值。

如果 let 声明的变量没有提升，那么调用 test 函数应该输出全局变量 i 的值才对，但它却报错了，说明其实是作了提升的，只是规定了它不能在声明前使用而已。我们把这种特性称为“暂时性死区”，这一特性，仅针对遵循“块级作用域”的命令（let、const）有效。

当然，let 也不允许在同一作用域下声明重复的变量：

	<script type="text/javascript">
		function test(){
			let i = 5;
			console.log(i);

			let i = 39;
			console.log(i);
		}

		test();
	</script>

执行报错：`SyntaxError: Cannot declare a let variable twice: 'i'.`

## 3. const

const 声明创建一个只读的常量。

语法：

	const name1 = value1 [, name2 = value2 [, ... [, nameN = valueN]]];
	
这个声明创建一个常量，可以在全局作用域或者函数内声明常量，常量需要被初始化。这就是说，在定义常量的同时必须初始化(这是有意义的，鉴于变量的值在初始化后就不能改变)。

	<script type="text/javascript">
		// 定义常量并赋值
		const PI = 3.14;

		// 为常量重新赋值，报错
		PI = 3.14159;

		// 尝试重新声明，报错
		const PI = 3.1415926;

		// 只声明，不赋值，报错，需要赋值初始化
		const E;

		// 声明对象常量
		const PERSON = {name:"张三"};
		// 修改对象属性，因对象属性并不在保护的范围内，下面这个修改会成功执行
		PERSON.name = "李四";
		// 常量的块级作用域
		{
			const PHONE = "13100998877";
		}
		console.log(PHONE);
	</script>
	
常量拥有块作用域，和使用 let 定义的变量十分相似。常量的值不能通过再赋值改变，也不能再次声明。

一个常量不能和它所在作用域内的其他变量或函数拥有相同的名称。
