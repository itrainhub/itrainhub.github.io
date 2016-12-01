---
layout: post
title: ES5 新特性之 Array 增强 API
date: 2016-11-30
category: JavaScript
tags: [JavaScript, ES5, ECMAScript, Array, API]
---

## 1. 简介 ##

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

	arr.indexOf(searchElement[, fromIndex = 0])

参数说明：
	
searchElement：表示要查找的元素

fromIndex：开始查找的位置。如果该索引值大于或等于数组长度，意味着不会在数组里查找，返回-1。如果参数中提供的索引值是一个负值，则将其作为数组末尾的一个抵消，即-1表示从最后一个元素开始查找，-2表示从倒数第二个元素开始查找 ，以此类推。 注意：如果参数中提供的索引值是一个负值，仍然从前向后查询数组。如果抵消后的索引值仍小于0，则整个数组都将会被查询。其默认值为0。

示例：

	var array = [2, 5, 9];
	console.log(array.indexOf(2));     // 0
	console.log(array.indexOf(7));     // -1
	console.log(array.indexOf(9, 2));  // 2
	console.log(array.indexOf(2, -1)); // -1
	console.log(array.indexOf(2, -3)); // 0

### 2.2 lastIndexOf() ###

lastIndexOf() 方法返回指定元素（也即有效的 JavaScript 值或变量）在数组中的最后一个的索引，如果不存在则返回 -1。从数组的后面向前查找，从 fromIndex 处开始。

语法：
	
	arr.lastIndexOf(searchElement[, fromIndex = arr.length - 1])

其参数意思与 indexOf() 参数意思类似，只是其查找方向是从后向前，不再赘述。

示例：

	var array = [2, 5, 9, 2];
	console.log(array.lastIndexOf(2)); // 3
	console.log(array.lastIndexOf(7)); // -1
	console.log(array.lastIndexOf(2, 3)); // 3
	console.log(array.lastIndexOf(2, 2)); // 0
	console.log(array.lastIndexOf(2, -2)); // 0
	console.log(array.lastIndexOf(2, -1)); // 3

**注意：indexOf() 与 lastIndexOf() 使用严格相等（strict equality，即 ===）比较 searchElement 和数组中的元素。**

## 3. 迭代方法## 

迭代方法包含 some()、every()、filter()、map() 和 forEach() 五个方法。

待整理，未完待续...

<!--
some() 方法测试数组中的某些元素是否通过了指定函数的测试。

arr.some(callback[, thisArg])

callback
用来测试每个元素的函数。调用时使用参数 (element, index, array)。
返回true表示保留该元素（通过测试），false则不保留。
thisArg
执行 callback 时使用的 this 值。

callback 被调用时传入三个参数：元素的值，元素的索引，被遍历的数组。

every() 方法测试数组的所有元素是否都通过了指定函数的测试。

arr.every(callback[, thisArg])

filter() 方法使用指定的函数测试所有元素，并创建一个包含所有通过测试的元素的新数组。

var new_arrary = arr.filter(callback[, thisArg])
-->