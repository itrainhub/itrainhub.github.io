---
layout: post
title: JavaScript 闭包
date: 2016-12-26
category: JavaScript
tags: [JavaScript, 面向对象]
---

## 1. 概述

闭包（closures），在 MDN 解释为：

> Closures are functions that refer to independent (free) variables (variables that are used locally, but defined in an enclosing scope). In other words, these functions 'remember' the environment in which they were created.

闭包是指那些能够访问独立(自由)变量的函数 (变量在本地使用，但定义在一个封闭的作用域中)。换句话说，这些函数可以“记忆”它被创建时候的环境。

闭包是 JavaScript 语言的一个特色，当然也是它的一大难点，很多高级应用都要依靠闭包实现，或者我们平常编码过程中，也在有意无意间使用到闭包。

## 2. 作用域链

在理解闭包，首先就要理解 JavaScript 中的作用域链。

在 JavaScript 中有两种作用域：全局作用域和函数作用域（在 ES6 中引入了块级作用域）。

在函数中定义的变量只能在本函数体中使用到，在函数外部不能直接调用函数体内部定义的变量，但函数中可以调用到全局作用域中定义的变量。

如果函数中有内嵌函数的定义，则在内嵌函数中可以访问到外部函数中定义的变量，也可访问到全局作用域中的变量，但在外部函数中不能访问内嵌函数中定义的变量。这样，就形成了作用域链，即内嵌函数可调用父级或祖先级函数中定义的变量，但父级函数不能调用子级或后代函数中定义的变量。

	function outer(){
		var outVar = 10;
		function inner(){
			var inVar = 20;
			console.log("inner 中调用外部函数变量 outVar = " + outVar);
		}
		inner();
		console.log("outer 中调用内嵌函数变量 inVar = " + inVar);
	}
	outer();
	
执行结果：

	inner 中调用外部函数变量 outVar = 10
	ReferenceError: Can't find variable: inVar
	
在 JavaScript 中，变量的作用域是由它在源代码中所处位置决定的，并且嵌套的函数可以访问到其外层作用域中声明的变量。
	
## 3. 闭包

如果有这样一种需求，我们需要在外部使用到函数内的变量，但正常情况下，通过直接调用的方式是不能访问到的，这就需要变通的方法了。

	function outer() {
		var i = 1;
		var inner = function(){
			return ++i;
		}

		return inner;
	}

	var result = outer();

	console.log("第一次调用：" + result());
	console.log("第二次调用：" + result());
	console.log("第三次调用：" + result());
	
执行结果：

	第一次调用：2
	第二次调用：3
	第三次调用：4
	
上例中，我们要使用到 outer 函数内部的变量 i，每次打印是在原有数值基础上自增 1。因在函数外部不能直接通过变量名对其进行访问，而嵌套在内部的 inner 函数则能够访问到外部函数变量 i，所以返回了内部函数的引用 inner，这样，当 outer 函数调用结束后，放置在 result 中的实际为内嵌函数的引用，这样就可以继续使用到在 outer 函数内部定义的变量 i 了。这就是闭包。

以前常用到的定时器，相信大家写过类似的代码片段：

	function fn(){
		var i = 0;
		var timer = setInterval(function(){
			console.log(i++);
			if(i > 10)
				clearInterval(timer);
		}, 50);
	}

	fn();
	
fn 函数调用结束后，按理说在 fn 函数内部的局部变量 i、timer 作用域该结束了，但 setInterval()函数的异步执行过程中，仍然可以使用到这两个变量的值。这也是典型的闭包使用情况。

## 4. 一个故事

来解释闭包可以有哪些适用场景前，我喜欢下面这个例子解释。

很久很久以前：

有一位公主......

	function princess() {
	
她住在一个充满冒险的奇妙世界里，遇到了她的白马王子。白马王子带着她骑着独角兽开始周游世界，与巨龙战斗，巧遇会说话的动物，还有很多其他的不可思议的新奇事物。

	    var adventures = [];

	    function princeCharming() { /* ... */ }

	    var unicorn = { /* ... */ },
	    	dragons = [ /* ... */ ],
			squirrel = "Hello!";
			
但她不得不回到自己乏味的王国里，例行去见那些成年人。

		return {
		
她会经常给大人分享她最近作为公主时的充满奇幻的冒险经历。

			sayStory: function() {
				return adventures[adventures.length - 1];
			}
		};
	}
	
但在大人的眼里，公主仅仅只是一个小女孩儿......

	var littleGirl = princess();
	
......在讲着一些神奇的、充满幻想的故事。

	littleGirl.sayStory();
	
即便所有大人都知道他们眼前的小女孩是真的公主，但是他们绝不相信有巨龙或独角兽，因为他们自己从来没有见到过。大人们说它们只存在于小女孩的想象之中。

但是我们却知道小女孩述说的是事实......

## 5. 闭包适用场景

通常闭包有如下两种适用场景：

*	在内存中维持变量，如缓存数据
* 	保护函数体内变量的安全，如为对象设置私有属性

### 5.1 缓存数据

一个比较常用到的例子就是，利用循环为元素绑定事件。

让每个 div 元素被点击时，都能正确弹出当前被点击的 div 的索引：

	<div> div-1 </div>
	<div> div-2 </div>
	<div> div-3 </div>
	<div> div-4 </div>
	<div> div-5 </div>
	
如果使用如下写法：

	<script>
		function handle(){
			var divs = document.getElementsByTagName("div");
			for (var i = 0, len = divs.length; i < len; i++){
				divs[i].onclick = function(){
					alert("你点击的 div 索引为：" + i);
				}
			}
		}

		handle();
	</script>	
这时，在每个 div 上点击时弹出的结果都是`你点击的 div 索引为：5`。这是因为事件处理是异步的，但事件绑定是同步的，会先执行完循环体的 5 次操作，为每个 div 绑定上 onclick 事件。

这个过程中，变量 i 的值一直在递增变化，当所有 div 元素都被遍历后，i 的值自增到 5 退出循环结构。函数 handle 调用结束后，由于在事件响应程序中仍然存在变量 i 的引用，如果释放变量 i 的资源，会导致事件响应程序执行错误，所以为了保证事件响应程序中仍然能正确使用到变量 i，会将变量 i 的值一直保留在内存中，但保留的 i 的值为 5。

如果要正确输出索引值，可使用闭包修改如下：

	<script>
		function handle(){
			var divs = document.getElementsByTagName("div");
			for (var i = 0, len = divs.length; i < len; i++){
				divs[i].onclick = clk(i);
			}
		}

		function clk(index){
			return function(){
				alert("你点击的 div 索引为：" + index);
			}
		}

		handle();
	</script>
	
在为每个 div 绑定事件时，调用 clk() 函数将与 div 关联的变量值 i 传递到 clk() 函数内部使用，因为内部返回了一个内嵌函数的引用，该内嵌函数功能的实现依赖于外部函数中的局部变量 index，所以 index 变量的值会在内存中得以缓存。

由于每个 div 绑定事件时，都调用了 clk() 函数来实现事件绑定操作，所以与之对应的变量索引 i 的数值也都在内存中得以缓存，只是这个值不是以 i 的名称来缓存。当我们再次测试时，就可以正确打印出所点击 div 的索引了。

当然以上功能的实现也可以通过自定义属性方式实现：

	<script>
		function handle(){
			var divs = document.getElementsByTagName("div");
			for (var i = 0, len = divs.length; i < len; i++){
				divs[i].index = i;
				divs[i].onclick = function(){
					alert("你点击的 div 索引为：" + this.index);
				};
			}
		}

		handle();
	</script>
	
或是通过 let 命令来实现：

	<script>
		function handle(){
			var divs = document.getElementsByTagName("div");
			for (let i = 0, len = divs.length; i < len; i++){
				divs[i].onclick = function(){
					alert("你点击的 div 索引为：" + i);
				};
			}
		}

		handle();
	</script>
	
### 5.2 为对象设置私有属性

如果有一个对象，拥有年龄这样一个属性，我们要限定年龄的取值范围在 18~25 岁之间，以类似 Java 面向对象的方式来实现，可模拟如下：

	<script>
		function Student(){
			var age = 18;

			this.getAge = function(){
				return age;
			}

			this.setAge = function(value) {
				if (value < 18 || value > 25)
					throw new RangeError("age must between 18 and 25");
				age = value;
			}
		}

		var stu = new Student();
		console.log(stu.getAge()); // 18
		stu.setAge(36); // 报错：RangeError
	</script>

age 表示学生的年龄，这样的一个变量如果对于任何人都可以修改值，那么如果给定一个负值，比如 -35，虽然就语法上来说没问题，但就实际逻辑来说，一个人不可能年龄为 -35 岁，所以为了保障这种数据的安全，可以使用闭包来解决。

对 Student 函数内部的局部变量 age 来说，本应该在 Student() 函数通过 new 调用结束后就释放掉资源，但在对象的 getAge/setAge 方法中仍然有对其的引用，释放资源会导致 getAge/setAge 功能不能正常完成，所以其值会保存在内存中。但要修改 age 年龄值时，由于它的作用域问题，我们没法在 Student 函数外直接通过调用 age 的方式来修改，仅能使用提供的 setAge 方法接口修改 age 值，这就保证了对 age 修改赋值的安全性。

## 6. 一点误解

以前在查阅资料时，经常见到说不要轻易使用闭包，否则容易造成内存泄漏的说法。

直到看到这篇文章：[《js闭包测试》](http://www.cnblogs.com/rubylouvre/p/3345294.html)

闭包里面的变量是我们需要使用到的变量（lives），而内存泄漏通常是指访问不到的变量依然占据内存空间，不能够对其占据的空间再次利用。显然闭包是不属于访问不到的内存空间。

之所以有这样的说法，大概是因为 IE，特别是 IE6 的 bug 吧。当然这是 IE 浏览器的问题，不是闭包的问题。

现代浏览器在 JavaScript 引擎中大都优化处理了闭包情形下的垃圾回收，所以关于内存泄漏的说法，我们大可不必再理会了。