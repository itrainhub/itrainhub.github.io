---
title: 1px 边框问题解决方案
category: web
tags: [border, mobile, 1px, retina, dp, dip, dpr, css]
key: web_one_pixel_problem
---

本文主要介绍造成 `1px` 边框问题原因和几种常用的解决方案。

## 几个概念

像素（`px`）是作为网页布局的基础，通常一个像素就是计算机能够显示一种特定颜色的最小区域。当设备尺寸相同，像素变得越密集，屏幕能显示的画面就越细致。

像素是一个抽象的单位，它不是一个确定的物理量，也不是一个具体的点或者小方块（尽管可以用点和小方块来呈现），在不同的设备或不同的环境中，`1px` 所代表的大小是不同的。

以下先介绍几个基本的概念：

### CSS 像素

`CSS` 像素是一个抽象的单位，主要使用在浏览器上，用来精确度量 `Web` 页面上的内容。一般情况之下，`CSS` 像素也被称为与设备无关的像素（`device-independent pixel`，简称 `DIPs`）或逻辑像素。

`CSS` 像素，顾名思义就是我们写 `CSS` 时所用的像素（当然 `JavaScript` 中也可以使用），它跟设备屏幕的物理像素没必然关系，比如 `windows` 的桌面显示器，当你修改显示器的分辨率，由 `1920` 的分辨率修改为 `1280` 分辨率，你会发现网页里的图形和字体会变大，同样的显示器，原来能显示网页的全部宽度，修改分辨率后只能显示部分宽度，也就是说 `CSS` 像素变大了。所以，`CSS` 像素是与设备无关的，可以被硬件和软件调节的单位。

### 物理像素（physical pixel）

物理像素又称为设备像素（`device pixel`）、设备物理像素，它是显示设备（如电脑显示屏、手机屏幕）最小的物理显示单位，每个物理像素由颜色值和亮度值组成。

一个设备的物理像素是**固定不变**的，我们经常听说的一倍屏、二倍屏（`Retina`）指的是设备以多少物理像素来显示一个 `CSS` 像素，多倍屏会以更多更精细的物理像素点来显示一个 `CSS` 像素点。例如，普通屏幕下一个 `CSS` 像素点对应一个物理像素点，而 `Retina` 屏中的一个 `CSS` 像素点对应四个物理像素点：

![css_piexls_device_piexls](/assets/images/2020-06-08/css_piexls_device_piexls.jpg)

### 设备像素比（device pixel ratio）

设备像素比简称 `dpr`，定义了物理像素与设备独立像素之间的对应关系，其换算公式为：

```bash
设备像素比 ＝ 物理像素 / 设备独立像素
```

浏览器中可以使用 `window.devicePixelRatio` 来获取设备像素比的值。

## 原因

啥玩应啊？

像素还分物理像素、逻辑像素，大家统一一点不好吗？

其实在很久以前的确是没区别的，`CSS` 里写个 `1px`，屏幕就给你渲染成 `1` 个实际的像素点，`dpr = 1`，多么简单，多么方便，多么自然。

然而，就有人出来搞事情了，这就是苹果的 `Retina` 技术。`Retina` 使用 `4` 个及至更多的物理像素点来渲染 `1` 个逻辑像素点，如此一来，同样的 `CSS` 代码设置的尺寸，在非 `Retina` 屏与 `Retina` 屏上显示的大小是一致的，但在 `Retina` 屏上却获得了更精细的显示效果。

在 `Retina` 屏上，通常 `dpr` 都不再是 `1`，而是大于 `1`，比如 `iPhone 5/SE/6/7/8`  的 `dpr` 为 `2`；`iPhone 6/7/8 Plus` 和 `iPhone X` 的 `dpr` 为 `3`；甚至有些 `Android` 机的 `dpr` 为非整数，比如 `Pixel 2` 的 `dpr` 为 `2.625`。

## 带来的问题

在苹果的带动下，`Retina` 技术在移动设备上已成为标配，那对于前端攻城狮们来说，就必须面对这样的事实：你想要画个 `1px` 的边框，但屏幕塞给你一条宽度为 `2` 或 `3` 物理像素的线，而设计师想要的其实就是 `1` 物理像素宽的线，你还不能像原生 `Android` 或 `iOS` 同事那样直接操纵物理像素点，这就是 `1px` 边框问题的由来。

如果 `dpr` 为 `2`，可以认为 `CSS` 设置 `border: 0.5px;` 就是 `1` 物理像素宽度的边框，但并不是所有移动设备的浏览器都能正确识别 `border: 0.5px;`，在有的系统里 `0.5px` 直接被处理为 `0px` 了，那如何来解决 `1px` 边框问题呢？

## 解决方案

### border-image

首先准备一线符合应用要求的图片，然后根据 `CSS` 的 `border-image` 属性来设置。例如设置下边框：

```css
.border-image-1px {
  border-bottom: 1px solid transparent;
  border-image: url(images/border.png) 0 0 2 0 stretch;
}
```

使用的图片是 `2px` 高，上部的 `1px` 颜色为透明，下部的 `1px` 使用视觉规定的 `border` 颜色，如图所示：

![border-image](/assets/images/2020-06-08/border-image.png)

**优点：**

- 可以设置单条边框、多条边框；
- 没有性能瓶颈问题。

**缺点：**

- 修改边框颜色和样式比较麻烦；
- 某些设备边缘会模糊。

### background-image

使用 `background-image` 与 `border-image` 的方法类似，需要先准备一张符合应用要求的图片，然后将边框的设置使用背景的方式来实现，例如：

```css
.background-image-1px {
  background: url(images/border.png) repeat-x left bottom;
  background-size: 100% 1px;
}
```

优缺点与 `border-image` 一致。

### box-shadow

使用 `box-shadow` 模拟边框，利用 `CSS` 对阴影处理的方式实现 `1px` 的效果，例如：

```css
.box-shadow-1px {
  box-shadow: inset 0px -1px 1px -1px #666;
}
```

**优点：**

- 代码量少，兼容性较好。

**缺点：**

- 边框有阴影，颜色变淡。

### viewport + rem 实现

通过设置 `viewport` 的 `rem` 基准值，这种方式就可以像以前一样轻松愉快的写 `1px` 了。

可以结合 `JavaScript` 判断，当 `dpr = 2` 时：

```html
<meta name="viewport" content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no">
```

当 `dpr = 3` 时：

```html
<meta name="viewport" content="initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no">
```

**优点：**

- 一套代码，基本可以兼容所有布局。

**缺点：**

- 老旧项目修改代价太大。

### 伪类 + transform 实现

个人认为伪类 + `transform` 是比较完美的方法，原理是把元素的 `border` 去掉，然后利用 `:before` 或者 `:after` 重做 `border`，并将 `transform` 的 `scale` 缩小一半，将原先的元素相对定位，新做的 `border` 绝对定位即可。

单边框 `border` 样式：

```css
.border-1px{
  position: relative;
  border: none;
}
.border-1px:after{
  content: '';
  position: absolute;
  bottom: 0;
  background: #000;
  width: 100%;
  height: 1px;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
```

如果需要四边 `border` 样式设置：

```css
.border-1px{
  position: relative;
  border: none;
}
.border-1px:after{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #000;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 200%;
  height: 200%;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-transform-origin: left top;
  transform-origin: left top;
}
```

### 其它方案

**`WWDC` 对 `iOS` 系统给出的方案：**

在 `2014` 年的 `WWDC` 大会上，对 `iOS8+` 的并且是 `dpr = 2` 的设备来说，给出来了 `1px` 方案：当写成 `0.5px` 的时候，就会显示一个物理像素宽度的 `border`， 所以在 `iOS` 下，你可以这样写：

```css
.box {
  border:0.5px solid #ccc;
}
```

但这种解决方案通常 `Android` 不适用。

**多背景渐变：**

与 `background-image` 方案类似，只是将图片替换为 `css3` 渐变的方式：设置 `1px` 的渐变背景，`50%` 有颜色，`50%` 透明。样式设置：

```css
.background-gradient-1px {
  background:
    linear-gradient(#000, #000 100%, transparent 100%) left / 1px 100% no-repeat,
    linear-gradient(#000, #000 100%, transparent 100%) right / 1px 100% no-repeat,
    linear-gradient(#000,#000 100%, transparent 100%) top / 100% 1px no-repeat,
    linear-gradient(#000,#000 100%, transparent 100%) bottom / 100% 1px no-repeat
}
/* 或者 */
.background-gradient-1px{
  background:
    -webkit-gradient(linear, left top, right bottom, color-stop(0, transparent), color-stop(0, #000), to(#000)) left / 1px 100% no-repeat,
    -webkit-gradient(linear, left top, right bottom, color-stop(0, transparent), color-stop(0, #000), to(#000)) right / 1px 100% no-repeat,
    -webkit-gradient(linear, left top, right bottom, color-stop(0, transparent), color-stop(0, #000), to(#000)) top / 100% 1px no-repeat,
    -webkit-gradient(linear, left top, right bottom, color-stop(0, transparent), color-stop(0, #000), to(#000)) bottom / 100% 1px no-repeat
}
```

但这种方式设置代码量大，也存在兼容问题。