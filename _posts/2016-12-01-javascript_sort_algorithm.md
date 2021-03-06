---
title: JavaScript 排序算法
category: javascript
tags: [javascript, 算法]
key: javascript_sort_algorithm
---

## 关于排序 ##

维基百科关于排序算法的描述如下：

>在计算机科学与数学中，一个排序算法（英语：Sorting algorithm）是一种能将一串数据依照特定排序方式进行排列的一种算法。最常用到的排序方式是数值顺序以及字典顺序。有效的排序算法在一些算法（例如搜索算法与合并算法）中是重要的，如此这些算法才能得到正确解答。排序算法也用在处理文字数据以及产生人类可读的输出结果。基本上，排序算法的输出必须遵守下列两个原则：
>
>输出结果为递增序列（递增是针对所需的排序顺序而言）
>
>输出结果是原输入的一种排列、或是重组
>
>虽然排序算法是一个简单的问题，但是从计算机科学发展以来，在此问题上已经有大量的研究。举例而言，冒泡排序在1956年就已经被研究。虽然大部分人认为这是一个已经被解决的问题，有用的新算法仍在不断的被发明。

排序算法在很多领域得到相当地重视，尤其是在大量数据的处理方面。一个优秀的算法可以节省大量的资源。在各个领域中考虑到数据的各种限制和规范，要得到一个符合实际的优秀算法，需要经过大量的推理和分析。

## 1. 冒泡排序 ##

### 1.1 介绍 ###

冒泡排序（Bubble Sort）是一种简单的排序算法，它重复地遍历要排序的数列，每次比较相邻的两个元素，如果他们的顺序不满足排序条件就把他们交换过来。遍历数列的工作是重复地进行直到不再需要交换，也就是说该数列已经排序完成。这个算法的名字由来是因为越小（或越大）的元素会经由交换慢慢“浮”到数列的顶端。

由于冒泡算法的简洁性，基本上大家都把它看作程序设计的入门算法。

### 1.2 算法描述 ###

我们先看一张图：

![冒泡排序](/assets/images/jssort/bubble.gif)

上图表明了冒泡排序的算法过程，按照从小到大（升序）排序。

分解一下，过程如下：

```javascript
未排序数列：6 5 3 1 8 7 2 4
第一轮排序后：5 3 1 6 7 2 4 [8]
第二轮排序后：3 1 5 6 2 4 [7] 8
第三轮排序后：1 3 5 2 4 [6] 7 8
第四轮排序后：1 3 2 4 [5] 6 7 8
第五轮排序后：1 2 3 [4] 5 6 7 8
第六轮排序后：1 2 [3] 4 5 6 7 8
第七轮排序后：1 [2] 3 4 5 6 7 8
最后排序结果为：1 2 3 4 5 6 7 8
```

每一轮排序都会将该轮中的最大值冒上来（用[]标记出来的），对上一轮已经排好序的数就不用再进行判断排序。

我们可以总结一下，冒泡排序的算法原理如下（按从小到大排序）：

*	比较相邻的元素。如果前一个比后一个大，就交换他们的顺序。
*	对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步完成后，最后的元素应该会是最大的数。
*	针对所有的元素重复以上的步骤，除了最后一个。
*	持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

### 1.3 算法实现 ###

代码：

```javascript
var array = [6, 5, 3, 1, 8, 7, 2, 4], // 未排序数组
	count = 0, // 记录排序总循环次数
	tmp; // 临时变量，用于交换元素位置

console.log("排序前：", array);

for (var i = 0, len = array.length - 1; i < len; i++) { // 控制比较轮数
	for (var j = 0, l = len - i; j < l; j++) { // 控制每轮比较次数
		count++; // 记录循环次数
		if (array[j] > array[j + 1]) {
			tmp = array[j];
			array[j] = array[j + 1];
			array[j + 1] = tmp;
		}
	}
	console.log("第" + (i + 1) + "轮排序：", array);
}

console.log("排序后：", array);
console.log("共执行循环次数：", count);
```

执行结果：

```javascript
排序前： [6, 5, 3, 1, 8, 7, 2, 4]
第1轮排序： [5, 3, 1, 6, 7, 2, 4, 8]
第2轮排序： [3, 1, 5, 6, 2, 4, 7, 8]
第3轮排序： [1, 3, 5, 2, 4, 6, 7, 8]
第4轮排序： [1, 3, 2, 4, 5, 6, 7, 8]
第5轮排序： [1, 2, 3, 4, 5, 6, 7, 8]
第6轮排序： [1, 2, 3, 4, 5, 6, 7, 8]
第7轮排序： [1, 2, 3, 4, 5, 6, 7, 8]
排序后： [1, 2, 3, 4, 5, 6, 7, 8]
共执行循环次数： 28
```

我们从上述结果中看到，第5、6、7轮排序结果都一样，即当数列已经排好序后，还在继续进行下一轮的比较，然后排序，很显然，这是多余的。当整个数列已经排好序后我们就没有必要再做多余的比较了，这时，可以用一个标记来表示上次内层循环是否有元素交换，如果有则进行下一轮循环，否则退出，因为所有元素已经有序。

优化如下：

```javascript
var array = [6, 5, 3, 1, 8, 7, 2, 4], // 未排序数组
	count = 0, // 记录排序总循环次数
	tmp, // 临时变量，用于交换元素位置
	flag; // 标记是否需要继续排序，true为继续排序 false为排序结束

console.log("排序前：", array);

for (var i = 0, len = array.length - 1; i < len; i++) { // 控制比较轮数
	flag = false; // 每轮先默认该轮排序后就不需要再排
	for (var j = 0, l = len - i; j < l; j++) { // 控制每轮比较次数
		count++; // 记录循环次数
		if (array[j] > array[j + 1]) {
			tmp = array[j];
			array[j] = array[j + 1];
			array[j + 1] = tmp;
			flag = true; // 有元素位置交换，下一轮还需要比较排序
		}
	}

	console.log("第" + (i + 1) + "轮排序：", array);
	if (!flag) // 下一轮不需要继续判断排序，退出循环
		break;
}

console.log("排序后：", array);
console.log("共执行循环次数：", count);
```

执行结果：

```javascript
排序前： [6, 5, 3, 1, 8, 7, 2, 4]
第1轮排序： [5, 3, 1, 6, 7, 2, 4, 8]
第2轮排序： [3, 1, 5, 6, 2, 4, 7, 8]
第3轮排序： [1, 3, 5, 2, 4, 6, 7, 8]
第4轮排序： [1, 3, 2, 4, 5, 6, 7, 8]
第5轮排序： [1, 2, 3, 4, 5, 6, 7, 8]
第6轮排序： [1, 2, 3, 4, 5, 6, 7, 8]
排序后： [1, 2, 3, 4, 5, 6, 7, 8]
共执行循环次数： 27
```

这次测试结果比第一次测试结果少了一轮排序，比较次数少了1次，但我们发现，第5轮与第6轮仍然最终结果是一致的，即第5轮已经有序了，因此下次循环完全没有必要再继续对其比较。我们可以增加一个位置变量来记录每次冒泡的最后交换的位置，下次比较到此处就可以了，避免对后面已经有序的元素重复进行比较。

继续优化如下：

```javascript
var array = [6, 5, 3, 1, 8, 7, 2, 4], // 未排序数组
	count = 0, // 记录排序总循环次数
	tmp, // 临时变量，用于交换元素位置
	flag, // 标记是否需要继续排序，true为继续排序 false为排序结束
	index = array.length - 1; // 用于记录最后一次交换的位置

console.log("排序前：", array);

for (var i = 0, len = array.length - 1; i < len; i++) { // 控制比较轮数
	flag = false; // 每轮先默认该轮排序后就不需要再排
	for (var j = 0, l = index; j < l; j++) { // 控制每轮比较次数
		count++; // 记录循环次数
		if (array[j] > array[j + 1]) {
			tmp = array[j];
			array[j] = array[j + 1];
			array[j + 1] = tmp;
			flag = true; // 有元素位置交换，下一轮还需要比较排序
			index = j; // 记录最后一次交换的位置
		}
	}

	console.log("第" + (i + 1) + "轮排序：", array);
	if (!flag) // 下一轮不需要继续判断排序，退出循环
		break;
}

console.log("排序后：", array);
console.log("共执行循环次数：", count);
```

执行结果：

```javascript
排序前： [6, 5, 3, 1, 8, 7, 2, 4]
第1轮排序： [5, 3, 1, 6, 7, 2, 4, 8]
第2轮排序： [3, 1, 5, 6, 2, 4, 7, 8]
第3轮排序： [1, 3, 5, 2, 4, 6, 7, 8]
第4轮排序： [1, 3, 2, 4, 5, 6, 7, 8]
第5轮排序： [1, 2, 3, 4, 5, 6, 7, 8]
第6轮排序： [1, 2, 3, 4, 5, 6, 7, 8]
排序后： [1, 2, 3, 4, 5, 6, 7, 8]
共执行循环次数： 26
```

### 1.4 小结 ###

若数列的初始状态是正序的，一趟扫描即可完成排序。所需的比较次数 C 和记录移动次数 M 均达到最小值：C=n-1，M=0。这是冒泡排序最好的时间复杂度：O(n)。

若初始数列是反序的，需要进行 n-1 趟排序。每趟排序要进行 n-i 次比较(1≤i≤n-1)，且每次比较都必须移动记录三次来达到交换记录位置。在这种情况下，比较和移动次数均达到最大值：C=n*(n-1)/2，M=3*n*(n-1)/2。因此，冒泡排序的最坏时间复杂度为 O(n^2)。

## 2. 选择排序 ## 

### 2.1 介绍 ### 

在冒泡排序算法中，介绍了基本的冒泡排序与几种改进方法，但无论怎么改进，都还是基于两两交换不断推进的冒泡排序。

冒泡排序算法最费时的是什么？一是相邻元素两两比较，二是不满足排序规则的元素两两交换，当然交换要比比较费时多了。两两交换的目的是什么呢？是找出最值（最大值或最小值）。

但是冒泡排序算法中找最值的代价是很大的，每次遍历，可能需要很多次交换才能找到最值，而这些交换都是很浪费时间的。如果能减少交换次数，又能达到找到最值的目的，那较冒泡排序来说就是一种改进。

这时，我们很自然就可能会想到，如果每次遍历，只选择最值元素进行交换，这样一次遍历，只需进行一次交换即可，从而避免了其它无价值的交换操作，相较冒泡排序可能多次交换来说就是一种改进。选择排序就是这样一种算法。

### 2.2 算法描述 ###

选择排序（Selection Sort）是一种简单直观的排序算法。它的工作原理是每一次从待排序的元素中选出最小（或最大）的一个元素，存放在该序列的起始位置，这样一次遍历，只需一次交换，便可将最值放置到合适位置；重复前述操作直到全部待排序的数据元素排完。

下图就表示选择排序的算法过程：

![选择排序](/assets/images/jssort/selection.gif)

分解执行过程：
	
```javascript
排序前：8, 5, 2, 6, 9, 3, 1, 4, 0, 7
第一轮：[0], 5, 2, 6, 9, 3, 1, 4, [8], 7
第二轮：0, [1], 2, 6, 9, 3, [5], 4, 8, 7
第三轮：0, 1, [2], 6, 9, 3, 5, 4, 8, 7
第四轮：0, 1, 2, [3], 9, [6], 5, 4, 8, 7
第五轮：0, 1, 2, 3, [4], 6, 5, [9], 8, 7
第六轮：0, 1, 2, 3, 4, [5], [6], 9, 8, 7
第七轮：0, 1, 2, 3, 4, 5, [6], 9, 8, 7
第八轮：0, 1, 2, 3, 4, 5, 6, [7], 8, [9]
第九轮：0, 1, 2, 3, 4, 5, 6, 7, [8], 9
排序结果：0, 1, 2, 3, 4, 5, 6, 7, 8, 9
```

### 2.3 算法实现 ###

```javascript
var array = [8, 5, 2, 6, 9, 3, 1, 4, 0, 7],
	minIndex, // 每轮最小值下标
	tmp; // 交换所需要临时变量
for (var i = 0, len = array.length; i < len - 1; i++) { // 外层循环，控制选择的轮数
	minIndex = i; // 使用变量minIndex记录该轮最小值元素的索引
	for (var j = i + 1; j < len; j++) { // 循环，查找最小值索引
		if (array[j] < array[minIndex]) { // 当找到比minIndex索引处元素还小的值时，记录该索引为最小值索引
			minIndex = j;
		}
	}

	if (minIndex != i) { // minIndex不等于i，说明找到另一个元素比当前轮遍历到的元素小，则交换位置
		tmp = array[i];
		array[i] = array[minIndex];
		array[minIndex] = tmp;
	}

	console.log("第"+ (i + 1) +"轮排序结果为：", array);
}
```

执行结果：

```javascript
第1轮排序结果为： [0, 5, 2, 6, 9, 3, 1, 4, 8, 7]
第2轮排序结果为： [0, 1, 2, 6, 9, 3, 5, 4, 8, 7]
第3轮排序结果为： [0, 1, 2, 6, 9, 3, 5, 4, 8, 7]
第4轮排序结果为： [0, 1, 2, 3, 9, 6, 5, 4, 8, 7]
第5轮排序结果为： [0, 1, 2, 3, 4, 6, 5, 9, 8, 7]
第6轮排序结果为： [0, 1, 2, 3, 4, 5, 6, 9, 8, 7]
第7轮排序结果为： [0, 1, 2, 3, 4, 5, 6, 9, 8, 7]
第8轮排序结果为： [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
第9轮排序结果为： [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 2.4 小结 ###

从选择排序的思想或者是上面的代码中，我们都不难看出，寻找最小的元素需要一个循环的过程，而排序又是需要一个循环的过程。因此显而易见，这个算法的时间复杂度也是O(n^2)的。这就意味值在n比较小的情况下，算法可以保证一定的速度，当n足够大时，算法的效率会降低。随着n的增大，算法的时间增长很快，因此使用时需要特别注意。

## 3. 插入排序 ##

### 3.1 介绍 ###

有一个已经有序的数据序列，要求在这个已经排好的数据序列中插入一个数，但要求插入后此数据序列仍然保持有序，这个时候就要用到一种新的排序方法——插入排序法。

插入排序的基本操作就是将一个数据插入到已经排好序的有序数列中，从而得到一个新的、个数加一的有序数列，算法适用于少量数据的排序，时间复杂度为O(n^2)，是稳定的排序方法。

### 3.2 算法描述 ###

插入算法把要排序的数组分成两部分：第一部分包含了这个数组的所有元素，但将最后一个元素除外（让数组多一个空间才有插入的位置），而第二部分就只包含这一个元素（即待插入元素）。在第一部分排序完成后，再将这个最后元素插入到已排好序的第一部分中。

其实插入排序非常类似于玩扑克牌。

在开始摸牌时，左手是空的，牌面朝下放在桌上。接着，一次从桌上摸起一张牌，并将它插入到左手一把牌中的正确位置上。为了找到这张牌的正确位置，要将它与手中已有的牌从右到左地进行比较。无论什么时候，左手中的牌都是排好序的。

插入排序的基本思想是：每步将一个待排序的纪录，按其值的大小插入到前面已经排序的数列中适当位置上，直到全部插入完为止。

![插入排序](/assets/images/jssort/insertion.gif)

上图表明了插入排序算法的过程，每轮排序后的结果：

![插入结果](/assets/images/jssort/insert_result.png)

### 3.3 算法实现 ###

```javascript
var array =[6, 5, 3, 1, 8, 7, 2, 4],
	tmp; // 暂存待插入元素值
for (var i = 1, len = array.length; i < len; i++) { // 外层循环遍历从第2个元素到最后一个元素
	if (array[i - 1] > array[i]) { // 当前遍历到的元素比前一个元素小，则需要在已排序部分去查找插入位置
		tmp = array[i]; // 暂存当前元素值
		var j = i; // 保存插入位置
		// 循环，查找元素插入位置，在找到该位置前，每个元素依次后移一位
		for (; j > 0 && array[j - 1] > tmp; j--) {
			array[j] = array[j - 1];
		}
		array[j] = tmp; // 将元素插入找到的位置
	}

	console.log("第" + i + "轮排序结果：", array);
}
```

执行结果：

```javascript
第1轮排序结果： [5, 6, 3, 1, 8, 7, 2, 4]
第2轮排序结果： [3, 5, 6, 1, 8, 7, 2, 4]
第3轮排序结果： [1, 3, 5, 6, 8, 7, 2, 4]
第4轮排序结果： [1, 3, 5, 6, 8, 7, 2, 4]
第5轮排序结果： [1, 3, 5, 6, 7, 8, 2, 4]
第6轮排序结果： [1, 2, 3, 5, 6, 7, 8, 4]
第7轮排序结果： [1, 2, 3, 4, 5, 6, 7, 8]
```

说明：

将待插入记录 array[i] 的值暂存到临时变量 tmp 中，将 tmp 中的值从右向左依次与有序集中元素 array[j](j=i - 1, i - 2, …., 1, 0) 的值比较：

若 array[j] 的值大于 tmp 的值，则将 array[j] 后移一个位置。

若 array[j] 的值小于或等于 tmp 的值，则查找过程结束，j + 1 即为 tmp 插入位置。值比 tmp 大的元素均已后移，所以 j + 1 的位置已经腾空，只要将 tmp 直接插入到此位置即可完成一趟插入排序。

若 array[j] 的值始终大于 tmp 的值，则最终将 tmp 的值插入到索引为0的位置。

### 3.4 小结 ###

如果目标是把n个元素的序列升序排列，那么采用插入排序存在最好情况和最坏情况。

最好情况就是，序列已经是升序排列了，在这种情况下，需要进行的比较操作需（n-1）次即可。

最坏情况就是，序列是降序排列，那么此时需要进行的比较共有 n*(n-1)/2 次。插入排序的赋值操作是比较操作的次数加上 (n-1）次。

平均来说插入排序算法的时间复杂度为 O(n^2）。因而，插入排序不适合对于数据量比较大的排序应用。

和插入排序相比，选择排序是固定位置，找元素；而插入排序则是固定元素找位置，是两种思维方式。

## 4. 总结 ##

排序算法在大数据处理方面受到相当的重视，一个好的排序算法可以高效的完成任务，节省更多的资源，除上上述简单的这三种排序算法外，还有很多其它的排序算法，比如快速排序、归并排序、希尔排序等，大家需要对这些排序算法有所了解。