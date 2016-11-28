---
layout: post
title: JavaScript 流程控制语句
date: 2016-11-28
category: JavaScript
tags: [JavaScript, 流程控制语句]
---

JavaScript 程序是由若干个语句组成的，每一个语句以分号作为结束符，语句可以很简单，也可以很复杂。我们将改变程序正常流程的语句称为控制语句，流程控制是用来控制程序中各语句执行顺序的结构，是程序中基本却又非常关键的部分。流程控制语句可以把单个语句组合成有意义的、能完成一定功能的小逻辑模块。

流程控制语句主要分为以下几类：

- 	顺序结构
- 	选择结构
- 	循环结构
- 	跳转语句

## 1. 顺序结构 ##

JavaScript 语言中，顺序结构是最简单的逻辑结构。有这些特点：所有语句按照先后顺序依次执行，每一条语句只执行一遍，不重复执行，也没有语句不执行。在此不赘述了。

## 2. 选择结构 ##

当在执行过程中需要满足一定的条件才去执行语句时，而不满足条件则不执行语句时，我们可以使用选择结构。常用的选择结构有：简单 if 结构，if - else 结构，多重 if 结构，switch 结构以及嵌套。

### 2.1 简单 if 结构 ###

语法结构：

	if ( 条件表达式 ) {
		// 条件表达式为 true 时执行的语句块
	}

如果条件表达式成立，则执行 if 分支语句，否则执行 if 语句之后的其他语句。

流程图为：

![简单if](/images/posts/jscontrolflow/if_1.png)

示例1：

	var num1 = 34, num2 = 10;
	if (num1 > num2){
		console.log(num1 + ">" + num2);
	}

	console.log("执行结束...");

执行结果：

	34>10
	执行结束...

示例2：

	var num1 = 34, num2 = 10;
	if (num1 < num2){
		console.log(num1 + ">" + num2);
	}

	console.log("执行结束...");

执行结果：

	执行结束...

### 2.2 if - else ###

语法结构

	if ( 条件表达式 ) {
		// 条件表达式为 true 时执行的语句块1
	} else {
		// 条件表达式为 false 时执行的语句块2
	}

如果条件表达式成立，则执行 if 分支语句块1，否则执行 else 语句块2。语句块1与语句块2为互斥关系，即不能都执行。

流程图为：

![if-else](/images/posts/jscontrolflow/if_2.png)

示例1：

	var num1 = 34, num2 = 10;
	if (num1 > num2){
		console.log(num1 + ">" + num2);
	} else {
		console.log(num + "<" + num2);
	}

	console.log("执行结束...");

执行结果：

	34>10
	执行结束...

示例2：

	var num1 = 3, num2 = 10;
	if (num1 > num2){
		console.log(num1 + ">" + num2);
	} else {
		console.log(num + "<" + num2);
	}

	console.log("执行结束...");

执行结果：

	3<10
	执行结束...

### 2.3 if - else if - else (多重 if 结构) ###

语法结构：

	if (条件表达式1) {
		// 语句序列1
	} else if (条件表达式2) {
		// 语句序列2
	}
	……
	else if (条件表达式n) {
		// 语句序列n
	} else {
		// 语句序列n+1
	}

如果条件表达式1成立，则执行语句序列1，否则执行判断条件表达式2，表达式2成立，则执行语句序列3，否则向下判断表达式，以此类推，如果所有条件表达式都不满足，则执行最后的 else 语句块中的语句序列 n+1。

流程图为：

![多重if](/images/posts/jscontrolflow/if_3.png)

示例：

	var score = 75;
	if (score >= 90) {
		console.log("A");
	} else if (score < 90 && score >= 80) {
		console.log("B");
	} else if (score < 80 && score >= 70) {
		console.log("C");
	} else if (score < 70 && scroe >= 60) {
		console.log("D");
	} else {
		console.log("E")
	}

	console.log("程序结束...");

执行结果：

	C
	程序结束...

在使用多重 if 结构时还需要注意的是，当有多个条件表达式都成立时，不会每个成立的语句块都去执行到，而只会执行到第一个成立的语句块，执行完毕后退出多重 if 的条件结构。所以以上示例我们可以修改如下：

	var score = 92;
	if (score >= 90) {
		console.log("A");
	} else if (score >= 80) {
		console.log("B");
	} else if (score >= 70) {
		console.log("C");
	} else if (score >= 60) {
		console.log("D");
	} else {
		console.log("E")
	}

	console.log("程序结束...");

执行结果：

	A
	程序结束...

### 2.4 switch ###

语法结构：

	switch（表达式）{
		case 常量表达式1：
			// 语句序列1；
			break；
		case 常量表达式2：
			// 语句序列2；
			break；
		……
		case 常量表达式n：
			// 语句序列n；
			break；
		default：
			// 语句序列n+1；
			break；
	}

switch 结构多用于等值条件判断的情况，即，当表达式与常量表达式1相等时，执行语句序列1；表达式与常量表达式2相等时，执行语句序列2，以此类推。当表达式与所有常量表达式都不相等时，则执行 default 语句序列。

switch 结构中的 case 语句块按照书写的先后顺序来和表达式等值判断，各 case 语句块、default 语句块没有固定的先后顺序，可以把default 语句块写在最前边、中间或最后边。 

每个 case 语句块后都有一个 `break;` 语句，遇到 break 的执行则表示退出所在的 switch 结构。

将多重 if 实现分数等级输出的示例修改为 switch 来实现：

	var score = 75;
	switch(Math.floor(score / 10)){
		case 10:
			console.log("A");
			break;
		case 9:
			console.log("A");
			break;
		case 8:
			console.log("B");
			break;
		case 7:
			console.log("C");
			break;
		case 6:
			console.log("D");
			break;
		default:
			console.log("E");
			break;
	}

	console.log("程序执行结束...");

执行结果：

	C
	程序结束...

以上示例中，当成绩值对 10 求商后再向下取整后，就相当于将成绩值个位数字丢弃掉，假如得到结果值为 8，其实相当于成绩是在 80 ~ 89 之间。case 10 与 case 9 语句块中的执行语句完全一致，如果这种情况经常遇到，要重复书写代码就显得比较繁琐了，比如，每天我们都会面对世界级的三大难题--早饭吃什么，午饭吃什么，晚饭吃什么？我们写个程序来帮我们选择，比如就喜欢吃回锅肉和土豆丝，星期1，3，5吃土豆丝，其余时间吃回锅肉：

	var day = 1; // 今天星期一
	switch (day) {
		case 1:
			console.log("吃土豆丝");
			break;
		case 3:
			console.log("吃土豆丝");
			break;
		case 5:
			console.log("吃土豆丝");
			break;
		default:
			console.log("吃回锅肉");
			break;
	}

	console.log("程序执行结束...");

执行结果：

	吃土豆丝
	程序执行结束...

现在业务逻辑非常简单，复制粘贴相同的代码也很方便，但我们说作为程序员，就应该学会从技术上边来偷懒。

switch 结构 case 语句块中的 `break;` 语句是可以省略的，当省略 `break;` 语句时可能会出现贯穿现象，即从一个 case 语句块贯穿到另一个 case 语句块中继续执行。大家可以把上述代码中的 `break;` 都去掉：

	var day = 1; // 今天星期一
	switch (day) {
		case 1:
			console.log("吃土豆丝");
		case 3:
			console.log("吃土豆丝");
		case 5:
			console.log("吃土豆丝");
		default:
			console.log("吃回锅肉");
	}

	console.log("程序执行结束...");

查看执行结果：

	吃土豆丝
	吃土豆丝
	吃土豆丝
	吃回锅肉
	程序执行结束...

当满足 `day === 1` 条件时，执行 case 1 语句块的内容，但在这个语句块中没有 `break;` 语句，也就是不会退出 switch 结构，那么程序继续向下一个 case 语句块执行，这是不需要再判断条件了。所以将每个 case 语句块里的内容都输出来了。

既然省略 `break;` 有这个效果，我们也可以灵活使用 case 语句贯穿的特性，代码修改如下：

	var day = 1; // 今天星期一
	switch (day) {
		case 1:
		case 3:
		case 5:
			console.log("吃土豆丝");
			break;
		default:
			console.log("吃回锅肉");
	}

	console.log("程序执行结束...");

查看执行结果：

	吃土豆丝
	程序执行结束...

**switch与多重if的区别：** switch 多用于等值条件判断，而多重 if 等值、范围条件均可判断；switch 结构中的 case 语句块没有先后顺序限制，通常多重 if 在书写条件表达式时有先后顺序。

### 2.5 嵌套 ###

假设现在女神想出去北京旅游了，坐飞机去，想让你帮她订张机票，我们写个程序来计算一下你该花多少钱买机票。

如果某航空公司机票价格有以下规则：旺季（3-10月）出行，商务舱机票打9折，经济舱8折，淡季出行（11，12，1，2月），商务舱打6折，经济舱5折，成都到北京的机票全价为 2000 元，该如果编写这个程序？

	var month = 8, // 出行月份
		seat = "商务舱", // 女神当然要坐好的座位咯
		fullPrice = 2000, // 全价
		discount, // 折扣率
		pay; // 实际票价
	if (month >= 3 && month <= 10) {
		if (seat === "商务舱") 
			discount = 0.9;
		else
			discount = 0.8;
	} else {
		if (seat === "商务舱") 
			discount = 0.6;
		else
			discount = 0.5;
	}
	pay = fullPrice * discount;
	console.log("出行月份："+ month +"，舱位："+ seat +"，全价："+ fullPrice +"，折扣："+ discount +"，实付：" + pay);

执行结果：

	出行月份：8，舱位：商务舱，全价：2000，折扣：0.9，实付：1800

当然上边这个例子中内嵌的条件判断也可以使用三目运算符来替代，大家自行修改即可。

嵌套注意层次结构正确，不能出现层次混乱的情况，否则会有语法错误。