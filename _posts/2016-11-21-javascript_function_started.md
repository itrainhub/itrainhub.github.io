---
layout: post
title: JavaScript 函数入门
date: 2016-11-21
category: JavaScript
tags: [javascript, function]
---

### 0. 入门概述 ###

函数是由事件驱动的或者当它被调用时执行的可重复使用的代码块。

在很多传统语言（C/C++/Java/C#等）中，函数都是作为一个二等公民存在，你只能用语言的关键字声明一个函数然后调用它，如果需要把函数作为参数传给另一个函数，或是赋值给一个本地变量，又或是作为返回值，就需要通过函数指针(（function pointer）、代理（delegate）等特殊的方式周折一番。

而在 JavaScript 世界中函数却是一等公民，它不仅拥有一切传统函数的使用方式（声明和调用），而且可以做到像简单值一样赋值、传参、返回，这样的函数也称之为第一级函数（First-class Function）。不仅如此，JavaScript 中的函数还充当了类的构造函数的作用，同时又是一个 Function 类的实例（instance）。这样的多重身份让 JavaScript 的函数变得非常重要。

### 1. 函数定义 ###

JavaScript 函数像一般语言一样也是遵循先声明后使用的原则，函数名只能包含字母、数字、下划线或$，且不能以数字开头。

现在介绍几种常见的函数定义方式。

#### 1.1 常规方式定义函数 ####

先看以下两种常见方式：

	// 声明函数
	function functionName([param1[, param2]...) {
		// function_body;
		// [return exp;]
	}

	// 函数表达式
	var func = function([param1[, param2]...){
		// function_body;
		// [return exp;]
	}

function 为创建函数的关键字，`[param1[, param2]...` 为定义函数时的形式参数列表；`function_body;` 为函数所需要完成功能的具体逻辑代码；`[return exp;]` 为函数执行结束时需要返回的数据。关于形式参数列表与返回值稍后介绍。

通常函数定义后不会主动执行，需要调用它或是通过事件驱动才能执行，那么通用的函数调用方法为：`functionName([parameterList])` ，即使用函数名+括号的方式来实现调用。

上述两种函数声明方式可看作等价的方式，但也存在细微的差别：

第一种方式在声明时就是一个命名的函数，无论是声明在调用之前、调用之后，甚至是不会执行到的位置（例如 return 语句之后或是永远不会为真的分支里），都在整个作用域可访问；

第二种方式是通过把匿名函数赋值给变量来声明函数，可以通过变量名再次使用该匿名函数。严格意义上说这不是一个函数的声明（function declaration），而是一个函数表达式（function expression）。在赋值之前这个函数不能被任何代码访问到，也就是说这个赋值必须在调用之前完成，否则调用时会出现错误：`"TypeError: undefined is not a function"`。如：

	<script>
		// 能够正确调用
		func();

		// 直接声明命名函数
		function func() {
			alert("hello");
		}

		// 错误的调用：Uncaught TypeError: func2 is not a function(…)
		func2();

		// 定义函数表达式
		var func2 = function(){
			alert("hello2222");
		}

		// 正确调用，打印 "hello2222"
		func2();
	</script>

#### 1.2 使用 new Function() 定义函数 ####

除了常规的两种定义函数的方式外，我们也可以这样定义函数：

	var func = new Function(arg1, arg2, ..., argN, function_body);

这种方式创建函数表示的意义是：函数实际上是功能完整的对象。

在上面的形式中，每个 arg? 都是所定义函数的一个参数，当函数没有参数时可省略，最后一个参数 function_body 是函数主体（要执行的代码）。如：

	// 声明式定义函数
	function func() {
		console.log("hello");
	}
	// 调用函数
	func();

	// 也可以这样定义函数：
	var func2 = new Function(console.log("hello"));
	// 调用函数
	func2();

调用函数都可以执行出结果，这个比较好理解，我们再看下面一个例子：

	// 声明带参与带返回值的函数
	function func3 (num1, num2) {
		if (num1 > num2){
			return num1 - num2;
		} else if (num1 < num2) {
			return num2 - num1;
		} else {
			return num1;
		}
	}
	// 调用函数打印结果
	console.log(func3(35, 24));

	// 将带参函数转换为使用 new Function() 定义
	var func4 = new Function("num1", "num2", "if (num1 > num2) {return num1 - num2;}"
				+" else if(num1 < num2){return num2 - num1;}else{return num1;}");
	// 调用函数
	console.log(func4(35, 24));

当使用 new Function() 的方式创建函数对象时，Function() 的所有参数都为字符串格式，因为函数体内容较多，所以在 Function() 函数的第三个参数以字符串连接就比较长。

由于是字符串的关系，这种形式写起来有些困难，但有助于我们理解函数是一种引用类型。但毕竟这种写法我们写起来不方便，同时代码阅读也非常不方便，用它定义函数比用传统常规定义的方式要慢得多，所以还是很少用到它。不过，**所有函数都应看作 Function 的实例**。

### 2. 函数参数 ###

在调用函数时，可以向函数传递值，这些值被称为参数，这些参数可以在函数体中使用。

通常参数使用有两种方式：期望参数（形式参数，简称形参）的使用与实际调用函数时实际传递参数（实际参数，简称实参）的使用。

形参是我们在声明函数时的定义的变量，如：

	function add(num1, num2) {
		var result = num1 + num2;
		console.log(num1 + " + " + num2 + " = " + result);
	}

其中 num1 与 num2 就是形式参数。

实参是我们在调用函数时传递的的变量或字面量，如：

	add(15, 8); // 调用 add() 函数，显示结果：15 + 8 = 23

有一点需要注意的是，JavaScript 函数不会检查函数调用时传入的参数个数与定义时的形式参数个数是否一致。如：
	
	add(); // 调用 add() 函数，显示结果：undefined + undefined = NaN
	add(20); // 调用 add() 函数，显示结果：20 + undefined = NaN
	add(10, 20, 30); // 调用 add() 函数，显示结果：10 + 20 = 30

函数定义时参数个数在 ECMAScript 标准中对这一点并没有规范，但不同的浏览器可能有差异。

### 3. arguments ###

有时我们需要在函数体中使用到参数，但又不知道具体传入的参数个数与参数内容，该如何做呢？比如我们要实现任意多个数字之和的计算，但在声明函数时不可能确定下来参数的个数，这时可以使用 arguments 对象。

arguments 是一个类（似）数组对象，代表传给一个 function 的参数列表。(数组我们以后介绍。)

arguments 对象是函数内部的本地变量（局部变量），我们可以在函数内部通过使用 arguments 对象来获取函数的所有参数。这个对象为传递给函数的每个参数建立一个条目，条目的索引号从 0 开始。例如，如果一个函数有三个参数，你可以通过以下方式获取参数：

	arguments[0]
	arguments[1]
	arguments[2]

参数也可以被重新赋值:

	arguments[1] = 'new value';

arguments 对象仅在函数内部有效，在函数外部调用 arguments 对象会出现一个错误：`Uncaught ReferenceError: arguments is not defined`。

arguments 对象并不是一个真正的数组，它类似于数组，但没有数组所特有的属性和方法，即不能使用数组的属性和方法，除了 length 属性。

我们可以用 arguments.length 在函数体内来得到实际参数的数量，如果想要得到形式参数（函数签名时的参数）数量，则使用 functionName.length 属性：

	// 函数声明
	function test(a, b){
		var i, str;
		var expargs = test.length; // 获取期望参数的个数，函数定义时的预期参数个数（有a和b 2个参数）。
		var realargs = arguments.length; // 获取实际被传递参数的数值。
		str = "test函数有 " + expargs + " 个期望参数，有 " + realargs + " 个实际参数。";		
		
		str += "\n\n"
		for (i =0 ; i < realargs; i++){ // 获取参数内容。
			str += "第" + (i + 1) + "个参数是：" + arguments[i] + "\n";
		}
		
		console.log(str);
	}
	
	// 调用函数
	test(1, 3, 5, 7, 9);

执行结果：

	test函数有 2 个期望参数，有 5 个实际参数。
	
	第1个参数是：1
	第2个参数是：3
	第3个参数是：5
	第4个参数是：7
	第5个参数是：9

如果我们调用一个函数，当这个函数的参数数量比它显式声明的参数数量更多的时候，就可以使用 arguments 对象。这个技术对于参数数量是一个可变量的函数来说比较有用。

### 4. 函数返回值 ###

有时，我们会希望函数将值返回调用它的地方，通过使用 return 语句就可以实现。如：

	// 定义计算圆面积的函数
	function area(radius){
		var result = Math.PI * radius * radius;
		return result;
	}

	// 调用函数
	var a = area(2);
	console.log("半径为 2 的圆面积为：", a); // 结果：半径为 2 的圆面积为： 12.566370614359172

在执行完 return 语句后，函数会停止执行，并返回指定的值。如：

	function test(num){
		if (num > 10)
			return "num > 10";

		console.log("go on......");
		return "num <= 10";
	}

	console.log(test(15)); 
	console.log("********************");
	console.log(test(5)); 

显示结果：

	num > 10
	********************
	go on......
	num <= 10

上边的示例中，我们如果先不看 if 结构满足条件时执行的语句，则 if 结构执行结束后会继续执行 `console.log("go on......");return "num <= 10";` 这两条语句。但当 if 条件满足时，执行了 `return "num > 10";` 的语句，表示结束函数调用，返回字符串表达式结果，所以后两条语句`console.log("go on......");return "num <= 10";` 不再执行。

我们也可以这样写：

	function test(num){
		if (num > 10)｛
			console.log("num > 10");
			return;
		｝

		console.log("go on......");
		console.log("num <= 10");
	}

	test(15); 
	console.log("********************");
	test(5); 

执行结果为：

	num > 10
	********************
	go on......
	num <= 10

也就是说，`return` 关键字后可以不跟表达式，表示函数没有返回值，这里的 return 主要起到结束函数执行的作用。

### 5. 总结 ###

之所以我们要使用函数，是为了能够实现代码的复用，为了能够使用别人已定义好的实现某些功能的代码块，为了写得更少做得更多，这也是我们会在面向对象中说到封装时的特征。

要理解函数的使用，首先就需要理解函数在定义时的参数及返回值。我们也可以这样去理解：比如我们要去取钱，银行所提供的 ATM 机就相当于是一个函数，我们得插入银行卡，输入密码，输入提款金额，那么银行卡、密码、提款金额就是这个函数的参数，ATM 机需要，我们就提供。我们确认好取款金额后，ATM 机会进行点钞，然后将我们所需要提取的钞票吐出来，那么这个 ATM 机吐出的钱就相当于是函数的返回值了。

由此，我们也可以这样认为：函数的参数是输入型的，返回值是输出型的。那么根据实际需求，我相信大家能够很快学会函数的使用。