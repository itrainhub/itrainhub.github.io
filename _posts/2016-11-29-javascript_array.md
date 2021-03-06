---
title: JavaScript 数组
category: javascript
tags: [javascript, 数组]
key: javascript_array_es3
---

JavaScript 中数组的作用是：使用单独的变量名来存储一系列的值。即当我们需要存储一系列值的时候，如果对每个值都使用单个变量来进行存储就会显得很麻烦，如果能有一种存储结构能够通过一个名称就将一系列的值关联起来，那就很方便了，数组就是这样的存储结构。

### 1. 基本概念 ###

数组：存储一系列值的结构。

元素：数组中这一系列值的每一个具体值。

下标：数组中每个元素的编号，下标从0开始实现编号。

长度：数组中元素的个数，元素下标是从 0 开始编号，到 “数组长度值 - 1” 止。

### 2. 创建数组 ###

要使用数组的存储结构，我们可以通过以下几种方式创建数组：

```javascript
var arrayObj1 = new Array();　// 创建一个数组对象
var arrayObj2 = new Array(size);　// 创建一个数组并指定长度	
var arrayObj3 = new Array([element0[, element1[, ...[, elementN]]]]);　// 创建一个数组并赋值	
var arrayObj4 = [[element0[, element1[, ...[, elementN]]]]]; // 创建一个数组并赋值的简写，注意这里最外层的中括号不可省略。
```

说明：虽然第二种方法创建数组指定了长度，但实际上所有情况下数组都是变长的，也就是说即使指定了长度为5，仍然可以将元素存储在规定长度以外的，当然，这时长度会随之改变。

JavaScript 中数组也是弱类型的，数组中可以含有不同类型的元素，如数组元素初始化时给定如下的各初始元素值：

```javascript
var arr=[1,'2',[1,2],null];
```

数组中允许最后面有一个多余的 ","：

```javascript
var arr=[,,]; // 数组元素：undefined,undefined
```

### 3. 访问数组元素 ###

数组中元素的引用是通过下标来引用的，访问元素时，通过 `数组名[下标]` 结构进行。如：

```javascript
var arr = [1, 3, 5, 7, 9]; // 定义数组
alert(arr[2]); // 访问数组中下标为2的元素，即第三个元素
arr[2] = 50; // 修改数组中下标为2的元素
```

### 4. 数组操作方法 ###

数组是值的有序集合，使用 typeof 测试数组的类型，可以发现数组类型是 object。

对于对象来说，有可以使用到的常规属性与方法，下面就介绍经常使用到的数组属性与方法。

**数组长度**

很多时候我们需要知道一个数组中元素的个数是多少，即需要求解数组长度，则可以使用 `数组名.length` 来求解。

```javascript
var arr = [1,3,5,7,9]; // 定义数组
alert(arr.length); // 5
```

**添加元素**

*	push(element0[, element1[, ...[, elementN]]])：向数组末尾追加元素
*	unshift(element0[, element1[, ...[, elementN]]])：向数组头部插入元素
*	splice(index, 0, element0[, element1[, ...[, elementN]]])：向数组指定下标处插入元素

示例：

```javascript
var arr = new Array(); // 定义数组
arr.push("a"); // 调用 push 方法，向数组尾部添加元素，返回数组新长度
arr.unshift("b"); // 调用 unshift 方法，向数组头部插入元素，返回数组新长度
arr.splice(1, 0, "c"); // 向数组中下标为1的位置插入元素，插入位置及之后的元素自动后移

// 数组最后元素为：[b, c, a]
```

我们也可以直接以如下方式向数组中添加元素：

```javascript
arr[arr.length] = "d"; // 为下标为数组长度的元素赋值，数组长度自动扩展
```

**删除元素**

*	pop()：从末尾删除最后一个元素
*	shift()：从头部删除第一个元素
*	splice(index, length)：在数组指定 index 下标处删除 length 个元素

示例：

```javascript
var arr = [1, 2, 3, 4, 5, 6, 7, 8]; // 定义数组
arr.pop(); // 移除尾部一个元素并返回该元素值
arr.shift(); // 移除头部一个元素并返回该元素值，数组中元素自动前移
arr.splice(3,2); // 删除下标3开始的2个元素，以数组形式返回所移除的元素

// 数组最后元素为：[2, 3, 4]
```

也可以操作数组的 length 属性来删除元素：
	
```javascript
arr.length -= 1; // 移除尾部一个元素
```

**元素排序**

*	sort([fn(a, b)])：按照给定排序函数规则排序，如果未提供排序函数，则按照数组元素的 字符串 unicode 编码顺序升序排序。
*	reverse()：数组元素顺序反转

示例：

```javascript
var arr = [3, 7, 6, 8, 2, 4, 9, 11, 5, 23]; // 定义数组
arr.reverse(); // 反转数组元素，即[23, 5, 11, 9, 4, 2, 8, 6, 7, 3]
arr.sort(); // 数组升序排序，即[11, 2, 23, 3, 4, 5, 6, 7, 8, 9]
arr.sort(function(a, b){
    return b - a;
}); // 降序排序，即[23, 11, 9, 8, 7, 6, 5, 4, 3, 2]

arr.sort(function(a, b){
    return Math.random() > 0.5 ? 1 : -1;
}); // 乱序排序，如：[23, 9, 7, 11, 5, 6, 8, 3, 2, 4]
```

**连接**

*	concat(arrayX,arrayX,......,arrayX)：连接两个或多个数组，返回连接后的数组。原数组不受影响。
*	join()：使用指定的分隔符将数组中每个元素连接成一个字符串。

示例：

```javascript
var array1 = [3, 9, 2, 6, 4],
	array2 = [1, 5, 18, 8, 7];
var array = array1.concat(array2);
console.log(array); // [3, 9, 2, 6, 4, 1, 5, 18, 8, 7]
var str = array.join("-");
console.log(str); // 3-9-2-6-4-1-5-18-8-7
```

**截取子元素**

*	slice(start, end)：从 start 索引处开始截取子元素，到 end 索引处结束，包含开始索引处元素，不包含结束索引处元素。可省略 end 参数，表示一直截取到数组末尾。

注意：参数也可以取负数。如果是负数，那么它规定从数组尾部开始算起的位置。也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推。

示例：

```javascript
var array = [3, 9, 2, 6, 4],
	sub1 = array.slice(1, 3),
	sub2 = array.slice(2),
	sub3 = array.slice(-2),
	sub4 = array.slice(-4, -1);
console.log(sub1);
console.log(sub2);
console.log(sub3);
console.log(sub4);
```

结果：

```javascript
[9, 2]
[2, 6, 4]
[6, 4]
[9, 2, 6]
```

### 5. 数组迭代 ###

使用简单的 for 循环，如：

```javascript
var array = [3, 7, 6, 9, 2, 4, 5, 1];

for (var i = 0, len = array.length; i < len; i++) {
	console.log(array[i]);
}
```

使用 for-in 遍历迭代：

```javascript
var array = [3, 7, 6, 9, 2, 4, 5, 1];

for (var i in array) {
	console.log(array[i]);
}
```

当然在 ES5 中对数组新增了迭代方法，我将在后继的文章中说明，敬请期待...