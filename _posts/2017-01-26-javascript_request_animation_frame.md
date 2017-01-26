---
layout: post
title: 使用 window.requestAnimationFrame 实现动画效果
date: 2017-01-26
category: JavaScript
tags: [requestAnimationFrame]
---

## 1. 简介

原生 JavaScript 中，我们可以通过 setTimeout() 或是 setInterval() 来不断更新元素状态以实现动画效果。要看到流畅的动画效果，就需要在更新元素状态时以一定的频率进行，我们先来了解一下“帧”的概念。

以下是百度百科是关于“帧”的说明：

> 为了更好地说明帧的概念，我们先来看看电影播放的基本原理。
> 
> 在放映电影的过程中，画面被一幅幅地放映在银幕上。画幅移开时，光线就被遮住，幕上便出现短暂的黑暗；每放映一个画幅后，幕上就黑暗一次。但这一次次极短暂的黑暗，被人的视觉生理现象“视觉暂留”所弥补。人眼在观察景物时，光信号传入大脑神经需经过一段短暂时间，光的作用结束时，视觉也不立即消失。视觉的这一现象称为“视觉暂留”。当电影画面换幅频率达到每秒15幅~30幅时，观众便见不到黑暗的间隔了，这时人“看到”的就是运动的事物，这就是电影的基本原理。这里的一幅画面就是电影的一帧，实际上就是电影胶片中的一格。
> 
> 帧——就是影像动画中最小单位的单幅影像画面。一帧就是一副静止的画面，连续的帧就形成动画，如电视图象等。我们通常说帧数，简单地说，就是在1秒钟时间里传输的图片的帧数，也可以理解为图形处理器每秒钟能够刷新几次，通常用 FPS（Frames Per Second）表示。每一帧都是静止的图象，快速连续地显示帧便形成了运动的假象。高的帧率可以得到更流畅、更逼真的动画。每秒钟帧数 (fps) 愈多，所显示的动作就会愈流畅。

了解了帧的概念，我们再回顾一下[《浏览器是如何工作的？》](/2016/11/javascript_how_broswers_work/)。

![浏览器如何工作](/images/posts/jshowbrowserworks/2.png)

浏览器中网页的生成过程大致可以分成五步：

1.	HTML 代码转化成 DOM
2.	CSS 代码转化成 CSSOM（CSS Object Model）
3.	结合 DOM 和 CSSOM，生成一棵渲染树（包含每个节点的视觉信息）
4.	生成布局（layout），即将所有渲染树的所有节点进行平面合成
5.	将布局绘制（paint）在屏幕上

这几个步骤中，第 1 到 3 步执行速度非常快，但第 4、5 步就比较耗时了。

网页在生成时至少会渲染一次，在用户访问过程中，还会不断地重新渲染，重新渲染就需要重新生成布局（reflow，也称重排）和重新绘制（repaint，也称重绘）。修改 DOM、修改样式表或是用户事件（如页面滚动、改变窗口大小等）都会导致页面重新渲染，reflow 和 repaint 不断被触发，这在用户访问过程中是不可避免的。

因为 reflow 和 repaint 非常耗时，所以重新渲染也是导致网页性能低下的根本原因，要提高网页性能，就是要降低 reflow 和 repaint 的频率和成本，尽量少触发重新渲染。

但很多时候，密集的重新渲染又是不可避免的，比如 scroll 事件响应程序的处理、网页动画效果等。

网页动画的每一帧都是一次重新渲染。每秒低于 24 帧的动画，人眼就能捕获到停顿，动画效果就感觉有卡顿，一般网页动画，需要达到 30 至 60 fps 才能比较流畅。网页动画和电影动画的帧率又有些差别，可参考 [https://www.zhihu.com/question/21081976](https://www.zhihu.com/question/21081976) 继续了解，不详细说明。

![刷新](/images/posts/jsframes/frame1.jpg)

大多数显示器的刷新频率是 60Hz（1Hz = 1次/秒），所以，如果网页动画能够做到每秒 60 帧，就会跟显示器同步刷新，达到最佳的视觉效果。这意味着，一秒之内进行 60 次重新渲染，每次重新渲染的时间不能超过 16.7 毫秒，这也是我们在使用 setTimeout() 或 setInterval() 定时器实现动画效果时推荐的时间间隔。

![图片2](/images/posts/jsframes/frame2.jpg)

但是，使用 setTimeout() 和 setInterval() 绘制的动画并没有为 Web 开发人员提供有效的方法来规划动画的图形计时器。这导致了动画过度绘制，浪费 CPU 周期以及消耗额外的电能等问题。而且，即使看不到网站，特别是当网站使用背景选项卡中的页面或浏览器已最小化时，动画都会频繁出现（新版浏览器中对此也有优化，可参见[翻译：setInterval与requestAnimationFrame的时间间隔测试](https://segmentfault.com/a/1190000000386368)）。

使用时间间隔 10ms（过度绘制）的计时器绘制动画时，计时与显示器刷新频率可能不匹配，如下所示：

![图片3](/images/posts/jsframes/frame3.png)

上面一行表示大多数监视器上显示的 16.7ms 显示频率，而下面一行表示 10ms setTimeout()。每个第三个图形都无法绘制（由红色箭头指示），因为在显示器刷新间隔之前发生了其他绘制请求。这种过度绘制的情况会导致动画断续显示，因为所有第三帧都会丢失。这种计时器定时时间降低也会对电池使用寿命造成负面影响，并会降低其它应用的性能。

requestAnimationFrame() 方法可以解决丢失帧的问题，因为它使应用能够在浏览器需要更新页面显示时获得通知，它用来在页面重绘之前，通知浏览器调用一个指定的函数，以满足开发者操作动画的需求。因此，使用 requestAnimationFrame()，应用可与浏览器的绘制时间间隔保持完全一致，并且仅使用适量的资源，可实现性能上的优化。

## 2. 使用 window.requestAnimationFrame

requestAnimationFrame() 方法原理其实跟 setTimeout 差不多，通过递归调用同一方法来不断更新画面以达到动起来的效果，但它优于 setTimeout 的地方在于它是由浏览器专门为动画提供的API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了CPU开销。

语法：

	var id = window.requestAnimationFrame(callback);
	
callback 参数为回调函数，在每次重新绘制动画时调用该函数，该回调函数有一个参数，表示当前时间距离开始触发 requestAnimationFrame 的回调的时间。

该方法返回一个长整型非 0 值，作为唯一的标识符。可以像停止定时器 clearTimeout() 一样，将返回值传递到 window.cancelAnimationFrame() 中，取消一个先前通过调用 window.requestAnimationFrame() 方法添加到计划中的动画帧请求。

下面是一个旋转动画的例子，元素每一帧旋转 1 度，为了快速查找页面元素及绑定事件处理，使用了 jQuery：

	<script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>
	<script type="text/javascript">
		$(function(){
			// 点击按钮，开启旋转动画
			$("#btn").click(function(){
				update();
			});
			
			// 角度
			var degrees = 0;
			
			// 动画方法
			function update() {
				if (degrees >= 360) return;
				$("#box").css("transform", "rotate("+ (++degrees) +"deg)");
				window.requestAnimationFrame(update); // 递归调用实现动画效果
			}
		});
	</script>
	
<button id="btn">按钮</button>

<div id="box" style="width:100px;height:100px;background:red;position:relative;top:0;left:0;border-right:3px solid black"></div><script src="http://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script><script type="text/javascript">$(function(){function n(){t>=360||($("#box").css("transform","rotate("+ ++t+"deg)"),window.requestAnimationFrame(n))}$("#btn").click(function(){n()});var t=0});</script>

再举一个模拟进度条的例子，点击按钮后进度从 0 增长到 100%：

	<script type="text/javascript">
		$(function(){
			$("#btn2").click(function(){
				update();
			});

			// 当前进度
			var progress = 0;
			// 动画方法
			function update() {
				if (progress >=  100) return;
				$("#progressbar").css("width", ++progress * 2).text(progress+"%");
				window.requestAnimationFrame(update); // 递归调用实现动画效果
			}
		});
	</script>

<button id="btn2">按钮</button>

<div id="progressbar" style="height:30px;background:#00f;width:0;text-align:center;line-height:30px;color:white"></div><script type="text/javascript">$(function(){function n(){t>=100||($("#progressbar").css("width",2*++t).text(t+"%"),window.requestAnimationFrame(n))}$("#btn2").click(function(){n()});var t=0});</script>

## 3. 浏览器兼容问题

![兼容](/images/posts/jsframes/browser_support.png)

更为具体的兼容性大家可以通过 [caniuse](http://caniuse.com/#search=requestAnimationFrame) 查询。

由上图可以看出，在老版本的浏览器中，requestAnimationFrame() 方法不被支持，为了让代码能够有更好的浏览器兼容性，即在旧版本的浏览器上也能运行不报错，我们可以写一段代码让浏览器在不支持 requestAnimationFrame() 的情况下使用 setTimeout() 以达到类似效果，把这样的代码称为 Polyfill（垫片），通俗点来说，就是代码备胎的意思。

以下借鉴 paulirish 发布在 GitHub Gist 上的代码片段 [requestAnimationFrame polyfill](https://gist.github.com/paulirish/1579671)，用于在不支持 requestAnimationFrame 的浏览器中回退到 setTimeout 来实现：

	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	
	// MIT license
	
	(function() {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
	                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }
	 
	    if (!window.requestAnimationFrame)
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
	              timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	 
	    if (!window.cancelAnimationFrame)
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
	}());
	
## 4. 小结

虽然 CSS3 中的 transition 或 animation 动画也能实现与 requestAnimationFrame 一样的绘制原理，但 CSS3 动画也不是适用于所有的属性，如 scrollTop 值，CSS3 就无能为力了。同时，CSS3 支持的动画效果有限，如果要实现某些特殊的缓动效果，还得使用 requestAnimationFrame 或 setTimeout 来实现。而 setTimeout 又可能存在过度绘制问题，浪费 CPU 资源或消耗更多额外的电池电能，所以使用 requestAnimationFrame 来优化是很有必要的。

参考：

[基于脚本的动画的计时控制（“requestAnimationFrame”）](https://msdn.microsoft.com/library/hh920765(v=vs.85).aspx)

[网页性能管理详解：浅谈chrome-Timeline及window.requestAnimationFrame()方法](http://www.mamicode.com/info-detail-1057819.html)

[MDN window.requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

[requestAnimationFrame for Smart Animating](https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)

[CSS3动画那么强，requestAnimationFrame还有毛线用？](http://www.zhangxinxu.com/wordpress/2013/09/css3-animation-requestanimationframe-tween-动画算法/)