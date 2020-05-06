---
title: ES5 新特性之 Array 增强 API
category: javascript
tags: [javascript, ES5]
key: javascript_array_es5
---

## 1. 简介 ##

ECMAScript 1.0 是 1997 年发布的，接下来的两年，连续发布了 ECMAScript 2.0（1998年6月）和 ECMAScript 3.0（1999年12月）。3.0版是一个巨大的成功，在业界得到广泛支持，成为通行标准，奠定了 JavaScript 语言的基本语法，以后的版本完全继承。直到今天，初学者一开始学习 JavaScript，其实就是在学 3.0 版的语法。

2008 年 7 月，ECMA 发布 ECMAScript 3.1，不久又将 ECMAScript 3.1 改名为 ECMAScript 5。

ES5 中新增的不少内容，了解这些对我们编写 JavaScript 会有不少帮助。就数组这块，ES5 对 Array 新增了9个方法，比如要实现元素迭代，我们可以不需要再使用 for 循环了。

ES5 中对 Array 新增的方法，大致可以分为以下几类：

*	索引方法(2个)：indexOf()、lastIndexOf()
*	迭代方法(5个)：forEach()、map()、filter()、some()、every()
*	归并方法(2个)：reduce()、reduceRight()

## 2. 索引方法 ##

索引方法包含 indexOf() 和 lastIndexOf() 两个方法。

### 2.1 indexOf() ###

indexOf() 方法返回给定元素能找在数组中找到的第一个索引值，否则返回-1。indexOf() 方法的查找方向是从前向后查找。

语法：

```javascript
arr.indexOf(searchElement[, fromIndex = 0])
```

参数说明：
	
searchElement：表示要查找的元素

fromIndex：开始查找的位置。如果该索引值大于或等于数组长度，意味着不会在数组里查找，返回-1。如果参数中提供的索引值是一个负值，则将其作为数组末尾的一个抵消，即-1表示从最后一个元素开始查找，-2表示从倒数第二个元素开始查找 ，以此类推。 注意：如果参数中提供的索引值是一个负值，仍然从前向后查询数组。如果抵消后的索引值仍小于0，则整个数组都将会被查询。其默认值为0。

示例：

```javascript
var array = [2, 5, 9];
console.log(array.indexOf(2));     // 0
console.log(array.indexOf(7));     // -1
console.log(array.indexOf(9, 2));  // 2
console.log(array.indexOf(2, -1)); // -1
console.log(array.indexOf(2, -3)); // 0
```

### 2.2 lastIndexOf() ###

lastIndexOf() 方法返回指定元素（也即有效的 JavaScript 值或变量）在数组中的最后一个的索引，如果不存在则返回 -1。从数组的后面向前查找，从 fromIndex 处开始。

语法：
	
```javascript
arr.lastIndexOf(searchElement[, fromIndex = arr.length - 1])
```

其参数意思与 indexOf() 参数意思类似，只是其查找方向是从后向前，不再赘述。

示例：

```javascript
var array = [2, 5, 9, 2];
console.log(array.lastIndexOf(2)); // 3
console.log(array.lastIndexOf(7)); // -1
console.log(array.lastIndexOf(2, 3)); // 3
console.log(array.lastIndexOf(2, 2)); // 0
console.log(array.lastIndexOf(2, -2)); // 0
console.log(array.lastIndexOf(2, -1)); // 3
```

**注意：indexOf() 与 lastIndexOf() 使用严格相等（strict equality，即 ===）比较 searchElement 和数组中的元素。**

## 3. 迭代方法## 

迭代方法包含 forEach()、map()、filter()、some() 和 every() 五个方法。

### 3.1 forEach() ###

forEach() 方法对数组的每个元素执行一次提供的函数(回调函数)。

语法：

```javascript
array.forEach(callback[, thisArg])
```

参数说明：

callback：回调函数，被每个元素迭代的元素调用执行，形如 `function(currentValue, index, array){}`。currentValue 表示数组中正在处理的当前元素，index 表示数组中正在处理的当前元素的索引，array 表示正在应用 forEach() 的数组。

thisArg：可选参数。当执行回调函数时用作 this 的值(参考对象)。

forEach() 方法按升序为数组中含有效值的每一项执行一次 callback 函数，那些已删除（使用 delete 方法等情况）或者从未赋值的项将被跳过（但不包括那些值为 undefined 的项）。

如果给 forEach() 传递了 thisArg 参数，它将作为 callback 函数的执行上下文，类似执行函数 `callback.call(thisArg, element, index, array)`。如果 thisArg 值为 undefined 或 null，函数的 this 值取决于当前执行环境是否为严格模式（严格模式下为 undefined，非严格模式下为全局对象）。

forEach() 遍历的范围在第一次调用 callback 前就会确定。调用forEach() 后添加到数组中的项不会被 callback 访问到。如果已经存在的值被改变，则传递给 callback 的值是 forEach 遍历到他们那一刻的值。已删除的项不会被遍历到。

**注意：**没有办法中止或者跳出 forEach 循环，除了抛出一个异常。如果你需要这样，使用forEach()方法是错误的，你可以用一个简单的循环作为替代。

示例：

```javascript
var array = [3, 9, 2, 7, 6, 4];

array.forEach(function(element, index, arr){
	console.log("arr["+ index +"] = " + element);
});
```

执行结果：

```javascript
arr[0] = 3
arr[1] = 9
arr[2] = 2
arr[3] = 7
arr[4] = 6
arr[5] = 4
```

**使用 thisArg。** 举个勉强的例子 -- 从每个数组中的元素值中更新一个对象中每个属性的值：

```javascript
function Counter() {
	this.sum = 0;
	this.count = 0;
}
Counter.prototype.add = function(array) {
	array.forEach(function(entry) {
		this.sum += entry;
		this.count++;
	}, this);
};

var obj = new Counter();
obj.add([2, 5, 9]);
console.log(obj.count); // 3
console.log(obj.sum); // 16
```

### 3.2 map() ###

map() 方法返回一个由原数组中的每个元素调用一个指定方法后的返回值组成的新数组。

语法：

```javascript
array.map(callback[, thisArg])
```

map() 方法的参数意思与 forEach() 方法类似，可参考 forEach() 方法的说明。

需要注意的是，map() 方法的返回值是**由回调函数的返回值组成的新数组**。

map() 方法会给原数组中的每个元素都按顺序调用一次 callback 函数。callback 每次执行后的返回值（包括 undefined）组合起来形成一个新数组。 callback 函数只会在有值的索引上被调用；那些从来没被赋过值或者使用 delete 删除的索引则不会被调用。

map() 不修改调用它的原数组本身（当然可以在 callback 执行时改变原数组）。

示例1：

```javascript
var numbers = [1, 4, 9, 16, 25];
var roots = numbers.map(Math.sqrt);
console.log("numbers = ", numbers);
console.log("roots = ", roots);
```

执行结果：

```javascript
numbers =  [1, 4, 9, 16, 25]
roots =  [1, 2, 3, 4, 5]
```

示例2：

```javascript
function fuzzyPlural(single) {
	var result = single.replace(/o/g, 'e');  
	if( single === 'kangaroo'){
		result += 'se';
	}
	return result; 
}

var words = ["foot", "goose", "moose", "kangaroo"];
console.log("复数形式：", words.map(fuzzyPlural));
console.log("原数组：", words);
```

执行结果：

```javascript
复数形式： ["feet", "geese", "meese", "kangareese"]
原数组： ["foot", "goose", "moose", "kangaroo"]
```

### 3.3 filter() ###

filter() 方法使用指定的函数测试所有元素，并创建一个包含所有通过测试的元素的新数组。

语法：
	
```javascript
arr.filter(callback[, thisArg])
```

参数与 forEach() 类似，callback 是用来测试数组的每个元素的函数，返回 true 表示保留该元素（通过测试），false 则不保留。

filter() 方法利用所有使得 callback 返回 true 或 等价于 true 的值的元素创建一个新数组，它不会改变原数组。

示例：

```javascript
var src = [12, 5, 8, 130, 44];
var filtered = src.filter(function (element) {
	return element >= 10;
});
console.log("原数组：", src);
console.log("过滤后数组：", filtered);
```

执行结果：

```javascript
原数组： [12, 5, 8, 130, 44]
过滤后数组： [12, 130, 44]
```

### 3.4 some() ###

some() 方法测试数组中的某些元素是否通过了指定函数的测试。

语法：

```javascript
arr.some(callback[, thisArg])
```

some() 为数组中的每一个元素执行一次 callback 函数，直到找到一个使得 callback 返回一个“真值”（即可转换为布尔值 true 的值）。如果找到了这样一个值，some 将会立即返回 true。否则，some() 返回 false。

some() 被调用时不会改变数组。

示例：

```javascript
function isBigEnough(element, index, array) {
	return (element >= 10);
}
var passed = [2, 5, 8, 1, 4].some(isBigEnough);
console.log(passed); // false
passed = [12, 5, 8, 1, 4].some(isBigEnough);
console.log(passed); // true
```

### 3.5 every() ###

every() 方法测试数组的所有元素是否都通过了指定函数的测试。

语法：

```javascript
arr.every(callback[, thisArg])
```

和 some() 类似，every() 方法为数组中的每个元素执行一次 callback 函数，直到它找到一个使 callback 返回 false（表示可转换为布尔值 false 的值）的元素。如果发现了一个这样的元素，every() 方法将会立即返回 false。否则，callback 为每一个元素返回 true，every() 就会返回 true。

every() 不会改变原数组。

示例：

```javascript
function isBigEnough(element, index, array) {
	return (element >= 10);
}
var passed = [12, 5, 8, 130, 44].every(isBigEnough);
console.log(passed); // false
passed = [12, 54, 18, 130, 44].every(isBigEnough);
console.log(passed); // true
```

## 4. 归并方法 ##

归并方法有两个：reduce()、reduceRight()。

### 4.1 reduce() ###

reduce() 方法接收一个函数作为累加器（accumulator），数组中的每个值（从左到右）开始合并，最终合并为一个值。

语法：

```javascript
arr.reduce(callback,[initialValue])
```

callback 是数组中每个元素迭代时都会调用的函数，包含四个参数，形如 `function(previousValue, currentValue, index, array)`：

*	previousValue：上一次调用回调函数返回的值，或者是提供的初始值（initialValue）
*	currentValue：数组中当前被处理的元素
*	index：当前元素在数组中的索引
*	array：调用 reduce() 的数组

callback 函数需要返回一个值，这个值会在下一次迭代中作为初始值。

initialValue 是迭代初始值，参数可选，如果缺省，初始值为数组第一项，从数组第一个项开始叠加，缺省参数要比正常传值少一次运算。

示例：

```javascript
var scores = [88, 99, 87, 76, 67],
	sum = scores.reduce(function(prev, curr){
		return prev + curr;
	}),
	avg = sum / scores.length;

console.log("总分：", sum); // 417
console.log("平均分：", avg); // 83.4
```

### 4.2 reduceRight() ###

reduceRight() 跟 reduce() 相比，用法类似：

```javascript
array.reduceRight(callback[, initialValue])
```

实现上差异在于 reduceRight() 是从数组的末尾开始实现。

示例：

```javascript
[0, 1, 2, 3, 4].reduceRight(function(previousValue, currentValue, index, array) {
	return previousValue + currentValue;
});
```

reduceRight() 与 reduce() 区别：

```javascript
var a = ["1", "2", "3", "4", "5"]; 
var left  = a.reduce(function(prev, cur)      { return prev + cur; }); 
var right = a.reduceRight(function(prev, cur) { return prev + cur; }); 

console.log(left);  // "12345"
console.log(right); // "54321"
```

## 5. 结尾 ##

ES5 里这些处理数组的新方法，在 IE6-IE8 浏览器还未得到支持，所以我们需要在 IE 这些低版本浏览器中引入这个 [es5-shim](https://github.com/es-shims/es5-shim) 补丁，这样我们就可以使用它了。

熟练掌握 ES5 中提供的这些数组方法，有助于我们提高开发的效率，使得对数组的使用更加优雅。