---
title: JavaScript 执行顺序
category: javascript
tags: [javascript]
key: javascript_execution_order
---

我们都知道，JavaScript 是一种描述型脚本语言，它不同于 Java 或 C# 等编译性语言，它不需要进行编译成中间语言，而是由浏览器进行动态地解析与执行。如果你不能了解[浏览器是如何工作的](/2016/11/javascript_how_broswers_work/)，不能了解 JavaScript 的执行顺序，那你就犹如伯乐驾驭不了千里马。

### 1. 术语 ###

在了解 JavaScript 执行顺序之前，我们先来认识几个重要的术语：

#### 1.1 代码块 ####

JavaScript 中的代码块是指由 \<script> 标签分隔的代码段。JavaScript 是按照代码块来进行编译和执行的，代码块之间相互独立的，但是变量和函数可以共享。举个粟子：

```javascript
<script type="text/javascript">
	/* 代码块一 */
	var val = "variable in first block"; // 定义变量
	console.log(info); // 因为没有定义 info，浏览器会出错，下面的语句都不能运行
	console.log("first block");
</script>

<script type="text/javascript">
	/* 代码块二 */
	console.log("second block...");
	console.log(val);
</script>
```

运行结果：

```javascript
Uncaught ReferenceError: info is not defined
second block...
variable in first block
```

从结果中可以看出，在代码块一中运行报错，则报错行后的剩余部分不再执行，但它不会影响代码块二的执行，这就是代码块间的独立性，而代码块二中能调用到代码一中的变量 val，则是块间共享性。

#### 1.2 函数声明与函数表达式 ####

我在 [JavaScript 函数入门](/2016/11/javascript_function_started/) 一文中已经介绍了函数声明与函数表达式：

```javascript
// 函数声明
function functionName([param1[, param2]...) {
	// function_body;
	// [return exp;]
}

// 函数表达式
var func = function([param1[, param2]...){
	// function_body;
	// [return exp;]
}
```

函数声明与函数表达式的区别在于：在 JS 的预编译期，函数声明将会先被提取出来，然后再按顺序执行 JS 代码。

#### 1.3 预编译期与执行期 ####

预编译期 JavaScript 会对本代码块中所有声明的变量和函数进行处理（类似与 C 语言的编译），但需要注意的是此时处理函数的只是声明式函数，而且变量也只是进行了声明但未进行初始化以及赋值。细节可参考 [【翻译】JavaScript Scoping and Hoisting](/2016/11/javascript_scoping_and_hoisting/)。

执行期当然就是负责 JS 代码块的执行。

```javascript
<script type="text/javascript">  
	console.log(str); 
	var str = "aaa";  
	func(); 

	// 声明函数
	function func(){ 
		console.log("执行了声明式函数");  
	}  
    
	// 函数表达式
	var func = function(){ 
		console.log("执行了赋值式函数");  
	}  
</script> 
```

执行结果：
	
```javascript
undefined
执行了声明式函数
```

以上结果是因为在预编译期，变量名称 str、func 和函数声明都做了提升 (hoisting)，但因为函数声明优先级高于变量声明，所以调用 `func()` 时仍然调用到了命名函数来执行。

我们再来看一段代码：

```html
<script type="text/javascript">  
	func();
</script>

<script type="text/javascript">  
	function func(){
		console.log("hello.......");  
	}  
</script>
```

这段代码执行后的结果是什么呢？`Uncaught ReferenceError: func is not defined`。报错了！！！

为什么运行上面的代码浏览器会报错呢？声明函数不是会在预处理期就会被处理了吗，怎么还会找不到 func() 函数呢？其实这是一个理解误点，我们上面说了 JS 引擎是按照代码块来顺序执行的，其实完整的说应该是按照代码块来进行预处理和执行的，也就是说预处理的只是执行到的代码块的声明函数和变量，而对于还未加载的代码块，是没法进行预处理的，这也是边编译边处理的核心所在。

### 2. 执行顺序 ###

有了以上的知识点铺垫，我们来总结一下 JavaScript 的执行顺序：

**step 1. 读入第一个代码块。**

**step 2. 做语法分析，有错则报语法错误（比如括号不匹配等），并跳转到step5。**

**step 3. 对 va r变量和 function 定义做“预编译处理”。**

**step 4. 执行代码段，有错则报错（比如变量未定义）。**

**step 5. 如果还有下一个代码块，则读入下一个代码块，重复step2。**

**step 6. 结束。**

### 3. 发散：JavaScript 脚本引入 ###

当浏览器遇到 \<script>标签（内嵌或是外链 JavaScript 文件）时，因为无从获知 JavaScript 是否会修改页面内容，因此，这时浏览器会停止处理页面，先执行 JavaScript 代码，然后再继续解析和渲染页面。在外链 JavaScript 文件时，浏览器必须先花时间下载文件中的代码，然后解析并执行它。在这个过程中，页面渲染和用户交互完全被阻塞了，细节可参考 [浏览器是如何工作的？](/2016/11/javascript_how_broswers_work/)。

常见在 HTML 页面中引入 JavaScript 脚本的做法有：

**惯例的做法**

最传统的方式是在 head 标签内插入 \<script>标签：

然而这种常规的做法却隐藏着严重的性能问题。根据上述对 \<script> 标签特性的描述，我们知道，在该示例中，当浏览器解析到 \<script> 标签时，浏览器会停止解析其后的内容，而优先下载脚本文件，并执行其中的代码，这意味着，其后的 *.css 样式文件和 \<body> 标签都无法被加载，由于 \<body> 标签无法被加载，那么页面自然就无法渲染了。因此在该 JavaScript 代码完全执行完之前，页面都是一片空白。

**经典的做法**

既然 \<script> 标签会阻塞其后内容的加载，那么将 \<script> 标签放到所有页面内容之后不就可以避免这种糟糕的状况了吗？ 将所有的 \<script> 标签尽可能地放到 \<body> 标签底部（即 \</body> 之前），以尽量避免对页面其余部分下载的影响。实际开发中，这种方式使用最多。

**动态脚本**

通过文档对象模型（DOM），我们可以几乎可以页面任意地方创建脚本：

```javascript
var _script = document.createElement("script"); 
_script.type = "text/javaScript"; 
_script.src = "tools.js"; 
document.getElementsByTagName("body")[0].appendChild(_script);
```

上述代码动态创建了一个外链文件 tools.js 的 \<script> 标签，并将其追加到 \<body> 标签内。这种技术的重点在于：无论在何时启动下载，文件的下载和执行过程不会阻塞页面其他进程（包括脚本加载）。

当然这种做法也存在问题：这种方法加载的脚本会在下载完成后立即执行，那么意味着多个脚本之间的运行顺序可能是无法保证的，当某个脚本对另一个脚本有依赖关系时，就很可能发生错误了。如何解决这个问题，让我们留待后继来解决吧......