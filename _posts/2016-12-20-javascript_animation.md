---
layout: post
title: JavaScript 中的运动
date: 2016-12-20
category: JavaScript
tags: [JavaScript]
---

## 1. 概述 ##

JavaScript 中的运动效果使用非常多，比如页面中常见的轮播图效果、图片淡入淡出效果、广告图片展开隐藏效果等等，都涉及到运动。

我们可以使用各种运动框架去完成运动效果，当然也可以先自己来实现一套运动框架。

## 2. 算法实现 ##

### 2.1 基本的水平匀速运动效果 ###

在实现元素水平匀速运动前，选将页面元素定位方式设置为 "absolute" 绝对定位，我们在 JS 代码中将元素 CSS 属性 left 值定时修改即可。要实现实时修改操作，又需要使用到定时器来完成功能，这里使用 setInterval() 方法：

	<script type="text/javascript">
		// 根据 id 查找页面元素
		function $(id) {
			return document.getElementById(id);
		}
		
		// 查找 element 元素 attr CSS 属性值
		function css (element, attr) {
			return element.currentStyle 
					? element.currentStyle[attr] 
					: getComputedStyle(element, null)[attr];
		}

		var _left = parseFloat(css($("box"), "left")) || 0, // 初始水平定位
			speed = 5; // 水平运动速度

		// 启动定时器，运动
		var timer = setInterval(function(){
			_left += speed;
			if (_left >= 200){ // 运动到达目标终点，取消定时器
				_left = 200;
				clearInterval(timer);
			}
			// 设置定位位置
			$("box").style.left = _left + "px";
		}, 30);
	</script>

以上代码只是实现水平向右运动，如果要实现水平向左运动呢？

	var _left = parseFloat(css($("box"), "left")) || 0, // 初始定位
		speed = -5; // 水平速度

	// 启动定时器，运动
	var timer = setInterval(function(){
		_left += speed;
		if (_left <= 0){ // 运动到达目标终点，取消定时器
			_left = 0;
			clearInterval(timer);
		}
		// 设置定位位置
		$("#box").style.left = _left + "px";
	}, 30);

只需更改速度 speed 变量值，及将终点条件判断改为 `_left <= 0` 后的逻辑运算，其它部分不用修改。

### 2.2 适用不同属性的运动效果 ###

那如果要实现垂直方向的运动呢，其操作和水平方向运动相似，垂直向下运动：

	var _top = parseFloat(css($("box"), "top")) || 0, // 初始定位
		speed = 5; // 垂直速度

	// 启动定时器，运动
	var timer = setInterval(function(){
		_top += speed;
		if (_top >= 200){ // 运动到达目标终点，取消定时器
			_top = 200;
			clearInterval(timer);
		}
		// 设置定位位置
		$("#box").style.left = _top + "px";
	}, 30);

垂直向上运动：

	var _top = parseFloat(css($("box"), "top")) || 0, // 初始定位
		speed = -5; // 垂直速度

	// 启动定时器，运动
	var timer = setInterval(function(){
		_top += speed;
		if (_top <= 0){ // 运动到达目标终点，取消定时器
			_top = 0;
			clearInterval(timer);
		}
		// 设置定位位置
		$("#box").style.left = _top + "px";
	}, 30);

那如果要修改元素的宽度 width，高度 height 这些属性使其运动呢，和水平/垂直运动也是类似的，但每次再去将上述代码写一次显示非常冗余。这时，我们可以使用函数封装，来实现代码的重用：

	// attr:运动属性
	function animate (attr) {
		var current = parseFloat(css($("box"), attr)) || 0, // 初始定位
			speed = 5; // 速度

		// 启动定时器，运动
		var timer = setInterval(function(){
			current += speed;
			if (current >= 200){ // 运动到达目标终点，取消定时器
				current = 200;
				clearInterval(timer);
			}
			// 设置元素CSS属性
			$("#box").style[attr] = current + "px";
		}, 30);
	}

这样就可以适用于如width、height、left、right 属性的运动了，但执行后又发现，上述函数的功能要实现，必须是初始属性值在小于 200 时才能实现功能，那如果初始属性值大于 200 则不会有动画效果，而直接会将元素指定 CSS 属性值设置为 "200px"。

继续优化：

	// attr:运动属性
	// target:属性运动终值
	function animate (attr, target) {
		var current = parseFloat(css($("box"), attr)) || 0, // 初始定位
			speed = target > current ? 5 : -5; // 根据终值与初始值计算速度

		// 启动定时器，运动
		var timer = setInterval(function(){
			current += speed; // 计算运动当前值
			if (speed > 0 && current >= target
				|| speed < 0 && current <= target){ // 运动到达目标终点，取消定时器
				current = target;
				clearInterval(timer);
			}
			// 设置元素CSS属性
			$("#box").style[attr] = current + "px";
		}, 30);
	}

将运动的属性与终值都作为参数传递到 animate() 函数内部，在函数内根据目标终值与运动前初始值大小关系决定运动速度的正负情况。运动到达目标终值后，停止定时器，运动效果完成。

### 2.3 页面多元素运动 ###

上面所封装的函数也仅适用于页面上固定的 id 为 box 的元素，如果页面上有 10 个元素需要设置运动动画效果，那它就不适用了。

优化：

	// element:待添加运动动画的元素
	// attr:运动属性
	// target:属性运动终值
	function animate (element, attr, target) {
		var current = parseFloat(css(element, attr)) || 0, // 初始定位
			speed = target > current ? 5 : -5; // 根据终值与初始值计算速度

		// 启动定时器，运动
		var timer = setInterval(function(){
			current += speed; // 计算运动当前值
			if (speed > 0 && current >= target
				|| speed < 0 && current <= target){ // 运动到达目标终点，取消定时器
				current = target;
				clearInterval(timer);
			}
			// 设置元素CSS属性
			element.style[attr] = current + "px";
		}, 30);
	}

将待添加运动动画的元素作为函数参数传递到函数体内部使用，这样，就可以根据传递的不同页面 DOM 元素去获取各自的指定属性初始值，设置各自属性的运动中值及终值。

### 2.4 定时器问题 ###

2.3 节中封装的函数，如果某一个 DOM 元素调用它执行一次完整的运动动画效果，可以顺利的执行起来。但在页面中实现如下按钮所示功能：

	<button id="right">将 #box 元素水平移动到 800 像素</button>
	<button id="left">将 #box 元素水平移动到 100 像素</button>

JS 片段：

	$("right").onclick = function(){
		animate($("box"), "left", 800);
	};
	$("left").onclick = function(){
		animate($("box"), "left", 100);
	};

如果点击 #right 按钮等到 #box 元素完全移动到 800 像素位置后，再点击 #left 按钮让 #box 移动到 100 像素位置，能够顺利执行。但如果点击 #right 按钮后，在 #box 移动到中途（比如 450 像素位置）时，又点击 #left 按钮让元素移动到 100 像素位置，这时页面中 #box 元素就会出现运动抖动现象。

因为点击两个按钮时，都各自创建了一个定时器，来使 #box 的元素向自己指定的方向运动，而在定时器中操作的运动元素指向的是同一个 DOM 元素对象，所以向右运动的定时器起作用时，元素在页面定位位置靠右，向左定时器起作用时，元素在页面定位位置又变成靠左了。

要解决这个问题，可以设置当按下 #left 按钮时，取消 #right 按下时设置的定时器，在按下 #right 按钮时，取消 #left 按下时设置的定时器。这就意味着针对同一个元素操作的定时器应该使用同一个引用：

	// 定时器 id
	var timer = null; 

	// element:运动元素
	// attr:运动属性
	// target:属性运动终值
	function animate (element, attr, target) {
		// 先取消在 timer 中保存的定时器
		clearInterval(timer);

		var current = parseFloat(css(element, attr)) || 0, // 初始定位
			speed = target > current ? 5 : -5; // 根据终值与初始值计算速度

		// 启动定时器，运动
		timer = setInterval(function(){
			current += speed; // 计算运动当前值
			if (speed > 0 && current >= target
				|| speed < 0 && current <= target){ // 运动到达目标终点，取消定时器
				current = target;
				clearInterval(timer);
			}
			// 设置元素CSS属性
			element.style[attr] = current + "px";
		}, 30);
	}

但如果页面中有多个元素要同时实现运动动画效果，使用上述函数后，最终的效果是页面中只能有一个元素表现动画效果，因为每个元素添加运动动画时，都会将其它元素上添加的运动动画定时器取消掉。那这样如果要实现多个元素同时添加上运动动画，是否要定义多个变量来保存定时器呢，在运动结束时又该如果取消设置的定时器呢。

为解决这个问题，我们将各元素上添加的运动动画定时器和元素本身绑定在一起，也就是说，为哪个元素添加运动动画效果，就直接以属性的方式将定时器 id 保存在该元素属性中，这样就可以解决多个元素各自运动定时器独立开的问题，也不用想办法去找怎么定义多个不同的变量，查找不同变量了。

修改如下：

	// element:运动元素
	// attr:运动属性
	// target:属性运动终值
	function animate (element, attr, target) {
		// 先取消 element 本身已有的定时器，结束前一次运动动画
		clearInterval(element.timer);

		var current = parseFloat(css(element, attr)) || 0, // 初始定位
			speed = target > current ? 5 : -5; // 根据终值与初始值计算速度

		// 启动定时器，运动，将定时器 id 保存在当前元素的属性中
		element.timer = setInterval(function(){
			current += speed; // 计算运动当前值
			if (speed > 0 && current >= target
				|| speed < 0 && current <= target){ // 运动到达目标终点，取消定时器
				current = target;
				clearInterval(timer);
			}
			// 设置元素CSS属性
			element.style[attr] = current + "px";
		}, 30);
	}

### 2.5 多属性运动问题 ###

上述封装都还只是针对的是某元素的单属性运动问题，如果元素有多个属性需要同时运动，比如一个元素需要同时在水平和垂直方向运动，继续修改：

	// element:运动元素
	// options:存放各运动目标终值的对象，如：{top:200, width:300, left:100}
	function animate (element, options) {
		// 先取消 element 本身已有的定时器，结束前一次运动动画
		clearInterval(element.timer);
		// 定义对象来保存各运动属性的初始值，速度
		var current = {}, speed = {};
		// 设置各运动属性初值、速度
		for (var attr in options) {
			current[attr] =  parseFloat(css(element, attr)) || 0;
			speed[attr] = options[attr] > current[attr] ? 5 : -5;
		}

		// 启动定时器，运动，将定时器 id 保存在当前元素的属性中
		element.timer = setInterval(function(){
			var clear = true; // 标记是否应该关闭定时器，所有属性都运动到达目标终点才关闭
			// 各属性计算运动当前值，设置运动当前值
			for (var attr in options) {
				current[attr] += speed[attr];
				if (speed[attr] > 0 && current[attr] >= options[attr]
						|| speed[attr] < 0 && current[attr] <= options[attr]) {
					current[attr] = options[attr];
				}
				// 设置元素 css 属性
				element.style[attr] = current[attr] + "px";
				// 计算是否应该关闭定时器
				if (current[attr] !== options[attr]) { // 当前属性未运动到达目标终点
					clear = false;
				}
			}
			// 所有属性运动到达目标终点，停止定时器
			if (clear){
				clearInterval(element.timer);
			}
		}, 30);
	}
	
至此，同一元素多属性运动问题算是基本解决了。如：

	animate($("box"), {top:200, left:300, width:100, height:300});
	
### 2.6 能够控制时间的单属性运动效果

不管是封装的单属性运动动画，还是多属性运动动画，都还不支持时间控制，比如 3 秒完成从起始位置运动到达目标终点，或是 400 毫秒完成运动动画。我们还是先来看最简单的单属性控制时间的运动动画，仍以匀速运动为例介绍。

![animate](/images/posts/jsanimate/animate.png)

如果要使 #box 元素从页面中水平位置 100 像素处运动到 500 像素处，总耗时控制在 2 秒完成运动动画，我们来分析运动过程。

从水平位置 100 像素到 500 像素处，有 400 像素宽度的可运动区间，在这 400 像素运动区间内，如果控制 2 秒完成运动动画，我们可以计算一下单位时间的运动距离。在实现运动动画效果时，我们使用了 setInterval() 方法来周期性使元素每隔指定时间修改一次运动属性值的设置，而 setInterval() 计时单位为毫秒，将 2 秒换算为 2000 毫秒来处理。

可以求出 1 毫秒单位时间的运动距离：`400 / 2000`，即 `运动区间宽度 / 总时间`。那么，如果运动已经经过 1200 毫秒了，就可以计算出运动过的距离：`1200 * 400 / 2000`，即 `已运动时间 * 运动区间宽度 / 总时间`。如果要换算成水平方向元素的定位位置，则再加上元素运动前的初始水平定位位置即可：`运动元素水平定位 = 已运动时间 * 运动区间宽度 / 总时间 + 运动前初始水平定位`。

根据推导的公式，如果运动时间达到 2000 毫秒，则恰好到达运动目标终值。

由水平方向运动动画，可推广到其它属性，公式类似。代码表述如下：

	// element: 待添加运动动画元素
	// speed: 设置运动总时间
	// attr: 运动属性
	// target: 运动终值
	function animate(element, speed, attr, target) {
		clearInterval(element.timer);
		// 运动前初始位置
		var start = parseFloat(css($("box"), attr)) || 0;
		// 可运动区间范围
		var origin = target - start;
		// 运动前先记录一下起始运动时间
		var startTime = +new Date();
		// 运动
		element.timer = setInterval(function(){
			// 计算运动耗时
			var elapse = Math.min(+new Date() - startTime, speed);
			// 根据公式计算运动过程中属性值
			var value = (elapse * origin / speed) + start;
			// 设置属性值
			element.style[attr] = value + "px";
			// 当运动到达指定时间，则停止定时器
			if (elapse === speed) {
				clearInterval(element.timer);
			}
		}, 30);
	}
	
假如设置运动总时间控制为 100 毫秒，则理论上定时器 setInterval() 指定函数会在 30 毫秒、60 毫秒、90 毫秒和 120 毫秒时被调用（实际可能由于 event loop 机制有一定的时间延迟）。

我们发现，在运动到 100 毫秒时，并不会触发 setInterval() 第一个参数函数的执行，而是再继续运动 20 毫秒后才执行该函数，这就意味着在运动过程中，多余了 20 毫秒的运动时间，如果我们在计算运动过程值时使用 `运动元素属性值 = 已运动时间 * 运动区间范围 / 总时间 + 运动前初始值` 公式，则算出的属性值会超出目标终值的范围，显然这是不合适的。

虽然多运动了 20 毫秒的时间，但我们不能在超出运动目标终值后再继续运动，这样和运动需求相郣。也就是说，即使多运动了 20 毫秒时间，我们最终还是应该以运动 100 毫秒来计算运动属性值，使得能够正常在运动时到达运动目标。这也是 `var elapse = Math.min(+new Date() - startTime, speed);` 这条语句的主要作用。

### 2.7 能够控制时间的多属性运动

同样将控制时间时的单属性运动扩展到多属性运动：

	// element:待实现运动动画的元素
	// options: 对象，保存运动目标终值的对象
	// speed: 控制运动时间，单位---毫秒
	function animate(element, options, speed) {
		// 先取消当前元素上之前的运动动画
		clearInterval(element.timer);
		// 保存各属性运动前的初始值
		var start = {};
		// 保存各属性运动的范围
		var origin = {};
		// 获取各运动初始的初始值
		for (var attr in options) {
			start[attr] = parseFloat(css(element, attr)) || 0;
			origin[attr] = options[attr] - start[attr];
		}

		// 记录运动起始时间
		var startTime = +new Date();
		// 启动定时器，实现运动动画
		element.timer = setInterval(function(){
			// 计算已运动时间
			var elapsed = Math.min(+new Date() - startTime, speed);
			// 换算各属性当前次属性值
			for (var attr in options) {
				// 计算当前遍历到的 attr 属性值
				var value = elapsed * origin[attr] / speed + start[attr];
				// 设置 element 元素CSS属性值
				element.style[attr] = value + "px";
			}
			// 判断是否停止定时器
			if (elapsed === speed) {
				clearInterval(element.timer);
			}
		}, 30);
	}
		
步骤和单属性运动动画步骤基本一致，只是使用了 for-in 循环结构遍历了每个运动的属性，将各属性的初值、可运动范围都保存在了对象中，在设置运动值时使用到了这些值。

### 2.8 不透明度的处理

如果需要有不透明度的渐变运动效果，那么将之前的函数继续改造一下：

	// element:待实现运动动画的元素
	// options: 对象，保存运动目标终值的对象
	// speed: 控制运动时间，单位---毫秒
	function animate(element, options, speed) {
		// 先取消当前元素上之前的运动动画
		clearInterval(element.timer);
		// 保存各属性运动前的初始值
		var start = {};
		// 保存各属性运动的范围
		var origin = {};
		// 获取各运动初始的初始值
		for (var attr in options) {
			start[attr] = parseFloat(css(element, attr)) 
							|| attr === "opacity" ? 1 : 0;
			origin[attr] = options[attr] - start[attr];
		}

		// 记录运动起始时间
		var startTime = +new Date();
		// 启动定时器，实现运动动画
		element.timer = setInterval(function(){
			// 计算已运动时间
			var elapsed = Math.min(+new Date() - startTime, speed);
			// 换算各属性当前次属性值
			for (var attr in options) {
				// 计算当前遍历到的 attr 属性值
				var value = elapsed * origin[attr] / speed + start[attr];
				// 设置 element 元素CSS属性值
				element.style[attr] = value + (attr === "opacity" ? "" : "px");
				// IE opacity
				if (attr === "opacity") {
					element.style.filter = "alpha(opacity="+ (value * 100) +")";
				}
			}
			// 判断是否停止定时器
			if (elapsed === speed) {
				clearInterval(element.timer);
			}
		}, 30);
	}
	
因为 opacity 在 CSS 属性中是没有单位的，所以在设置时不需要添加 px 像素单位。IE 低版本浏览器中不支持 opacity 属性的使用，支持的是过滤器的使用，所以添加了一点关于 IE 中不透明度的处理。

### 2.9 完善及链接运动

在调用 animate() 函数执行时，可以设置 speed 参数为可选参数，即如果不设置运动时间，可以默认 speed 为 400 毫秒的时间。

在运动动画执行结束后，如果还有后继需要继续执行的函数，可以继续传递后继执行函数。

修改如下：

	// element:待实现运动动画的元素
	// options: 对象，保存运动目标终值的对象
	// speed: 控制运动时间，单位---毫秒，可选参数，不选则默认 400 ms
	// fn : 运动动画结束后，继续执行的函数
	function animate(element, options, speed, fn) {
		// 判断是否有传递时间参数
		if (typeof speed === "function"){ // 未传递时间数字，在该参数中接收到函数引用
			fn = speed;
			speed = 400; // 默认值 400 毫秒
		}

		// 先取消当前元素上之前的运动动画
		clearInterval(element.timer);
		// 保存各属性运动前的初始值
		var start = {};
		// 保存各属性运动的范围
		var origin = {};
		// 获取各运动初始的初始值
		for (var attr in options) {
			start[attr] = parseFloat(css(element, attr)) 
							|| (attr === "opacity" ? 1 : 0);
			origin[attr] = options[attr] - start[attr];
		}

		// 记录运动起始时间
		var startTime = +new Date();
		// 启动定时器，实现运动动画
		element.timer = setInterval(function(){
			// 计算已运动时间
			var elapsed = Math.min(+new Date() - startTime, speed);
			// 换算各属性当前次属性值
			for (var attr in options) {
				// 计算当前遍历到的 attr 属性值
				var value = elapsed * origin[attr] / speed + start[attr];
				// 设置 element 元素CSS属性值
				element.style[attr] = value + (attr === "opacity" ? "" : "px");
				// IE opacity
				if (attr === "opacity") {
					element.style.filter = "alpha(opacity="+ (value * 100) +")";
				}
			}
			// 判断是否停止定时器
			if (elapsed === speed) {
				clearInterval(element.timer);
				// 判断，有要继续执行的函数，则调用
				fn && fn();
			}
		}, 30);
	}
	
调用示例：

	animate($("box"), {top:200}, 2000， function(){
		animate($("box"),{left:300}, 3000, function(){
			animate($("box"), {width:400});
		});
	});

### 2.10 其它运动效果

以上的封装都是针对匀速运动的封装，匀速运动也称线性运动，但实际开发中，可能也会遇到其它类型的运动效果，比如加速运动、减速运动、先加速后减速运动等。要实现其它类型的运动效果，更多的是在算法上的不同，就逻辑步骤上来说，和匀速运动基本一致。借鉴 Tween 算法来改进我的运动框架：

	// element:待实现运动动画的元素
	// options: 对象，保存运动目标终值的对象
	// speed: 控制运动时间，单位---毫秒，可选参数，不选则默认 400 ms
	// easing: 运动类型，可选参数，可取值有：linear、easeIn、easeOut、easeInOut，默认为 linear
	// fn : 运动动画结束后，继续执行的函数
	function animate(element, options, speed, easing, fn) {
		// 判断是否有传递时间参数、运动类型参数
		if (typeof speed === "string"){ // 未传递时间数字，该参数中接收到字符串，表示运动类型
			fn = easing;
			easing = ["linear", "easeIn", "easeOut", "easeInOut"].indexOf(speed) !== -1
						? speed : "linear";
			speed = 400;
		} else if (typeof speed === "function"){ // 未传递时间数字，在该参数中接收到函数引用
			fn = speed;
			easing = "linear"; // 默认运动类型为 “linear”
			speed = 400;
		} else if (typeof speed === "undefined") { 
			speed = 400;
			easing = "linear";
		} else if (typeof easing === "function") { // 未传递运动类型，该参数表示函数
			fn = easing;
			easing = "linear"; // 默认运动类型为 “linear”
		} else if (typeof easing === "undefined") {
			easing = "linear";
		}
		// 确保 easing 在 linear、easeIn、easeOut、easeInOut 中取值
		easing = ["linear", "easeIn", "easeOut", "easeInOut"].indexOf(easing) !== -1
						? easing : "linear";

		console.log(speed, easing, fn)

		// 先取消当前元素上之前的运动动画
		clearInterval(element.timer);
		// 保存各属性运动前的初始值
		var start = {};
		// 保存各属性运动的范围
		var origin = {};
		// 获取各运动初始的初始值
		for (var attr in options) {
			start[attr] = parseFloat(css(element, attr)) 
							|| (attr === "opacity" ? 1 : 0);
			origin[attr] = options[attr] - start[attr];
		}

		// 记录运动起始时间
		var startTime = +new Date();
		// 启动定时器，实现运动动画
		element.timer = setInterval(function(){
			// 计算已运动时间
			var elapsed = Math.min(+new Date() - startTime, speed);
			// 换算各属性当前次属性值
			for (var attr in options) {
				var value;

				// 根据运动类型计算当前遍历到的 attr 属性值
				switch(easing) {
					case "linear": // 线性
						value = elapsed * origin[attr] / speed + start[attr];
						break;
					case "easeIn": // 加速
						value = origin[attr] * (elapsed /= speed) * elapsed + start[attr];
						break;
					case "easeOut": // 减速
						value = -origin[attr] * (elapsed /= speed) * (elapsed - 2) + start[attr];
						break;
					case "easeInOut": // 加速减速
						if ((elapsed /= speed / 2) < 1)
							value = origin[attr] / 2 * elapsed * elapsed + start[attr];
						else
							value = -origin[attr] / 2 * ((--elapsed) * (elapsed - 2) - 1) + start[attr];
						break;
				}
				// 设置 element 元素CSS属性值
				element.style[attr] = value + (attr === "opacity" ? "" : "px");
				// IE opacity
				if (attr === "opacity") {
					element.style.filter = "alpha(opacity="+ (value * 100) +")";
				}
			}
			// 判断是否停止定时器
			if (elapsed === speed) {
				clearInterval(element.timer);
				// 判断，有要继续执行的函数，则调用
				fn && fn();
			}
		}, 30);
	}
	
## 3. 小结

上述运动框架还有可优化完善之处，暂无更多时间进行优化，留待后继完善。当然，实际开发中可能更多地会使用到成熟的运动框架，以上的封装作为理解运动原理的一个流程，大家也可以在此基础之上继续完善。