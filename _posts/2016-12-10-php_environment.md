---
title: PHP 集成环境搭建
category: PHP
tags: [php]
key: php_environment
---

俗话说，工欲善其事，必先利其器。要学习 PHP 开发，也必须先搭建能够运行 PHP 的环境。

作为入门介绍，不推荐完全自己配置并搭建环境，因为自己搭建环境就得独立安装 apache、php、mysql及各种管理工具，然后再进行相关配置，这无疑增加了入门难度。

推荐使用 PHP 集成环境来学习 PHP 开发，下面以 wampserver 集成开发环境为例在 32 位 windows 操作系统中介绍 PHP 环境安装。

### 下载 ###

wampserver 官方网站为 [http://www.wampserver.com/en/](http://www.wampserver.com/en/)，点击导航中 DOWNLOAD 下载，根据操作系统位数选取 32 位或 64 位版本下载。

![下载](/assets/images/phpevmt/download.png)

下载完毕后不能立刻安装，因为要安装 wmap 还需要 VC++ 运行库的支持。详情可见 [https://sourceforge.net/projects/wampserver/files/WampServer%203/WampServer%203.0.0/](https://sourceforge.net/projects/wampserver/files/WampServer%203/WampServer%203.0.0/) 的说明。

根据操作系统位数下载 VC++ 运行库。Wampserver 2.4, 2.5 和 3.0 版本需要 VC9, VC10, VC11 的运行库， 如果 PHP 版本为 7 以上，apache 版本为 2.4.17 以上，还必需 VC13, VC14 运行库。

**VC9**

[Microsoft Visual C++ 2008 SP1 Redistributable Package (x86) (32bits)](http://www.microsoft.com/en-us/download/details.aspx?id=5582)

[Microsoft Visual C++ 2008 SP1 Redistributable Package (x64) (64bits)](http://www.microsoft.com/en-us/download/details.aspx?id=2092)

**VC10**

[Microsoft Visual C++ 2010 SP1 Redistributable Package (x86)](http://www.microsoft.com/en-us/download/details.aspx?id=8328)

[Microsoft Visual C++ 2010 SP1 Redistributable Package (x64)](http://www.microsoft.com/en-us/download/details.aspx?id=13523)

**VC11**

[Visual C++ Redistributable for Visual Studio 2012 Update 4 (x86 and x64)](http://www.microsoft.com/en-us/download/details.aspx?id=30679)

**VC13**

[Visual C++ Redistributable Packages for Visual Studio 2013](https://www.microsoft.com/en-us/download/details.aspx?id=40784)

**VC14**

[Visual C++ Redistributable Packages for Visual Studio 2015 Update 3](http://www.microsoft.com/en-us/download/details.aspx?id=53840)

特别需要注意的是，如果你的操作系统是 64 位 windows 系统，你既要安装 32 位的 VC++ 运行库，又需要安装 64 位的 VC++ 运行库，即使安装的不是 64 位的 wampserver。

### 安装 ###

先安装 VC++ 运行库，按照从小到大顺序一一安装；再安装 wampserver。按下图中各程序顺序安装即可：

![安装](/assets/images/phpevmt/install.png)

注意，最好将 wampserver 安装在某个根目录下的文件夹中，比如：c:\\wamp、d:\\wamp 目录。确保在安装路径中不要有空格或特殊符号，不要安装在如 c:\\program files\\ 或 c:\\program files (x86)\\ 下，当然更不能安装在中文路径下了。

安装完成后，运行桌面 Wampserver 快捷方式，在任务栏右下角，会出现 wampserver 管理工具图标：

![安装](/assets/images/phpevmt/server_icon.png)

可以右键单击该图标，进入 Language 菜单项，选择 Chinese 将语言设置为简体中文。

### 测试 ###

启动 Wampserver 后，如果各端口未被占用，则可以直接打开浏览器，在地址栏中输入 [http://localhost](http://localhost) 或 [http://127.0.0.1](http://127.0.0.1) 进行访问，能够打开类似如下页面，则说明 Wampserver 安装成功了：

![index.php](/assets/images/phpevmt/page.png)

当然，Wampserver 默认的 apache 服务器端口为 80 端口，mysql 数据库端口为 3306 端口，如果想使用其它的端口，可以直接通过配置工具修改：

![配置端口](/assets/images/phpevmt/config.png)