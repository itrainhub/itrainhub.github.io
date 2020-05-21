---
title: 开发规范及工作规范示例
category: engineering
tags: [BEM, OOCSS, Lint, ESLint]
key: engineering_specification
---

在实际开发中，由于团队成员编码习惯不一，技术层次不同，开发前定制并遵循一种代码规范能提高代码质量，增加开发效率。

## 开发规范

### 工作目录构建规范

示例：

```html
front-end/
|--src
|  |--assets
|  |  |--css
|  |  |--font
|  |  |--images
|  |  |--js
|  |--components
|  |--requests
|  |--router
|  |--store
|  |--utils
|  |--views
|--dist
|--build
|--test
|--doc
```

前端项目构建时，目录结构大同小异，类似使用到上例中的目录结构。

### 代码命名规范

#### BEM

示例：

```css
.sidebar { /* .block */ }
.sidebar-item { /* .block-modifier */ }
.sidebar-item__text { /* .block-modifier__element */ }
```

`Block`，块，逻辑与功能独立的单元，类似于一个组件，如：`.btn` 是表示按钮的类，在任何元素上使用该类就可以生成按钮的传统样式；

`Modifier`，修饰符，改变某个 Block 的外观、状态或行为的标志，如：`.btn-lg` 表示一个大按钮，`.btn-sm` 表示一个小按钮；

`Element`，元素，Block 的子节点，如：`.sidebar-item__text` 表示侧边导航项的文本，`.sidebar-item__info` 表示侧边导航项的徽标提示等。

#### OOCSS

`Object Oriented Cascading Style Sheets`，面向对象的 `CSS`，旨在编写可复用，可扩展，低耦合的 `CSS` 代码，是以面向对象的思想去定义样式，将抽象和实现分离，抽离出公共代码。

两个主要原则：

- **区分结构和皮肤**

使用 `OOCSS` 前的设计：

```css
#button {
  width: 200px;
  height: 50px;
  padding: 10px;
  border: solid 1px #ccc;
  background: linear-gradient(#ccc, #222);
  box-shadow: rgba(0, 0, 0, .5) 2px 2px 5px;
}

#box {
  width: 400px;
  overflow: hidden;
  border: solid 1px #ccc;
  background: linear-gradient(#ccc, #222);
  box-shadow: rgba(0, 0, 0, .5) 2px 2px 5px;
}

#widget {
  width: 500px;
  min-height: 200px;
  overflow: auto;
  border: solid 1px #ccc;
  background: linear-gradient(#ccc, #222);
  box-shadow: rgba(0, 0, 0, .5) 2px 2px 5px;
}
```

这三个元素是不同的，使用了不可复用的 `ID` 选择器来定义样式，但它们也有几个通用的样式，改进一下，我们可以抽象出一个通用的样式：

```css
.button {
  width: 200px;
  height: 50px;
}

.box {
  width: 400px;
  overflow: hidden;
}

.widget {
  width: 500px;
  min-height: 200px;
  overflow: auto;
}

.skin {
  border: solid 1px #ccc;
  background: linear-gradient(#ccc, #222);
  box-shadow: rgba(0, 0, 0, .5) 2px 2px 5px;
}
```

我们使用可复用的类选择器，通用样式合并到可复用的 `.skin` 中以避免不必要的重复。

- **区分容器和内容**

为说明这一原则的重要性，先看如下 `CSS` 片段：

```css
#sidebar h3 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 2em;
  line-height: 1;
  color: #777;
  text-shadow: rgba(0, 0, 0, .3) 3px 3px 6px;
}
```

如果在 `footer` 中也有这样的样式，仅是字号与文字阴影小有差异，则：

```css
#sidebar h3, #footer h3 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 2em;
  line-height: 1;
  color: #777;
  text-shadow: rgba(0, 0, 0, .3) 3px 3px 6px;
}

#footer h3 {
  font-size: 1.5em;
  text-shadow: rgba(0, 0, 0, .3) 2px 2px 4px;
}
```

甚至可能写得更糟糕点：

```css
#sidebar h3 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 2em;
  line-height: 1;
  color: #777;
  text-shadow: rgba(0, 0, 0, .3) 3px 3px 6px;
}

/* other styles here.... */

#footer h3 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.5em;
  line-height: 1;
  color: #777;
  text-shadow: rgba(0, 0, 0, .3) 2px 2px 4px;
}
```

上述写法中出现了不必要的重复书写，那么可以考虑修改如下：

```css
.title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 2em;
  line-height: 1;
  color: #777;
  text-shadow: rgba(0, 0, 0, .3) 3px 3px 6px;
}
#footer .title {
  font-size: 1.5em;
  text-shadow: rgba(0, 0, 0, .3) 2px 2px 4px;
}
```

> 参考文章：https://www.smashingmagazine.com/2011/12/an-introduction-to-object-oriented-css-oocss/

#### JSLint、JSHint、ESLint

由于 `JavaScript` 本身设计上存在许多缺陷，代码不严谨可能就会触发神奇的错误。比如 `==` 与 `===` 混用时，可能会导致类型不一致时的 `bug`，但开发经验不足时可能很难查找到错误。`Lint` 工具的面市，帮助 `JavaScript`的开发者们节省了不少排查代码错误的时间，它不仅可以检测代码中的潜在 `Bug`，还能做一些类型检查。

> https://eslint.bootcss.com/docs/user-guide/getting-started

### 开发文档编写规范

> https://github.com/ecomfe/spec

## 工作规范

### 周报、日报

很多公司会要求写日报或周报，大多数也会有自己的模板，无外乎当是/周工作内容、遗留问题、工作计划等方面。

### 邮件

邮件是公司内部沟通的主要手段之一，如何写好一封邮件，也是职场必备技能之一，我们可以从以下几方面来说明。

收件人：一般为对接的主要联系人，可能是一个团队，也可能是多个人

抄送：和本次事件相关联的人，比如，团队成员，收件人的leader等。我让大家抄送给小明老师，因为他是我的leader

主题：这里正常的格式为`在什么时间，谁关于什么事情`。比如：你们这次的主题应该是`某某小组代码规范的草案`或者`某某小组关于代码规范的议案`或者`某某小组代码规范V1.0`等等

正文：

正文内容应该由几个部分组成

- 称呼问好
- 关于主题的描述
- 祝福语
- 落款，我根本不知道你们是谁，你们的都是一些昵称
- 如果有附件，需要声明

套用上面的格式，你们的邮件应该长成这样：

> 勇哥：
> 
> ​  你（正规的工作中，尽量用"您"）好！(如果是多位接收者，可以用 大家好！或者各位**好之类的称呼)
> 
> ​  我是XXX小组的组长XXX，我们组的成员有：XXX，YYY，ZZZ，这次作业大家的分工如下：
> 
>   XXX: 负责XXX的编写
> 
>   ……
> 
>   现在小组成员已经完成初稿(v1.0等)，你可以在这里查看：
> 
>   链接地址
> 
>   如果有附件的话，就需要注明：请查收附件之类的话
> 
>   如有问题，请（礼多人不怪）随时联系（或者请多指教之类的话）。如果没有问题，我们团队将按照这个规范执行。等一系列的话。
> 
> 祝：好！
> 
> 落款
> 
> 联系方式等

