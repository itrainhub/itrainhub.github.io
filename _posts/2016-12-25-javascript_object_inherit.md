---
layout: post
title: JavaScript 面向对象之继承
date: 2016-12-25
category: JavaScript
tags: [JavaScript, 面向对象]
---

## 1. 概述

JavaScript 是一门非常灵活的语言，对于同一个问题的解决，往往有多种方法来实现。

继承是面向对象特性之一，它实现了代码的复用性与可维护性，可缩短开发周期，降低开发成本。继承易于维护管理，它避免了在一般类和特殊类之间共同特征的重复描述。

比如学生（一般类）具有学号、姓名、年龄、性别的特征，小学生、大学生（特殊类）都是学生，也都具备学生的特征，这时，我们就可以让小学生、大学生继承自学生，重用在学生描述部分的信息。

JavaScript 也可使用继承实现代码复用，在很多资料中对 JavaScript 的继承细致的分了许多种类与实现的方式，但无外乎两种方式：对象冒充、原型继承。本文介绍这两种实现继承的方式。

## 2. 对象冒充

### 2.1 普通对象冒充

对象冒充的实现方式是：让父类的构造函数成为子类的方法，然后调用子类的方法，使用 this 的特性为属性与方法赋值。

	<script type="text/javascript">
		function Car(type, price) {
			this.type = type;
			this.price = price;
			this.show = function(){
				return "info : type = " + this.type + ", price = " + this.price;
			};
		}

		function Bus(type, price, capacity) {
			this.parent = Car;
			this.parent(type, price);
			delete this.parent;
			this.capacity = capacity;
			this.showInfo = function() {
				return this.show() + ", capacity = " + this.capacity;
			}
		}

		var bus = new Bus("ZK6809DX", 5000000, "41人");
		console.log(bus.showInfo());
	</script>
	
有汽车对象，具有型号、价格的特征，客车是汽车，也有型号、价格的特征，当然它也有自己独立的特征：载客量。我让客车继承汽车，在 Bus 构造函数中，先设置`this.parent = Car;`将 parent 属性指向 Car 构造函数，表示即将复用 Car 函数中的内容。

`this.parent(type, price);` 执行后，实际调用到 Car 函数，在 Car 函数中有 this 关键字的使用。this 表示的是调用函数时刻的对象，Car 是在 Bus 中被`this`调用，即 Car 函数中的 this 指向 Bus 函数中的 this 对象。

当使用 new 调用 Bus 构造函数时，Bus 函数中的 this 指向 new 创建出来的 Bus 对象，所以`this.parent(type, price);`相当于是为 Bus 对象设置了 type、price、show 的属性。

这种继承的方式实际上是灵活使用了函数中 this 关键字，根据 this 所指代的对象来动态为所创建对象属性赋值。这就是对象冒充的方式实现继承。

### 2.2 call() 方法

call() 语法：

	fun.call(thisArg[, arg1[, arg2[, ...]]])
	
call() 方法的作用是调用 fun 函数时，将 fun 函数中的 this 指向 call() 方法的第一个参数 thisArg 所表示的对象。非严格模式下，thisArg 如果为 null 或 undefined ，fun 中的 this 值会自动指向全局对象(浏览器中就是window对象)，同时值为原始值(数字，字符串，布尔值)的 this 会指向该原始值的自动包装对象。

`[, arg1[, arg2[, ...]]]` 为可选参数，表示在调用 fun 函数时所需要的参数列表。

	<script type="text/javascript">
		function Car(type, price) {
			this.type = type;
			this.price = price;
			this.show = function(){
				return "info : type = " + this.type + ", price = " + this.price;
			};
		}

		function Bus(capacity) {
			this.capacity = capacity;
			this.showInfo = function() {
				return this.show() + ", capacity = " + this.capacity;
			}
		}

		var bus = new Bus("41人");
		Car.call(bus, "ZK6809DX", 5000000);
		console.log(bus.showInfo());
	</script>
	
`Car.call(bus, "ZK6809DX", 5000000);` 调用 Car() 函数时，将函数中 this 指向 bus 对象，为 bus 对象添加 type、price、show 的属性。这同样是对象冒充的情况。

### 2.3 apply() 方法

apply() 语法：

	fun.apply(thisArg[, argsArray])
	
该方法和 call() 方法类似，不同之处在于 apply() 方法的第二个参数为数组或类数组对象。

	<script type="text/javascript">
		function Car(type, price) {
			this.type = type;
			this.price = price;
			this.show = function(){
				return "info : type = " + this.type + ", price = " + this.price;
			};
		}

		function Bus(capacity) {
			this.capacity = capacity;
			this.showInfo = function() {
				return this.show() + ", capacity = " + this.capacity;
			}
		}

		var bus = new Bus("41人");
		Car.apply(bus, ["ZK6809DX", 5000000]);
		console.log(bus.showInfo());
	</script>
	
其实仅将 2.2 例中的`Car.call(bus, "ZK6809DX", 5000000);`修改为`Car.apply(bus, ["ZK6809DX", 5000000]);`即可，这也是对象冒充方式。

### 2.4 说明

使用对象冒充方式来实现继承也就这么回事，如果要实现多继承，重复类似过程即可。但在实际使用过程中，我们也不会大量使用对象冒充的方式来实现继承。

对象通常由属性与方法共同作用，在创建不同对象时，对象的属性拥有各自的私有值，便对象的方法一般是操作属性变量罢了，每个对象没必要各自都拥有一份该函数的副本，只需要将函数共享即可，这便会使用到 prototype 了。

上述示例中，为实现性能优化，通常我们会将方法放置在 prototype 中供实例对象共享，如：

	function Car(type, price) {
		this.type = type;
		this.price = price;
	}
	Car.prototype.show = function(){
		return "info : type = " + this.type + ", price = " + this.price;
	};

这时要通过对象冒充来实现继承 prototype 域中的属性方法就不行了。

## 3. 原型继承

原型继承是利用 prototype 来达到继承的目的。

### 3.1 一句话继承

	<script type="text/javascript">
		function Student() {
			this.hobbies = [];
		}
		Student.prototype.introduce = function(){
			return "大家好，我叫 " + this.name + "，今年 " 
				+ this.age + " 岁，我的兴趣爱好有：" + this.hobbies;
		}

		function Pupil(stuNo, name, age) {
			this.stuNo = stuNo;
			this.name = name;
			this.age = age;
		}
		Pupil.prototype = new Student(); // 实现继承

		var pupil = new Pupil("s001", "小明", 18);
		console.log(pupil.introduce());
	</script>
	
`Pupil.prototype = new Student();` 这条语句实现了 Pupil 继承自 Student 的操作。

通过 new Pupil() 创建了一个对象，该对象的隐式属性 `__proto__` 指向了 Pupil 构造函数的显示属性 prototype，而 Pupil 的 prototype 指向了新创建的 Student 对象。则在 pupil 对象的原型链中可访问到 Student 原型中的方法 introduce，也可使用到 Student 构造函数中创建出来的 hobbies 属性。

### 3.2 混合模式继承

3.1 中的继承也还存在一些问题，例如：
	
	<script type="text/javascript">
		function Student() {
			this.hobbies = [];
		}
		Student.prototype.introduce = function(){
			return "大家好，我叫 " + this.name + "，今年 " 
				+ this.age + " 岁，我的兴趣爱好有：" + this.hobbies;
		}

		function Pupil(stuNo, name, age) {
			this.stuNo = stuNo;
			this.name = name;
			this.age = age;
		}
		Pupil.prototype = new Student(); // 实现继承

		var pupil = new Pupil("s001", "小明", 18);
		pupil.hobbies.push("吃饭", "睡觉");
		console.log(pupil.introduce());

		var another = new Pupil("s002", "小红", 16);
		another.hobbies.push("打豆豆");
		console.log(another.introduce());

		console.log("再次打印 pupil 对象信息：" + pupil.introduce());
	</script>
	
创建第一个对象后，为其兴趣爱好添加两个：“吃饭、睡觉”，创建第二个对象后，仅为其兴趣爱好添加了一个“打豆豆”，但最终执行结果发现，another 对象的兴趣爱好有三个：“吃饭、睡觉、打豆豆”，而再次打印第一个对象 pupil 后发现，其兴趣爱好也变为三个。

造成这个问题的最主要原因是 Pupil 的所有对象都共享原型链中的 hobbies 属性，一旦有一个对象对 hobbies 作出修改，其它对象也会受到影响。显然这样是不太合适的，修改如下：

	<script type="text/javascript">
		function Student() {
			this.hobbies = [];
		}
		Student.prototype.introduce = function(){
			return "大家好，我叫 " + this.name + "，今年 " 
				+ this.age + " 岁，我的兴趣爱好有：" + this.hobbies;
		}

		function Pupil(stuNo, name, age) {
			this.stuNo = stuNo;
			this.name = name;
			this.age = age;
		}
		
		// 实现继承
		function Super(){}
		Super.prototype = Student.prototype;
		Pupil.prototype = new Super(); 

		var pupil = new Pupil("s001", "小明", 18);
		console.log(pupil.introduce());
	</script>
	
执行结果却发现，无法访问到 hobbies 这个属性。why？

分析一下：在 pupil 对象的原型链中，由于并未像 3.1 一样去创建 Student 的对象，所以也就不存在 hobbies 这个属性，所以打印时会显示兴趣爱好为：undefined。

那又如何解决兴趣爱好这个属性的使用呢，对于每个学生来说，兴趣爱好应该算是学生的一个私有的属性，不同的学生兴趣爱好取值会不一样，可以将兴趣爱好这个属性重新处理：

	function Student(hobbies) {
		this.hobbies = hobbies || [];
	}

	function Pupil(stuNo, name, age, hobbies) {
		Student.call(this, hobbies);
		this.stuNo = stuNo;
		this.name = name;
		this.age = age;
	}
		
可将兴趣爱好继续按照第 2 节中对象冒充的方式作继承处理，那这样属性与方法的继承就分别进行，这也就是典型的采用混合模式实现的继承：对象冒充实现私有属性继承、原型实现共享属性继承。完整示例：

	<script type="text/javascript">
		function Student(hobbies) {
			this.hobbies = hobbies || [];
		}
		Student.prototype.introduce = function(){
			return "大家好，我叫 " + this.name + "，今年 " 
				+ this.age + " 岁，我的兴趣爱好有：" + this.hobbies;
		}

		function Pupil(stuNo, name, age, hobbies) {
			Student.call(this, hobbies);
			this.stuNo = stuNo;
			this.name = name;
			this.age = age;
		}
		
		// 实现继承
		function Super(){}
		Super.prototype = Student.prototype;
		Pupil.prototype = new Super(); 

		var pupil = new Pupil("s001", "小明", 18);
		pupil.hobbies.push("吃饭", "睡觉");
		console.log(pupil.introduce());

		var another = new Pupil("s002", "小红", 16);
		another.hobbies.push("打豆豆");
		console.log(another.introduce());

		console.log("再次打印 pupil 对象信息：" + pupil.introduce());
	</script>
	
## 4. 拷贝式继承

还有一种继承方式也是比较典型的继承：拷贝继承。

	<script type="text/javascript">
		function Student(hobbies) {
			this.hobbies = hobbies || [];
		}
		Student.prototype.introduce = function(){
			return "大家好，我叫 " + this.name + "，今年 " 
				+ this.age + " 岁，我的兴趣爱好有：" + this.hobbies;
		}

		function Pupil(stuNo, name, age, hobbies) {
			Student.call(this, hobbies);
			this.stuNo = stuNo;
			this.name = name;
			this.age = age;
		}
		
		// 实现继承:拷贝 Student.prototype 的
		// 所有属性到 Pupil.prototype 中
		for(var attr in Student.prototype){
			Pupil.prototype[attr] = Student.prototype[attr];
		}

		var pupil = new Pupil("s001", "小明", 18);
		pupil.hobbies.push("吃饭", "睡觉");
		console.log(pupil.introduce());

		var another = new Pupil("s002", "小红", 16);
		another.hobbies.push("打豆豆");
		console.log(another.introduce());

		console.log("再次打印 pupil 对象信息：" + pupil.introduce());
	</script>
	
将 Student.prototype 中的所有可枚举属性遍历后一一拷贝到 Pupil.prototype 中。实际上就是利用代码的方式来实现的 ctrl+c/ctrl+v 功能。