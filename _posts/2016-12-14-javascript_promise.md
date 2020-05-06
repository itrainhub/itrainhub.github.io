---
title: JavaScript Promise 模式
category: javascript
tags: [javascript, Promise]
key: javascript_promise
---

## 1. 简介 ##

在介绍 Promise 对象之前，我们先来看一个例子：

```javascript
step1(function (value1) {
	step2(value1, function(value2) {
		step3(value2, function(value3) {
			step4(value3, function(value4) {
			// ...
			});
		});
	});
});
```

如果我们要执行的任务是一个异步任务，并且有多个步骤，后一个步骤的执行需要使用到前一个步骤的执行结果，那么就极有可能出现上述的情况，即多层嵌套回调函数的书写方式。

这种写法当然在一定程度上也会给我们造成困扰，因为嵌套层次太多，对于代码的阅读来说也变得更加困难。如果我们换成以下的调用方式，相信大家在阅读时会更轻松：

```javascript
(new Promise(step1))
  .then(step2)
  .then(step3)
  .then(step4);
```

上述这种写法就是 Promise 对象的写法。

Promise 对象是 CommonJS 工作组提出的一种规范，目的是为异步操作提供统一接口。

Promise 对象的使用和普通 JavaScript 对象的使用一致，只是 Promise 对象充当的是异步操作与回调函数之间的中介，它使得异步操作具备同步操作的接口，使得程序具备正常的同步运行的流程，回调函数不必再一层层嵌套。就像上述代码，采用 Promise 对象的方式书写后，程序流程变得非常清楚，十分易读。

Promises 原本只是社区提出的一个构想，一些外部函数库率先实现了这个功能。ECMAScript 6 将其写入语言标准，因此目前 JavaScript 语言原生支持 Promise 对象。

## 2. 基本用法 ##

ES6 原生提供了 Promise 对象。所谓 Promise 对象，就是代表了未来某个将要发生的事件（通常是一个异步操作）。它的好处在于，有了 Promise 对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise 对象还提供了一整套完整的接口，使得可以更加容易地控制异步操作。

ES6 的 Promise 对象是一个构造函数，用来生成 Promise 实例。下面是 Promise 对象的基本用法：

```javascript
var promise = new Promise(function(resolve, reject) {
	if (/* 异步操作成功 */){
		resolve(value);
	} else {
		reject(error);
	}
});

promise.then(function(value) {
	// success
}, function(value) {
	// failure
});
```

上面代码表示，Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 方法和 reject 方法。

Promise对象有三种状态：异步操作“未完成”（pending）、异步操作“已完成”（resolved，又称fulfilled）、异步操作“失败”（rejected）。

如果异步操作成功，则用 resolve 方法将 Promise 对象的状态变为“成功”（即从 pending 变为 resolved）；如果异步操作失败，则用 reject 方法将状态变为“失败”（即从 pending 变为 rejected）。

但是这种变化只能发生一次，一旦当前状态变为“成功”或“失败”，就意味着不再有新的状态变化了。

resolve 方法和 reject 方法调用时，都带有参数。它们的参数会被传递给回调函数。reject 方法的参数通常是 Error 对象的实例，而 resolve 方法的参数除了正常的值以外，还可能是另一个 Promise 实例。

promise 实例生成以后，可以用 then 方法分别指定 resolve 方法和 reject 方法的回调函数。

下面是一个使用 Promise 对象的简单例子：

```javascript
function timeout(ms) {
	return new Promise(function(resolve){
		setTimeout(resolve, ms);
	});
}

timeout(1000).then(function(){
	console.log('done');
});
```

timeout() 函数返回一个 Promise 对象，经过一段时间（1s）后调用 resolve 改变自身状态，从而可以继续触发 then() 方法绑定的回调函数。

## 3. ajax 封装

ajax 是最常使用到的异步操作，我们可以用通用作法来封装 ajax 函数：

```javascript
<script type="text/javascript">
	// 通用封装方法
	function getJSON(url, success, error) {
		var xhr = new XMLHttpRequest();
		xhr.open("get", url, true);
		xhr.send();
		xhr.onreadystatechange = function(){
			if (xhr.readyState === 4) {
				if(xhr.status === 200) {
					var data = JSON.parse(xhr.responseText);
					success && success(data);
				} else {
					error && error(xhr.statusText);
				}
			}
		}
	}

	getJSON("/search.php?category=1", function(data){
		console.log("result : " + data);
	}, function(reason){
		console.log("error : " + reason);
	});
</script>
```

当响应成功时，传递 success 函数，如果响应失败，则传递 error 函数，那么，如果在响应成功时有多个需要执行的函数时，又需要修改封装函数结构，非常不方便，我们可以将 ajax 操作使用 Promise 模式来封装，这样就能解决上述问题了：

```html
<script type="text/javascript">
	// 使用 Promise 模式封装 ajax 操作
	function getJSON(url) {
		var p = new Promise(function(resolve, reject){
			var xhr = new XMLHttpRequest();
			xhr.open("get", url, true);
			xhr.send();
			xhr.onreadystatechange = function(){
				if (xhr.readyState === 4) {
					if(xhr.status === 200) {
						var data = JSON.parse(xhr.responseText);
						resolve(data); // 正常响应得到数据，成功
					} else {
						reject(xhr.statusText); // 失败
					}
				}
			}
		});

		return p;
	}

	getJSON("/search.php?category=1").then(function(data){
		console.log("result : " + data);
	}, function(reason){
		console.log("error : " + reason);
	});
</script>
```

## 4. Promise.prototype.then()

then() 方法返回一个 Promise 对象的实例。它有两个参数，分别为 Promise 在 success 和 failure 情况下的回调函数。

语法：

```javascript
p.then(function(value) {
	// 满足
	}, function(reason) {
	// 拒绝
	});
```

由于 then 返回的是 Promise 实例，我们可以轻易的链式调用 then：

```javascript
getJSON("/search.php?category=1").then(function(data){
	console.log("result : " + data);
	return data;
}, function(reason){
	console.log("error : " + reason);
	return reason;
}).then(function(data){
	console.log("go on... result : " + data);
}, function(reason){
	console.log("go on... error : " + reason);
});
```

当然，如果前一个 then 回调函数返回的是 Promise 对象，则后一个 then 会等到该 Promise 对象有执行结果后再继续执行：

```javascript
getJSON("/search.php?category=1").then(function(data){
	console.log("result : " + data.url);
	return getJSON(data.url);
}).then(function(data){
	console.log("go on... result : " + data);
});
```

这样，原本应该嵌套的调用结构变成了链式调用的结构，使用同步的写法来达到了异步的操作。

## 5. Promise.prototype.resolve() 与 Promise.prototype.reject()

Promise.resolve(value) 方法返回一个以给定值解析后的 Promise 对象。但如果这个值是个 thenable（即带有 then 方法），返回的 promise 会“跟随”这个 thenable 的对象，采用它的最终状态（指resolved/rejected/pending/settled）；否则以该值为成功状态返回 promise 对象。

Promise.reject(reason) 方法返回一个用 reason 拒绝的 Promise 对象。

示例：

```javascript
Promise.resolve(getJSON("/search.php?category=1")).then(function(data){
	console.log("result : " + data);
});
```

如果 Promise.resolve() 参数是 thenable 对象，则返回的 promise “跟随” 返回的参数 thenable 对象，即传递的 Promise 对象参数原封不动的返回。否则：

```javascript
Promise.resolve("resolve data").then(function(data){
	console.log("result : " + data);
});
```

生成一个新 Promise 实例，状态为 fulfilled，所以回调函数立即执行。

静态函数 Promise.reject() 返回一个被拒绝的 Promise。使用是 Error 实例的 reason 对调试和选择性错误捕捉很有帮助：

```javascript
Promise.reject("Testing static reject").then(function(data) {
	// 未被调用
}, function(reason) {
	console.log(reason); // "测试静态拒绝"
});

Promise.reject(new Error("fail")).then(function(data) {
	// 未被调用
}, function(error) {
	console.log(error); // 堆栈跟踪
});
```
