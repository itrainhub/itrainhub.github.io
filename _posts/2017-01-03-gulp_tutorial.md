---
layout: post
title: Gulp 使用教程
date: 2017-01-03
category: 工具
tags: [Gulp]
---

## 1. 简介

Gulp 是前端开发过程中对代码进行构建的工具，是自动化项目的构建利器；她不仅能对网站资源进行优化，而且在开发过程中很多重复的任务能够使用正确的工具自动完成；使用她，我们不仅可以很愉快的编写代码，而且大大提高我们的工作效率。

Gulp 是基于 Nodejs 的自动任务运行器， 她能自动化地完成 JavaScript/coffee/sass/less/html/image/css 等文件的的测试、检查、合并、压缩、格式化、浏览器自动刷新、部署文件生成，并监听文件在改动后重复指定的这些步骤。在实现上，她借鉴了 Unix 操作系统的管道（pipe）思想，前一级的输出，直接变成后一级的输入，使得在操作上非常简单。

通过本文，我们将学习如何使用 Gulp 来改变开发流程，从而使开发更加快速高效。大家也可参考 [Gulp 中文网](http://www.gulpjs.com.cn) 阅读 API 文档。

要使用 Gulp 的一个大致流程是：安装 Nodejs -> 全局安装 Gulp -> 项目安装 Gulp 以及 Gulp 插件 -> 配置 gulpfile.js -> 运行任务

## 2. 安装

### 2.1 安装 Nodejs

Gulp 是基于 Nodejs 的，所以在安装 Gulp 前先安装 Nodejs。

进入 [Nodejs 官网](https://nodejs.org/en/)，会自动检测本地操作系统类型及位数，下载稳定版本的 Nodejs 安装程序。LTS 表示是稳定版本，Current 表示当前最新版本。本文下载的是 v6.9.2 LTS 版本。

![nodejs](/images/posts/gulp/nodejs.png)

下载后根据向导安装即可。

安装完毕 Nodejs 后即可测试是否安装成功。在命令提示符下（通常 windows 系统是 cmd，mac 系统是终端）输入 `node -v` 即可查看安装的 Nodejs 版本。

常用命令说明：

`node -v`：查看安装的 Nodejs 版本，出现版本号，说明已正确安装nodejs。

`npm -v`：查看npm的版本号，npm是在安装 Nodejs 时一同安装的 Nodejs 包管理器。

### 2.2 npm 简介

npm 是 node package manager 的简称，它是 Nodejs 的包管理器，用于 node 插件的管理，如安装、卸载、依赖管理等。

**安装插件**

	npm install <name> [-g] [--save-dev]
	
<name> 表示插件名称，如 gulp

-g 表示全局安装。全局安装可以通过命令行在任何地方调用它，本地安装（非全局安装）将安装在定位目录的 node_modules 文件夹下，通过 require() 调用。

--save 表示将保存配置信息至 package.json 文件，package.json 是 Nodejs 项目配置文件。之所以要保存至 package.json，是因为 Nodejs 插件包相对来说非常庞大，将配置信息写入 package.json 并将其加入版本管理，其他开发者对应下载即可（命令提示符执行 `npm install`，则会根据 package.json 下载所有需要的包，`npm install --production` 只下载 dependencies 节点的包）。

-dev 表示保存至 package.json 的 devDependencies 节点，不指定 -dev 将保存至 dependencies 节点；一般保存在 dependencies 的像这些：express/ejs/body-parser 等。

**卸载插件**

	npm uninstall <name> [-g] [--save-dev]
	
要卸载插件，不要直接删除本地插件包，需要使用上述命令来卸载。

**更新插件**

	npm update <name> [-g] [--save-dev]
	
要更新全部插件，可使用`npm update [--save-dev]`。

### 2.3 cnpm

npm 安装插件是从国外服务器下载资源，受网络影响大，可能出现异常，可以使用[淘宝镜像](http://npm.taobao.org)，淘宝镜像是一个完整 npmjs.org 镜像，可以用它代替官方版本，其同步频率目前为 10 分钟一次以保证尽量与官方服务同步。

为保证安装能够正常进行，推荐使用淘宝镜像。cnpm 安装命令为：`npm install -g cnpm --registry=https://registry.npm.taobao.org`。

cnpm 的用法与 npm 完全一致，只需要将执行 npm 命令的地方替换为 cnpm 即可。

### 2.4 全局安装 Gulp

为了在任何地方都可以使用到 Gulp 命令来执行任务，我们全局安装 Gulp，可以在命令提示符下使用 `npm install gulp -g` 或 `cnpm install gulp -g` 来实现安装。

等待安装结束，可使用 `gulp -v` 命令测试 Gulp 版本，如果看到版本号出现，则说明安装成功。本文 Gulp 版本为 3.9.1。

### 2.5 生成 package.json

package.json 是基于 Nodejs 项目必不可少的配置文件，它是存放在项目根目录的 json 文件。

package.json 用来存放即将安装的插件 name 和 version，这个文件有什么用呢？当我们把项目拷贝给别人的时候不需要拷贝插件，只需要把项目文件、package.json 和 gulpfile.js 拷贝过去就可以，接收人 cd 到项目文件目录直接输入 `npm install` 即可安装上我们拷贝前安装的各种插件。

package.json 文件格式如下：

	{
	  "name": "demo", // 项目名称
	  "version": "1.0.0", // 项目版本
	  "description": "test page", // 项目描述
	  "main": "example.js", // 入口文件
	  "scripts": { // 运行脚本命令的 npm 命令行缩写
	    "test": "echo \"Error: no test specified\" && exit 1"
	  },
	  "author": "xiaoming", // 作者
	  "license": "ISC" // 项目许可协议
	}
	
可直接复制上述文本后修改，要注意的是 json 文件中不允许使用注释内容，所以如果是复制修改还需要将注释去掉。或在命令提示符下使用 `npm init` 命令来初始化自动生成 package.json 文件：

	$ npm init
	This utility will walk you through creating a package.json file.
	It only covers the most common items, and tries to guess sensible defaults.
	
	See `npm help json` for definitive documentation on these fields
	and exactly what they do.
	
	Use `npm install <pkg> --save` afterwards to install a package and
	save it as a dependency in the package.json file.
	
	Press ^C at any time to quit.
	name: (demo) 
	version: (1.0.0) 
	description: test page
	entry point: (example.js) 
	test command: 
	git repository: 
	keywords: 
	author: xiaoming
	license: (ISC) 
	About to write to /Users/isaac/Documents/HTML5/projects/demo/package.json:
	
	{
	  "name": "demo",
	  "version": "1.0.0",
	  "description": "test page",
	  "main": "example.js",
	  "scripts": {
	    "test": "echo \"Error: no test specified\" && exit 1"
	  },
	  "author": "xiaoming",
	  "license": "ISC"
	}
	
	
	Is this ok? (yes) yes

`npm init` 执行后会提示输入项目名称、版本、描述等信息，按提示输入即可，也可以留空。

### 2.6 本地安装 Gulp 及 Gulp 插件

使用 `npm install gulp --save-dev`（安装了 cnpm 使用 `cnpm install gulp --save-dev`）在项目根目录本地安装 Gulp。

我们全局安装了 Gulp，又在项目目录中安装了本地 Gulp，主要因为全局安装 Gulp 是为了执行 Gulp 任务，本地安装 Gulp 则是为了调用 Gulp 插件的功能。

`--save-dev` 这个命令是将安装的插件信息写入 package.json 文件内的“devDependencies”属性内，执行后 package.json 文件内容变为：

	{
	  "name": "demo",
	  "version": "1.0.0",
	  "description": "test page",
	  "main": "example.js",
	  "scripts": {
	    "test": "echo \"Error: no test specified\" && exit 1"
	  },
	  "author": "xiaoming",
	  "license": "ISC",
	  "devDependencies": { // 项目依赖的插件
	    "gulp": "^3.9.1"
	  }
	}
	
本地安装 Gulp 后，继续安装常用的 Gulp 插件，本文安装了两个插件（JS 压缩插件与 CSS 压缩插件）来作为示例：

	$ npm install gulp-minify-css gulp-uglify --save-dev
	
## 3. 开始使用 Gulp

### 3.1 建立 gulpfile.js 文件

Gulp 需要一个文件作为它的主文件，在 Gulp 中这个文件叫做 gulpfile.js。

新建一个文件名为 gulpfile.js 的文件，然后放到项目目录中。然后在 gulpfile.js 文件中定义任务。

下面是一个最简单的 gulpfile.js 文件内容示例，它定义了一个默认的任务：

	var gulp = require("gulp");
	gulp.task("default", function(){
		console.log("hello");
	});
	
### 3.2 gulp.task() 方法

gulp.task() 方法的主要是用来定义任务，其语法结构如下：

	gulp.task(name[, deps], fn)
	
参数 name 为任务名称。

deps 是当前定义的任务需要依赖的其他任务，为一个数组。当前定义的任务会在所有依赖的任务执行完毕后才开始执行。如果没有依赖，则可省略这个参数。

fn 为任务函数，我们把任务要执行的代码都写在里面。该参数也是可选的。

	var minifyCss = require("gulp-minify-css");
	gulp.task("minify-css", function(){
		return gulp.src("css/*.css")
			.pipe(minifyCss({
				advanced:false, // 是否开启高级优化（合并选择器等）
				compatibility:"ie7", // 启用兼容模式；'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式
				keepBreaks:false, // 是否保留换行
				keepSpecialComments:"*" // 保留所有特殊前缀，如果不加这个参数，有可能将会删除你的部分前缀
			}))
			.pipe(gulp.dest("dist"));
	});
	
上例中创建一个 CSS 压缩的任务，使用 gulp-minify-css 插件（现在 gulp-minify-css 已被废弃掉了，使用 [gulp-clean-css](https://github.com/scniro/gulp-clean-css) 代替，用法基本一致）。要执行该任务，可使用任务名称来执行，使用：

	$ gulp minify-css
	
再创建一个 js 压缩的任务，使用 [gulp-uglify](https://github.com/terinjokes/gulp-uglify)：

	var uglify = require("gulp-uglify");
	gulp.task("uglify", function(){
		return gulp.src(["js/*.js", "!js/*.min.js"])
				.pipe(uglify({
					mangle:true, // 是否修改变量名
					compress:true // 是否完全压缩
				}))
				.pipe(gulp.dest("dist/js"));
	});
	
执行 JS 压缩任务：

	$ gulp uglify
	
当然不跟任务名称，也可以使用 `gulp` 命令直接执行任务，默认执行的是名称为 “default” 的任务。

我们可以将所有任务都放到 “default” 任务中：

	gulp.task("default", ["minify-css", "uglify"]);
	
执行：
	
	$ gulp
	
将会调用 default 任务里的所有任务 ["minify-css", "uglify"]。
	
### 3.3 gulp.src() 方法

gulp.src() 方法是用来获取流的，这个流里的内容不是原始的文件流，而是一个虚拟文件对象流，这个虚拟文件对象中存储着原始文件的路径、文件名、内容等信息，这暂时不用去深入理解，只需简单的理解可以用这个方法来读取需要操作的文件即可。语法结构如下：

	gulp.src(globs[, options])
	
参数 globs 是文件匹配模式（类似正则表达式），用来匹配文件路径（包括文件名），当然这里也可以直接指定某个具体的文件路径。当有多个匹配模式时，该参数可以为一个数组。

options 为可选参数，通常不需要用到。

globs 文件匹配模式说明：

`*` 匹配文件路径中的0个或多个字符

`**` 匹配路径中的0个或多个目录及其子目录,需要单独出现，即它左右不能有其它东西，如果出现在末尾，也能匹配文件

`?` 匹配文件路径中的一个字符

`[...]` 匹配方括号中出现的字符中的任意一个，当方括号中第一个字符为^或!时，则表示不匹配方括号中出现的其他字符中的任意一个，类似 js 正则表达式中的用法

`!(pattern|pattern|pattern)` 匹配任何与括号中给定的任一模式都不匹配的

`?(pattern|pattern|pattern)` 匹配括号中给定的任一模式0次或1次，类似于 js 正则中的(pattern|pattern|pattern)?

`+(pattern|pattern|pattern)` 匹配括号中给定的任一模式至少1次，类似于 js 正则中的(pattern|pattern|pattern)+

`*(pattern|pattern|pattern)` 匹配括号中给定的任一模式0次或多次，类似于 js 正则中的(pattern|pattern|pattern)*

`@(pattern|pattern|pattern)` 匹配括号中给定的任一模式1次，类似于 js 正则中的(pattern|pattern|pattern)

`gulp.src("css/*.css")` 表示匹配 css 文件夹下所有后缀为 .css 的文件。

### 3.4 gulp.dest() 方法

gulp.dest() 方法是用来写文件的，可以通过管道传输。语法结构为：

	gulp.dest(path[, options])
	
参数 path 为写入文件的路径，如果文件路径不存在，会自动创建。

`.pipe(gulp.dest("dist"))` 表示将生成的文件写入 dist 目录中。

Gulp 的使用流程一般是：先通过 gulp.src() 方法获取到我们想要处理的文件流，然后把文件流通过 pipe() 方法导入到 gulp 的插件中，最后把经过插件处理后的流再通过 pipe() 方法导入到 gulp.dest() 中，gulp.dest() 方法则把流中的内容写入到文件中。

我们给 gulp.dest() 传入的路径参数，只能用来指定要生成的文件的目录，而不能指定生成文件的文件名，它生成文件的文件名使用的是导入到它的文件流自身的文件名，所以生成的文件名是由导入到它的文件流决定的。

## 4. 常用 Gulp 插件

除了 CSS 与 JS 压缩的插件外，还有其它很多常用到的 Gulp 插件，下面列举一二。

### 4.1 html 文件压缩

[gulp-htmlmin](https://github.com/jonschlinkert/gulp-htmlmin)：

	$ npm install gulp-htmlmin --save-dev
	
使用 gulp-minify-html 压缩 html 文件：
	
	var gulp = require('gulp'),
		minifyHtml = require("gulp-htmlmin");

	gulp.task('minify-html', function(){
		gulp.src('**/*.html') // 要压缩的html文件
			.pipe(minifyHtml({collapseWhitespace: true})) //压缩
			.pipe(gulp.dest('dist/html'));
	});
	
### 4.2 重命名

[gulp-rename](https://github.com/hparra/gulp-rename)：

	$ npm install gulp-rename --save-dev
	
默认情况下，使用 `gulp.dest()` 方法写入文件时，文件名使用的是文件流中的文件名，如果要想改变文件名，那可以在之前用 gulp-rename 插件来改变文件流中的文件名：

	var gulp = require('gulp'),
		rename = require('gulp-rename'),
		uglify = require("gulp-uglify");

	gulp.task('rename', function(){
		gulp.src('js/tools.js')
			.pipe(uglify())  // 压缩 js
			.pipe(rename('tools.min.js')) // 将 tools.js 重命名为 tools.min.js
			.pipe(gulp.dest('js'));
	});
	
### 4.3 文件合并

[gulp-concat](https://github.com/wearefractal/gulp-concat)：

	$npm install gulp-concat --save-dev
	
gulp-concat 可用来把多个文件合并为一个文件，我们可以用它来合并 JS 或 CSS 文件等，这样就能减少页面的 http 请求数了：

	var gulp = require('gulp'),
		concat = require("gulp-concat");

	gulp.task('concat', function () {
		gulp.src('css/*.css')  //要合并的文件
			.pipe(concat('style.css'))  // 合并匹配到的 CSS 文件为 "all.css"
			.pipe(gulp.dest('dist/css'));
	});
	
### 4.4 SASS 编译

[gulp-sass](https://github.com/dlmanning/gulp-sass)：

	$ npm install gulp-sass --save-dev
	
编译 sass 文件：

	var gulp = require('gulp'),
		sass = require("gulp-sass");
	gulp.task("sass", function(){
		return gulp.src("scss/*.scss")
					.pipe(sass()) // 编译 sass
					.pipe(minifyCss({ // 压缩 CSS
						advanced:true,
						compatibility:"ie7",
						keepBreaks:false,
						keepSpecialComments:"*"
					}))
					.pipe(gulp.dest("dist/css"));
	});
	
gulp-sass 是调用 node-sass 来完成编译过程，有 node.js 环境就够了，但有的时候可能在安装 node-sass 过程中出错，只需要重新安装即可。

### 4.5 自动刷新

[gulp-livereload](https://github.com/vohof/gulp-livereload)：

	$ npm install gulp-livereload --save-dev
	
当代码发生修改变化时，它可以帮我们自动刷新页面，推荐最好配合谷歌浏览器来使用，且要安装 livereload chrome extension 扩展插件。

	var gulp = require("gulp"),
		livereload = require("gulp-livereload");

	gulp.task("sass", function(){
		gulp.src("scss/*.scss")
			.pipe(sass())
			.pipe(minifyCss({
				advanced:true,
				compatibility:"ie7",
				keepBreaks:false,
				keepSpecialComments:"*"
			}))
			.pipe(gulp.dest("dist/css"))
			.pipe(livereload());
	});
	gulp.task('watch', function() {
		livereload.listen(); //要在这里调用listen()方法
		gulp.watch("scss/*.scss", ['sass']);
	});
	
执行：

	$ gulp watch
	
这样就可以实时刷新修改的 CSS 内容了。

### 4.6 自动处理浏览器前缀

[gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer)：

	$ npm install gulp-autoprefixer --save-dev
	
使用 gulp-autoprefixer 根据设置浏览器版本自动处理浏览器前缀，使用它我们可以很潇洒地写代码，不必考虑各浏览器兼容前缀。

	var autoprefixer = require('gulp-autoprefixer');

	gulp.task('autoFx', function () {
		gulp.src('css/style.css')
			.pipe(autoprefixer({
				browsers: ['last 2 versions', 'Android >= 4.0'],
				cascade: true, // 是否美化属性值 
				remove:true // 是否去掉不必要的前缀
			}))
			.pipe(gulp.dest('dist/css'));
	});
	
browsers 指明浏览器信息，详情参见 [browsers 参数详解](https://github.com/ai/browserslist#queries)。

