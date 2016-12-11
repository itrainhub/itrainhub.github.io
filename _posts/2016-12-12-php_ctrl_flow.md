---
layout: post
title: PHP 流程控制语句
date: 2016-12-12
category: PHP
tags: [PHP, 流程控制语句]
---

编程语言中的流程控制语句大都主要分为以下几类：

- 	顺序结构
- 	条件结构
- 	循环结构
- 	跳转语句

顺序结构是最基本的流程控制语句，按照书写顺序从上向下依次执行，不过多赘述。

## 1. 条件结构 ##

PHP 中的条件结构主要有以下几种：

*	简单 if 语句
*	if-else
*	if-else if-else
*	switch

和大多数其它编程语言类似，先来看看条件结构的语法。

### 1.1 简单 if ###

语法：

	if (expr) {
		// statement;
	}

如果 expr 表达式为真，则执行 statement 语句块，否则，跳过该结构继续向后执行。

	$num1 = 34;
	$num2 = 10;
	if ($num1 > $num2){
		echo ($num1 . ">" . $num2 . "<br>");
	}

	echo ("执行结束...");

### 1.2 if-else ###

语法：

	if (expr) {
		// statement1;
	} else {
		// statement2;
	} 

如果条件表达式 expr 成立，则执行 if 分支语句块1，否则执行 else 语句块2。语句块1与语句块2为互斥关系，即不能都执行。

	$num1 = 4;
	$num2 = 10;
	if ($num1 > $num2){
		echo ($num1 . ">" . $num2 . "<br>");
	} else {
		echo ($num . "<" . $num2 . "<br>");
	}

	echo ("执行结束...");

### 1.3 if-else if-else ###

多重 if，语法：

	if (expr1) {
		// statement1;
	} else if (expr2) {
		// statement2;
	} …… {
		// statement n;
	} else {
		// statement n+1;
	} 

如果条件表达式1成立，则执行语句序列1，否则执行判断条件表达式2，表达式2成立，则执行语句序列2，否则向下判断表达式，以此类推，如果所有条件表达式都不满足，则执行最后的 else 语句块中的语句序列 n+1。

	$num1 = 4;
	$num2 = 10;
	if ($num1 > $num2){
		echo ($num1 . ">" . $num2 . "<br>");
	} else if ($num1 === $num2) {
		echo ($num . "===" . $num2 . "<br>");
	} else {
		echo ($num . "<" . $num2 . "<br>");
	}

	echo ("执行结束...");

### 1.4 switch ###

多重 if 在实现多分支选择时，如果是等值的多分支选择，条件判断如果有多个，则可能十分冗长，则可使用 switch 来实现等值条件的多分支选择。

语法：

	switch(variable) {
		case value1:
			// statement1;
			break;
		case value2:
			// statement2;
			break;
		case ……:
			…………
		default:
			// statement n;
	}

switch 根据 variable 的值依次与各 case 后的 valueN 比较，如果不等，则继续比较下一个 case，如果相等，则执行对应语句，直到 switch 结束或遇到 `break;` 为止。default 块为缺省块，即当 variable 与所有 valueN 都不等时，执行缺省块。

	$score = 75;
	switch((integer)($score / 10)){
		case 10:
		case 9:
			echo ("A");
			break;
		case 8:
			echo ("B");
			break;
		case 7:
			echo ("C");
			break;
		case 6:
			echo ("D");
			break;
		default:
			echo ("E");
	}

## 2. 循环结构 ##

我们可以使用循环结构来解决重复使用某段代码或函数的问题。PHP 中循环结构主要有：while、do-while、for、foreach。

### 2.1 while ###

语法：

	while (expr) {
		// statement;
	}

当 expr 条件为真时，执行循环体 statement 语句，循环体执行完毕后继续判断 expr 条件，重复上述步骤，直到 expr 条件为假退出循环。

	$sum = 0;
	$currNum = 1;
	// 计算 1~100之和
	while ($currNum <= 100) {
		$sum += $currNum;
		$currNum++;
	}
	echo ("1+2+3+...+99+100=$sum");
	echo ("<br>执行结束...");

### 2.2 do-while ###

语法：
	
	do {
		// statement;
	} while (expr);

先无论如何执行一次循环体的操作，再判断条件，在条件满足的情况下，继续执行循环体操作，然后判断条件，重复，直到条件为假退出循环。

	$sum = 0;
	$currNum = 1;
	do {
		$sum += $currNum;
		$currNum++;
	} while ($currNum <= 100);
	echo ("1+2+3+...+99+100=$sum");
	echo ("<br>执行结束...");

### 2.3 for ###

语法：

	for (expr1; expr2; expr3) {
		// statement;
	}

执行流程说明：

1. 执行变量初始化表达式 expr1，通常这个变量是用于循环条件的控制；
2. 执行循环条件判断 expr2
3. 循环条件满足，则执行循环体操作，循环条件不满足，则跳到第 6 步；
4. 执行变量更新表达式 expr3，通常是循环变量更新，以构建退出循环的条件；
5. 回到第 2 步；
6. 退出循环结构。

	// 计算 10!
	$factorial = 1; // 保存阶乘结果
	for ($i = 10; $i >= 1; $i--) {
		$factorial *= $i;
	}
	echo ("10! = $factorial");

### 2.4 foreach ###

foreach 常用于数组元素遍历。

语法：

	foreach (array_expression as $value) {
		// statement;
	} 
	// 或
	foreach (array_expression as $key=>$value) {
		// statement;
	}

$value 表示遍历到的元素值，$key 表示遍历到的索引。

示例1：

	$arr = array(38,29,64,15,88);
	foreach($arr as $item) {
		echo "$item<br>";
	}

示例2：

	$arr = array(38,29,64,15,88);
	foreach ($arr as $key=>$value){
		echo "$key = $value<br>";
	}

## 3. 跳转语句 ##

### 3.1 break ###

在使用循环结构时，有时会遇到循环次数不定的情况，但条件表达式不好表示，这时可以固定将条件表达式置为 true，人为设置死循环。为了能够在循环体中满足一定条件的时候还是能够退出循环，可以使用 `break;` 语句。

	while (true) {
		$tmp = rand(1, 20);
		echo $tmp . " ";
		if ($tmp === 10) {
			echo "<div>变量值终于为10了</div>";
			break;
		}
	}

使用 `break;` 不仅可以跳出当前循环，还可以指定跳出几层循环，格式为 `break $num;`，但不推荐使用。

### 3.2 continue ###

如果只想终止当前一次循环，还能够继续判断条件执行下一次循环，那么可以使用 continue。

	$arr = array(3,5,2,1,8,9,6);
	for ($i = 0; $i < 7; $i++) {
		if ($i % 2 == 0)
			continue;
		echo "输出：$arr[$i]<br>";
	}

使用 `continue $num;` 和 break 类似，可以跳出几层循环，但这样一来，对程序逻辑的理解跳跃性就比较大，不推荐使用。

## 4. 小结 ##

流程控制语句在程序中是必不可少的，也是变化丰富的。再复杂的业务逻辑，都是通过流程控制语句的拆分组合演化而来的，所以对于流程控制语句，我们一定要不断练习和总结，掌握住一套属于自己的方法和技巧。