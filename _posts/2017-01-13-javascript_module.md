---
layout: post
title: 前端模块化开发
date: 2017-01-13
category: JavaScript
tags: [javascript, module]
---

## 1. 命名冲突 ##

首先从一个简单的习惯开始。

由于以前一直做 JavaEE 开发的缘故，在 JavaScript 开发中，我已经习惯将项目中的一些通用功能抽象出来，形成一个个的独立函数，以便于实现代码复用，如：

	function css(element, attr) { // 获取 element 元素的 attr 对应的 CSS 属性值
		// ...
	}

	function offset(element) { // 获取 element 元素在文档中的位置坐标
		// ...
	}

并把这些封装的函数放在统一的 tools.js 文件中。

如果页面功能实现需要使用到这些函数，则直接通过 `<script src="tools.js"></script>` 引入即可。

前期感觉一切都好，大家也都觉得写这样的工具文件对开发来说很方便，直到使用越来越多，页面功能越来越复杂，大家要实现的需求也越来越多样。

这时有人就抱怨，因为引入了 tools.js 文件，如果要定义一个能够设置 css 属性值的函数，那么就只有取另外的函数名称（如 setCss ）而不能再使用 css 这个函数名称了，同样如果要设置一个元素在整个文档中的定位坐标，也不能再使用 offset 这个函数名称，因为那样的话，就与 tools.js 文件中已定义的函数名称冲突了。

既然问题出现了，就需要解决。

在 Java 中有一个非常实用的技术——`package`，它将逻辑上相关的代码组织在一起使用“包”来进行管理，这相当于文件系统中的文件夹。在文件系统中，文件夹内是相对独立的一个空间，不用担心一个文件夹和另一个文件夹中文件命名的冲突。在“包”中也一样，可以解决文件命名冲突问题，如果要在包外部再使用到包内的资源，直接通过 `import` 导入相关的 `package` 即可。类似包这样的概念，在其它的语言（如 C#）中也称为命名空间。

JavaScript 中并没有提供原生的包或命名空间的支持，但可以使用其它的方法（如对象、闭包）来实现类似的效果。

参照 Java 的方式，我使用 JavaScript 中的对象来简单修改 tools.js 文件：

	var Util = {
		css : function(element, attr) {
			// ...
		},
		offset : function(element) {
			// ...
		}
	};

这样，当引入 tools.js 文件后，要获取 CSS 样式或获取元素的文档坐标，就通过类似 Util.css()/Util.offset() 的方法来实现。css 与 offset 的作用域是在对象 Util 下，再全局或是新对象中定义 css 属性是不受影响的。

Util 这个名称也具有通用性，通常用作辅助工具定义的时候会使用到这个名称，为了体现该名称的唯一性，可以继续借鉴 Java 中 package 的命名规范（域名倒置）：

	var com = {};
	com.github = {};
	com.github.itrainhub = {};
	com.github.itrainhub.Util = {
		css : function(element, attr) {
			// ...
		},
		offset : function(element) {
			// ...
		}
	};

要获取 CSS 样式值，则可使用 `com.github.itrainhub.Util.css()` 方法。但这样的写法增加了记忆难度，YUI 中关于这一点有比较好的解决方案，先按下暂且不表。

使用对象的写法可解决命名冲突问题，但这种写法也会暴露对象的所有成员，使对象内部状态可以在对象外部被改写。比如在对象内部存在计数器：

	var Util = {
		_count : 0
	}

在对象外部可以通过 `Util._count = 18;` 修改该计数器的值，这是不安全的。

像计数器这样的变量，通常可能是作为对象的私有成员存在，不希望在对象外部还能继续修改其值，这时，可以使用 IIFE（立即执行函数）来设计：

	var Util = (function(){
		var _count = 0;
	
		function _css(element, attr) {
			// ...
		}
	
		function _offset(element) {
			// ...
		}
	
		return {
			css : _css,
			offset : _offset
		}
	})();

这样，在外部就不能再直接修改 _count 的值了。

通过命名空间，的确可以解决命名冲突的问题，我们可以暂时松一口气了。

## 2. 文件依赖 ##

接着 tools.js 继续开发。

在 tools.js 的基础上，可以开发出一些 UI 层通用的组件，如放大镜、轮播图之类的，这样各个项目中要使用这些功能的时候就不用重复造轮子了。

通常情况下，每个 UI 组件都是以独立的 js 文件存在的，比如放大镜，可以将它放到一个 zoom.js 的文件中，当要使用到放大镜组件时，通过 `<script src="zoom.js"></script>` 引入即可。

	<script src="tools.js"></script>
	<script src="zoom.js"></script>
	<script>
		zoomIn(/* 传入放大镜效果的配置信息 */);
	</script>

但很多时候，在使用 zoom.js 之前忘记了引入 tools.js，则使用 zoom.js 就会报错，无法保证它的正常执行。

zoom.js 的正常执行依赖于 tools.js 的使用，上述的问题都还是比较容易解决的，但随着团队越来越大，业务需求越来越复杂，项目中组件间的依赖关系也会变得越来越复杂。比如：

某一天，我扩充了 zoom.js 组件的功能，但除了使用到 tools.js 外，还使用到另一个工具 js 组件：helper.js。如果项目中已有 N 个地方之前使用到了 zoom.js 组件，我就只好全局搜索每个引用 zoom.js 的地方，再加上对 helper.js 的引用。

再想想，随着项目推进，我们会继续修改 tools.js，添加更多的组件 component_1.js、component_2.js……某些组件中只使用到 tools.js，某些只使用到 helper.js，而某些组件既使用到了 tools.js 又使用到了 helper.js。那么关于组件间依赖关系的维护，工作量可想而知，如果以人肉的方式来保证依赖关系的维护，简直就要崩溃掉了。

为什么维护组件间的依赖关系这么费神呢，因为 JavaScript 中天生缺少了引入其它 js 文件的语法。在 Java 中可以通过 import 引入依赖组件，在 CSS 中也有 @import 命令去引入其它的 CSS 文件，而 js 中却不能自动管理依赖。

除了文件间的依赖关系维护不便外，如果在页面中引入的组件非常多，我们还得保证引用组件的路径及先后顺序不能出错，一旦出错，又得花时间查找错误，可想而知工作量是很可观了，再加上组件引入过多，又是以同步的方式加载各组件，也可能导致浏览器假死的现象。

要解决这些问题，模块化开发的价值就体现出来了。

## 3. 模块化开发 ##

### 3.1 模块化 ###

所谓模块化，就是把一个相对独立的功能，单独形成一个文件，可输入指定依赖、输出指定的函数，供外界调用，其它都在内部隐藏实现细节。这样即可方便不同的项目重复使用，也不会对项目造成额外的影响。

前端使用模块化载发主要的作用是：

*	异步加载 js，避免浏览器假死
*	管理模块间依赖关系，便于模块的维护

有了模块，我们就可以更方便地使用别人的代码，想要什么功能，就加载什么模块。

但要使用模块的前提，是必然要形成可遵循的开发规范，使得开发者和使用者都有据可寻，否则你有你的写法，我有我的写法，大家没办法统一，也就不能很好的互用了。

目前通用的规范是，服务器端使用 CommonJS 规范，客户端使用 AMD/CMD 规范。

### 3.2 CommonJS ###

CommonJS 规范出现是在 2009 年，Node.js 就是该规范的实现。CommonJS 规范中是这样加载模块的：

	var gulp = require("gulp");
	gulp.task(/* 任务 */);

模块的加载是同步的，这种写法适合服务器端，因为在服务器读取的模块都是在本地磁盘，加载速度很快，可同步加载完成。但是如果在客户端浏览器中，因为模块是放在服务器端的，模块加载取决于网络环境，以同步的方式加载模块时有可能出现“假死”状况。

今天我主要介绍针对浏览器编程，不针对 Node.js 内容，所以在此关于 CommonJS 规范就不作深究，知道 require() 用于加载模块即可。

### 3.3 AMD ###

由于在浏览器端，模块使用同步方式加载可能出现假死，那么我们采用异步加载的方式来实现模块加载，这就诞生了 AMD 的规范。

AMD 即 Asynchronous Module Definition 的简称，表示“异步模块定义”的意思。AMD 规范：[https://github.com/amdjs/amdjs-api/wiki/AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)。

AMD 采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖所加载模块的语句，都被定义在一个回调函数中，等到模块加载完毕后，回调函数才会执行。

AMD 也采用 require() 来加载模块，语法结构为：

	require([module], callback);

module 是数组参数，表示所加载模块的名称；callback 是回调函数参数，所有模块加载完毕后执行该回调函数。如：

	require(["jquery"], function($){
		$("#box").text("test");
	});

[RequireJS](http://requirejs.org/) 实现了 AMD 规范，使用详情见：[《》]()。

### 3.4 CMD ###

CMD 即 Common Module Definition 的简称，表示“通用模块定义”的意思。CMD 规范：[https://github.com/cmdjs/specification/blob/master/draft/module.md](https://github.com/cmdjs/specification/blob/master/draft/module.md)。

CMD 规范明确了模块的基本书写格式和基本交互规则，该规范是在国内发展出来的，由玉伯在推广 SeaJS 过程中规范产出的。

[SeaJS](http://seajs.org/) 实现了 CMD 规范。SeaJS 要解决的问题和 RequireJS 一样，只不过在模块定义方式和模块加载（运行、解析）时机上有所不同。

SeaJS 使用详情见：[《》]()。

### 3.5 AMD 与 CMD 的区别 ###

AMD 是 RequireJS 在推广过程中对模块定义的规范化产出。

CMD 是 SeaJS 在推广过程中对模块定义的规范化产出。

二者主要区别如下：

1.	对于依赖的模块，AMD 是提前执行，CMD 是延迟执行。
2.	CMD 推崇依赖就近，AMD 推崇依赖前置。
3.	AMD 的 API 默认是一个当多个用，CMD 的 API 严格区分，推崇职责单一。

当然还有一些其它细节上的区别，具体看规范的定义就好。

大家也可参照 [https://www.zhihu.com/question/20351507/answer/14859415](https://www.zhihu.com/question/20351507/answer/14859415) 或 [https://www.zhihu.com/question/20342350](https://www.zhihu.com/question/20342350) 看看玉伯对 AMD 与 CMD 区别的见解。