---
title: JavaScript 流程控制语句
category: javascript
tags: [javascript, 流程控制]
key: javascript_control_flow_statement
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

```javascript
if ( 条件表达式 ) {
	// 条件表达式为 true 时执行的语句块
}
```

如果条件表达式成立，则执行 if 分支语句，否则执行 if 语句之后的其他语句。

流程图为：

![简单if](/assets/images/jscontrolflow/if_1.png)

示例1：

```javascript
var num1 = 34, num2 = 10;
if (num1 > num2){
	console.log(num1 + ">" + num2);
}

console.log("执行结束...");
```

执行结果：

```javascript
34>10
执行结束...
```

示例2：

```javascript
var num1 = 34, num2 = 10;
if (num1 < num2){
	console.log(num1 + ">" + num2);
}

console.log("执行结束...");
```

执行结果：

```javascript
执行结束...
```

### 2.2 if - else ###

语法结构

```javascript
if ( 条件表达式 ) {
	// 条件表达式为 true 时执行的语句块1
} else {
	// 条件表达式为 false 时执行的语句块2
}
```

如果条件表达式成立，则执行 if 分支语句块1，否则执行 else 语句块2。语句块1与语句块2为互斥关系，即不能都执行。

流程图为：

![if-else](/assets/images/jscontrolflow/if_2.png)

示例1：

```javascript
var num1 = 34, num2 = 10;
if (num1 > num2){
	console.log(num1 + ">" + num2);
} else {
	console.log(num + "<" + num2);
}

console.log("执行结束...");
```

执行结果：

```javascript
34>10
执行结束...
```

示例2：

```javascript
var num1 = 3, num2 = 10;
if (num1 > num2){
	console.log(num1 + ">" + num2);
} else {
	console.log(num + "<" + num2);
}

console.log("执行结束...");
```

执行结果：

```javascript
3<10
执行结束...
```

### 2.3 if - else if - else (多重 if 结构) ###

语法结构：

```javascript
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
```

如果条件表达式1成立，则执行语句序列1，否则执行判断条件表达式2，表达式2成立，则执行语句序列2，否则向下判断表达式，以此类推，如果所有条件表达式都不满足，则执行最后的 else 语句块中的语句序列 n+1。

流程图为：

![多重if](/assets/images/jscontrolflow/if_3.png)

示例：

```javascript
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
```

执行结果：

```javascript
C
程序结束...
```

在使用多重 if 结构时还需要注意的是，当有多个条件表达式都成立时，不会每个成立的语句块都去执行到，而只会执行到第一个成立的语句块，执行完毕后退出多重 if 的条件结构。所以以上示例我们可以修改如下：

```javascript
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
```

执行结果：

```javascript
A
程序结束...
```

### 2.4 switch ###

语法结构：

```javascript
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
```

switch 结构多用于等值条件判断的情况，即，当表达式与常量表达式1相等时，执行语句序列1；表达式与常量表达式2相等时，执行语句序列2，以此类推。当表达式与所有常量表达式都不相等时，则执行 default 语句序列。

switch 结构中的 case 语句块按照书写的先后顺序来和表达式等值判断，各 case 语句块、default 语句块没有固定的先后顺序，可以把default 语句块写在最前边、中间或最后边。 

每个 case 语句块后都有一个 `break;` 语句，遇到 break 的执行则表示退出所在的 switch 结构。

将多重 if 实现分数等级输出的示例修改为 switch 来实现：

```javascript
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
```

执行结果：

```javascript
C
程序结束...
```

以上示例中，当成绩值对 10 求商后再向下取整后，就相当于将成绩值个位数字丢弃掉，假如得到结果值为 8，其实相当于成绩是在 80 ~ 89 之间。case 10 与 case 9 语句块中的执行语句完全一致，如果这种情况经常遇到，要重复书写代码就显得比较繁琐了，比如，每天我们都会面对世界级的三大难题--早饭吃什么，午饭吃什么，晚饭吃什么？我们写个程序来帮我们选择，比如就喜欢吃回锅肉和土豆丝，星期1，3，5吃土豆丝，其余时间吃回锅肉：

```javascript
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
```

执行结果：

```javascript
吃土豆丝
程序执行结束...
```

现在业务逻辑非常简单，复制粘贴相同的代码也很方便，但我们说作为程序员，就应该学会从技术上边来偷懒。

switch 结构 case 语句块中的 `break;` 语句是可以省略的，当省略 `break;` 语句时可能会出现贯穿现象，即从一个 case 语句块贯穿到另一个 case 语句块中继续执行。大家可以把上述代码中的 `break;` 都去掉：

```javascript
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
```

查看执行结果：

```javascript
吃土豆丝
吃土豆丝
吃土豆丝
吃回锅肉
程序执行结束...
```

当满足 `day === 1` 条件时，执行 case 1 语句块的内容，但在这个语句块中没有 `break;` 语句，也就是不会退出 switch 结构，那么程序继续向下一个 case 语句块执行，这是不需要再判断条件了。所以将每个 case 语句块里的内容都输出来了。

既然省略 `break;` 有这个效果，我们也可以灵活使用 case 语句贯穿的特性，代码修改如下：

```javascript
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
```

查看执行结果：

```javascript
吃土豆丝
程序执行结束...
```

**switch与多重if的区别：** switch 多用于等值条件判断，而多重 if 等值、范围条件均可判断；switch 结构中的 case 语句块没有先后顺序限制，通常多重 if 在书写条件表达式时有先后顺序。

### 2.5 嵌套 ###

假设现在女神想出去北京旅游了，坐飞机去，想让你帮她订张机票，我们写个程序来计算一下你该花多少钱买机票。

如果某航空公司机票价格有以下规则：旺季（3-10月）出行，商务舱机票打9折，经济舱8折，淡季出行（11，12，1，2月），商务舱打6折，经济舱5折，成都到北京的机票全价为 2000 元，该如果编写这个程序？

```javascript
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
```

执行结果：

```javascript
出行月份：8，舱位：商务舱，全价：2000，折扣：0.9，实付：1800
```

当然上边这个例子中内嵌的条件判断也可以使用三目运算符来替代，大家自行修改即可。

嵌套注意层次结构正确，不能出现层次混乱的情况，否则会有语法错误。

## 3. 循环结构 ##

循环语句是在一定条件下，反复执行某段代码的逻辑结构，被反复执行的语句序列称为循环体。JavaScript 语言中有3种常用的循环：while 循环、do-while 循环、for 循环。

### 3.1 循环特征 ###

对于所有的循环来说，都有这两个特征：循环条件、循环操作。

比如，我们在编写代码实现某个业务的时候，出现了逻辑错误，要修改这个逻辑错误，就需要进行断点调试。这时候的断点调试就是包含一个循环的动作：

1. 设置断点
2. 单步执行
3. 观察变量变化
4. 变量变化和预期变化一致，回到第2步
5. 变量变化和预期不一致，找到错误点
6. 修改错误

以上步骤中，从第2到4步就是一个循环的动作，循环条件就是变量变化和预期变化一致，循环操作就是单步执行程度，并观察变量变化。

我们要使用循环，可以按照以下步骤来进行：

1. 找出循环条件和循环操作
2. 代入循环的语法结构
3. 判断循环能否退出，避免出现死循环

有步骤后，再结合各种循环结构的语法和使用场景，就可以很方便的进行编码了。

### 3.2 while 循环 ###

语法结构：

```javascript
while (循环条件表达式) {
	// 循环体
}
```

流程图：

![while循环](/assets/images/jscontrolflow/while.png)

当循环条件满足时，执行循环体操作，循环体执行完毕后，会继续判断循环条件，一直这样执行下去直到循环条件不满足才会退出循环结构。

示例，计算1~100之间数字之和：

```javascript
var sum = 0, currNum = 1;
while (currNum <= 100) {
	sum += currNum;
	currNum++;
}

console.log("1+2+3+...+99+100=" + sum);
```

sum 用于保存计算结果，currNum 表示当前加到的数字，从 1 开始，到 100 结束。当满足条件 `currNum <= 100` 时，则执行将当前数字加到计算结果变量中的语句。当前数字累加完毕后，还可能需要累加下一个数字，所以有 `currNum++;` 这条语句，当然也是通过这一句来构建避免死循环的条件的。

### 3.3 do-while 循环 ###

语法结构：

```javascript
do {
	// 循环操作语句;
} while (循环条件表达式);
```

流程图：

![do-while循环](/assets/images/jscontrolflow/do_while.png)

从流程图中我们可以看出，先进入 do-while 结构执行一次循环体操作，再判断循环条件是否满足，如果循环条件满足，则继续执行循环，然后判断循环条件，直到循环条件不满足才退出 do-while 循环结构。

对于 do-while 来说，第一次循环体的执行是无条件执行的，也就是说，这个循环结构是无论如何会先做一次循环操作，再判断循环条件是否满足的。

例如我们现在有这样一个规则：在学校学习要进行测试，只有一个阶段测试通过了才能进入下一个阶段的学习，如果测试未通过，则还需要重新学习，直到测试通过。用程序表述如下：

```javascript
var score; // 存放考试成绩的变量
do {
	console.log("学习知识中...");
	console.log("准备测试")
	console.log("测试中...");
	score = parseInt(prompt("请输入测试成绩："));
	console.log("本次测试成绩为：" + score);
} while (score < 60);

console.log("测试通过，进入下一个阶段学习...");
```

执行结果：

```javascript
学习知识中...
准备测试
测试中...
本次测试成绩为：55
学习知识中...
准备测试
测试中...
本次测试成绩为：59
学习知识中...
准备测试
测试中...
本次测试成绩为：62
测试通过，进入下一个阶段学习...
```

这个例子中，是否能够进入下一阶段，是无论如何需要先测试一次才能够知道结果的，也就是说，不管是一次就测试通过了还是多次测试才通过，对于第一次的测试来说，都是无条件会进行的，所以采用 do-while 循环。

### 3.4 for 循环 ###

语法结构：

```javascript
for (变量初始化表达式; 循环条件表达式; 变量更新表达式) {
	// 循环操作
}
```

执行流程说明：

1. 执行变量初始化表达式，通常这个变量是用于循环条件的控制；
2. 执行循环条件判断
3. 循环条件满足，则执行循环体操作，循环条件不满足，则跳到第 6 步；
4. 执行变量更新表达式，通常是循环变量更新，以构建退出循环的条件；
5. 回到第 2 步；
6. 退出循环结构。

示例，计算10的阶乘：

```javascript
var factorial = 1; // 保存阶乘结果
for (var i = 10; i >= 1; i--) {
	factorial *= i;
}
console.log("10! = " + factorial);
```

执行结果：
	
```javascript
10! = 3628800
```

### 3.5 while、do-while、for 的比较 ###

while、do-while、for 结构都是循环结构，我们在使用的时候是可以用这些结构相互替换的，即使用 while 实现的功能，我们也能够用 do-while 去实现，使用 for 循环实现的功能，我们也可以用 while 去实现。

那为什么又会有几种不同的循环结构呢，我认为主要是基于几种不同的场合：

while、do-while 两种循环结构更多用作于循环次数不确定的情况，for 循环更常用作于循环次数确定的情况。当然我们在实际中，循环次数确定的情况会占比多一些。

那 while 与 do-while 又该如何选择呢，这可以从它们的执行流程上面来考虑，while 循环结构是第一次就需要在循环条件满足的情况下才执行循环，而 do-while 是无论如何先无条件执行一次循环体的操作，所以如果有先执行后判断的这种情况，就选择 do-while，如果是先判断后执行这种情况，就选择 while。

### 3.6 嵌套 ###

和条件结构类似，循环结构也可以嵌套使用，但还是必须注意嵌套层次的正确性，如我们要打印九九乘法表：

```javascript
var str;
for (var i = 1; i <= 9; i++) {
	str = "";
	for (var j = 1; j <= i; j++) {
		str += j + "*" + i + "=" + (i * j) + "   ";
	}
	console.log(str);
}
```

显示结果：

```javascript
1*1=1  
1*2=2  2*2=4  
1*3=3  2*3=6  3*3=9  
1*4=4  2*4=8  3*4=12  4*4=16  
1*5=5  2*5=10  3*5=15  4*5=20  5*5=25  
1*6=6  2*6=12  3*6=18  4*6=24  5*6=30  6*6=36  
1*7=7  2*7=14  3*7=21  4*7=28  5*7=35  6*7=42  7*7=49  
1*8=8  2*8=16  3*8=24  4*8=32  5*8=40  6*8=48  7*8=56  8*8=64  
1*9=9  2*9=18  3*9=27  4*9=36  5*9=45  6*9=54  7*9=63  8*9=72  9*9=81  
```

### 3.7 for - in ###

语法结构：

```javascript
for(var 临时变量 in 数组或对象) {
	// 代码块
}
```

这个结构主要用于遍历数组中的每个元素或是遍历对象的所有可被遍历的属性。

当遍历数组时，通常这个临时变量指代的是数组的下标；如果遍历的是对象，则临时变量指的是对象的属性名称。

示例：

```javascript
var array = [3, 9, 1],
	emp = {
	name : "小明",
	age : 18,
	address : "四川成都"
};

for (var i in array) {
	console.log(i, array[i]);
}
console.log("******************")
for (var attr in emp) {
	console.log(attr, emp[attr]);
}
```

执行结果：

```javascript
0 3
1 9
2 1
******************
name 小明
age 18
address 四川成都
```

## 4. 跳转语句 ##

在 JavaScript 中的跳转语句主要有三个：break、continue、return。

### 4.1 break ###

break 可用于 switch 结构和循环结构，用于 switch 结构时表示结束 switch 结构语句的执行，而用于循环结构时，是表示退出其所在的整个层次的循环结构。

示例：

```javascript
for (var i = 0; i < 10; i++) {
	if (i > 5 && i < 8)
		break;
	console.log("i = ", i);
}

console.log("for 循环结束后，i = ", i);
console.log("程序执行结束...");
```

执行结果：

```javascript
i =  0
i =  1
i =  2
i =  3
i =  4
i =  5
for 循环结束后，i =  6
程序执行结束...
```

在循环体中，当 i 满足大于5并且小于8的条件时，执行 `break;` 语句，所以当 i 在变量更新自增到 6 时，就退出了整个循环结构，循环体中还有执行完的语句不再执行，并且循环变量也不再更新。

### 4.2 continue ###

continue 只用于循环结构，表示结束其所在循环的当前一次循环操作，还可能会继续执行下一次循环。

示例：

```javascript
for (var i = 0; i < 10; i++) {
	if (i >= 5 && i <= 8)
		continue;
	console.log("i = ", i);
}

console.log("for 循环结束后，i = ", i);
console.log("程序执行结束...");
```

执行结果：
	
```javascript
i =  0
i =  1
i =  2
i =  3
i =  4
i =  9
for 循环结束后，i =  10
程序执行结束...
```

在打印结果中，中间的几次循环体打印操作未显示出来，是因为当满足 i 在5~8这个范围内时，结束掉了其当前次的循环操作，当前次未执行完的后继代码不再执行，但仍然做了变量更新，重新判断了条件继续执行循环操作，所以 `i =  9` 也打印出来了。最后当 i = 10 时不满足 for 循环条件 i < 10，退出循环结构。

### 4.4 return ###

return 语句用于函数中，遇到 return 语句表示结束函数的执行，这个在 [JavaScript 函数入门](/2016/11/javascript_function_started/) 一文中有讲解到，大家可以参考，不再赘述。

### 4.5 label ###

label 语句的使用方式：

```javascript
label: 代码块
```

label 语句只是在代码块之前加上一个标识，这样在程序中的其他语句中可以引用这个标识。一般在循环中，break 语句和 continue 语句可以通过 label 语句跳出或终止本轮循环。

示例：

```javascript
var num = 0;
here: for (var i = 0; i < 10; i++) {
	for (var j = 0; j < 10; j++) {
		num++;
		if (num >= 10)
			break here;
	}
}

console.log("最终 num =", num);
```

执行结果：

```javascript
最终 num = 10
```

这个可以用在多重循环中，由内层退出外层循环结构时使用，但一般都不推荐使用。我们可以以其它方式来代替它的实现，比如使用函数调用的方式或是抛出异常。因为 label 语句会使得代码的阅读变得困难和不容易被理解。在此大家做一个了解就可以了。