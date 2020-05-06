---
title: JavaScript 设计模式之单例模式
category: javascript
tags: [javascript, 设计模式, singleton]
key: javascript_singleton
---

## 1. 概述

单例模式（Singleton，也称单件模式、单体模式）是对象创建型模式，主要用于保证一个类仅有一个实例，并提供一个访问它的全局访问点。单例模式是一种常见的设计模式。

要使用单例模式，在某些场景显得尤为重要。比如要使用迅雷播放器播放视频，我同时打开两个视频文件，如果这两个视频文件分别在各自的播放器窗口放映视频内容，那么可能会有很不好的观看体验，我没办法分别让左右耳朵和左右眼睛只专注各自对应的视频。这时候，我们就需要单例模式来解决这个问题了：即一次只能打开一个迅雷播放器窗口。

在 windows 操作系统中还有很多单例的例子，比如任务管理器、回收站等。

## 2. 实现

单例模式是保证一个类仅有一个实例，那么传统做法是先判断实例是否存在，如果已经存在，则直接返回已存在实例，如果不存在就先创建实例后再返回，这就保证了唯一性。当然除了传统做法外，在 JavaScript 中要实现单例模式还有很多其它方法。

### 2.1 传统实现

```html
<script type="text/javascript">
	var Player = function(){
		this.currentVideo = null;
		this.instance = null;
	};

	Player.prototype.play = function(videoName){
		this.currentVideo = videoName;
		console.log("播放：" + this.currentVideo);
	}

	Player.getInstance = function(){
		if (!this.instance){
			this.instance = new Player();
			console.log("第一次启动播放器");
		} else {
			console.log("使用已打开的播放器");
		}

		return this.instance;
	}

	Player.getInstance().play("红楼梦 01.rmvb");
	Player.getInstance().play("猫和老鼠 川话版 01.rmvb");
	Player.getInstance().play("复仇者联盟.mkv");
</script>
```

定义保存单例对象的属性，在 getInstance() 方法中判断该属性是否保存有对象，如果已保存则直接返回，否则创建对象后再返回。
	
执行结果：

```javascript
第一次启动播放器
播放：红楼梦 01.rmvb
使用已打开的播放器
播放：猫和老鼠 川话版 01.rmvb
使用已打开的播放器
播放：复仇者联盟.mkv
```

### 2.2 闭包的实现

```html
<script type="text/javascript">
	var Player = function(){
		this.currentVideo = null;
	};

	Player.prototype.play = function(videoName){
		this.currentVideo = videoName;
		console.log("播放：" + this.currentVideo);
	}

	Player.getInstance = (function(){
		var instance;
		return function(){
			if (!instance){
				instance = new Player();
				console.log("第一次启动播放器");
			} else {
				console.log("使用已打开的播放器");
			}
			return instance;
		}
	})();

	Player.getInstance().play("红楼梦 01.rmvb");
	Player.getInstance().play("猫和老鼠 川话版 01.rmvb");
	Player.getInstance().play("复仇者联盟.mkv");
</script>
```

getInstance() 方法中，使用闭包将 instance 变量所保存的实例对象一直缓存在内存中，当第一次调用先创建对象，内存缓存该对象实例信息，第二次或多次调用时，可以直接使用已缓存值。

### 2.3 直接量

其实最简单的单例就是对象直接量（字面量）：

```html
<script type="text/javascript">
	var player = {
		currentVideo : null,
		play : function(){
			console.log("播放视频：" + this.currentVideo);
		}
	};

	player.currentVideo = "红楼梦";
	player.play();

	player.currentVideo = "西游记";
	player.play();
</script>
```

### 2.4 闭包的变式

```html
<script type="text/javascript">
	var Player = (function(){
		var instance;

		var init = function(){
			return {
				currentVideo : null,
				play : function(videoName){
					this.currentVideo = videoName;
					console.log("开始播放视频：" + videoName);
				}
			}
		};

		return {
			getInstance : function(){
				if (!instance) {
					instance = init();
					console.log("第一次启动播放器");
				} else {
					console.log("使用已打开的播放器");
				}

				return instance;
			}
		};
	})();

	Player.getInstance().play("红楼梦 01.rmvb");
	Player.getInstance().play("猫和老鼠 川话版 01.rmvb");
	Player.getInstance().play("复仇者联盟.mkv");
</script>
```

