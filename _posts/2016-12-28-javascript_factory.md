---
layout: post
title: JavaScript 设计模式之工厂模式
date: 2016-12-28
category: JavaScript
tags: [JavaScript, 设计模式]
---

## 1. 引子

在介绍这篇内容之前，先以一个小故事开头。

话说有一个暴发户，他家有三辆轿车（奔驰、宝马、奥迪），还雇了司机为他开车。不过，暴发户每次坐车时总是这样：上奔驰车后跟司机说“开奔驰车！”，坐上宝马后他说“开宝马车！”，坐上奥迪后他说“开奥迪车！”。

也许你会说：这人有病吧！直接说开车不就行了？！非得多此一举是要表明自己是壕了吗？这是病，得治。

其实像这样的行为放到程序中来实现时，在面向过程思想中暴发户一直是通过这种方式来坐车的。

幸运的是，这种病在面向对象思想中有得治了。那如何来治病，下面我们开始今天的主题：工厂模式。

## 2. 工厂模式

工厂模式主要是为创建对象提供过渡接口，专门负责将大量有共同接口的类实例化，而且不必事先知道每次是要实例化哪一个类的模式，以便将创建对象的具体过程屏蔽隔离起来，达到提高灵活性的目的。

一般工厂模式可以分为三类：

*	简单工厂模式
*	工厂方法模式
*	抽象工厂模式

这三种模式从上到下逐步抽象，并且更具一般性。

### 2.1 简单工厂

简单工厂模式又称静态工厂方法模式，从命名上就可以看出这个模式很简单。它存在的目的很简单：定义一个用于创建对象的接口。严格来说，它并未纳入 GoF 23 种设计模式中。

简单工厂的角色主要有四种：

*	抽象产品角色：它约束具体产品的特征
* 	具体产品角色：实实在在使用到的对象
*  工厂角色：负责创建具体产品

先看下面代码：

	<script type="text/javascript">
		// 奔驰构造函数
		function Benz(type) {
			this.type = type;
			this.startUp = function(){
				console.log("身份的象征，" + this.type + " 奔驰启动...");
			}
		}

		// 宝马构造函数
		function BMW(type) {
			this.type = type;
			this.startUp = function(){
				console.log("接老婆专用，" + this.type + " 宝马出发...");
			}
		}

		// 创建对象
		var benz = new Benz("2017 款奔驰 G350"),
			bmw = new BMW("2017 款宝马 X6");
		// 启动
		benz.startUp();
		bmw.startUp();
	</script>
	
`var benz = new Benz("2017 款奔驰 G350");` 老板说，取我的奔驰车来，则创建奔驰车对象。

`benz.startUp();` 老板说，启动奔驰车。

很显然，老板坐进奔驰车后，就只需要说“开车”就行，没必要再说明是开奔驰车，因为已经在奔驰车内部，再指明是开奔驰车就很多余了。而 `benz.startUp();` 正是说的“开奔驰车”这个意思。可做如下改进：

	<script type="text/javascript">
		// 原型继承方法
		function extend(Sub, Super) {
			function fn(){};
			fn.prototype = Super.prototype;
			Sub.prototype = new fn();
		}
		// 抽象产品角色
		function Car(){};
		Car.prototype.startUp = function(){throw new Error("请重写该方法...");}

		// 奔驰，具体产品角色
		function Benz() {}
		extend(Benz, Car);
		// 奔驰启动方法
		Benz.prototype.startUp = function(){
			console.log("身份的象征，奔驰启动...");
		}

		// 宝马构造函数
		function BMW() {}
		extend(BMW, Car);
		// 宝马启动方法
		BMW.prototype.startUp = function(){
			console.log("接老婆专用，宝马出发...");
		}
		// 工厂
		var Factory = function(){};
		// 静态方法
		Factory.getCar = function(type){
			switch(type) {
				case "benz":
					return new Benz();
				case "bmw":
					return new BMW();
			}

			return null;
		}

		// 创建对象
		var car = Factory.getCar("benz");
		// 启动
		car.startUp();

		car = Factory.getCar("bmw");
		car.startUp();
	</script>
		
老板说，取我的宝马来：`car = Factory.getCar("bmw");`，开车：`car.startUp();`。

对于对象的创建，直接在工厂的静态方法中根据所需提取汽车类型，创建对应的对象；获取到对象后，调用对象的启动方法即可。

这便是简单工厂模式了，它符合现实中的情况，并且客户**免除了直接创建产品对象的责任**，而仅仅负责“消费”产品（正如暴发户所为），产品的创建由工厂完成。

当暴发户增加了一辆车的时候，只要符合抽象产品角色的特点，就可以通知工厂知道，然后让工厂创建具体角色，对象就可以被客户使用了。对于具体产品角色部分来说，它是符合开闭原则的；但是对于工厂来说就不太理想，因为每增加一辆车，都要在工厂中增加相应的业务逻辑，即需要修改工厂的代码，这显然是违背开闭原则的。

所以，简单工厂模式适用于业务简单的情况下或者具体产品很少扩展的情况，而对于复杂的业务环境可能不太适应了，这时我们就可以考虑使用工厂方法模式了。

### 2.2 工厂方法

如果老板又购买了奥迪用于跑业务，那么使用简单工厂模式，则需要修改工厂类，当更复杂的业务添加进来后，工厂类修改得更频繁，这有悖开闭原则的设计原则，则可以使用工厂方法。

工厂方法涉及的角色：

*	抽象工厂角色： 这是工厂方法模式的核心，是具体工厂角色必须实现的接口或者必须继承的父类。
*	具体工厂角色：它含有和具体业务逻辑有关的代码，由应用程序调用以创建对应的具体产品的对象。
*	抽象产品角色：它是具体产品角色继承的父类或者是实现的接口。
*	具体产品角色：具体工厂角色所创建的对象是此角色的实例。

示例：

	<script type="text/javascript">
		// 原型继承方法
		function extend(Sub, Super) {
			function fn(){};
			fn.prototype = Super.prototype;
			Sub.prototype = new fn();
		}

		function Car(){};
		Car.prototype.startUp = function(){throw new Error("请重写该方法...");}

		// 奔驰构造函数
		function Benz() {}
		extend(Benz, Car);
		// 奔驰启动方法
		Benz.prototype.startUp = function(){
			console.log("身份的象征，奔驰启动...");
		}

		// 宝马构造函数
		function BMW() {}
		extend(BMW, Car);
		// 宝马启动方法
		BMW.prototype.startUp = function(){
			console.log("接老婆专用，宝马出发...");
		}
		// 工厂
		var Factory = function(){};
		Factory.prototype.createCar = function(){
			throw new Error("请重写该方法...");
		}

		// 创建奔驰的工厂
		function BenzFactory(){}
		extend(BenzFactory, Factory);
		BenzFactory.prototype.createCar = function(){
			return new Benz();
		}
		// 创建宝马的工厂
		function BMWFactory(){}
		extend(BMWFactory, Factory);
		BMWFactory.prototype.createCar = function(){
			return new BMW();
		}

		// 创建对象
		var car = new BMWFactory().createCar();
		// 启动
		car.startUp();

		car = new BenzFactory().createCar();
		car.startUp();
	</script>
	
这时如果新购入奥迪：

	function Audi(){}
	extend(Audi, Car);
	Audi.prototype.startUp = function(){
		console.log("业务专用，奥迪启动...");
	}
	function AudiFactory(){};
	extend(AudiFactory, Factory);
	AudiFactory.prototype.createCar = function(){
		return new Audi();
	}

	car = new AudiFactory().createCar();
	car.startUp();
	
这样就不用修改已有代码了，符合开闭原则了，但维护的重任就落在客户端上了。当然从上述示例看来，暂时单独创建具体工厂角色来实例化对象的优势也没体现出来。

对于`car = new AudiFactory().createCar(); car.startUp();`来说，这是司机要做的事。老板告诉司机去取什么样的车，司机将车发动，那司机怎么知道使用的具体工厂是已有的还是未来的呢？

对于以上两点问题，可利用 JavaScript 的灵活性来实现：

	var FactoryCreator = (function(){
		var roles = {"Benz":Benz, "BMW":BMW};
		return {
			register: function(role, Car) {
				if (Car.prototype.startUp)
					roles[role] = Car;
			},
			createCar: function(role) {
				var car = roles[role];
				return car ? new car() : null;
			}
		}
	})();

	function Driver(){}
	Driver.prototype.drive = function(type){
		var car = FactoryCreator.createCar(type);
		car.startUp();
	}
	
	// 测试
	new Driver().drive("Benz");
	
添加新车型奥迪：

	function Audi(){}
	extend(Audi, Car);
	Audi.prototype.startUp = function(){
		console.log("业务专用，奥迪启动...");
	}
	FactoryCreator.register("Audi", Audi);
	// 测试
	new Driver().drive("Audi");
	
这样，当奥迪创建后，只需要在工厂中注册一下，司机即可提取并启动奥迪了。

### 2.3 抽象工厂

抽象工厂模式的各个角色和工厂方法的如出一辙，抽象工厂模式是工厂方法模式的升级版本，在有多个业务品种、业务分类时，通过抽象工厂模式产生需要的对象是一种非常好的解决方式。

来认识一个概念，产品族：位于不同产品等级结构中，功能相关联的产品组成的家族。比如对于轿车来说有跑车家族，那么不管是宝马的跑车，还是奔驰的跑车，我们都可以放到跑车这个产品家族中。

抽象工厂模式的用意为：给客户提供一个接口，可以创建多个产品族中的产品对象。

	<script type="text/javascript">
		// 原型继承方法
		function extend(Sub, Super) {
			function fn(){};
			fn.prototype = Super.prototype;
			Sub.prototype = new fn();
		}

		// 奔驰车
		function Benz(){};
		Benz.prototype.startUp = function(){throw new Error("请重写该方法...");}

		// 奔驰跑车构造函数
		function BenzSports() {}
		extend(BenzSports, Benz);
		// 奔驰跑车启动方法
		BenzSports.prototype.startUp = function(){
			console.log("接老婆专用，奔驰跑车启动...");
		}

		// 奔驰商务车构造函数
		function BenzBusiness() {}
		extend(BenzBusiness, Benz);
		// 奔驰商务车启动方法
		BenzBusiness.prototype.startUp = function(){
			console.log("身份的象征，奔驰商务车出发...");
		}

		// 工厂
		function Factory(){};
		Factory.prototype.createSports = function(){
			throw new Error("请重写该方法...");
		}
		Factory.prototype.createBusiness = function(){
			throw new Error("请重写该方法...");
		}

		// 跑车工厂
		function SportsFactory(){};
		extend(SportsFactory, Factory);
		SportsFactory.prototype = {
			constructor : SportsFactory,
			createBenz : function(){
				return new BenzSports();
			}
		}
		// 商务车工厂
		function BusinessFactory(){};
		extend(BusinessFactory, Factory);
		BusinessFactory.prototype = {
			constructor : BusinessFactory,
			createBenz : function(){
				return new BenzBusiness();
			}
		}

		// 测试：奔驰商务车
		var car = new BusinessFactory().createBenz();
		car.startUp();
	</script>
	
抽象工厂模式具有很好的封装性，高层模块只关心接口、抽象类，它不关心对象是如何创建出来，因为对象的创建由工厂负责，只要知道工厂是谁，我就能创建出一个需要的对象，省时省力。

但抽象工厂模式的最大缺点就是产品族扩展非常困难。如果要增加一个产品（奥迪），看看我们的程序有多大改动吧！抽象类 Factory 要增加一个方法 createAudi()，然后，两个实现类都要修改，这就违背了开闭原则。

但是一定要清楚的是产品族扩展困难，而不是产品等级，在抽象工厂模式下，产品等级是非常容易扩展的，增加一个产品等级，只要增加一个工厂负责新增加出来的产品生产任务即可，也就是说横向扩展容易。比如要增加越野车的产品族，扩展就很方便，只需要创建越野车工厂，负责生产不同品牌的产品即可。