---
title: 再谈 JavaScript 相等比较
category: javascript
tags: [运算符, 数据类型, 算法]
key: javascript_equality_comparison
---

## 诱因

之前写的一篇文章已经简单介绍过了 `==` 与 `===` 的比较运算符（见[《JavaScript 中 == 与 === 的区别》](/2016/11/javascript_equals_compare/)一文）了，之所以再谈 `JavaScript` 中的相等比较，缘于昨天下午，同事出了一道灵魂拷问的题目：`null == 0` 的比较结果是什么？

这还用想吗，`==` 比较在类型不同时会隐式类型转换，最终结果为 `true` 呗……

但，等会儿，结果会这么简单？嗯，应该不简单。

简单测试一下，果然，运行结果为 `false`。

小朋友，你是否有很多的问号？？？

`==` 确实是一个令人头痛的运算符，它的语法行为多变，不符合直觉，为了一劳永逸，还是把 `==` 和 `===` 一次性搞清楚了吧。

## 规范

### 运算符==说明

为了弄清楚 `null == 0` 结果为 `false` 的原因，查阅 [ECMAScript® 2019 Language Specification](http://www.ecma-international.org/ecma-262/)，在 [7.2.14 节](http://www.ecma-international.org/ecma-262/#sec-abstract-equality-comparison)中有详细的说明：

> **7.2.14 Abstract Equality Comparison**
>
> The comparison x == y, where x and y are values, produces true or false. Such a comparison is performed as follows:
>
> 1. If Type(x) is the same as Type(y), then Return the result of performing [Strict Equality Comparison](http://www.ecma-international.org/ecma-262/#sec-strict-equality-comparison) x === y.
> 2. If x is null and y is undefined, return true.
> 3. If x is undefined and y is null, return true.
> 4. If Type(x) is Number and Type(y) is String, return the result of the comparison x == ! ToNumber(y).
> 5. If Type(x) is String and Type(y) is Number, return the result of the comparison ! ToNumber(x) == y.
> 6. If Type(x) is Boolean, return the result of the comparison ! ToNumber(x) == y.
> 7. If Type(y) is Boolean, return the result of the comparison x == ! ToNumber(y).
> 8. If Type(x) is either String, Number, or Symbol and Type(y) is Object, return the result of the comparison x == ToPrimitive(y).
> 9. If Type(x) is Object and Type(y) is either String, Number, or Symbol, return the result of the comparison ToPrimitive(x) == y.
> 10. Return false.

这段关于 `x == y` 的比较，总共有10步，简单翻译如下：

1. 如果 `Type(x)` 与 `Type(y)` 相等，则返回 `x === y` 的比较结果。(`x === y` 的比较说明在 [7.2.15 节 Strict Equality Comparison](http://www.ecma-international.org/ecma-262/#sec-strict-equality-comparison)中)。
2. 如果 `x` 为 `null`，`y` 为 `undefined`，则返回 `true`。
3. 如果 `x` 为 `undefined`，`y` 为 `null`，则返回 `true`。
4. 如果 `Type(x)` 是 `Number`，`Type(y)` 是 `String`，则返回 `x == ToNumber(y)` 的比较结果。(! ToNumber(y) 不是对转换结果取 `!` 运算，而是 `ReturnIfAbrupt()` 的简写方式，而 `ReturnIfAbrupt()` 会判断如果参数不是正常值时中断执行，详见 [5.2.3.4 ReturnIfAbrupt Shorthands](http://www.ecma-international.org/ecma-262/#sec-returnifabrupt-shorthands) 的说明)。
5. 如果 `Type(x)` 是 `String`，`Type(y)` 是 `Number`，则返回 `ToNumber(x) == y` 的比较结果。
6. 如果 `Type(x)` 是 `Boolean`，则返回 `ToNumber(x) == y` 的比较结果。
7. 如果 `Type(y)` 是 `Boolean`，则返回 `x == ToNumber(y)` 的比较结果。
8. 如果 `Type(x)` 是 `String`、`Number` 或 `Symbol`，`Type(y)` 是 `Object`，则返回 `x == ToPrimitive(y)` 的比较结果。
9. 如果 `Type(x)` 是 `Object`，`Type(y)` 是 `String`、`Number` 或 `Symbol`，则返回 `ToPrimitive(x) == y` 的比较结果。
10. 其它情况，返回 `false`。

步骤中的 `Type()` 方法是取参数的数据类型，在 [6 ECMAScript Data Types and Values](http://www.ecma-international.org/ecma-262/#sec-ecmascript-data-types-and-values) 有其说明：

> Within this specification, the notation “Type(x)” is used as shorthand for “the type of x” where “type” refers to the ECMAScript language and specification types defined in this clause.

这和 `JavaScript` 中的 `typeof` 运算符的结果不同。`ECMAScript` 中定义的类型有 `Undefined`，`Null`，`Boolean`，`String`，`Symbol`，`Number` 和 `Object`。

再来分析 `null == 0` 的判断，`null` 的类型为 `Null`，根据以上步骤分析，前9步条件都不满足，所以最终返回结果应该为 `false`。

### 运算符===说明

> **7.2.15 Strict Equality Comparison**
>
> The comparison x === y, where x and y are values, produces true or false. Such a comparison is performed as follows:
>
> 1. If Type(x) is different from Type(y), return false.
>
> 2. If Type(x) is Number, then
>
>    a. If x is NaN, return false.
>
>    b. If y is NaN, return false.
>
>    c. If x is the same Number value as y, return true.
>
>    d. If x is +0 and y is -0, return true.
>
>    e. If x is -0 and y is +0, return true.
>
>    f. Return false.
>
> 3. Return SameValueNonNumber(x, y).
>
> NOTE    This algorithm differs from the SameValue Algorithm in its treatment of signed zeroes and NaNs.

`===` 是严格比较相等，步骤翻译如下：

1. 如果 `x` 与 `y` 的类型不一致，返回 `false`；

2. 如果 `x` 类型为 `Number`，继续判断：
   
   a. 如果 `x` 是 `NaN`，返回 `false`；
   
   b. 如果 `y` 是 `NaN`，返回 `false`；
   
   c. 如果 `x` 与 `y` 是相同的数字值，返回 `true`；
   
   d. 如果 `x` 是 `+0`，`y` 是 `-0`，返回 `true`；
   
   e. 如果 `x` 是 `-0`，`y` 是 `+0`，返回 `true`；
   
   f. 否则返回 `false`。
   
3. 返回 `SameValueNonNumber(x, y)` 的运算结果。

注意：这个算法和 `SameValue` 算法的不同之处在于对有符号 `0` 和 `NaN` 的处理。

继续查看 [SameValueNonNumber(x, y)](http://www.ecma-international.org/ecma-262/#sec-samevaluenonnumber) 算法：

> **7.2.12 SameValueNonNumber ( x, y )**
>
> The internal comparison abstract operation SameValueNonNumber(x, y), where neither x nor y are Number values, produces true or false. Such a comparison is performed as follows:
>
> 1. Assert: Type(x) is not Number.
>
> 2. Assert: Type(x) is the same as Type(y).
>
> 3. If Type(x) is Undefined, return true.
>
> 4. If Type(x) is Null, return true.
>
> 5. If Type(x) is String, then
>    
>    a. If x and y are exactly the same sequence of code units (same length and same code units at corresponding indices), return true; otherwise, return false.
>    
> 6. If Type(x) is Boolean, then
>
>    a. If x and y are both true or both false, return true; otherwise, return false.
>
> 7. If Type(x) is Symbol, then
>
>    a. If x and y are both the same Symbol value, return true; otherwise, return false.
>
> 8. If x and y are the same Object value, return true. Otherwise, return false.

1. 断言 `x` 类型为 `Number`；

2. 断言 `x` 与 `y` 类型相同；

3. 如果 `x` 类型为 `Undefined`，返回 `true`；

4. 如果 `x` 类型为 `Null`，返回 `true`；

5. 如果 `x` 类型为 `String`，继续判断：
   
   a. 如果 `x` 和 `y` 是相同的字符串序列（相同长度，各位置字符也相同），返回 `true`，否则返回 `false`。
   
6. 如果 `x` 类型为 `Boolean`，继续判断：

   a. 如果 `x` 和 `y` 都是 `true` 或都是 `false`，返回 `true`，否则返回 `false`。

7. 如果 `x` 类型是 `Symbol`，继续判断：

   a. 如果 `x` 和 `y` 是相同的 `Symbol` 值，返回 `true`，否则返回 `false`。

8. 如果 `x` 和 `y` 是相同的对象值，返回 `true`，否则返回 `false`。

以上就是在 `ECMAScript` 规范中关于 `==` 与 `===` 相等比较的说明。

> 参考：[http://www.ecma-international.org/ecma-262](http://www.ecma-international.org/ecma-262)