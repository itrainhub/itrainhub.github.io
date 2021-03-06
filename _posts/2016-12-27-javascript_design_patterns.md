---
title: JavaScript 设计模式
category: javascript
tags: [javascript, 设计模式]
key: javascript_design_patterns
---

## 1. 概述

设计模式（Design pattern）是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结。使用设计模式是为了可重用代码、让代码更容易被他人理解、保证代码可靠性。

毫无疑问，设计模式于己于他人于系统都是多赢的，设计模式使代码编制真正工程化，设计模式是软件工程的基石，如同大厦的一块块砖石一样。项目中合理的运用设计模式可以完美的解决很多问题，每种模式在现在中都有相应的原理来与之对应，每一个模式描述了一个在我们周围不断重复发生的问题，以及该问题的核心解决方案，这也是它能被广泛应用的原因。

拿现在的话来说，设计模式就是套路，已知的解决某类问题的套路。中国自古以来其实就有这种套路了，比如《孙子兵法》。

**设计模式的四人帮：**

Erich Gamma、Richard Helm、Ralph Johnson和John Vlissides，（GoF，Gang of Four）在 1994 年合作出版的著作：《Design Patterns：Elements of Reusable Object-Oriented Software》（中译本《设计模式：可复用的面向对象软件的基本原理》或《设计模式》）。

GoF 的《设计模式》是圣经，书中归纳了23种设计模式，被称为 GoF 23 种模式。但是同时因为《设计模式》一书是 4 位博士的作品，并且主要是基于 Erich 的博士论文。文章最大的特色就是抽象，将一个具体的问题抽象到一般，形成理论，因此 GoF 的这本圣经在很多地方用语都比较精简和抽象。抽象的好处是能够提供指导性的意见和建议，其瑕疵就是不容易为新手所理解和掌握。所以本文也仅简单介绍一下设计模式的内容，让大家有所认识。

GoF 在《设计模式》一书中也提到，如果不是一个有经验的面向对象设计人员，建议从最简单最常用的设计模式入门，比如 Abstract Factory 模式、Adapater 模式、Composite 模式、Decorator 模式、Factory 模式、Observer 模式、Strategy 模式、Template 模式、Singleton 模式等。

## 2. 设计模式的分类

《设计模式》一书中，主要将设计模式分为三个类别：

*	创建型 
	-	Factory Method（工厂方法）
	- 	Abstract Factory（抽象工厂）
	-  Builder（建造者）
	-  Prototype（原型）
	-  Singleton（单例）
*	结构型
	-	Adapter（适配器）
	- 	Bridge（桥接）
	-  Composite（组合）
	-  Decorator（装饰）
	-  Facade（外观）
	-  Flyweight（享元）
	-  Proxy（代理）
*	行为型
	-	Interpreter（解释器） 
	- 	Template Method（模板方法）
	-  Chain of Responsibility（负责链）
	-  Command（命令）
	-  Iterator（迭代器）
	-  Mediator（中介者）
	-  Memento（备忘录）
	-  Observer（观察者）
	-  State（状态）
	-  Strategy（策略）
	-  Visitor（访问者）

借鉴《设计模式》一文的图来整体描述一下：

![设计模式](/assets/images/jsdsnptn/category.jpg)

## 3. 设计原则

说到设计模式，就要说一下设计原则。

设计原则的提出是针对软件的可维护性和可复用性问题的，首先是复用的原则，遵循设计原则可以有效地提高系统的复用性。

设计原则也是对系统进行合理重构的指南针，在不改变软件现有功能的基础上，通过调整程序代码改善软件的质量、性能，提高软件的扩展性和维护性。

常用七大设计原则：

|名称					|描述					|
|----					|----					|
|单一职责原则 (SRP)	|类的职责要单一，不能将太多的职责放在一个类中。	|
|开放封闭原则 (OCP)	|软件实体对扩展是开放的，对修改是关闭的	|
|里氏代换原则 (LSP)	|一个可以接受基类对象的地方必然可以接受一个子类对象	|
|依赖倒置原则 (DIP)	|要针对抽象层编程，而不要针对具体类编程	|
|接口隔离原则 (ISP)	|使用多个专用接口来取代一个统一的接口	|
|合成复用原则 (CRP)	|尽量多使用组合和聚合关联关系，尽量少使用甚至不使用继承关系	|
|迪米特法则 (LoD) 		|一个软件实体对其他实体的引用越少越好	|