---
layout: post
title: ES5 新特性
date: 2016-12-16
category: JavaScript
tags: [JavaScript, ES5]
---

ECMAScript 5.0 的标准于 2009 年 12 月推出，ECMAScript 5.1 的标准于 2011 年 6 月发布，并且成为 ISO 国际标准，现在已经被几乎所有的主流浏览器支持，本文将简单列举 ES5 的核心特性。

## 1. 对象/数组字面量扩展

### 1.1 支持 getter/setter 访问器

getter/setter 主要用于获取/设置属性值，可以对属性值进行预处理：

	<script type="text/javascript">
		var obj = {
			get age(){
				return this._age;
			},
			set age(_age) {
				this._age = parseInt(_age);
			}
		};

		obj.age = 18;
		console.log("obj.age = " + obj.age);
	</script>
	
### 1.2 对象/数组尾逗号

在对象最后一个属性或数组最后一个元素之后允许出现逗号。以前是需要将最后一个逗号去掉，如果有新增属性或元素，又得重新添加上，现在允许出现逗号，相当于是增强了 JavaScript 的容错能力。

	<script type="text/javascript">
		var stu = {
			name : "小明",
			age : 18,
		};
		var array = [1,2,3,4,];
		for (var attr in stu) {
			console.log(attr + " : " + stu[attr]);
		}
		console.log("数组长度：" + array.length);
	</script>
	
### 1.3 保留字、关键字可用作属性名

 ES5 中允许将保留字、关键字用作于对象的属性名：
 
 	<script type="text/javascript">
		var stu = {
			name : "小明",
			class : "三年级5班",
			do : "干活儿"
		};

		console.log(stu.class + "的" + stu.name + "在" + stu.do);
	</script>
	
## 2. Object

### 2.1 Object.create()

Object.create() 方法创建一个拥有指定原型和若干个指定属性的对象。

语法：

	Object.create(proto, [ propertiesObject ])
	
参数 proto 是一个对象，作为新创建对象的原型；propertiesObject 可选，表示一组属性与值，属性名称将是新创建的对象的属性名称，值是属性描述符。

注意：propertiesObject 不能是 undefined，另外只有该对象中自身拥有的可枚举的属性才有效，也就是说该对象的原型链上属性是无效的。如果 proto 参数不是 null 或一个对象值，则抛出一个 TypeError 异常。

	<script type="text/javascript">
		var o = Object.create(Object.prototype, {
			// foo 会成为所创建对象的数据属性
			foo: { writable:true, configurable:true, value: "hello" },
			// bar 会成为所创建对象的访问器属性
			bar: {
				configurable: false,
				get: function() { return 10 },
				set: function(value) { console.log("Setting `o.bar` to", value) }
			}
		});
	</script>
	
### 2.2 Object.defineProperty()

Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个已经存在的属性， 并返回这个对象。

语法：

	Object.defineProperty(obj, prop, descriptor)

参数 obj 表示需要定义属性的对象；prop 表示需定义或修改的属性的名字；descriptor 表示将被定义或修改的属性的描述符。

该方法允许精确添加或修改对象的属性。一般情况下，我们为对象添加属性是通过赋值来创建并显示在属性枚举中（for...in 或 Object.keys 方法），但这种方式添加的属性值可以被改变，也可以被删除。而使用 Object.defineProperty() 则允许改变这些额外细节的默认设置。

对象里目前存在的属性描述符有两种主要形式：数据描述符和存取描述符。数据描述符是一个拥有可写或不可写值的属性。存取描述符是由一对 getter-setter 函数功能来描述的属性。描述符必须是两种形式之一，不能同时是两者。

数据描述符和存取描述符均具有以下可选键值：

*	configurable：当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，也能够被删除。默认为 false。
* 	enumerable：当且仅当该属性的 enumerable 为 true 时，该属性才能够出现在对象的枚举属性中。默认为 false。

数据描述符同时具有以下可选键值：

*	value：该属性对应属性的值，可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
*	writable：当且仅当该属性的 writable 为 true 时，该属性才能被赋值运算符改变。默认为 false。

存取描述符同时具有以下可选键值：

*	get：一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。该方法返回值被用作属性值。默认为 undefined。
*	set：一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为 undefined。

示例：

	<script type="text/javascript">
		var o = {}; // 创建一个新对象

		Object.defineProperty(o, "a", {value : 37,
		                               writable : true,
		                               enumerable : true,
		                               configurable : true});
		// 对象o拥有了属性a，值为37

		var bValue;
		Object.defineProperty(o, "b", {get : function(){ return bValue; },
		                               set : function(newValue){ bValue = newValue; },
		                               enumerable : true,
		                               configurable : true});
		o.b = 38;
		// 对象o拥有了属性b，值为38
	</script>
	
### 2.3 Object.defineProperties()

Object.defineProperties() 方法在一个对象上添加或修改一个或者多个自有属性，并返回该对象。

语法：

	Object.defineProperties(obj, props)
	
参数 obj 表示将要被添加属性或修改属性的对象；props 表示将要为对象添加或修改的属性的具体配置。

	<script type="text/javascript">
		var obj = {};
		Object.defineProperties(obj, {
			"property1": {
				value: true,
				writable: true
			},
			"property2": {
				value: "Hello",
				writable: false
			}
		});
		console.log(obj.property2); // "Hello"
	</script>
	
### 2.4 Object.getPrototypeOf()

Object.getPrototypeOf() 方法返回指定对象的原型（也就是该对象内部属性[[Prototype]]的值）。

语法：

	Object.getPrototypeOf(object)
	
该方法等价于以前使用的 object.\_\_proto\_\_。

	<script type="text/javascript">
		var proto = {};
		var obj = Object.create(proto);
		console.log(Object.getPrototypeOf(obj) === proto); // true
		console.log(Object.getPrototypeOf(proto) === Object.prototype); // true
	</script>
	
### 2.5 Object.keys()

Object.keys() 方法会返回一个由给定对象的所有可枚举自身属性的属性名组成的数组，数组中属性名的排列顺序和使用for-in循环遍历该对象时返回的顺序一致 (顺序一致不包括数字属性)（两者的主要区别是 for-in 还会遍历出一个对象从其原型链上继承到的可枚举属性）。

语法：

	Object.keys(obj)
	
示例：

	<script type="text/javascript">
		var obj = {
			name : "lucy",
			age : 18,
			address : "chengdu"
		};
		var arr = ["lily", "lucy", "marry", "tommy"];
		console.log(Object.keys(obj)); // ["name", "age", "address"]
		console.log(Object.keys(arr)); // ["0", "1", "2", "3"]
	</script>
	
### 2.6 Object.seal()

Object.seal() 方法可以让一个对象密封，并返回被密封后的对象。密封对象是指那些不能添加新的属性，不能删除已有属性，以及不能修改已有属性的可枚举性、可配置性、可写性，但可能可以修改已有属性的值的对象。

语法：

	Object.seal(obj)
	
通常情况下，一个对象是可扩展的（可以添加新的属性）。密封一个对象会让这个对象变得不能添加新属性，且所有已有属性会变得不可配置。属性不可配置的效果就是属性变得不可删除，以及一个数据属性不能被重新定义成为访问器属性，或者反之，但属性的值仍然可以修改。尝试删除一个密封对象的属性或者将某个密封对象的属性从数据属性转换成访问器属性，结果会静默失败或抛出 TypeError 异常（严格模式）。

示例：

	<script type="text/javascript">
		var obj = {
			prop: function () {},
			foo: "bar"
		};

		// 普通对象可以添加新的属性,已有属性的值可以修改,可以删除
		obj.lumpy = "woof";
		obj.foo = "baz";
		delete obj.prop;
		// 密封对象
		Object.seal(obj);
		// 仍然可以修改密封对象上的属性的值.
		obj.foo = "quux";
		// 但不能把一个数据属性重定义成访问器属性，抛出 TypeError 异常
		Object.defineProperty(obj, "foo", { get: function() { return "g"; } }); 
		// 任何属性值以外的修改操作都会失败.
		obj.quaxxor = "the friendly duck"; // 静默失败,新属性没有成功添加
		delete obj.foo; // 静默失败,属性没有删除成功
	</script>
	
### 2.7 Object.freeze()

Object.freeze() 方法可以冻结一个对象，冻结指的是不能向这个对象添加新的属性，不能修改其已有属性的值，不能删除已有属性，以及不能修改该对象已有属性的可枚举性、可配置性、可写性。也就是说，这个对象永远是不可变的。该方法返回被冻结的对象。

语法：

	Object.freeze(obj)

冻结对象的所有自身属性都不可能以任何方式被修改。任何尝试修改该对象的操作都会失败，可能是静默失败，也可能会抛出异常（严格模式中）。

	<script type="text/javascript">
		var obj = {
			prop: function () {},
			foo: "bar"
		};

		// 普通对象可以添加新的属性,已有属性的值可以修改,可以删除
		obj.lumpy = "woof";
		obj.foo = "baz";
		delete obj.prop;
		// 冻结对象
		Object.freeze(obj);
		// 现在任何修改操作都会失败
		obj.foo = "quux"; // 静默失败
		obj.quaxxor = "the friendly duck"; // 静默失败,并没有成功添加上新的属性
	</script>
	
### 2.8 Object.preventExtensions()

Object.preventExtensions() 方法让一个对象变的不可扩展，也就是永远不能再添加新的属性。

语法：

	Object.preventExtensions(obj)
	
如果一个对象可以添加新的属性，则这个对象是可扩展的。preventExtensions 可以让这个对象变的不可扩展，也就是不能再有新的属性。需要注意的是不可扩展的对象的属性通常仍然可以被删除。尝试给一个不可扩展对象添加新属性的操作将会失败，可能是静默失败，也可能会抛出 TypeError 异常（严格模式）。

Object.preventExtensions() 只能阻止一个对象不能再添加新的自身属性，仍然可以为该对象的原型添加属性。

	<script type="text/javascript">
		var obj = {
			prop: function () {},
			foo: "bar"
		};

		// 普通对象可以添加新的属性
		obj.lumpy = "woof";
		// 阻止扩展
		Object.preventExtensions(obj);
		// 现在任何添加操作都会失败
		obj.quaxxor = "the friendly duck"; // 静默失败,并没有成功添加上新的属性
	</script>
	
### 2.9 Object.isSealed()、Object.isFrozen()、Object.isExtensible()

`Object.isSealed()` 方法判断一个对象是否是密封的（sealed）；`Object.isFrozen()` 方法判断一个对象是否被冻结（frozen）；`Object.isExtensible()` 方法判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）。

语法：

	Object.isSealed(obj)
	Object.isFrozen(obj)
	Object.isExtensible(obj)
	
示例：

	<script type="text/javascript">
		var empty = {};
		console.log(Object.isSealed(empty)); // false
		console.log(Object.isFrozen(empty)); // false
		console.log(Object.isExtensible(empty)); // true
		// 修改
		Object.seal(empty);
		Object.freeze(empty);
		Object.preventExtensions(empty);
		console.log(Object.isSealed(empty)); // true
		console.log(Object.isFrozen(empty)); // true
		console.log(Object.isExtensible(empty)); // false
	</script>
	
### 2.10 Object.getOwnPropertyDescriptor()

Object.getOwnPropertyDescriptor() 返回指定对象上一个自有属性对应的属性描述符。自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性。

语法：

	Object.getOwnPropertyDescriptor(obj, prop)
	
示例：

	<script type="text/javascript">
		var obj = {name : "小明"};
		console.log(Object.getOwnPropertyDescriptor(obj, "name"));
		// {value: "小明", writable: true, enumerable: true, configurable: true}
		console.log(Object.getOwnPropertyDescriptor(obj, "toString"));
		// undefined
	</script>

### 2.11 Object.getOwnPropertyNames()

Object.getOwnPropertyNames() 方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性）组成的数组。

语法：

	Object.getOwnPropertyNames(obj)
	
示例：

	<script type="text/javascript">
		var obj = Object.create(Object.prototype, {
			foo: { writable:true, configurable:true, value: "hello" },
			bar: {
				configurable: false,
				get: function() { return 10 },
				set: function(value) { console.log("Setting `o.bar` to", value) },
				enumerable: false
			},
			tool: {value: "tool", enumerable:true }
		});

		console.log(Object.getOwnPropertyNames(obj)); // ["foo", "bar", "tool"]
	</script>
	
## 3. Array

### 3.1 Array.isArray()

Array.isArray() 方法用来判断某个值是否为 Array。如果是，则返回 true，否则返回 false。

语法：

	Array.isArray(value)
	
示例：

	<script type="text/javascript">
		// 下面的函数调用都返回 true
		console.log(Array.isArray([]));
		console.log(Array.isArray([1]));
		console.log(Array.isArray(new Array()));
		// 鲜为人知的事实：其实 Array.prototype 也是一个数组。
		console.log(Array.isArray(Array.prototype));

		// 下面的函数调用都返回 false
		console.log(Array.isArray());
		console.log(Array.isArray({}));
		console.log(Array.isArray(null));
		console.log(Array.isArray(undefined));
		console.log(Array.isArray(17));
		console.log(Array.isArray('Array'));
		console.log(Array.isArray(true));
		console.log(Array.isArray(false));
		console.log(Array.isArray({ __proto__: Array.prototype }));
	</script>
	
### 3.2 数组原型新增方法

详见 [《ES5 新特性之 Array 增强 API》](/2016/11/javascript_es5_array/)。

## 4. String

### 4.1 字符串属性访问

字符串可以看作是字符型数组的结构，所以也可以通过索引方式来访问字符串中某个位置的元素：

	<script type="text/javascript">
		var str = "football";
		console.log(str[3] === "t");
	</script>
	
### 4.2 String.prtotype.trim

trim() 方法会删除一个字符串两端的空白字符。在这个字符串里的空白包括所有的空格字符 (space, tab, no-break space 等)以及所有的行结束符（如 LF，CR）。

语法：

	stringObject.trim()
	
trim() 方法并不影响原字符串本身，它返回的是一个新的字符串。

	<script type="text/javascript">
		var orig = '   foo  ';
		console.log(orig.length); // 8
		console.log(orig.trim().length); // 3
	</script>
	
有了 trim() 方法的支持，我们就不用自己再到 String 原型上添加 trim() 方法了。

## 5. Date

### 5.1 Date.prototype.toISOString()

toISOString() 方法返回一个 ISO 格式的字符串： YYYY-MM-DDTHH:mm:ss.sssZ。时区总是UTC（协调世界时），加一个后缀“Z”标识。

语法：

	dateObj.toISOString()

示例：

	<script type="text/javascript">
		var today = new Date();
		console.log(today.toISOString()); // 返回 2016-12-18T06:14:00.559Z
	</script>
	
### 5.2 Date.now()

Date.now() 方法返回自1970年1月1日 00:00:00 UTC到当前时间的毫秒数。

语法：

	var timeInMs = Date.now();
	
示例：

	<script type="text/javascript">
		var mills = Date.now();
		console.log(mills);
	</script>
	
### 5.3 Date.prototype.toJSON()

toJSON() 方法返回 Date 对象的字符串形式。

语法：

	dateObj.toJSON()
	
示例：

	<script type="text/javascript">
		var now = new Date();
		console.log(now.toJSON()); // 2016-12-18T06:21:15.753Z
	</script>
	
调用 toJSON() 返回一个 JSON 格式字符串(使用 toISOString())，表示该日期对象的值。默认情况下，这个方法常用于 JSON序列化Date对象。

## 6. Function

### 6.1 Function.prototype.bind()

bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

语法：

	fun.bind(thisArg[, arg1[, arg2[, ...]]])
	
参数 thisArg 表示当绑定函数被调用时，该参数会作为原函数运行时的 this 指向，当使用new 操作符调用绑定函数时，该参数无效。

JavaScript 新手经常犯的一个错误是将一个方法从对象中拿出来，然后再调用，希望方法中的 this 是原来的对象。（比如在回调中传入这个方法。）如果不做特殊处理的话，一般会丢失原来的对象。从原来的函数和原来的对象创建一个绑定函数，则能很漂亮地解决这个问题：

	<script type="text/javascript">
		this.x = 9; 
		var module = {
			x: 81,
			getX: function() { return this.x; }
		};

		console.log(module.getX()); // 返回 81

		var retrieveX = module.getX;
		console.log(retrieveX()); // 返回 9, 在这种情况下，"this"指向全局作用域

		// 创建一个新函数，将"this"绑定到module对象
		// 新手可能会被全局的x变量和module里的属性x所迷惑
		var boundGetX = retrieveX.bind(module);
		console.log(boundGetX()); // 返回 81
	</script>
	
在默认情况下，使用 window.setTimeout() 时，this 关键字会指向 window （或全局）对象。当使用类的方法时，需要 this 引用类的实例，你可能需要显式地把 this 绑定到回调函数以便继续使用实例：

	<script type="text/javascript">
		function LateBloomer() {
			this.petalCount = Math.ceil(Math.random() * 12) + 1;
		}

		LateBloomer.prototype.bloom = function() {
			window.setTimeout(this.declare.bind(this), 1000);
		};

		LateBloomer.prototype.declare = function() {
			console.log('I am a beautiful flower with ' +
				this.petalCount + ' petals!');
		};

		var flower = new LateBloomer();
		flower.bloom();  // 1 秒钟后, 调用'declare'方法
	</script>
	
## 7. JSON

### 7.1 JSON.parse()

JSON.parse() 方法将一个 JSON 字符串解析成一个 JavaScript 值。（！注意之前的反了！）在解析过程中，还可以选择性的修改某些属性的原始解析值。

语法：

	JSON.parse(text[, reviver])
	
参数 text 是要被解析成 JavaSctipt 值的字符串；reviver 可选函数，规定了原始值如何被解析改造。

	<script type="text/javascript">
		var str = "[1, 2, 3, \"false\"]";
		var obj = JSON.parse(str);
		console.log(Array.isArray(obj));
	</script>
	
可使用 reviver 函数将解析值改造：

	<script type="text/javascript">
		var str = "[1, 2, 3, \"false\"]";
		var obj = JSON.parse(str, function(index, element){
			if (index >= 2)
				return !!element;
			return element;
		});
		console.log(obj); // [1, 2, true, true]
	</script>
	
注意，**JSON.parse() 不允许用逗号作为结尾**

	<script type="text/javascript">
		var str = "[1, 2, 3, \"false\", ]";
		var obj = JSON.parse(str);
		// SyntaxError: JSON Parse error: Unexpected comma at the end of array expression
	</script>
	
### 7.2 JSON.stringify()

JSON.stringify() 方法可以将任意的 JavaScript 值序列化成 JSON 字符串。若转换的函数被指定，则被序列化的值的每个属性都会经过该函数的转换和处理；若转换的数组被指定，只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中。

语法：

	JSON.stringify(value[, replacer [, space]])
	
value 是将要序列化成 JSON 字符串的值。

如果 replacer 参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；如果 replacer 是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；如果 replacer 为 null 或者未提供，则对象所有的属性都会被序列化。

参数 space 为可选参数，指定缩进用的空白字符串，用于美化输出（pretty-print）；如果是个数字，它代表有多少的空格，上限为10，该值若小于1，则意味着没有空格；如果该参数为字符串(字符串的前十个字母)，该字符串将被作为空格；如果该参数没有提供（或者为null）将没有空格。

	<script type="text/javascript">
		JSON.stringify([1, "false", false]);	// '[1,"false",false]'
		JSON.stringify({ x: 5 });				// '{"x":5}'
	</script>
	
使用 replacer 参数：

	<script type="text/javascript">
		function replacer(key, value) {
			if (typeof value === "string") {
				return undefined;
			}
			return value;
		}

		var foo = {foundation: "Mozilla", model: "box", week: 45, transport: "car", month: 7};
		// replacer 为函数
		var jsonString1 = JSON.stringify(foo, replacer);
		// replacer 为数组
		var jsonString2 = JSON.stringify(foo, ["foundation", "transport"]);
		console.log(jsonString1); // '{"week":45,"month":7}'
		console.log(jsonString2); // '{"foundation":"Mozilla","transport":"car"}'
	</script>
	
使用 space 参数：

	<script type="text/javascript">
		var result = JSON.stringify({ uno: 1, dos : 2 }, null, '\t');
		console.log(result);
	</script>
	
执行结果为：

	{
		"uno": 1,
		"dos": 2
	}
	
## 8. 严格模式

详见 [《ES5 严格模式》](/2016/12/javascript_strict/)。

## 9. 其它

*	不变的全局变量：undefined、NaN、Infinity
* 	Array.prototype.sort() 的参数必须是函数或 undefined，但 Chrome 与 Safari 并未实现该规范
*  Array.prototype.sort() 的参数可以是 undefined
*  Function.prototype.apply() 允许使用类数组参数，如 arguments
*  parseInt() 忽略前导 0
*  Function 的 prototype 不可枚举
*  Arguments 的 toStringTag 是 “Arguments”
*  0 宽字符标识符，如：`var _\u200c\u200d = true;`
*  非保留字，如：boolean、short、byte、char、final 等
*  可枚举属性可由非枚举项隐藏，但 Safari 未实现该规范
*  被抛出的函数具有适当的 “this” 值

> 参考
> 
> [http://kangax.github.io/compat-table/es5/](http://kangax.github.io/compat-table/es5/)
> 
> [https://developer.mozilla.org/en-US/docs/Web/JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)