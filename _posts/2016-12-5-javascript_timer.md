---
layout: post
title: JavaScript 定时器
date: 2016-12-5
category: JavaScript
tags: [JavaScript, 定时器]
---

## 1. 简介 ##

我们经常能够在页面中见到这样的效果：打开页面时，自动在页面中打开一张广告图片，广告显示一段时间后又自动关闭了。

要达到这样的效果，JavaScript 提供定时执行代码的功能，叫做定时器（timer），主要由 setTimeout() 和 setInterval() 这两个函数来完成。

## 2. setTimeout() ##

setTimeout() 函数用来指定某个函数或某段代码，在延迟指定的毫秒之后被执行。它返回一个整数，表示定时器的编号，以后可以用来取消这个定时器。

语法结构如下：

	var timeoutID = window.setTimeout(func[, delay, param1, param2, ...]);
	var timeoutID = window.setTimeout(code[, delay]);

从语法结构中来看，由于第一个参数问题，我们可以有两种调用方式，为 setTimeout() 传递函数参数，或是传递字符串的执行表达式。

func 表示的是在 delay 延迟时间之后要执行的一个函数；

code 允许我们使用一个字符串来替代函数，在 delay 延迟时间结束后执行这个字符串的的表达式内容。但这是不推荐的写法，因为在底层，对于这个字符串中表达式的执行，会调用到 eval() 函数来执行，[eval()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) 可能会导致安全性的问题。

delay 表示延迟时间，单位为毫秒。

param1, param2, ... 为调用 func 函数时该函数所需要的额外参数，当然在 IE9 以前的版本中有兼容性问题。

示例：

	function showTime() {
		console.log(new Date());
	}

	console.log("start...");
	setTimeout(showTime, 1000);
	console.log("end...");

执行结果：

	start...
	end...
	Mon Dec 05 2016 16:42:06 GMT+0800 (中国标准时间)

输出结果中最后才打印系统时间，是因为 setTimeout() 将其的显示推迟了 1 秒钟。但为什么不是在显示了时间之后再显示 `end...`的呢？推荐大家再次阅读 [JavaScript 运行机制之 Event Loop](/2016/12/javascript_event_loop/)。

注意调用 setTimeout() 时，第一个参数仅为函数名称，是通过函数名称引用到函数，再 1 秒后由浏览器帮我们去调用到这个函数的具体内容来执行，不需要加括号。但如果使用字符串表达式，则需要使用 `setTimeout("showTime()", 1000);` 这种方式来调用，当然不推荐这种写法。

## 3. setInterval() ##

setInterval() 与 setTimeout 类似，语法结构为：

	var intervalID = window.setInterval(func, delay[, param1, param2, ...]);
	var intervalID = window.setInterval(code, delay);

setInterval() 和 setTimeout 的不同之处在于，setInterval() 是每隔指定的 delay 延迟时间，都会去执行一次 func 函数或 code 表达式，是周期性的执行行为。而 setTimeout() 是指定时间后只执行一次。

示例：

	function showTime() {
		console.log(new Date());
	}

	console.log("start...");
	setInterval(showTime, 1000);
	console.log("end...");

执行结果：

	start...
	end...
	Mon Dec 05 2016 17:10:13 GMT+0800 (中国标准时间)
	Mon Dec 05 2016 17:10:14 GMT+0800 (中国标准时间)
	Mon Dec 05 2016 17:10:15 GMT+0800 (中国标准时间)
	Mon Dec 05 2016 17:10:16 GMT+0800 (中国标准时间)
	Mon Dec 05 2016 17:10:17 GMT+0800 (中国标准时间)
	..........

## 4. clearTimeout()、clearInterval() ##

上例中，每隔 1 秒就会显示一次时间，我们并不知道它什么时候会结束输出。如果我们要在输出 10 次时间后停止输出，那需要将定时器给关闭掉，这时，就需要使用到 clearTimeout()、clearInterval() 这样的函数。

clearTimeout() 对应是停止 setTimeout() 开启的定时器，setTimeout() 执行后会有一个整数数字的返回，可以把它看作是定时器的 id 标识，那么在关闭这个定时器时，就可以直接使用 `clearTimeout(id);` 来关闭指定 id 标识的定时器了。

示例1：

	var timer = null,
		num = 50;

	function showTime() {
		console.log(new Date());
	}

	console.log("start...");
	timer = setTimeout(showTime, 1000);
	if (num >= 10)
		clearTimeout(timer);
	console.log("end...");

执行结果中，时间就不再打印了，因为满足 `num >= 10` 条件后已经调用 `clearTimeout(timer);` 关闭了定时器。

示例2：

	var timer = null,
		count = 0;

	function showTime() {
		count++;
		console.log(new Date());
		if (count >= 5)
			clearInterval(timer);
	}

	console.log("start...");
	timer = setInterval(showTime, 1000);
	console.log("end...");

在打印完5次日期时间后，控制台上不再输出日期时间，因为在周期性执行 showTime() 函数过程中，每进入函数体一次，会统计一次打印的次数，当总打印次数大于等于5后 `clearInterval(timer);` 关闭定时器。

## 5. 利用 setTimeout() 实现 setInterval() 功能 ##

setTimeout() 是到指定时间后执行一次指定的函数，setInterval() 是周期性的执行指定的函数，那么我们也可利用递归调用的方式，来使用 setTimeout() 实现 setInterval() 功能。

示例：

	var count = 0;

	function showTime() {
		count++;
		console.log(new Date());
		if (count < 5)
			setTimeout(showTime, 1000);
	}

	console.log("start...");
	showTime();
	console.log("end...");

执行结果：

	start...
	Mon Dec 05 2016 17:29:28 GMT+0800 (中国标准时间)
	end...
	Mon Dec 05 2016 17:29:29 GMT+0800 (中国标准时间)
	Mon Dec 05 2016 17:29:30 GMT+0800 (中国标准时间)
	Mon Dec 05 2016 17:29:31 GMT+0800 (中国标准时间)
	Mon Dec 05 2016 17:29:32 GMT+0800 (中国标准时间)

在 showTime() 函数内部，当打印时间次数不足 5 次时，调用 setTimeout() 在延迟 1 秒后执行一次 showTime() 函数，这样就是在函数内部调用自身（即递归）的功能实现。