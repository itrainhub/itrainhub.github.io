---
title: 移动端常见的触摸事件
category: web
tags: [touch, tap, click, swipe, double click, 300ms]
key: web_mobile_touch_event
---

为了给基于触摸的用户界面提供高质量的支持，触摸事件提供了在触摸屏或触控板上解释手指（或触控笔）活动的能力。

## touch 事件

触摸事件有以下几种类型：`touchstart`、`touchmove`、`touchend`、`touchcancel`，可以通过检查触摸事件的 `TouchEvent.type` 属性来确定当前事件属于哪种类型。

### touchstart

当用户在触摸平面上放置了一个触点时触发，可理解为当用户手指或使用手写笔之类的工具触摸到屏幕时触发。

### touchmove

当用户在触摸平面上移动触点时触发，当触点的半径、旋转角度以及压力大小发生变化时，也将触发此事件。注意，不同浏览器上 `touchmove` 事件的触发频率并不相同，这个触发频率还和硬件设备的性能有关，因此决不能让程序的运作依赖于某个特定的触发频率。

### touchend

当一个触点被用户从触摸平面上移除（即用户的一个手指或手写笔离开触摸平面）时触发，当触点移出触摸平面的边界时也将触发，例如用户将手指划出屏幕边缘。

### touchcancel

当触点由于某些原因被中断时触发。

## click 事件 300ms 延迟问题

本来点击事件不应该成为一个问题，但很可惜的是，在移动端的浏览器中，`click` 事件有 `300ms` 左右的响应延迟，不能立即响应会对用户体验造成很大的困扰，因此有必要解决移动端 `click` 延迟问题。

### 前世之因

时间可以追溯至 2007 年初，苹果公司在发布其首款 `iPhone` 前夕，遇到了一个问题，当时的网站都是为 `PC` 等大屏幕设备所设计的。于是，苹果的工程师们做了一些约定，以应对 `iPhone` 这种小屏幕设备浏览**桌面端**站点的问题，其中双击缩放应该是最出名的一项，殊不知这正是一切祸乱的根源。

双击缩放，指用户在屏幕上快速的点击两次，`iOS` 自带的 `Safari` 浏览器会将网页放大至合适比例或是缩小到原始比例展示。假设有这样一种场景：用户在浏览器中点击了一个超级链接，由于用户可以进行双击缩放操作，当用户点击屏幕一次时，浏览器并不能立即判断出用户是要点击超级连接还是要进行双击缩放操作，因此，`iOS` 的 `Safari` 浏览器就等待 `300ms`，以判断用户是否在 `300ms` 内再次点击了屏幕。`300ms` 延迟问题就这样诞生了。

鉴于 `iPhone` 的成功，其他移动浏览器都复制了 `Safari` 浏览器的多数约定，包括双击缩放，几乎现在所有的移动端浏览器都有这个功能。 

### 今生之果

有研究表明，当延迟超过 `100ms`，用户就能感受到界面的卡顿，以前大家刚接触移动端的页面，在欣喜的时候往往不会在意这个 `300ms` 的延时问题，可是如今 `touch` 端界面如雨后春笋，用户对体验的要求也更高，`300ms` 延迟带来的卡顿慢慢变得让人难以接受。

### 解决之道

避免点击延迟，提供一个响应迅速的移动端浏览器，是浏览器开发商的当务之急。谷歌开发者文档中有这样一篇文章：[300ms tap delay, gone away](https://developers.google.com/web/updates/2013/12/300ms-tap-delay-gone-away)，原文中的部分内容引用如下：

> For many years, mobile browsers applied a 300-350ms delay between `touchend` and `click` while they waited to see if this was going to be a double-tap or not, since double-tap was a gesture to zoom into text.

大致意思是，多年以来，移动浏览器在 `touchend` 和 `click` 事件之间加入了 `300-350ms` 的延迟以等待区分出是否为双击，而双击是一种文本放大的手势。

> Ever since the first release of Chrome for Android, this delay was removed if pinch-zoom was also disabled. However, pinch zoom is an important accessibility feature. As of Chrome 32 (back in 2014) this **delay is gone** for **mobile-optimized** sites, **without removing pinch-zooming**! Firefox and IE/Edge did the same shortly afterwards, and in March 2016 a similar fix landed in iOS 9.3.
>
> The performance difference is huge!
>
> Having a UI that responds instantly means the user can quickly press each button with confidence, rather than pausing and waiting for a response.

从 `Android` 的第一版 `Chrome` 开始，如果禁用了缩放功能，则不会出现延迟效果。然而，缩放功能是非常重要的辅助特性，从 `Chrome 32`（早在 `2014` 年）开始，不禁用缩放功能，针对移动端设计的网站的延迟也消失了。`Firefox` 和 `IE / Edge` 之后不久也做了同样的事情，并在 `2016` 年 `3` 月在 `iOS 9.3` 中进行了类似的修复。

性能差异极大！

具有立即响应的 `UI` 意味着用户可以放心的快速点击各按钮，而不需要暂停和等待响应。

#### 禁用缩放

既然双击缩放仅对那些可被缩放的页面来说有存在意义，那对于不可缩放的页面，直接去掉点击延迟，何乐而不为呢？这里所说的不可缩放，是指使用了下述 `<meta>` 标签的页面：

```html
<meta name="viewport" content="user-scalable=no">
<!-- 或 -->
<meta name="viewport" content="initial-scale=1,maximum-scale=1">
```

`Android` 平台的 `Chrome` 浏览器率先做出了这一改变，`Firefox` 浏览器随后也跟着实现了该方案。

但完全禁用缩放功能仅是表面看起来很美好的解决方案，从移动端站点的可用性和可访问性来看，缩放也是相当关键的一环。你很可能已经遇到过这个问题，即你想要放大一张图片或者一段字体较小的文本，但由于页面已经完全禁用了缩放功能，故而无法完成操作。

#### 不禁用缩放

`Chrome` 开发团队在其 `Chrome 32` 这一版中，在包含 `width=device-width` 或者置为比 `viewport` 值更小的页面上禁用双击缩放，当然，没有双击缩放就没有 `300ms` 点击延迟。在 `<head>` 内部添加如下代码即可：

```html
<meta name="viewport" content="width=device-width">
```

这一方案只是去除了双击缩放，但用户仍可以使用双指缩放，缩放功能并非被完全禁用，也就不存在可用性和可访问性的问题了。

#### CSS：touch-action

```css
html {
  touch-action: manipulation;
}
```

`CSS` 属性 `touch-action` 用于设置触摸屏用户如何操纵元素的区域，也经常用于完全解决由支持双击缩放手势引起的点击事件的延迟。

#### zepto 库的 tap 事件

`zepto`（可以看作移动端的 `jQuery`） 的 `touch` 模块中自定义了 `tap` 事件，用于代替 `click` 事件，表示一个轻击操作。其实现 `tap` 的原理是绑定事件`touchstart`、`touchmove` 和 `touchend` 到 `document` 上，然后通过计算 `touch` 事件触发的时间差，位置差来实现了自定义的 `tap`、`swipe` 等。

#### FastClick 库

`FastClick` 是一个简单易用的库，可用于在移动端消除 `click` 事件点击后 `300ms` 延迟问题。但其官方说明中已明确提示：

> *Note: As of late 2015 most mobile browsers - notably Chrome and Safari - no longer have a 300ms touch delay, so fastclick offers no benefit on newer browsers, and risks introducing [bugs](https://github.com/ftlabs/fastclick/issues) into your application. Consider carefully whether you really need to use it.*

是否需要引入使用 `FastClick` 库，根据实际需求决定。

### 使用 touch 事件替代 click

在移动端使用 `touchend` 事件代替 `click` 事件，示例如下：

```js
const eventType = 'ontouchend' in document ? 'touchend' : 'click'
document.querySelector(selector).addEventListener(eventType, e => {
  // 如果在移动端，要记得阻止默认事件
  e.preventDefault()
  // TODO: 点击事件处理程序
}, false)
```

## 同时支持触屏事件和鼠标事件

`touch` 接口使得应用可以提高触屏设备上的用户体验，然而，现在绝大多数的web内容都是为鼠标操作而设计的。因此，即使浏览器支持触屏，也必须要模拟(emulate)鼠标事件，这样即使是那些只能接受鼠标输入的内容，也不需要进行额外修改就可以正常工作。

触摸事件标准定义了一些关于触摸和鼠标交互的浏览器要求，注意浏览器可以触发触摸事件和鼠标事件以响应相同的用户输入。如果浏览器因单个用户输入而触发触摸和鼠标事件，则浏览器必须在任何鼠标事件之前触发 `touchstart`。因此，如果应用程序不希望在特定触摸 `target` 元素上触发鼠标事件，则元素的触摸事件处理程序应调用 `preventDefault()` 并且不会调度其他鼠标事件。

虽然触摸和鼠标事件的特定顺序是根据实际情况而定的，但标准表明事件执行顺序是固定的，对于单个输入：

- `touchstart`
- Zero or more `touchmove` events, depending on movement of the finger(s)
- `touchend`
- `mousemove`
- `mousedown`
- `mouseup`
- `click`

如果 `touchstart`、`touchmove` 或者 `touchend` 在触摸的过程中触发了 `touchcancel` 事件，后面的鼠标事件将不会被触发，即：

- `touchstart`
- Zero or more `touchmove` events, depending on movement of the finger(s)
- `touchend`

执行顺序测试：

```js
function addListeners(el, types) {
  const listeners = types.split(', ')
  listeners.forEach(listener => {
    el.addEventListener(listener, e => {
      console.log(e.type)
    }, false)
  })
}

const oBox = document.querySelector('.box')
addListeners(oBox, 'click, mousedown, mousemove, mouseup, touchstart, touchend, touchmove')
```

打印结果：

```html
touchstart
touchend
mousemove
mousedown
mouseup
click
```

## 点击穿透问题

我们知道了移动端点击存在 `300ms` 延迟问题，那么是不是移动端完全使用 `touch` 事件来代替 `click` 事件处理就可以一劳永逸呢？答案是否定的，某些场景下可能会出现点击穿透（也叫点透）现象。

### 什么是点击穿透

例如页面上有两个重叠元素：位于上层的遮罩层 `A` 和位于下层的超级链接 `B`，在 `A` 元素的 `touchend` 事件上注册了一个回调函数，该回调函数的作用是隐藏 `B` 元素。我们发现，当点击 `A` 元素，`A` 元素被隐藏了，随后，`B` 元素触发了 `click` 事件，实现了超级链接跳转：

![touch-demo1](/assets/images/2020-06-12/touch-demo1.gif)

### 解决方案

在 `touchstart`、`touchmove`、`touchend` 事件处理程序中阻止默认行为，只触发 `touch` 事件，不触发 `click` 事件：

```js
document.querySelector('.mask').addEventListener('touchend', e => {
  // 阻止默认行为
  e.preventDefault()
  // TODO:
}, false)
```

## 小结

移动端 `touch` 事件的处理是经常遇到的问题，包括 `300ms` 延迟和点击穿透问题，这些也是面试过程中会被经常问到的问题，有必要整理一下，后期我们自己再封装如 `tap`、`longTap`、`swipe` 之类的库来实现点击、长按、滑动之类的功能吧。

参考：

> [300ms tap delay, gone away](https://developers.google.com/web/updates/2013/12/300ms-tap-delay-gone-away)
>
> [What Exactly Is..... The 300ms Click Delay](https://www.telerik.com/blogs/what-exactly-is.....-the-300ms-click-delay)
>
> [TouchEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/TouchEvent)
>
> [Supporting both TouchEvent and MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent)

