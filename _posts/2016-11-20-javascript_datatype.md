---
layout: post
title: JavaScript数据类型
date: 2016-11-20
category: JavaScript
tags: [javascript, datatype]
---

JavaScript 中有5种简单数据类型（也称为基本数据类型、原始数据类型）：undefined、null、boolean、number 和 string。还有1种复杂数据类型（也称为引用数据类型）：object，object 本质上是由一组无序的名值对组成的。

## 1. 基本数据类型 ##

**undefined**

undefined 类型有且只有一个值，即特殊的 undefined。在使用 var 声明变量但未对其加以初始化时，这个变量的值就是 undefined，例如：

    var message;
	alert(message); // undefined

任何没有被赋值的变量都是 undefined 值。

**null**

null 类型是第二个有且只有一个值的数据类型，这个特殊的值是 null，通常用于初始化表示一个空对象（稍后介绍）。

**boolean**

该类型表示逻辑实体，有两个字面值：true 和 false。如：

	var b1 = true,
		b2 = false;
	alert(b1); // true
	alert(b2); // false

**number**

该类型用来表示整数和浮点数值，通俗的说，就是数字。

整数：可以通过八进制、十进制，十六进制的字面值来表示。

如：

	var decimalNum=88, //十进制
		octalNum=077, //八进制，第一位必须是0，解析为十进制的63
		hexNum=0x2A; //十六进制，前两位必须是0x，后跟16进制数字（0~9及A~F），解析为十进制的42

浮点数：

1. 该数值中必须包含一个小数点，且小数点后必须有一位数字，如果小数点后只有零，则该小数会被转化为整数。
2. 浮点数所占据的内存空间是整数的两倍。
3. 对极大极小的浮点数采用 e 表示法（科学计数法）。

如：

	var floatNum1 = 3.14159,
		floatNum2 = 5.3e7, // 5.3 × 10（7次幂）
		floatNum3 = 3.7e-12, // 3.7 × 10（-12次幂）
		floatNum4 = .5; // 0.5

number 类型有一种特殊的数值，即 NaN（非数值，Not a Number）。NaN 用于表示一个本来要返回数值的操作数未返回数值的情况（这样就不会抛出错误了）。如：

	var num = "3.a",
		result = num * 3;
	alert(result); // NaN

NaN 本身有两个非同寻常的特点。首先，任何涉及 NaN 的操作（例如 NaN/10）都会返回 NaN，例如上边这个示例显示的结果，这个特点在多步计算中有可能导致问题。

其次，NaN 与任何值都不相等，包括 NaN 本身。例如，下面的代码会返回 false：

	alert(NaN == NaN); // false

number 还有另外两个特殊值，称为正无穷（+Infinity，可简记为Infinity）和负无穷（-Infinity）。

	var res1 = 5 / 0, // Infinity
		res2 = -5 / 0, // -Infinity
		res3 = 0 / 0; // NaN

**string**

string 类型用于表示由零或多个16位 Unicode 字符组成的字符序列，即字符串。字符串可以由成对匹配的单引号 (') 或双引号 (") 表示。

    var str1 = "Hello";
    var str2 = 'Hello';

任何字符串的长度都可以通过访问其 length 属性取得：

	alert(str1.length); // 5

## 2. 引用数据类型 ##

**object**

对象其实就是一组数据和功能的集合。对象可以通过执行 new 调用构造函数的方式来创建。而创建 Object 类型的实例并为其添加属性和（或）方法，就可以创建自定义对象。我们常用到的 Date、Array 对象就可以这样来创建。如：

	var date = new Date(),
		array = new Array(3, 5, 7, 9);

对于对象使用的详情，我们留待 JavaScript 面向对象时再详细说明吧。

## 3. typeof ##

鉴于 JavaScript 是弱类型（松散类型）的，因此需要有一种手段来检测给定变量的数据类型，typeof 就是负责提供这方面信息的操作符。对一个值使用 typeof 操作符可能返回下列某个字符串：

*	"undefined"——如果这个值未定义；
*	"boolean"——如果这个值是布尔值；
*	"string"——如果这个值是字符串；
*	"number"——如果这个值是数值；
*	"object"——如果这个值是对象或null；
*	"function"——如果这个值是函数；

如：

	alert(typeof true); // "boolean"
	alert(typeof 3.5); // "number"
	alert(typeof "hello"); // "string"
	alert(typeof undefined); // "undefined"
	alert(typeof null); // "object"
	alert(typeof new Date()); // "object"
	alert(typeof function(){}); // "function"

**关于 `typeof null` 的说明**：

从逻辑角度来看，null 值表示一个空对象指针，而这也正是使用 typeof 操作符检测 null 时会返回 "object" 的原因，例如：

    var car = null;
    alert(typeof car); // "object"

如果定义的变量准备在将来用于保存对象，那么最好将该变量初始化为 null 而不是其他值。这样一来，只要直接检测 null 值就可以知道相应的变量是否已经保存了一个对象的引用了，例如：

    if(car !== null) {
        // 对car对象执行某些操作
    }

实际上，undefined 值是派生自 null 值的，因此 ECMA-262 规定对它们的相等性测试要返回 true。

	alert(undefined == null); // true

尽管 null 和 undefined 有这样的关系，但它们的用途完全不同。无论在什么情况下都没有必要把一个变量的值显式地设置为 undefined，可是同样的规则对 null 却不适用。换句话说，只要意在保存对象的变量还没有真正保存对象，就应该明确地让该变量保存 null 值。这样做不仅可以体现 null 作为空对象指针的惯例，而且也有助于进一步区分 null 和 undefined。

## 4. 数据类型转换 ##

JavaScript 的变量是弱类型的，它可以存储 JavaScript 支持的任何数据类型，其变量的类型可以在运行时被动态改变，如：

	var value = 666;
	alert(typeof value); // "number"
	value = "hello";
	alert(typeof value); // "string"
	value = {};
	alert(typeof value); // "object"

上例可以看出，变量 value 的类型具有动态性，实际编程中，我们建议不要频繁改变变量的类型，因为这对调试没有好处。

正因为 JavaScript 中变量类型具有动态性，在程序实际执行的过程中很多时候就需要用到类型转换的概念。

JavaScript 数据类型转换主要提供两种方式：显示类型转换和隐式类型转换（也叫自动类型转换）。

**4.1 显示类型转换**

**parseInt(value)、parseFloat(value)**

JavaScript 提供了 parseInt() 和 parseFloat() 两个转换函数。这两个函数通常用于将字符串（string）解析转换为数字（number），前者转换成整数，后者转换成浮点数。

parseInt() 函数在解析字符串时，更多的是看其是否符合数值模式。它会忽略字符串前面的空格，直至找到第一个非空格字符。如果第一个非空格字符不是数字字符或者负号，parseInt() 会返回 NaN；也就是说，用 parseInt() 转换空字符串会返回 NaN。如果第一个字符是数字字符，praseInt() 会继续解析第二个字符，直到解析完所有后续字符或者遇到了一个非数字字符。例如，“1234blue” 会被转换为 1234，“22.5” 会被转换为 22，因为小数点并不是整数中的有效数字字符。

如果字符串中的第一个字符是数字字符，parseInt() 也能够识别出各种整数格式（即十进制、八进制、十六进制）。为了更好的理解 parseInt() 函数的转换规则，下面给出一些例子：

    var num1 = parseInt("1234blue"); // 1234
    var num2 = parseInt(""); // NaN
    var num3 = parseInt("0xA"); // 10（十六进制）
    var num4 = parseInt("22.5"); // 22
    var num5 = parseInt("070"); // 56（八进制）
    var num6 = parseInt("70"); // 70

我们还可以给 parseInt() 第二个参数，指定解析的进制基数：

    var num7 = parseInt("10",2); // 2（按二进制解析）
    var num8 = parseInt("10",8); // 8(按八进制解析)
    var num9 = parseInt("10",10); // 10（按十进制解析）
    var num10 = parseInt("10",16); // 16（按十六进制解析）
    var num11 = parseInt("70", 8); // 56（八进制）
    var num12 = parseInt("AF",16); // 175 (十六进制)

与 parseInt() 函数类似，parseFloat() 也是从第一个字符（位置0）开始解析每个字符，而且也是一直解析到字符串末尾，或者解析到遇见一个无效的浮点数字字符为止。也就是说，字符串中的第一个小数点是有效的，而第二个小数点就是无效的了，因此它后面的字符串将被忽略。例如，“22.34.5” 将会被转换成 22.34。

parseFloat() 和 parseInt() 的第二个区别在于它始终都会忽略前导的零。parseFloat() 只解析十进制值，因此它没有用第二个参数指定基数的用法。

    var num1 = parseFloat("1234blue"); // 1234
    var num2 = parseFloat("0xA"); // 0
    var num3 = parseFloat("22.5"); // 22.5
    var num4 = parseFloat("22.34.5"); // 22.34
    var num5 = parseFloat("0908.5"); // 908.5

**Number(value)**

Number() 函数把给定的值转换成数字（可以是整数或浮点数）

Number() 的强制类型转换与 parseInt() 和 parseFloat() 方法的处理方式相似，只是它转换的是整个值，而不是部分值。

Number() 函数的转换规则如下：

*	如果是 boolean 值，true 和 false 将分别被转换为 1 和 0
*	如果是数字值，只是简单的传入和返回
*	如果是 null 值，返回 0
*	如果是 undefined，返回 NaN
*	如果是字符串，遵循下列规则：
	-	如果字符串中只包含数字，则将其转换为十进制数值，即 “1” 会变成 1，“123” 会转换成 123，而 “011” 会转换为 11（前导的0被忽略）
	-	如果字符串中包含有效的浮点格式，如 “1.1”，则将其转换为对应的浮点数（同样，也会忽略前导 0）
	-	如果字符串中包含有效的十六进制格式，例如 “0xf”，则将其转换成十六进制对应的十进制值
	-	如果字符串是空的或全空格字符串，则将其转换为0
	-	如果字符串中包含除了上述格式之外的字符，则将其转换为NaN
*	如果是对象，则调用对象的 valueOf() 方法，然后依照前面的规则转换返回的值。如果没有 valueOf() 方法，则调用对象的 toString() 方法，然后再依次按照前面的规则转换返回的字符串值。

如：

    var num1 = Number("Hello World"); // NaN
    var num2 = Number(""); // 0
    var num3 = Number("000011"); // 11
    var num4 = Number(true); // 1

由于 Number() 函数在转换字符串时比较复杂，因此在将字符串转换为数值时，更常用的是 parseInt() 函数。

**Boolean(value)**

Boolean() 函数用于把给定的值转换成 boolean 类型，可以对任何数据类型的值调用 Boolean() 函数，而且总会返回一个 boolean 值。至于返回的这个值是 true 还是 false，取决于要转换值的数据类型及其实际值。下表给出了各种数据类型及其对象的转换规则：

| 数据类型		| 转换为 true	| 转换为 false	|
| ------------- |:-------------:|:-------------:|
| Boolean		| true			| false			|
| String		| 任何非空字符串	| "" (空字符串)	|
| Number		| 任何非零数字值(包括无穷大)| 0和NaN|
| Object		| 任何对象		| null			|
| Undefined		| 不适用			| undefined		|

**String(value)**

String() 是最简单的，因为它可把任何值转换成字符串。

String() 函数遵循下列转换规则：

*	如果值有 toString() 方法，则调用该方法（没有参数）并返回相应的结果
*	如果值是 null，则返回 "null"
*	如果值是 undefined，则返回 "undefined"

如：

    var value1 = 10;
    var value2 = true;
    var value3 = null;
    var value4;
    alert(String(value1)); // "10"
    alert(String(value2)); // "true"
    alert(String(value3)); // "null"
    alert(String(value4)); // "undefined"

我们也经常使用 toString() 方法来转换字符串，几乎每个值都有的 toString() 方法：

    var age = 11;
    var ageAsString = age.toString(); // 字符串"11"
    var found = true;
    var foundAsString = found.toString(); // 字符串"true"

但 null 和 undefined 值没有这个方法：

	var result1 = null.toString(); // 报错：Uncaught TypeError: Cannot read property 'toString' of null(…)
	var result2 = undefined.toString(); // 报错：Uncaught TypeError: Cannot read property 'toString' of undefined(…)

所以在不确定要转换为字符串的内容是否为 null 或 undefined 时，推荐使用 String() 转换。

多数情况下，调用 toString() 方法不必传递参数，但是，在调用数值的 toString() 方法时，可以传递一个参数：输出数值的基数。

    var num = 10;
    alert(num.toString()); // "10"
    alert(num.toString(2)); // "1010"
    alert(num.toString(8)); // "12"
    alert(num.toString(10)); // "10"
    alert(num.toString(16)); // "a"

通过这个例子可以看出，通过指定基数，toString() 方法会改变输出的值，数值 10 根据基数的不同，在输出时被转换为不同的数值格式。

**4.2 隐式类型转换（自动转换）**

在某些情况下，即使我们不提供显示转换，JavaScript 也会进行自动类型转换，主要情况有：

**isNaN(value)**

这个函数接受一个参数，该参数可以使用任何类型，而函数会帮我们确定这个参数是否“非数值”。isNaN() 在接收一个参数值之后，会尝试将这个值利用 Number() 转换为数值。任何不能被转换为数值的值（“非数值”）都会导致这个函数返回 true，否则返回 false。例如：

    alert(isNaN(NaN)); // true
    alert(isNaN(10)); // false(10是一个数值)
    alert(isNaN("10")); // false(可能被转换为数值10)
    alert(isNaN("blue")); // true(不能被转换为数值)
    alert(isNaN(true)); // false(可能被转换为数值1)

**++/--、一元正负运算符**

这些操作符适用于任何数据类型的值，针对不同类型的值，该操作符遵循以下规则：

*	如果是包含有效数字字符的字符串，先将其转换为数字值（转换规则同Number()），再执行运算操作，字符串变量变为数值变量。
*	如果是不包含有效数字字符的字符串，将变量的值设置为 NaN，字符串变量变成数值变量。
*	如果是布尔值 true/false，先将其转换为 1/0 再执行运算操作，布尔值变量编程数值变量。
*	如果是浮点数值，直接执行运算操作。
*	如果是对象，先调用对象的 valueOf() 方法（如果对象没有 valueOf() 方法则调用 toString() 方法），然后对该返回值应用前面的规则，对象变量变成数值变量。

**加运算符**

加运算符在 JavaScript 中用于算术加运算，也可用于字符串连接，所以加运算符的规则分两种情况：

如果两个操作数都是数值，其规则为：

*	如果其中一个操作数为NaN，则结果为NaN
*	如果是 Infinity + Infinity，结果是 Infinity
*	如果是 -Infinity + (-Infinity)，结果是 -Infinity
*	如果是 Infinity + (-Infinity)，结果是 NaN
*	如果是 +0 + (+0)，结果为 +0
*	如果是 (-0) + (-0)，结果为 -0
*	如果是 (+0) + (-0)，结果为 +0

如果有一个操作数为字符串，则：

*	如果两个操作数都是字符串，则将它们拼接起来
*	如果只有其中一个操作数为字符串，则将另外的操作数转换为字符串，然后拼接起来
*	如果一个操作数为字符串，另一个操作数是对象、数值或者布尔值，则调用非字符串操作数的 toString() 方法取得字符串值，然后再应用前面的字符串规则。对于 undefined 和 null，调用String() 转换为字符串后再连接。

可以看出，加法运算中，如果有一个操作值为字符串类型，则将另一个操作值转换为字符串，最后连接起来。

**乘除、减号、取模运算符**

这些操作符针对的是运算，所以他们具有共同性：如果操作值之一不是数值，则被隐式调用 Number() 函数进行转换。

**逻辑运算符（!、&&、\|\|）**

逻辑非（!）运算符首先通过 Boolean() 函数将它的操作值转换为布尔值，然后求反。

逻辑与（&&）运算符，如果一个操作值不是布尔值时，遵循以下规则进行转换：

*	如果第一个操作数经 Boolean() 转换后为 true，则返回第二个操作数，否则返回第一个值（不是 Boolean() 转换后的值）
*	如果有一个操作数为 null，返回 null
*	如果有一个操作数为 NaN，返回 NaN
*	如果有一个操作数为 undefined，返回 undefined	
	
逻辑或（\|\|）运算符，如果一个操作值不是布尔值，遵循以下规则：

*	如果第一个操作值经 Boolean() 转换后为 false，则返回第二个操作值，否则返回第一个操作值（不是 Boolean() 转换后的值）
*	对于 undefined、null 和 NaN 的处理规则与逻辑与（&&）相同

**关系运算符（<, >, <=, >=）**

与上述运算符一样，关系运算符的操作数也可以是任意类型的，所以使用非数值类型参与比较时也需要系统进行隐式类型转换：

*	如果两个操作数都是数值，则进行数值比较
*	如果两个操作数都是字符串，则比较字符串对应的字符 unicode 编码值
*	如果只有一个操作数是数值，则将另一个操作数转换为数值，进行数值比较
*	如果一个操作数是对象，则调用 valueOf() 方法（如果对象没有 valueOf() 方法则调用 toString() 方法），得到的结果按照前面的规则执行比较
*	如果一个操作数是布尔值，则将其转换为数值，再进行比较

注：NaN 是非常特殊的值，它不和任何类型的值相等，包括它自己（已介绍过），同时它与任何类型的值比较大小时都返回 false。

**相等运算符（==）**

相等运算符会对操作数进行隐式转换后进行比较：

*	如果一个操作数为布尔值，则在比较之前先将其转换为数值
*	如果一个操作数为字符串，另一个操作数为数值，则通过 Number() 函数将字符串转换为数值
*	如果一个操作数是对象，另一个不是，则调用对象的 valueOf() 方法，得到的结果按照前面的规则进行比较
*	null与undefined是相等的
*	如果一个操作数为NaN，则相等比较返回false
*	如果两个操作数都是对象，则比较它们是不是指向同一个对象

## 5. 小结 ##

JavaScript 因为是弱类型的语言，所以对于数据类型，特别是类型转换来说，非常灵活，所以通常我们定义变量时应该自己有意识的将变量类型固定下来，尽量不要频繁改变变量的类型。当然这些还需要在大量的使用中去体会并记忆。