---
layout: post
title: JavaScript 事件
date: 2016-12-7
category: JavaScript
tags: [JavaScript, DOM, Event]
---

## 1. 关于事件驱动 ##

当用户通过浏览器与页面实现交互体验时，鼠标键盘的操作完成后，如何使得页面能够响应用户的操作，事件驱动这一概念就由此而来。

当然事件驱动不仅体现在用户与页面间的交互，也体现在使用操作系统的时时刻刻。比如双击 window 系统桌面“我的电脑”图标，操作系统打开一个窗口供我们查看各盘符信息。

我们首先来简单的说明一下什么是事件与事件响应程序。

用户通过鼠标或键盘（不仅限于这两种设备）执行的操作就称为事件，当事件发生后，系统做出响应，这段响应的代码就称为是事件响应程序（或事件处理程序），主要是完成具体的响应任务。

事件的发生使得相应的事件处理程序被执行就称为事件驱动。

下面再简单的说一说事件驱动模型。事件驱动模型的三要素主要为：

*	事件源：即能够接收外部事件的源体，如超级链接、按钮等
*	监听器：即能够接收事件源通知的对象，用于事件监听
*	事件响应程序：用于处理事件的代码

要实现事件监听，通常有中断和轮询的方式。

中断一般需要硬件的支持，会被操作系统封装起来。

轮询会循环检测是否有事件发生，如果有就去执行相应的处理程序，这在底层和上层的开发中都有应用。轮询不断检测是否有消息（用户的 UI 操作、系统消息等）出现，有的话就分发消息，调用相应的回调函数进行处理。

但在 JavaScript 中并没有类似消息循环代码，我们只是简单地注册事件，然后等待被调用。这是因为浏览器作为执行平台，已经将 event loop 实现了，JavaScript 代码不需要介入到这个过程中，只需要作为被调用者安静地等待即可。

## 2. 获取 event 对象 ##

在 W3C 规范中，event 对象是随事件处理函数传入的，Chrome、FireFox、Opera、Safari、IE9.0及其以上版本都支持这种方式；但是对于 IE8.0 及其以下版本，event 对象是作为 window 对象的一个属性。

在遵循 W3C 规范的浏览器中，event 对象通过事件处理函数的参数传入，如：

	element.onclick = function(evt){
		// 语句块...
	}

上述绑定的事件处理程序中，参数 evt 用来传递 event 对象，我们不需要知道具体是怎么传递进入到函数体内部的，只需要清楚在函数体内部可以直接使用 evt 参数所代表的 event 对象来调用属性或方法就可以了。

对于不遵循规范的浏览器来说，如 IE8.0 及其以下版本，event 是作为 window 对象的一个属性存在的。如：

	element.onclick = function(){
		var evt = window.event; // 声明一个变量来接收 event 对象，该对象保存在 window.event 中
		// 语句块...
	}

为了兼容 IE8.0 及以下版本获取 event 对象，通信我们采用如下写法：

	element.onclick = function(evt){
		evt = evt || window.event; // 解决 event 兼容性问题
		// 语句块...
	}

## 3. 事件类型 ##

因为浏览器充当了事件驱动模型中监听器的角色，在 JavaScript 中没有类似消息循环代码，所以我们只是简单地注册事件监听器，然后等待被调用。

注册事件监听器，就是将事件与事件处理程序进行关联，要注册事件监听，就需要知道发生了何种事件，也就是需要知道发生事件的类型。

常见事件类型如下：

|名称		|此事件发生在何时...	|
|:--			|:----------			|
|blur		|元素失去焦点。		|
|change		|域的内容被改变。		|
|click		|当用户点击某个对象时调用的事件句柄。|
|dblclick	|当用户双击某个对象时调用的事件句柄。|
|focus		|元素获得焦点。		|
|keydown	|某个键盘按键被按下。	|
|keypress	|某个键盘按键被按下并松开。|
|keyup		|某个键盘按键被松开。	|
|load		|一张页面或一幅图像完成加载。|
|mousedown	|鼠标按钮被按下。		|
|mousemove	|鼠标被移动。			|
|mouseout	|鼠标从某元素移开。	|
|mouseover	|鼠标移到某元素之上。	|
|mouseup	|鼠标按键被松开。		|
|reset		|重置按钮被点击。		|
|resize		|窗口或框架被重新调整大小。|
|select		|文本被选中。			|
|submit		|确认按钮被点击。		|

更多事件类型可以从 [https://developer.mozilla.org/en-US/docs/Web/Events](https://developer.mozilla.org/en-US/docs/Web/Events) 上获取。

## 4. 鼠标/键盘属性 ##

如果我们需要知道鼠标按下了哪个键、光标在窗口的坐标位置、是否按下了键盘上的 ctrl 键等，那么就可以使用 event 对象的鼠标/键盘属性去获取。

常用鼠标/键盘属性有：

|属性			|描述							|
|:----			|:--								|
|button			|哪个鼠标按钮被点击。				|
|clientX		|鼠标指针在可见窗口的水平坐标。		|
|clientY		|鼠标指针在可见窗口的垂直坐标。		|
|pageX			|鼠标指针在文档中的水平坐标。		|
|pageY			|鼠标指针在文档中的垂直坐标。		|
|offsetX		|鼠标指针相对事件源元素的水平坐标	|
|offsetY		|鼠标指针相对事件源元素的垂直坐标	|
|altKey			|"Alt" 是否被按下。				|
|ctrlKey		|"Ctrl" 键是否被按下。			|
|shiftKey		|"Shift" 键是否被按下。			|
|keyCode		|获取按键的虚拟键盘码。			|
|which			|获取按键的虚拟键盘码。			|

clientX/clientY 与 pageX/pageY 的区别在于，clientX/clientY 表示的是当前可视窗口中光标的坐标位置，而 pageX/pageY 是在整个文档中的坐标位置。当然 pageX/pageY 在 IE8.0 及之前的浏览器中不适用，要在 IE8.0 及之前浏览器中获取光标相对文档的定位位置，可使用如下方法：

	var _pageX = event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
	var _pageY = event.clientY + (document.documentElement.scrollTop || document.body.scrollTop);

我们要知道键盘是什么，event 对象提供 keyCode 或 which 属性来获取，当然这两个属性也有兼容问题，再比如我们要写一个聊天室，当输入完毕消息后，按 ctrl + enter 组合键发送消息，可以使用如下片段：

	document.getElementById("msg").onkeydown = function(e){
		e = e || event;
		var code = e.keyCode ? e.keyCode : e.which; // 按键的虚拟键盘码值
		if (e.ctrlKey && code === 13) {
			// alert("你按下了 ctrl + enter 键");
			sendMsg();
		}
	};

## 5. 事件流 ##

事件发生时会在元素节点与根节点之间按照特定的顺序传播，路径所经过的所有节点都会收到该事件，这个传播过程即 DOM 事件流。

事件传播的顺序对应浏览器的两种事件流模型：捕获型事件流（事件冒泡）和冒泡型事件流（事件捕获）。

之所以有这两种事件流，最早要从微软和网景公司的浏览器大战说起，微软在 IE 中提出的是冒泡流，而网景提出的是捕获流。

**事件冒泡：**事件的传播是从最特定的事件目标到最不特定的事件目标，即从 DOM 树的叶子到根。

**事件捕获：**事件的传播是从最不特定的事件目标到最特定的事件目标，即从 DOM 树的根到叶子。

### 5.1 事件冒泡 ###

事件开始时由最具体的元素（即最初触发事件的事件源元素）接收，然后逐级向上传播到较为不具体的节点（document）。对于 html 来说，就是当一个元素产生了一个事件，它会把这个事件传递给它的父元素，父元素接收到了之后，还要继续传递给它的上一级元素，就这样一直传播到 document 对象（现代浏览器是传播到 window 对象，IE8.0 及以下的浏览器是传播到 document 对象）。

![事件冒泡](/images/posts/jsevent/bubbling.png)

现在的浏览器默认都是采用的是以事件冒泡的方式来处理事件。使用 DOM0 级方法绑定事件只能是事件冒泡，不能设置事件捕获，使用 DOM2 级方法可以设置是用事件冒泡还是事件捕获来处理事件（稍后介绍）。

示例：

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>测试</title>
		<style type="text/css">
			#div-1 {width:400px; height: 400px; background: black;}
			#div-2 {width:200px; height: 200px; background: yellow;}
			#div-3 {width:100px; height: 100px; background: blue;}
		</style>
	</head>
	<body>
		<div id="div-1">
			<div id="div-2">
				<div id="div-3"></div>
			</div>
		</div>
		<script type="text/javascript">
			function $(id){
				return document.getElementById(id);
			}
	
			/* 为三个元素绑定点击事件 */
			$("div-1").onclick = function(){
				console.log("div-1");
			}
			$("div-2").onclick = function(){
				console.log("div-2");
			}
			$("div-3").onclick = function(){
				console.log("div-3");
			}
		</script>
	</body>
	</html>

在最内层的元素上单击鼠标左键，运行结果如下：

	div-3
	div-2
	div-1

即最初始触发事件的事件源元素是 id 为 #div-3 的元素，在执行完 #div-3 元素的点击事件处理程序后，点击事件沿着 DOM 树向上传播，传播到 #div-2 元素上，在 #div-2 元素上也有点击事件的处理程序，继续执行 #div-2 元素上的事件处理程序，处理完毕后点击事件继续向 DOM 树上级传播到达 #div-1 处，同样执行 #div-1 元素上的事件处理程序，处理完毕后点击事件继续沿 body --> html --> document --> window 传播，但在这些对象上并未绑定点击事件的处理程序，所以控制台上只打印出三个 div 元素的信息，并且是按照从内向外的嵌套层次打印的。

### 5.2 事件捕获 ###

事件捕获是网景提出来的，事件捕获是不太具体的元素应该更早接受到事件，而最具体的节点应该最后接收到事件。他们的用意是在事件到达目标之前就捕获它，也就是跟冒泡的过程正好相反，所以有的资料中也叫反向冒泡。以 html 的 click 事件为例，document 对象（DOM 级规范要求从 document 开始传播，但是现在的浏览器是从 window 对象开始的）最先接收到 click 事件，然后事件沿着 DOM 树依次向下传播，一直传播到事件的实际目标。除 chrome、firfox 等浏览器外，IE9.0 及以上的浏览器也支持事件捕获。

![事件捕获](/images/posts/jsevent/capture.png)
 
如何实现事件捕获的代码，稍后我会在 DOM Level 中再继续说明（详见 6.2.1 小节）。由于老版本浏览器不支持捕获，所以实际开发中，为了兼容更多浏览器，很少有人使用事件捕获，建议大家使用事件冒泡。

### 5.3 标准事件流处理 ###

由于微软与网景的浏览器大战，使得事件流出现了分歧，所以为了方便开发者的使用，在 W3C 组织的统一之下，JavaScript 支持了冒泡流和捕获流。

![事件流](/images/posts/jsevent/eventflow.svg)

从上图我们可以看到，一个完整的 JavaScript 事件流是从 window 开始，最后回到 window 的一个过程。在这个过程中，事件流被分为三个阶段：事件捕获阶段、目标处理阶段和事件冒泡阶段。从 DOM 树结构来看，事件捕获就是从上向下捕获处理事件的过程；事件冒泡就是从下向上处理事件的过程，就像水泡一样不断浮向顶端，所以称为事件冒泡。

### 5.4 阻止事件冒泡 ###

事件冒泡的机制为集中式处理事件提供了便利，但实际开发中，事件冒泡可能也会带来一些副作用。

示例1：
	
	<!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>测试</title>
	    <style type="text/css">
			#div-1 {width:400px; height: 400px; background: black;}
	    </style>
	</head>
	<body>
	    <div id="div-1"></div>
	    <script type="text/javascript">
	    	var num = 10;
	
	        function $(id){
	            return document.getElementById(id);
	        }
	
	        $("div-1").onclick = function(){
	        	num = 20;
	        	console.log("点击 #div-1 后将 num 值修改为 " + num);
	        }
	
	        document.onclick = function(){
	        	num = 50;
	        	console.log("document 上将 num 值修改为 " + num);
	        }
	    </script>
	</body>
	</html>

当点击 #div-1 元素后，控制台上打印输出：

	点击 #div-1 后将 num 值修改为 20
	document 上将 num 值修改为 50

由于事件冒泡的缘故，在 #div-1 上执行了事件处理程序后，事件又向上传播到 document 上继续执行了事件处理程序，所以最终 num 的值被修改为了 50。但我们的初衷可能仅仅是想在点击 #div-1 元素后将 num 变量的值修改为 20。

这时，如果能够在 #div-1 元素上的事件处理程序被执行完毕后不再将点击事件向上传播，那么就是我们预期想要得到的结果。要实现这一点，我们就得阻止事件的冒泡，可以使用事件 event 对象的标准方法 `stopPropagation()` 来阻止事件冒泡：

	event.stopPropagation()

将示例1中 #div-1 的点击事件重新绑定如下：

	$("div-1").onclick = function(e){
		e = e || event;
		num = 20;
		console.log("点击 #div-1 后将 num 值修改为 " + num);
		e.stopPropagation(); // 阻止事件冒泡
	}

执行结果：

	点击 #div-1 后将 num 值修改为 20

stopPropagation() 方法在 IE8.0 及以前的版本中不支持，要将 event 对象的 cancelBubble 属性设置为 true 才能阻止 IE8.0 及之前版本中的事件冒泡。继续修改如下：

	$("div-1").onclick = function(e){
		e = e || event;
		num = 20;
		console.log("点击 #div-1 后将 num 值修改为 " + num);
		if (e.stopPropagation) // 支持使用 stopPropagation() 方法
			e.stopPropagation(); // 阻止事件冒泡
		else
			e.cancelBubble = true;
	}

## 6. DOM Level 0、DOM Level 2 事件 ##

在 W3C 对 DOM 事件进行规范化之前的事件，一般称为 DOM Level 0（DOM0 级）事件。W3C 在 DOM2 级文档规范中，包含了 DOM 事件（DOM Events）规范，也就是我们通常所说的 DOM Level 2（DOM2 级）事件。

### 6.1 DOM0 级事件 ###

在 DOM0 级事件中，事件名以 "on" 开头，因此 click 事件类型就对应为 onclick，load 事件就对应为 onload。我们把以 "on" 开头的这些名称通常称为事件句柄，大家可参见 [https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers) 查看全局事件句柄。

DOM0 级事件可以通过两种方式绑定事件处理程序：HTML 元素属性方式和 DOM 元素属性方式。

#### 6.1.1 HTML 元素属性方式绑定事件 ####

要让一个 HTML 元素支持事件，可以通过 HTML 元素的属性来指定：

	<button onclick="start()">按钮</button>

对应的 JavaScript 中事件处理程序：

	function start() {
		alert("hello...");
	}

通过 HTML 元素属性添加事件处理程序的方式，属于 DOM0 事件处理程序。通过上面的方式添加会有一定的麻烦，属于侵入式添加事件的方式，即 HTML 与 JavaScript 代码紧密耦合，对代码修改和维护都造成了不便。

#### 6.1.2 DOM 元素属性方式绑定事件 ####

除了使用 HTML 元素的属性方式添加外，也可以直接在 JavaScript 代码中动态为某个页面中的 DOM 元素绑定事件。

	<button id="btn">按钮</button>

首先在 JavaScript 中获取到页面中的 DOM 元素，然后通过事件句柄引用到事件处理程序：

	document.getElementById("btn").onclick = function(){
		alert("hello...");
	}

通过 DOM 元素属性的方式来进行事件绑定，相较于直接在 HTML 元素的属性中绑定更加灵活，并且这种方式也是非侵入式的方式，对于代码修改与维护来说，方便很多。

#### 6.1.3 解除 DOM0 级事件绑定 ####

要删除 DOM0 级事件处理程序，只需要将相应的事件句柄设置为 null 即可：

	document.getElementById("btn").onclick = null;

#### 6.1.4 为同一元素绑定多次同一事件 ####

如果做为合作开发的项目，在同一个元素上，绑定了多次同一个事件，会出现什么情况呢？

示例：

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>测试</title>
		<style type="text/css">
			#div-1 {width:400px; height: 400px; background: black;}
		</style>
	</head>
	<body>
		<div id="div-1"></div>
		<script type="text/javascript">
			function $(id){
				return document.getElementById(id);
			}
	
			$("div-1").onclick = function(){
				console.log("first...");
			}
	
			$("div-1").onclick = function(){
				console.log("second...");
			}
	
			$("div-1").onclick = function(){
				console.log("third...");
			}
		</script>
	</body>
	</html>

执行结果：

	third...

从执行结果中可以看到，仅最后一次绑定的事件处理程序执行了，前两次的事件处理程序并没有被执行，这说明 DOM0 级元素上多次绑定同一事件，只有最后一次绑定的事件处理程序能起作用，相当于是后绑定的事件覆盖了先绑定的事件。

### 6.2 DOM2 级事件 ###

W3C 进行事件流规范后，我们可以显示指明事件是以冒泡还是捕获的方式来处理，这就是 DOM2 级事件，在 DOM2 级中也包含了 DOM 事件规范。

#### 6.2.1 addEventListener() ####

addEventListener() 方法将指定的事件监听器注册到 EventTarget 上，当该对象触发指定的事件时，指定的回调函数就会被执行。

	target.addEventListener(type, callback[, useCapture]);

参数 type 表示事件类型，callback 表示事件处理程序的回调函数。

useCapture 为可选 boolean 型参数，表示是否采用事件捕获方式来处理事件。不选该参数，则默认值为 false，采用事件冒泡方式处理。

如，页面元素为：
	
	<button id="btn">按钮</button>

JavaScript 中以 DOM2 级绑定事件

	document.getElementById("btn").addEventListener("click", function(){
		alert("hello...");
	}, false);

我们继续来测试一下关于事件冒泡与事件捕获，看一下它们的区别：

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>测试</title>
		<style type="text/css">
			#div-1 {width:400px; height: 400px; background: black;}
			#div-2 {width:200px; height: 200px; background: yellow;}
			#div-3 {width:100px; height: 100px; background: blue;}
		</style>
	</head>
	<body>
		<div id="div-1">
			<div id="div-2">
				<div id="div-3"></div>
			</div>
		</div>
		<script type="text/javascript">
			function $(id){
				return document.getElementById(id);
			}
	
			/* 为三个元素绑定点击事件 */
			$("div-1").addEventListener("click", function(){
				console.log("div-1");
			}, false);
			$("div-2").addEventListener("click", function(){
				console.log("div-2");
			}, false);
			$("div-3").addEventListener("click", function(){
				console.log("div-3");
			}, false);
		</script>
	</body>
	</html>

采用事件冒泡方式处理，执行结果为：

	div-3
	div-2
	div-1

将 addEventListener() 方法第三个参数改为 true，即采用事件捕获的方式来处理：

	/* 为三个元素绑定点击事件 */
	$("div-1").addEventListener("click", function(){
		console.log("div-1");
	}, true);
	$("div-2").addEventListener("click", function(){
		console.log("div-2");
	}, true);
	$("div-3").addEventListener("click", function(){
		console.log("div-3");
	}, true);

执行结果为：

	div-1
	div-2
	div-3

#### 6.2.2 attachEvent() ####

在 IE9.0 及以后的版本中才支持使用 addEventListener() 方法，即在 IE9.0 之前，IE 浏览器都只支持以冒泡的方式来处理事件，要绑定事件，需要使用 attachEvent() 方法，但该方法并不是标准方法。

attachEvent() 方法是微软 IE 为替代 addEventListener() 方法的专有方法，语法结构：

	attached = target.attachEvent(eventNameWithOn, callback)

参数 eventNameWithOn 是事件类型，但需要要事件类型名称前加上前缀 "on"，即事件句柄；callback 为事件处理程序的回调函数。该方法返回事件是否绑定成功。

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>测试</title>
		<style type="text/css">
			#div-1 {width:400px; height: 400px; background: black;}
			#div-2 {width:200px; height: 200px; background: yellow;}
			#div-3 {width:100px; height: 100px; background: blue;}
		</style>
	</head>
	<body>
		<div id="div-1">
			<div id="div-2">
				<div id="div-3"></div>
			</div>
		</div>
		<script type="text/javascript">
			function $(id){
				return document.getElementById(id);
			}
	
			/* 为三个元素绑定点击事件 */
			$("div-1").attachEvent("onclick", function(){
				alert("div-1");
			});
			$("div-2").attachEvent("onclick", function(){
				alert("div-2");
			});
			$("div-3").attachEvent("onclick", function(){
				alert("div-3");
			});
		</script>
	</body>
	</html>

以上示例执行结果为依次弹出警告框，显示 "div-3"、"div-2"、"div-1"。

因为 attachEvent() 是 IE9.0 之前版本所特有的方法，所以只在 IE 浏览器中测试。

对于 attachEvent() 方法的使用，微软官方建议在 IE11 及之后不要再使用了，改用标准的 addEventListener() 方法：

> attachEvent is no longer supported. Starting with Internet Explorer 11, use addEventListener.

#### 6.2.3 addEventListener() 与 attachEvent() 区别 ####

除了是否支持事件捕获上的区别外，addEventListener() 与 attachEvent() 还存在一些其它区别。

示例1：

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>测试</title>
		<style type="text/css">
			#div-1 {width:400px; height: 400px; background: black;}
		</style>
	</head>
	<body>
		<div id="div-1"></div>
		<script type="text/javascript">
			function $(id){
				return document.getElementById(id);
			}
	
			for (var i = 1; i <= 100; i++) {
				$("div-1").addEventListener("click", callback(i));
			}
	
			function callback(i) {
				return function(){
					console.log("div-1：" + i);
				};
			}
		</script>
	</body>
	</html>

我使用 addEventListener() 方法为同一个元素绑定了 100 次点击事件，执行结果显示：

	div-1：1
	div-1：2
	div-1：3
	div-1：4
	div-1：5
	div-1：6
	div-1：7
	……………………

即当点击 #div-1 元素时，所绑定的 100 次点击事件都执行了，并且是按照绑定的先后顺序依次执行，即先绑定的事件先执行。

再利用同样的方式使用 attachEvent() 来为同一个元素绑定 100 次点击事件：

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>测试</title>
		<style type="text/css">
			#div-1 {width:400px; height: 400px; background: black;}
		</style>
	</head>
	<body>
		<div id="div-1"></div>
		<script type="text/javascript">
			function $(id){
				return document.getElementById(id);
			}
	
			for (var i = 1; i <= 100; i++) {
				$("div-1").attachEvent("onclick", callback(i));
			}
	
			function callback(i) {
				return function(){
					document.write("div-1：" + i + "<br>");
				};
			}
		</script>
	</body>
	</html>

当点击 #div-1 元素后，页面显示结果为：

	div-1：10
	div-1：9
	div-1：8
	div-1：7
	div-1：11
	div-1：13
	div-1：15
	div-1：17
	……………………

虽然所有绑定的 100 次事件处理程序都执行了，但是就执行顺序上来说，和 addEventListener() 有很大差别。attachEvent() 为同一元素多次绑定同一事件，事件执行顺序是随机的。以下引用的是微软官方对于该方法调用函数顺序的说明：

> If you attach multiple functions to the same event on the same object, the functions are called in random order, immediately after the object's event handler is called.

#### 6.2.4 addEventListener() 与 attachEvent() 的兼容 ####

在不同浏览器版本中，为了兼容 addEventListener() 与 attachEvent() 的使用，可以编写如下函数来复用重复代码：

	function registerHandler(element, type, fn){
		if (element.addEventListener) { // 支持使用 addEventListener
			if (type.indexOf("on") === 0) // 事件类型以 “on” 开头
				type = type.slice(2);
			element.addEventListener(type, fn, false);
		} else {
			if (type.indexOf("on") !== 0) // 事件类型不以 “on” 开头
				type = "on" + type;
			element.attachEvent(type, fn);
		}
	}

#### 6.2.5 解除 DOM2 级事件绑定 ####

对应于 addEventListener() 方法的解除事件绑定方法为 removeEventListener()，对应 attachEvent() 方法的解除事件绑定方法为 detachEvent()。

	target.removeEventListener(type, callback[, useCapture]); // 或
	target.detachEvent(eventNameWithOn, callback)

注意，移除绑定的事件回调函数 callback 不能在方法里面直接以匿名函数的方式写，而要在外部将函数封装好，然后在通过调用外部这个封装好的函数名来实现绑定和移除。

所以为了兼容 IE 浏览器和标准的浏览器，我们可以编写通用的方法来处理，如下：

	function removeHandler(element, type, fn){
		if (element.removeEventListener) { // 支持使用 removeEventListener
			if (type.indexOf("on") === 0) // 事件类型以 “on” 开头
				type = type.slice(2);
			element.removeEventListener(type, fn, false);
		} else {
			if (type.indexOf("on") !== 0) // 事件类型不以 “on” 开头
				type = "on" + type;
			element.detachEvent(type, fn);
		}
	}

示例：

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>测试</title>
		<style type="text/css">
			#div-1 {width:400px; height: 400px; background: black;}
		</style>
	</head>
	<body>
		<div id="div-1"></div>
		<button id="cancel">取消事件</button>
		<script type="text/javascript">
			function $(id){
				return document.getElementById(id);
			}
	
			function registerHandler(element, type, fn){
				if (element.addEventListener) { // 支持使用 addEventListener
					if (type.indexOf("on") === 0) // 事件类型以 “on” 开头
						type = type.slice(2);
					element.addEventListener(type, fn, false);
				} else {
					if (type.indexOf("on") !== 0) // 事件类型不以 “on” 开头
						type = "on" + type;
					element.attachEvent(type, fn);
				}
			}
	
			function removeHandler(element, type, fn){
				if (element.removeEventListener) { // 支持使用 removeEventListener
					if (type.indexOf("on") === 0) // 事件类型以 “on” 开头
						type = type.slice(2);
					element.removeEventListener(type, fn, false);
				} else {
					if (type.indexOf("on") !== 0) // 事件类型不以 “on” 开头
						type = "on" + type;
					element.detachEvent(type, fn);
				}
			}
	
			function first() {
				console.log("first...");
			}
	
			function second() {
				console.log("second...");
			}
			// 为 #div-1 添加绑定两次事件
			registerHandler($("div-1"), "click", first);
			registerHandler($("div-1"), "click", second);
			// 点击按钮取消 #div-1 第一次绑定的事件
			registerHandler($("cancel"), "click", function(){
				removeHandler($("div-1"), "click", first);
			});
		</script>
	</body>
	</html>

### 6.3 小结 ###

绑定 DOM0、DOM2 级事件，也称作注册事件监听器，由上述内容我们可以总结三种注册事件监听器的方法：

1. EventTarget.addEventListener()
2. DOM 元素属性方式：Element.onclick = function(){}
3. HTML 元素属性方式：\<button onclick="fn()">button</button>

按照顺序，在注册事件监听器是优先使用 addEventListener()，其次是非侵入式的 DOM 元素属性方式，最后是侵入式的 HTML 元素属性方式。

DOM2 可以在一个元素上面注册多个相同事件，但是 DOM0 不可以；DOM0 兼容性好，适用于所有浏览器，而 DOM2 在 IE8.0 及以下的版本中使用 attachEvent() 绑定事件，其它浏览器使用 addEventListener() 绑定事件。attachEvent() 绑定的事件只能以事件冒泡的方式处理，而 addEventListener() 可以设置事件冒泡或事件捕获方式处理。

## 7. 阻止默认行为 ##

浏览器中的某些元素是有默认行为的，比如超级链接 \<a> 默认是进行页面跳转，表单 \<form> 中点击提交按钮时默认提交到 action 属性指定的 URL 进行处理，页面中按 Tab 键切换元素焦点，点击鼠标右键默认打开浏览器右键菜单，等等。

如果我们现在要在页面中自定义一个右键菜单，但是浏览器默认点击右键时会将浏览器自带的右键快捷菜单打开，这时我们就需要阻止浏览器的默认行为。event 对象的标准方法 preventDefault() 就用于阻止默认行为：

	event.preventDefault()

示例：

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Document</title>
		<style type="text/css">
			* {margin: 0;padding: 0;}
			ul {width:80px; height:100px; line-height: 20px; border: 1px solid; position: absolute; display: none; list-style: none;}
			li {height: 20px;}
			li:hover {background: #ccc;}
		</style>
	</head>
	<body style="height:3000px;">
		<ul id="right">
			<li>新建</li>
			<li>复制</li>
			<li>粘贴</li>
			<li>剪切</li>
			<li>撤销</li>
		</ul>
	
		<script type="text/javascript" src="js/tools.js"></script>
		<script type="text/javascript">
			document.oncontextmenu = function(e){
				e = e || event;
				// 阻止打开浏览器的右键菜单
				e.preventDefault();
				// 把自定义的右键菜单在鼠标光标处显示
				$("#right").style.display = "block";
				// 获取光标在文档中的定位位置
				var _left = e.pageX ? e.pageX : (document.documentElement.scrollLeft || document.body.scrollLeft) + e.clientX,
					_top = e.pageY ? e.pageY : (document.documentElement.scrollTop || document.body.scrollTop) + e.clientY;
				// 将菜单显示到光标处
				$("#right").style.left = _left + "px";
				$("#right").style.top = _top + "px";
			}
	
			document.onclick = function(){
				$("#right").style.display = "none";
			}
		</script>
	</body>
	</html>

preventDefault() 方法是标准中的方法，但 IE8.0 及以前的版本不支持这种标准方法，所以在 IE 中需要使用 event 对象的 returnValue 属性，将 returnValue 属性设置为 false 表示阻止默认行为。

	if (e.preventDefault) // 支持标准方法 preventDefault() 的使用
		e.preventDefault();
	else // 不支持标准方法
		e.returnValue = false;

不管是使用 preventDefault() 方法还是使用 returnValue 属性，都与 event 对象相关。其实在事件处理函数中，我们还可以通过 `return false;` 语句来阻止默认行为，它也不存在兼容问题。但需要注意的是，`return false;` 是一条完整的语句，在函数中遇到 `return 表达式;` 语句的执行表示结束函数的调用，所以通常将 `return false;` 语句写在函数最后，或是判断当满足一定条件时执行 `return false;` 阻止默认行为。

## 8. 事件委派 ##

相信大家在平时使用的时候有遇到过这样的一种情况：如果事件涉及到添加 HTML 节点的时候，新添加的节点和原有节点的事件处理程序一致，不再一次为新添加节点绑定事件，新添加节点是不会自动实现事件绑定的。

示例1：

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>测试</title>
		<style type="text/css">
			#container div {width:200px; height: 50px; margin-top: 5px; background: red;}
		</style>
	</head>
	<body>
		<button id="add">添加元素</button>
		<div id="container">
			<div>1</div>
			<div>2</div>
			<div>3</div>
			<div>4</div>
			<div>5</div>
		</div>
		<script type="text/javascript">
			var _btn = document.getElementById("add"),
				_container = document.getElementById("container"),
				subDivs = _container.getElementsByTagName("div"),
				index = 6;
			// 为每个 #container 下的子 div 绑定点击事件
			for (var i = 0, len = subDivs.length; i < len; i++) {
				subDivs[i].onclick = function(){
					alert("你点击了 div" + this.innerHTML);
				}
			}
	
			// 为 添加元素 按钮绑定点击事件
			_btn.onclick = function () {
				_container.innerHTML += "<div>"+ (index++) +"</div>";
			}
		</script>
	</body>
	</html>

在循环中，我只为页面中已有的元素绑定了事件，通过按钮点击后添加到 #container 中的节点，我并没有为其绑定事件。当然这时在页面中原有 div 节点上点击，可以触发点击事件处理程序的执行，但新添加的 div 元素并没有这样的功能。

如果希望新添加的元素和原有元素执行相同的事件处理程序，一种方式就是在添加时为新元素绑定事件处理程序，但这种方式显得很冗余。

假设 #container 下的子 div 元素有 500 个，那么就需要绑定 500 次事件处理程序，如果每绑定一次事件的资源开销占用 CPU 5毫秒（非常夸大了）时间，那么绑定 500 次就是 2500 毫秒时间，这对于资源占用来说也是比较浪费的。

能不能有一种方式既能够节省资源，又可以重用事件处理程序呢，我们想到了事件冒泡。

事件冒泡最初是为集中处理事件提供的一种方法，就是说可以**将后代元素上同种类型的事件通过冒泡的方式传播到一个共同的父元素或是祖先元素上处理，那么我们把这种事件处理的方式就称作是事件委派**（或叫事件代理）。

在事件委派中，我们是将后代元素上发生的事件传播到祖先元素上处理，那么就需要在祖先元素上知道具体是哪一个后代元素触发的事件，这时可以使用 event 对象的 `target` 属性，表示最初触发事件的事件源对象。

由于在 IE6-IE8 版本浏览器中，使用 attachEvent() DOM2 级事件绑定，那么对于触发事件的事件源获取，可以使用 `srcElement` 属性。

示例 1 代码可修改如下，示例2：

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>测试</title>
		<style type="text/css">
			#container div {width:200px; height: 50px; margin-top: 5px; background: red;}
		</style>
	</head>
	<body>
		<button id="add">添加元素</button>
		<div id="container">
			<div>1</div>
			<div>2</div>
			<div>3</div>
			<div>4</div>
			<div>5</div>
		</div>
		<script type="text/javascript">
			var _btn = document.getElementById("add"),
				_container = document.getElementById("container"),
				index = 6;
			// 利用事件委派为每个 #container 下的子 div 绑定点击事件
			_container.onclick = function(e) {
				e = e || event;
				var _target = e.target || e.srcElement; // 获取事件源对象
				alert("你点击了 div" + _target.innerHTML);
			}
	
			// 为 添加元素 按钮绑定点击事件
			_btn.onclick = function () {
				_container.innerHTML += "<div>"+ (index++) +"</div>";
			}
		</script>
	</body>
	</html>