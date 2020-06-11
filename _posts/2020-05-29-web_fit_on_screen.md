---
title: 前端屏幕适配方案
category: web
tags: [屏幕适配, rem, viewport, em, 响应式, 媒体查询, media query]
key: web_fit_on_screen
---

## 前言

随着移动设备变得越来越丰富，前端开发人员要实现 `页面内容自动适应不同尺寸屏幕` 的需求也越来越凸显了。原本可能通过百分比就可以完成适配的问题，现在也不是全部都适用了，为了适配各种不同尺寸的屏幕，我们需要了解一下都有哪些常用的适配方案。

## 适配方案

### 固定宽度

这是一种老版屏幕适配问题的解决方案，通常是把页面宽度固定死，如果有多余的宽度则进行居中留白。这种解决方案对于前端开发非常 `happy`，也就是不用管适配了。如下图示例：

![fit_old_edi](/assets/images/2020-05-29/fit_old_edi.png)

但是这种适配如果放在移动设备端，就有点难堪了，估计粉丝量分分钟就掉完了：

<img src="/assets/images/2020-05-29/fit_old_edi_2.png" alt="fit_old_edi_2" style="zoom:60%;" /><img src="/assets/images/2020-05-29/fit_old_edi_3.png" alt="fit_old_edi_3" style="zoom:60%;" /> <img src="/assets/images/2020-05-29/fit_old_edi_4.png" alt="fit_old_edi_4" style="zoom:60%;" />

### 响应式布局

这种方式是利用 `CSS3` 的 `Media Query`（媒体查询）技术实现，通过媒体查询根据不同的屏幕分辨率来进行适配。但响应式布局的问题在于：

- 屏幕分辨率分区间：通常使用主流分辨率来进行区间划分，区间内无法进行区分，无法保证 `100%` 兼容；
- 额外的工作量：由于每个分辨率区间都会形成一套样式，响应式布局增加了额外的开发量；
- 不适合功能复杂的页面：响应式一般适用于较简洁的页面，如资讯类、企业管网等，功能复杂的网站对于页面的整体排版和样式要求较高（特别是对比 `PC` 和移动端）。

### viewport 缩放

以 `iPhone 4/5` 的宽度（`320px`）为基准，还原视觉稿：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no />
```

对不同分辨率的屏幕进行等比例缩放，比如 `iPhone 6` (宽度为 `375px`)：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.171875, user-scalable=no />
```

据说早期天猫就是这样适配的。

### rem

[W3schools](https://www.w3schools.com/cssref/css_units.asp) 中关于 `rem` 单位的介绍：

> rem --  Relative to font-size of the root element
> 

`rem` 是一个相对长度单位，是相对于根元素节点 `font-size` 的尺寸大小。

如果 `html` 的 `font-size` 为 `12px`，那么 `2rem` 就是 `24px`，同理 `3rem` 就是 `36px`，例如：

```css
html { font-size: 12px; }
div { width: 20rem; } /* 20 * 12px = 240px */
p { font-size: 1.5rem; } /* 1.5 * 12px = 18px */
```

利用 `rem`，我们只需要根据不同屏幕设定好根元素 `<html>` 的 `font-size`，就可以自适应显示相应的尺寸了。

可以结合 `JavaScript` 来动态计算不同分辨率下的 `font-size` 值。例如设计稿为 `@2` 倍屏宽度（如：`750px`）：

```js
const unit = document.documentElement.clientWidth / 7.5 + 'px'
document.documentElement.style.fontSize = unit
```

当某布局元素设计宽度为 `375px`，高度也为 `375px` 时：

```css
.box {
  width: 3.75rem;
  height: 3.75rem;
  background: #eee;
}
```

在不同分辨率下测试，可以发现元素宽度高度都为设备屏幕宽度的一半，可实现自动适配。

### 手淘 flexible 适配方案

手机淘宝的 `H5` 页面是如何实现多端适配的呢，经过多年的摸索和实战，手淘总结了一套移动端适配的方案——**[flexible方案](https://github.com/amfe/lib-flexible)**：在整个手淘团队，有一个名叫 [`lib-flexible`](https://github.com/amfe/lib-flexible) 的库，而这个库就是用来解决H5页面终端适配的。

详情可见 [《使用Flexible实现手淘H5页面的终端适配 #17》](https://github.com/amfe/article/issues/17)。

