---
title: 解构赋值
category: javascript
tags: [javascript, ES6]
key: javascript_destructuring_assignment
---

## 1. 简述

解构赋值（destructuring assignment）语法是一个 JavaScript 表达式，它使得从数组或者对象中提取数据赋值给不同的变量成为可能。

对象字面量和数组字面量提供了一种简单的定义一个特定的数据组的方法。一旦你创建了这类数据组，你可以用任意的方法使用这些数据组，甚至从函数中返回它们。

以前，要给变量赋值，只能直接使用赋值运算符指定，如：

```javascript
var name = "张三";
```

但在 ES6 中，我们可以使用解构赋值来为变量赋值。解构赋值的一个特别有用的功能是：你可以用一个表达式读取整个结构。

## 2. 解构数组

语法：

```javascript
var [a, b, ...rest] = [value1, value2, ... valueN]
```

### 2.1 简单例子：

```html
<script type="text/javascript">
	var foo = ["one", "two", "three"];

	// 没有解构赋值
	var one = foo[0];
	var two = foo[1];
	var three = foo[2];

	// 解构赋值
	var [one, two, three] = foo;
</script>
```

解构赋值后，可单独使用各变量 one、two、three。

### 2.2 交换变量

没有解构赋值的情况下，交换两个变量通常使用一个临时变量来进行，使用解构赋值后变得简单了：

```html
<script type="text/javascript">
	var i = 10, j = 8;
	[i, j] = [j, i];
	console.log("i = " + i + "; j = " + j);
</script>
```

### 2.3 返回多值

函数中返回多值可以使用数组或对象，但有了解构赋值后，使用数组返回多值变得更加灵活：

```html
<script type="text/javascript">
	function calc ( width, height) {
		var area = width * height;
		var circu = 2 * (width + height);
		return [area, circu];
	}

	var [a, c] = calc(3, 4);
	console.log("面积：" + a + ", 周长：" + c);
</script>
```

当然，如果函数调用如：

```javascript
var a = calc(3, 4);
```

在变量 a 中仍然存放的是一个数组内容。

### 2.4 忽略某些值

可能会对某些值不感兴趣，这时可以选择忽略：

```html
<script type="text/javascript">
	function f() {
		return [1, 2, 3];
	}

	var [a, , b] = f();
	console.log("A is " + a + " B is " + b);
</script>
```

运行这段代码后，a是1、b是3。2这个值被忽略了，你可以忽略任意（或全部）返回值。例如：

```javascript
[,,] = f();
```

### 2.5 用正则匹配提取值

用正则表达式方法 exec() 匹配字符串会返回一个数组，该数组第一个值是完全匹配正则表达式的字符串，然后的值是匹配正则表达式括号内内容部分。解构赋值允许你轻易地提取出需要的部分，忽略完全匹配的字符串——如果不需要的话。

```html
<script type="text/javascript">
	var url = "https://developer.mozilla.org/en-US/Web/JavaScript";

	var parsedURL = /^(\w+)\:\/\/([^\/]+)\/(.*)$/.exec(url);
	var [, protocol, fullhost, fullpath] = parsedURL;

	console.log(protocol); // 输出"https:"
</script>
```

### 2.6 默认值

解构赋值允许指定默认值。

```html
<script type="text/javascript">
	var [i = 8] = []; // i = 8
	var [x, y='b'] = ['a']; // x='a', y='b'
	var [x, y='b'] = ['a', undefined]; // x='a', y='b'
</script>
```

### 2.7 解构赋值不成功的情况

如果解构赋值不成功，变量的值就等于 undefined。

```javascript
var [foo] = [];
var [foo] = 1;
var [foo] = 'Hello';
var [foo] = false;
var [foo] = NaN;
var [bar, foo] = [1];
```

以上几种情况都属于解构赋值不成功，foo 的值都会等于 undefined。

如果对 undefined 或 null 进行解构赋值，会报错。

```javascript
// 报错
var [foo] = undefined;
var [foo] = null;
```

因为解构只能用于数组或对象。其他原始类型的值都可以转为相应的对象，但是，undefined 和 null 不能转为对象，因此报错。

### 2.8 其它

解构赋值不仅适用于 var 命令，也适用于 let 和 const 命令。

```javascript
var [v1, v2, ..., vN ] = array;
let [v1, v2, ..., vN ] = array;
const [v1, v2, ..., vN ] = array;
```

对于 Set 结构，也可以使用数组的解构赋值：

```javascript
[a, b, c] = new Set(["a", "b", "c"]);
```

事实上，只要某种数据结构具有 Iterator 接口，都可以采用数组形式的结构赋值。

## 3. 解构对象

### 3.1 简单示例

```html
<script type="text/javascript">
	var o = {p: 42, q: true};
	var {p, q} = o;

	console.log(p); // 42
	console.log(q); // true 

	// 用新变量名赋值
	var {p: foo, q: bar} = o;

	console.log(foo); // 42
	console.log(bar); // true  
</script>
```

对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。如果变量名与属性名不一致，需要写成`var {p: foo, q: bar} = o;`这种结构。
	
### 3.2 解构嵌套对象和数组

```html
<script type="text/javascript">
	var metadata = {
		title: "Scratchpad",
		translations: [
		{
			locale: "de",
			localization_tags: [ ],
			last_edit: "2016-12-14T09:32:25",
			url: "/de/docs/Tools/Scratchpad",
			title: "JavaScript-Umgebung"
		}
		],
		url: "/en-US/docs/Tools/Scratchpad"
	};

	var { title: englishTitle, translations: [{ title: localeTitle }] } = metadata;

	console.log(englishTitle); // "Scratchpad"
	console.log(localeTitle);  // "JavaScript-Umgebung"
</script>
```

### 3.3 默认值

ES5 版本中函数默认值的设置如：

```html
<script type="text/javascript">
	function drawES5Chart(options) {
		options = options === undefined ? {} : options;
		var size = options.size === undefined ? 'big' : options.size;
		var cords = options.cords === undefined ? { x: 0, y: 0 } : options.cords;
		var radius = options.radius === undefined ? 25 : options.radius;
		console.log(size, cords, radius);
		// now finally do some chart drawing
	}

	drawES5Chart({
		cords: { x: 18, y: 30 },
		radius: 30
	});
</script>
```

ES6 中可以改写为：

```html
<script type="text/javascript">
	function drawES6Chart({size = 'big', cords = { x: 0, y: 0 }, radius = 25} = {}) {
		console.log(size, cords, radius);
		// do some chart drawing
	}

	drawES6Chart({
		cords: { x: 18, y: 30 },
		radius: 30
	});
</script>
```

### 3.4 从作为函数实参的对象中提取数据

```html
<script type="text/javascript">
	function userId({id}) {
		return id;
	}

	function whois({displayName: displayName, fullName: {firstName: name}}){
		console.log(displayName + " is " + name);
	}

	var user = { 
		id: 42, 
		displayName: "jdoe",
		fullName: { 
			firstName: "John",
			lastName: "Doe"
		}
	};

	console.log("userId: " + userId(user)); // "userId: 42"
	whois(user); // "jdoe is John"
</script>
```

这段代码的主要作用是从 user 对象中提取并输出 id、displayName 和 firstName。

### 3.5 对象属性计算名和解构

计算属性名，可以被解构。如：

```html
<script type="text/javascript">
	let key = "z";
	let { [key]: foo } = { z: "bar" };

	console.log(foo); // "bar"
</script>
```

### 3.6 For of 迭代和解构

```html
<script type="text/javascript">
	var people = [
		{
			name: "Mike Smith",
			family: {
				mother: "Jane Smith",
				father: "Harry Smith",
				sister: "Samantha Smith"
			},
			age: 35
		},
		{
			name: "Tom Jones",
			family: {
				mother: "Norah Jones",
				father: "Richard Jones",
				brother: "Howard Jones"
			},
			age: 25
		}
	];

	for (var {name: n, family: { father: f } } of people) {
		console.log("Name: " + n + ", Father: " + f);
	}

	// "Name: Mike Smith, Father: Harry Smith"
	// "Name: Tom Jones, Father: Richard Jones"
</script>
```

### 3.7 加载模块

解构赋值可以帮助加载一个模块的特定子集：

```javascript
const { Loader, main } = require('toolkit/loader');
```

### 3.8 其它

如果要将一个已经声明的变量用于解构赋值，必须非常小心。

```html
<script type="text/javascript">
	var x;
	{x} = {x:1};
</script>
```

这会报语法错误。原因是因为 JavaScript 引擎会将 `{x}` 理解成一个代码块，从而发生语法错误。只有不将大括号写在行首，避免 JavaScript 将其解释为代码块，才能解决这个问题。

```javascript
({x}) = {x:1};
// 或者
({x} = {x:1});
```

