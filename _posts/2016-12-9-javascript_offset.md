---
layout: post
title: JavaScript 中 offsetTop、offsetLeft 与 offsetParent 的使用
date: 2016-12-9
category: JavaScript
tags: [JavaScript, DOM, Event]
---

相对整个文档来说，某一个 DOM 元素定位位置我们该如何获取呢。我们可以使用 offsetTop、offsetLeft 与 offsetParent 这几个属性来解决。

### 1. offsetParent ###

offsetParent 是一个只读属性，返回一个指向最近的（closest，指包含层级上的最近）包含该元素的**定位元素**。如果没有定位的元素，则 offsetParent 为最近的 table 元素对象或根元素（标准模式下为 html；quirks 模式（怪异模式/兼容模式）下为 body）。当元素的 style.display 设置为 "none" 时，offsetParent 返回 null。

语法：

	parentObj = element.offsetParent;

返回值 parentObj 是一个对象引用，表示 element 元素相对于该对象（parentObj）偏移（offset）。

示例：
	
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>测试</title>
		<style type="text/css">
			#outer {width:400px; height:400px; position: absolute; top:100px; left:100px; background: red;}
			#inner {width:200px; height:200px; position: absolute; top:50px; left:100px; background: yellow;}
		</style>
	</head>
	<body>
		<div id="outer">
			<div id="inner"></div>
		</div>
		<script type="text/javascript">
			var _outer = document.getElementById("outer"),
				_inner = document.getElementById("inner");
	
			console.log("#inner offsetParent = ", _inner.offsetParent);
			console.log("#outer offsetParent = ", _outer.offsetParent);
		</script>
	</body>
	</html>

执行结果：

![](/images/posts/jsoffset/offsetParent.png)

如果去掉 #outer 样式中的 `position:absolute` 定位方式及定位位置设置，执行结果为：

![](/images/posts/jsoffset/offsetParent.png)

还需要**注意**的是，在 Webkit 中，如果元素为隐藏的（该元素或其祖先元素的 style.display 为 "none"），或者该元素的 style.position 被设为 "fixed"，则 offsetParent 返回 null。

在 IE 9 中，如果该元素的 style.position 被设置为 "fixed"，则该属性返回 null。（display:none 无影响。）

offsetParent 很有用，因为 offsetTop 和 offsetLeft 都是相对于其内边距边界的。

### 2. offsetTop ###

offsetTop 为只读属性，它返回当前元素相对于其 offsetParent 元素顶部的距离。

语法：

	topPos = element.offsetTop;

topPos 为返回的像素数，为数字类型，不带 "px" 像素单位。

如：
	
	var _top = document.getElementById("inner").offsetTop;
	console.log(_top);

### 3. offsetLeft ###

offsetLeft 是一个只读属性，返回当前元素左上角相对于其 offsetParent 节点的左边界偏移的像素值。

语法：

	leftPos = element.offsetLeft;

leftPos 为返回的像素数，为数字类型，不带 "px" 像素单位。

如：
	
	var _left = document.getElementById("inner").offsetLeft;
	console.log(_left);

### 4. 获取元素在文档中的定位 ###

要获取元素在文档中的定位位置，即相对整个文档，而不是其有定位的父元素的定位位置，可以使用如下函数：

	function offset(element) {
		var _top = 0,
			_left = 0;
		// 循环累加定位的 top、left 值
		do {
			_top += element.offsetTop;
			_left += element.offsetLeft;
			element = element.offsetParent;
		} while (element !== null);
	
		return {
			top : _top,
			left : _left
		};
	}

计算文档中定位位置时，只需按 DOM 树从下向上的方向依次累加 top、left 定位值即可。上述函数返回一个坐标定位对象，包括元素在文档中与顶部的距离 top 和与文档左侧的距离 left。