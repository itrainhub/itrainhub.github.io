---
title: JavaScript 对象初识
category: javascript
tags: [javascript, OOP]
key: javascript_object_create
---

## 1. 概述

在 JavaScript 中，数据类型分为：number、string、boolean、undefined、null、object，其中 number、string、boolean、undefined、null 也称为基本数据类型，而 object 称为引用数据类型。

之所以 object 和其它数据类型不同，是因为对象是一种复合值，它将若干值以 key-value 键值对的形式聚合在一起。我们可以将对象看作是一系列无序的数据集合，通过 key 关键字可以访问到其关联的 value 值。

## 2. 对象创建

对象创建有三种方式：对象直接量方式、new 调用构造函数方式与 Object.create() 方式。

### 2.1 对象直接量

直接量也称为字面量，对象直接量由若干 key-value 键值对组成映射表，key 与 value 间使用冒号（:）分隔，键值对间会用逗号（,）分隔，将所有 key-value 键值对包裹在花括号（{}）之间：

```javascript
var student = {
	name : "张三",
	age : 18,
	sex : "男"
};
```

对象的所有键名都是字符串，所以在 JavaScript 中，键名可使用引号（单引号、双引号均可），也可不使用引号，不使用引号会自动转为字符串。上边的对象也等价于：

```javascript
var student = {
	"name" : "张三",
	"age" : 18,
	"sex" : "男"
};
```

对象的所有键值对也叫做属性，键名就是属性名，键值就是属性值。键值可以是任意数据类型，即键值也可以是函数（function），当键值为函数时，我们通常就将这个属性称为“方法”。

```javascript
var student = {
	name : "张三",
	age : 18,
	sex : "男",
	show : function(){
		console.log("这是一个学生对象...");
	}
};
```

**ES5 标准中，允许对象直接量最后一个属性后有一个逗号**，但如果是旧版本的浏览器，不支持 ES5 标准，则会提示错误。

### 2.2 new 构造函数

我们可以像创建数组对象、日期时间对象一样，通过 new 调用构造函数来创建普通的对象：

```javascript
var student = new Object();
```

对象创建后，通过点运算符或索引方式为对象添加属性：

```javascript
student.name = "张三";
student["age"] = 18;
```

通过 `new Object()` 创建的一个空对象，也可直接写成：`new Object` 省略小括号的编写。

也可以在 new 创建对象时传递参数，如果传递参数是一个对象，则直接返回参数对象：

```javascript
var obj = {name:"张三", age:18};
var stu = new Object(obj);
console.log(obj === stu); // true
```

如果传递参数是基本类型的值，则返回包装对象：

```javascript
var obj1 = new Object(1.3); // Number {}
var obj2 = new Object("test"); // String {0: "t", 1: "e", 2: "s", 3: "t", length: 4}
var obj3 = new Object(true); // Boolean {}
var obj4 = new Object(undefined); // {}
var obj5 = new Object(null); // {}
```

注意，传递 undefined 与 null 会返回空对象。

当以非构造函数形式被调用时，Object 等同于 new Object()，即我们通常使用 Object() 来实现数据类型的转换，将其它类型转换为对象类型：

```javascript
var obj1 = Object(1);
var obj2 = Object(true);
```

### 2.3 Object.create()

ES5 新特性中定义了名为 Object.create() 的方法，用来创建对象。

语法：

```javascript
Object.create(proto, [ propertiesObject ])
```

proto 参数是作为新创建对象的原型，propertiesObject 是可选参数，用来对对象的属性进行描述：

```javascript
var sexValue;
var stu = Object.create(Object.prototype, {
	name : {
		value: "张三",
		writable: true,
		configurable:true,
		enumerable: true
	},
	age : {
		get : function(){return 18},
		configurable:true,
		enumerable: true
	},
	sex : {
		get : function(){return sexValue},
		set : function(newSexValue){sexValue = newSexValue;},
		configurable:true,
		enumerable: false
	}
});
```

有关对象属性描述，可见[《ES5 新特性》](/2016/12/javascript_feature/)说明。

## 3. 删除对象属性

`delete` 命令可用于删除对象属性，返回是否删除成功：

```javascript
var obj = {name:"lily", age:18, sex:"female"};
console.log(Object.keys(obj)); // ["name", "age", "sex"]
console.log(delete obj.sex); // true
console.log(Object.keys(obj)); // ["name", "age"]
console.log(obj.sex); // undefined
```

注意，删除一个不存在的属性也会返回 true ：
	
```javascript
console.log(delete obj.address); // true
```

所以不能仅通过返回值的 true 或 false 就判断对象属性存在与不存在，只能保证删除后再次读取该属性值返回 undefined。

但下边的情况 `delete` 会返回 false：

```javascript
var stu = Object.create(Object.prototype, {
	name : {
		value: "张三",
		writable: true,
		configurable:false,
		enumerable: true
	}
});
console.log(delete stu.name); // false
console.log(stu.name); // 张三
```

## 4. in 运算符

in 运算符用于检查对象是否包含某个属性（注意：检查的是键名，不是键值），如果包含就返回 true，否则返回 false。

```javascript
var obj = {name:"lily", age:18, sex:"female"};
console.log("age" in obj); // true
console.log("address" in obj); // false
```

in 运算符的一个问题是，它不能识别对象继承的属性：

```javascript
console.log("toString" in obj); // true
```

toString 方法不是对象 obj 自身的属性，而是继承的属性，如果要判断是否 obj 自身的属性，可以使用hasOwnProperty 方法：

```javascript
console.log(obj.hasOwnProperty("toString")); // false
```

## 5. for .. in

for...in 循环可用来遍历一个对象的全部属性：

```javascript
var obj = {name:"lily", age:18, sex:"female"};
for (var attr in obj) {
	console.log(attr, obj[attr]);
}
```

打印结果：

```javascript
name – "lily"
age – 18
sex – "female"
```

for...in 循环有两个使用注意点：

*	遍历的是对象所有可遍历（enumerable）的属性，会跳过不可遍历的属性
*	不仅遍历对象自身的属性，还遍历继承的属性

示例：

```javascript
function Student(name, age){
	this.name = name;
	this.age = age;
}

Student.prototype.show = function(){
	console.log("学生信息...");
}

var obj = new Student("lily", 18);
var stu = Object.create(obj, {
	address : {
		value : "成都",
		enumerable : true
	},
	sex : {
		value : "女"
	}
});
for (var attr in stu) {
	console.log(attr, stu[attr]);
}
```

打印结果：

```javascript
address – "成都"
name – "lily"
age – 18
show – function (){
	console.log("学生信息...");
}
```

> 参考
> 
> [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
> 
> [http://javascript.ruanyifeng.com/grammar/object.html](http://javascript.ruanyifeng.com/grammar/object.html)