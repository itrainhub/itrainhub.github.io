---
title: JavaScript 中的 HTML DOM 操作
category: javascript
tags: [DOM]
key: javascript_dom
---

## 1. 简介 ##

DOM（Document Object Model，文档对象模型），是一个 HTML、XML 和 SVG 的编程接口，它将结构化表示的文档映射为一棵树。DOM 定义了一些允许访问这棵树的方法，因此这些方法可以改变文档结构、样式以及内容。

DOM 以节点和对象的结构化组提供文档的结构化表现，拥有各种属性和方法。节点也可以绑定事件句柄，一旦事件被触发，事件句柄将被调用执行。本质上它是将网页链接到脚本或是编程语言上。

尽管通常会使用 JavaScript 来访问 DOM， 但它并不是 JavaScript 的一部分，它也可以被其他语言使用。DOM被设计成独立于任何编程语言，通过单一的、一致的 API，可以访问结构化表现的文档。

## 2. HTML DOM 树 ##

HTML 文档为结构化文档内容，HTML DOM 定义了访问和操作 HTML 文档的标准，也就是关于如何获取、修改、添加或删除 HTML 元素的标准。

在 HTML DOM 中，所有事物都是节点。DOM 是被视为节点树的 HTML。

![HTML DOM 树](/assets/images/jsdom/ct_htmltree.gif)

通过 HTML DOM，树中的所有节点均可通过 JavaScript 进行访问。所有 HTML 元素（节点）均可被修改，也可以创建或删除节点。

节点树中的节点彼此拥有层级关系。父（parent）、子（child）和兄弟（sibling）等术语用于描述这些关系：父节点拥有子节点，同级的子节点被称为兄弟（或姐妹）。

在节点树中，顶端节点被称为根（root），每个节点都有父节点、除了根（它没有父节点）。一个节点可拥有任意数量的子，兄弟节点是拥有相同父节点的节点。

下面的图片展示了节点树的一部分，以及节点之间的关系：

![DOM 节点关系](/assets/images/jsdom/dom_navigate.gif)

常见 HTML DOM 节点类型：

*	文档节点：整个文档 (document)
*	元素节点：HTML 元素
*	文本节点：HTML 元素内的文本
*	属性节点：HTML 元素的属性
*	注释节点：HTML 注释

## 3. HTML DOM 方法 ##

常用的 HTML DOM 方法有：

|	方法					|描述								|
|:----						|:---								|
|getElementById()			|返回带有指定 id 的元素				|
|getElementsByTagName()	|返回包含带有指定标签名称的所有元素的节点列表（集合/节点数组）	|
|getElementsByClassName()	|返回包含带有指定类名的所有元素的节点列表|
|appendChild()				|把新的子节点添加到指定节点			|
|removeChild()				|删除子节点							|
|replaceChild()				|替换子节点							|
|insertBefore()				|在指定的子节点前面插入新的子节点	|
|createAttribute()			|创建属性节点						|
|createElement()			|创建元素节点						|
|createTextNode()			|创建文本节点						|	
|getAttribute()				|返回指定的属性值					|
|setAttribute()				|把指定属性设置或修改为指定的值		|

### 3.1 查找元素 ###

**根据 id 查找元素**

```javascript
element = document.getElementById(id);
```

该方法根据特定的 id 查找页面中的元素，返回的是一个元素对象。如果在页面中没有查找到对应的元素，该方法会返回null。

注意 id 参数是大小写敏感的，所以 `document.getElementById("Main")`无法获取到元素 `<div id="main">`，因为 'M' 和 'm' 是不一样的。

示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>测试</title>
</head>
<body>
	<input type="text" id="txt" value="测试文本">
	<script type="text/javascript">
		var element = document.getElementById("txt");
		console.log(element.value);
	</script>
</body>
</html>
```

**根据标签名查找元素**

```javascript
var elements = document.getElementsByTagName(name);
```

该方法返回一个包括所有给定标签名称的元素的 HTML 集合 HTMLCollection，整个文档结构都会被搜索，包括根节点。返回的 HTML 集合是动态的，意味着它可以自动更新自己来保持和 DOM 树的同步而不用再次调用 document.getElementsByTagName() 。

参数 name 是一个代表元素的名称的字符串，可以使用特殊字符 "*" 代表所有元素。

示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>测试</title>
</head>
<body>
	<span>第一个span</span>
	<input type="text" id="txt" value="测试文本">
	<div>第一个div</div>
	<span>第二个span</span>
	<div>第二个div</div>
	<span>第三个span</span>
	<script type="text/javascript">
		var elements = document.getElementsByTagName("div");
		console.log(elements);
	</script>
</body>
</html>
```

该方法也可以通过某个具体的元素对象来调用：

```javascript
var elements = element.getElementsByTagName(tagName);
```

这时，getElementsByTagName() 方法仍然返回一个动态的包含指定标签名的元素的 HTML 集合，只是是在指定的元素的子树中搜索。

示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>测试</title>
</head>
<body>
	<div id="first">
		<div>第一个内嵌div</div>
		<span>第一个内嵌span</span>
		<div>第二个内嵌div</div>
		<span>第二个内嵌span</span>
	</div>
	<script type="text/javascript">
		var _firstDiv = document.getElementById("first");
		var elements = _firstDiv.getElementsByTagName("div");
		console.log(elements);
	</script>
</body>
</html>
```

**根据类名查找元素**

```javascript
var elements = document.getElementsByClassName(names); // or:
var elements = rootElement.getElementsByClassName(names);
```

该方法可以通过 document 对象调用，也可以通过一个具体的元素对象调用。它返回一个 HTML 集合(类似数组的对象)，包含了所有指定 class 名称的子元素。调用这个方法的元素将作为本次查找的根元素。

示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>测试</title>
</head>
<body>	
	<div class="test">类名为test的div</div>
	<div id="first">
		<div>内嵌div</div>
		<span class="test">类名为test的span</span>
	</div>
	<script type="text/javascript">
		var elements = document.getElementsByClassName("test");
		console.log(elements);
		var _firstDiv = document.getElementById("first");
		elements = _firstDiv.getElementsByClassName("test");
		console.log(elements);
	</script>
</body>
</html>
```

需要注意的是，该方法存在兼容性问题，在 IE 9 之前的版本中该方法不适用。我们可以这样来解决兼容的问题：

```javascript
function getByClassName(className, rootElement) {
	rootElement = rootElement || document;
	if (rootElement.getElementsByClassName)
		return rootElement.getElementsByClassName(className);

	var tags = rootElement.getElementsByTagName("*"),	
		result = [];
	for (var i = 0, len = tags.length; i < len; i++) {
		var classNames = tags[i].className.split(" ");
		for (var j = 0, length = classNames.length; j < length; j++) {
			if (classNames[j] === className){
				result.push(tags[i]);
				break;
			}
		}
	}

	return result;
}
```

`tags[i].className.split(" ")` 中的 className 为 DOM 元素对象的属性，指代的是 HTML 元素节点中的 class（CSS类）属性。如果一个元素使用了多个类名，通常我们使用空格(" ")将类名分隔开作为元素的 class 属性值。

### 3.2 添加元素 ###

**创建元素节点**

```javascript
var element = document.createElement(tagName);
```

tagName 指定将要创建的元素类型的字符串（标签名），该方法返回创建的 HTML 元素。

**设置属性**

```javascript
element.setAttribute(name, value);
```

该方法用于添加一个新属性（attribute）到元素上，或改变元素上已经存在的属性的值。name 是表示属性名称的字符串，value 是属性的新值。

**设置元素内 HTML 文本内容**

```javascript
element.innerHTML = markup;
```

markup 是包含元素（以及子元素）内容的字符串。元素的内容以原始 HTML 代码显示出来。

**插入节点**

```javascript
var child = parentNode.appendChild(child);
```

该方法将一个节点插入到指定的父节点的最末尾处（也就是成为了这个父节点的最后一个子节点）。child 既是参数又是这个方法的返回值，即 appendChild() 方法会把要插入的这个节点引用作为返回值返回。

```javascript
var insertedElement = parentNode.insertBefore(newElement, referenceElement);
```

该方法在父节点的某个子节点之前再插入一个子节点。如果 referenceElement 为 null 则 newElement 将被插入到子节点的末尾，如果 newElement 已经在 DOM 树中，newElement 首先会从 DOM 树中移除，再插入指定的 referenceElement 元素前。

注意：没有 insertAfter() 方法。可以使用 insertBefore() 方法和 nextSibling 来模拟这个操作。

综上，示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>测试</title>
	<style type="text/css">
		.test {width:200px; height:100px; background:red;}
	</style>
</head>
<body>
	<script type="text/javascript">
		var _div = document.createElement("div");
		_div.setAttribute("class", "test");
		_div.innerHTML = "<a href='http://www.baidu.com'>百度</a>";
		document.getElementsByTagName("body")[0].appendChild(_div);
	</script>
</body>
</html>
```

### 3.3 删除元素 ###

```javascript
var oldChild = parentNode.removeChild(child);
```

该方法从某个父节点中移除指定的子节点，并返回那个子节点。

child 是要移除的那个子节点，parentNode 是 child 的父节点，oldChild 和 child 指向同一个节点,即 oldChild === child。

被移除的这个子节点仍然存在于内存中，只是没有添加到当前文档的 DOM 树中，因此，我们还可以把这个节点重新添加回文档中。当然，实现要用另外一个变量，比如上例中的 oldChild 来保存这个节点的引用。

如果 child 节点不是 parentNode 节点的子节点，则该方法会抛出异常。

示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>测试</title>
	<style type="text/css">
		.test {width:200px; height:100px; background:red;}
	</style>
</head>
<body>
	<button id="del">删除</button>
	<div class="test">测试 div 元素节点</div>
	<script type="text/javascript">
		document.getElementById("del").onclick = function(){
			var _div = document.getElementsByClassName("test")[0],
				_body = document.getElementsByTagName("body")[0];
			_body.removeChild(_div);
			alert("删除成功...")
		};
	</script>
</body>
</html>
```

### 3.4 替换节点 ###

```javascript
var replacedNode = parentNode.replaceChild(newChild, oldChild);
```

该方法用指定的节点替换父节点的一个子节点，并返回被替换掉的节点。

newChild 是用来替换 oldChild 的新节点，如果该节点已经存在于DOM树中，则它会被从原始位置删除。oldChild 是待替换掉的原始节点，replacedNode 和 oldChild 相等。

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>测试</title>
	<style type="text/css">
		.test {width:200px; height:100px; background:red;}
	</style>
</head>
<body>
	<button id="replace">替换</button>
	<div class="test">测试 div 元素节点</div>
	<script type="text/javascript">
		document.getElementById("replace").onclick = function(){
			var _div = document.getElementsByClassName("test")[0],
				_body = document.getElementsByTagName("body")[0],
				_newNode = document.createElement("span");
			_newNode.innerHTML = "被替换后的内容";
			_body.replaceChild(_newNode, _div);
			alert("替换成功...")
		};
	</script>
</body>
</html>
```

### 3.5 克隆节点 ###

```javascript
var dupNode = node.cloneNode(deep);
```

该方法返回调用的节点的一个副本，node 为将要被克隆的节点，dupNode 是克隆生成的副本节点。deep 是可选参数，表示是否采用深度克隆，如果为 true，则该节点的所有后代节点也都会被克隆，如果为false，则只克隆该节点本身。

示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>测试</title>
	<style type="text/css">
		.test {width:200px; height:100px; background:red; margin-top: 5px;}
	</style>
</head>
<body>
	<button id="clone">克隆</button>
	<div class="test">测试 div 元素节点
		<span>内嵌 span 元素</span>
	</div>
	<script type="text/javascript">
		document.getElementById("clone").onclick = function(){
			var _div = document.getElementsByClassName("test")[0],
				_body = document.getElementsByTagName("body")[0],
				_newNode = _div.cloneNode(true);
			_body.appendChild(_newNode);
		};
	</script>
</body>
</html>
```

## 4. HTML DOM 属性 ##

常用的 HTML DOM 属性有：

|属性						|描述								|
|:----						|:---								|
|childNodes					|返回父节点下所有子节点的集合（包括空白文本节点）|
|firstChild					|返回父节点下第一个子节点			|
|innerText					|返回父节点内部纯文本（非标准属性）	|
|lastChild					|返回父节点下最后一个子节点			|
|nextSibling				|返回指定节点的后一个兄弟节点		|
|nodeName					|返回节点名称						|
|nodeType					|返回节点类型（1元素 2属性 3文本）	|
|nodeValue					|返回节点值							|
|parentNode					|返回指定节点的父节点				|
|previousSibling			|返回指定节点的前一个兄弟节点		|
|innerHTML					|返回指定节点内部 HTML 文本			|
|className					|设置/获取元素节点的CSS类名			|

示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>测试</title>
</head>
<body>
	<div id="div-01">div-01</div>
	<div id="div-02">div-02</div>

	<script type="text/javascript">
		var el = document.getElementById('div-01').nextSibling,
			i = 1;
		console.log('Siblings of div-01:');
		while (el) {
			console.log(i + '. ' + el.nodeName + ", nodeType = " + el.nodeType);
			el = el.nextSibling;
			i++;
		}
	</script>
</body>
</html>
```

执行结果：

```javascript
Siblings of div-01:
1. #text, nodeType = 3
2. DIV, nodeType = 1
3. #text, nodeType = 3
4. SCRIPT, nodeType = 1
```

## 5. CSS 样式 ##

HTMLElement.style 属性返回一个 CSSStyleDeclaration 对象，表示元素的 内联 style 属性（attribute）。 

由于 DOM 中 style 属性的优先级和通过 HTML 元素的 style 属性设置内联样式是一样的，并且在 css 层级样式中拥有最高优先级，因此在为特定的元素设置样式时很有用。

### 5.1 设置 style 属性 ###

注意不能通过直接给 style 属性设置字符串（如：`elt.style = "color: blue;"`）来设置 style，因为 style 应被当成是只读的（尽管 Firefox(Gecko), Chrome 和 Opera 允许修改它），这是因为通过 style 属性返回的 CSSStyleDeclaration 对象是只读的。但是 style 属性本身的属性能够用来设置样式。此外，通过单独的样式属性（如：`elt.style.color = '...'`）比用 `elt.style.cssText = '...'` 或者 `elt.setAttribute('style', '...')` 形式更加简便，除非你希望完全通过一个单独语句来设置元素的全部样式，因为通过 style 本身属性设置的样式不会影响到通过其他方式设置的其他 css 属性的样式。

示例：

```javascript
elt.style.cssText = "color: blue"; // 设置多个样式属性 
elt.setAttribute("style", "color: blue"); // 设置多个样式属性 
elt.style.color = "blue"; // 直接设置样式属性
var st = elt.style; st.color = "blue"; // 间接设置样式属性
```

如果 css 属性名称是使用 -（减号）连接的（如：font-size），而在 JavaScript 中 -（减号）表示算术运算，那么需要将 -（减号）去掉，将 -（减号）后的单词第一个字母改为大写状态。如：

```javascript
elt.style.fontSize = "20px"; // 设置字体大小为 20px
elt.style.backgroundColor = "#ccc"; // 设置背景颜色
```

css 属性名书写方式可参见 [CSS Properties Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference) 中 JavaScript 的写法。

### 5.2 获取元素样式信息 ###

通常，要了解元素样式的信息，仅仅使用 style 属性是不够的，这是因为它只包含了在元素内嵌 style 属性（attribute）上声明的 CSS 属性，而不包括来自其他地方声明的样式，如 \<head> 部分的内嵌样式表，或外部样式表。要获取一个元素的所有 CSS 属性，可以使用 window.getComputedStyle()。

```javascript
var style = window.getComputedStyle(element, [pseudoElt]);
```

参数 element 表示用于计算样式的元素，而 pseudoElt 为可选参数，指定一个伪元素进行匹配。对于常规的元素来说 pseudoElt 可省略。

getComputedStyle() 方法在 IE9 之前的版本中不支持，对于 IE 老版本来说，我们需要使用 `element.currentStyle` 来获取样式信息。

为解决老版本 IE 浏览器获取样式的兼容性问题，我们可以做如下封装：

```javascript
function css(element, attr) {
	return element.currentStyle ? element.currentStyle[attr] : 
			getComputedStyle(element)[attr];
}
```

示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>测试</title>
	<style type="text/css">
		.test {width:300px; height:100px; background:#ccc; color:#00f;}
	</style>
</head>
<body>
	<div id="div-01" class="test">div-01</div>

	<script type="text/javascript">
		var element = document.getElementById("div-01");
		var _width = css(element, "width");
		console.log("宽度：" + _width);

		function css(element, attr) {
			return element.currentStyle ? element.currentStyle[attr] : 
					getComputedStyle(element)[attr];
		}
	</script>
</body>
</html>
```
