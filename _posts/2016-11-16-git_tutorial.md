---
title: Git 使用教程
category: web
tags: [git, tutorial]
key: git_tutorial
---

## 一、什么是 Git ##

Git 是 Linus Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。

Git 是一个开源的分布式版本控制系统，用于敏捷高效的处理任何项目的版本问题。与常用的版本控制工具 CVS、SVN 等不同，Git 采用了分布式版本库的方式，不必服务器端软件支持。可以说 Git 是目前世界上最先进的分布式版本控制系统。

## 二、关于项目版本管理 ##

项目在开发的过程中，经常会出现多人分工协作进行项目开发并整合的过程，所以经常会出现一些协作开发时同步的问题，同时存在项目整体进度的控制和管理的问题，所以在程序开发行业衍生出来了版本管理工具。

版本管理工具，首先是一个内容管理工具，可以将项目的内容信息存放在版本管理服务器上方便项目组人员进行访问和查询修改。

版本管理具有里程碑意义的主要有三个阶段：CVS 阶段 --> SVN 阶段 --> Git 阶段。

### 1. CVS 阶段 ###

![cvs](/assets/images/git/cvs.png)

项目搭建开发过程中，每次提交项目都会将整个项目提交到服务器进行保存，服务器存储着项目的 N 个备份，开发过程中的协作效率较低，同时也出现了各种传输的问题，所以慢慢淡出了行业。

### 2. SVN 阶段 ###

![svn](/assets/images/git/svn.png)

考虑到 CVS 的缺陷，开发人员根据项目的实际情况，研发出专门针对项目版本控制的软件 Subversion（简称SVN），SVN 同样也需要搭建服务器，让项目组成员将数据存储在服务器上，但是每次改动并提交的时候，SVN 服务器并不重新保存整个项目的完整信息，而是和原来的项目进行对比，只保存改动的信息。这样就在很大的程度上对于项目版本服务器、项目协作效率有了显著的提升。所以至今为止，有很多公司依然选用 SVN 作为公司内部项目协作的版本控制软件。

### 3. Git 阶段 ###

![git](/assets/images/git/git.png)

CVS 和 SVN 都是基于一个服务器的，如果脱离服务器，项目的版本保存就没有了任何意义，Git 恰恰处理了这样的问题。

### 4. Git 与 SVN 区别 ###

#### 4.1 Git 是分布式的，而 SVN 不是 ###
SVN 是集中式版本控制系统，版本库是集中放在中央服务器的。通常我们干活的时候，用的都是自己的电脑，所以首先要从中央服务器哪里得到最新的版本，然后开始干活，活干完后，需要把自己做完的活推送到中央服务器。集中式版本控制系统是必须联网才能工作，如果在局域网还可以，带宽够大，速度够快，如果在互联网下，加上网速慢的话，就纳闷了。

Git 是分布式版本控制系统，这是和其它非分布式的版本控制系统（SVN，CVS）最核心的区别。如果你能理解这个概念，那么你就已经上手一半了。

Git 跟 SVN 一样有自己的集中式版本库或服务器。但 Git 更倾向于被使用于分布式模式，也就是每个开发人员从中心版本库的服务器上 chect out 代码后会在自己的机器上克隆一个自己的版本库。可以这样说，如果你被困在一个不能连接网络的地方时，比如在飞机上，地下室，电梯里，通信欠发达的地区等，你仍然能够提交文件，查看历史版本记录，创建项目分支等。因为每个人的电脑就是一个完整的版本库，这样，工作的时候就不需要联网了，版本都是在自己的电脑上。对一些人来说，这好像没多大用处，但当你突然遇到没有网络的环境时，这个将解决你的大麻烦。

#### 4.2 Git 按照元数据的方式存储内容，SVN 是按照文件的形式存储 ####

所有的资源控制系统都是把文件的元信息隐藏在一个类似 .cvs、.svn、.git 的目录里。如果你把 .git 目录的体积大小跟 .svn 比较，你会发现它们差距很大。因为 .git 目录是你机器上的一个克隆版的版本库，它拥有中心版本库上所有的东西，例如标签、分支、版本记录等。

#### 4.3 Git 和 SVN 中的分支不同 ####

分支在 SVN 中一点不特别，就是版本库中的另外的一个目录。如果你想知道是否合并了一个分支，你需要手工运行命令来确认代码是否被合并。所以，经常会发生有些分支被遗漏的情况。

然而，处理 Git 的分支却是相当的简单和有趣，你可以从同一个工作目录下快速的在几个分支间切换。你很容易发现未被合并的分支，你能简单而快捷的合并这些文件。

#### 4.4 Git 没有全局版本号，SVN 有 ####

目前为止这是跟 SVN 相比 Git 缺少的最大的一个特征。SVN的版本号实际是任何一个相应时间的源代码快照，它是从 CVS 进化到 SVN 的最大的一个突破。Git 可以使用 SHA-1 来唯一的标识一个代码快照，但这个并不能完全的代替 SVN 里容易阅读的数字版本号。

#### 4.5 Git 内容的完整性优于 SVN ####

Git 的内容存储使用的是 SHA-1 哈希算法，这能确保代码内容的完整性，确保在遇到磁盘故障和网络问题时降低对版本库的破坏。

## 三、Git 安装与配置 ##

### 1. 安装 ###

> 以 windows 操作系统为例，以下操作均在 windows 7 32 bit 系统环境下进行。

在使用 Git 之前，我们需要安装 Git，下载地址：[http://git-scm.com/downloads](http://git-scm.com/downloads)

![downloads](/assets/images/git/download.png)

选择 windows 操作平台（如果是其它系统对应选择即可）下载对应的安装包。

![download_git](/assets/images/git/download_git.png)

双击安装包开始安装，一路点击 "Next" 下一步即可，我在选择组件时将快捷方式添加到了桌面，以方便使用，当然不做任何修改全部使用默认推荐到最后安装完成也可。

![git_component](/assets/images/git/git_components.png)

安装完成后，在桌面可见到 Git Bash 的快捷方式，或是在开始菜单中可以找到 Git 文件夹：

![git_bash](/assets/images/git/git_bash.png) 或 ![git_start](/assets/images/git/git_start.png)

### 2. 配置 ###

一般在新的系统上，我们都需要先配置下自己的 Git 工作环境。配置工作只需一次，以后升级时还会沿用现在的配置。当然，如果需要，你随时可以用相同的命令修改已有的配置。

在 Windows 系统上，Git 会找寻用户主目录下的 .gitconfig 文件。主目录即 $HOME 变量指定的目录，一般都是 C:\Users\\$USER。

#### 用户信息 #####

第一个要配置的是你个人的用户名称和电子邮件地址。这两条配置很重要，每次 Git 提交时都会引用这两条信息，说明是谁提交了更新，所以会随更新内容一起被永久纳入历史记录：

```bash
$ git config --global user.name "username"
$ git config --global user.email xxx@xxx.xx
```

![config_username](/assets/images/git/config_username.png)

若使用 git config 时用 --global 选项，读写的就是用户主目录下的 .gitconfig 文件。

#### 查看配置信息 ####

```bash
$ git config --list
```

![git_list](/assets/images/git/git_list.png)

## 四、Git 工作区、暂存区、版本库 ##

- **工作区：**就是你在电脑里能看到的目录。
- **暂存区：**英文叫 stage，或 index。一般存放在 ".git" 目录下的 index 文件（.git/index）中，所以我们把暂存区有时也叫作索引（index）。
- **版本库：**工作区有一个隐藏目录 .git，这个不算工作区，而是 Git 的版本库。

![](/assets/images/git/repository.png)

上图左侧为工作区，右侧为版本库。在版本库中标记为 "index" 的区域是暂存区（stage, index），标记为 "master" 的是 master 分支所代表的目录树。

从图中我们可以看出此时 "HEAD" 实际是指向 master 分支的一个"游标"。所以图示的命令中出现 HEAD 的地方可以用 master 来替换。

图中的 objects 标识的区域为 Git 的对象库，实际位于 ".git/objects" 目录下，里面包含了创建的各种对象及内容。

当对工作区修改（或新增）的文件执行 "git add" 命令时，暂存区的目录树被更新，同时工作区修改（或新增）的文件内容被写入到对象库中的一个新的对象中，而该对象的ID被记录在暂存区的文件索引中。

当执行提交操作（git commit）时，暂存区的目录树写到版本库（对象库）中，master 分支会做相应的更新。即 master 指向的目录树就是提交时暂存区的目录树。

当执行 "git reset HEAD" 命令时，暂存区的目录树会被重写，被 master 分支指向的目录树所替换，但是工作区不受影响。

当执行 "git rm --cached <file>" 命令时，会直接从暂存区删除文件，工作区则不做出改变。

当执行 "git checkout ." 或者 "git checkout -- <file>" 命令时，会用暂存区全部或指定的文件替换工作区的文件。这个操作很危险，会清除工作区中未添加到暂存区的改动。

当执行 "git checkout HEAD ." 或者 "git checkout HEAD <file>" 命令时，会用 HEAD 指向的 master 分支中的全部或者部分文件替换暂存区和以及工作区中的文件。这个命令也是极具危险性的，因为不但会清除工作区中未提交的改动，也会清除暂存区中未提交的改动。

## 五、Git 工作流程 ##

![](/assets/images/git/work_flow.png)

一般工作流程如下：

 - 克隆 Git 资源作为工作目录。
 - 在克隆的资源上添加或修改文件。
 - 如果其他人修改了，你可以更新资源。
 - 在提交前查看修改。
 - 提交修改。
 - 在修改完成后，如果发现错误，可以撤回提交并再次修改并提交。

## 六、Git 基本操作 ##

### 1. 创建仓库 ###

版本库又叫仓库，英文名：repository，你可以简单的理解为一个目录，这个目录里面的所有文件都可以被 Git 管理起来，每个文件的修改，删除，Git 都能跟踪，以便任何时刻都可以追踪历史，或者在将来某个时刻还可以将文件“还原”。

有两种取得 Git 仓库的方法，第一种是在现在的目录下，通过导入所有文件来创建新的 Git 仓库，第二种是从已有的 Git 仓库中克隆出一个新的镜像仓库来。

下面我们先使用第一种方式创建 Git 仓库（第二种创建仓库的方式稍后讲解）。

#### 1.1 初始化仓库 ####

我先在 F: 盘下创建了一个目录（git_test，相当于我们的工作区），从 Git Bash 中进入该目录，执行如下命令：

```bash
$ git init
```

初始化后，在当前目录下会出现一个名为 .git 的隐藏目录，这个目录是 Git 来跟踪管理版本的，所有 Git 需要的数据和资源都存放在这个目录中，所以没事千万不要手动乱改这个目录里面的文件，否则可能会把 Git 仓库给破坏了。

![](/assets/images/git/git_init.png)

生成的隐藏目录：

![](/assets/images/git/git_init_folder.png)

#### 1.2 将文件添加到仓库中 ####

在 git_test 目录下新建一个文本文件 readme.txt，内容为：version 1.0.1.10161117_beta。

**跟踪文件**

使用如下命令跟踪文件：

```bash
$ git add 文件/目录路径
```

在 `git add` 后面可以指明要跟踪的文件或目录路径。如果是目录的话，就说明要递归跟踪该目录下的所有文件。其实 `git add` 的潜台词就是把目标文件快照放入暂存区域，也就是 add file into staged area，同时未曾跟踪过的文件标记为需要跟踪。这样就好理解后续 add 操作的实际意义了。

![](/assets/images/git/add_readme.png)

如果和上面一样，没有任何提示，说明已经添加成功了。

我们可以使用 `cat` 命令查看文件内容：

![](/assets/images/git/cat_readme.png)

**提交到版本库**

我们先使用 `git status` 来查看状态信息：

```bash
$ git status
```

再使用命令 `git commit` 告诉 Git，把文件提交到仓库：

```bash
$ git commit -m 'info'
```

![](/assets/images/git/git_commit.png)

从上图中 `git status` 可以看出，readme.txt 文件已被跟踪，并处于暂存状态。只要在 “Changes to be committed:” 这行下面的，就说明是已暂存状态。如果此时提交，那么该文件此时此刻的版本将被留存在历史记录中。

### 2. 修改文件 ###

**暂存已修改文件**

现在我们修改下之前已跟踪过的文件 readme.txt，在头部插入一行：version 1.0.2，然后再次运行 `git status` 命令，会看到这样的状态报告：

![](/assets/images/git/modify_not_add.png)

这说明已跟踪文件的内容发生了变化（readme.txt 文件已被修改），但还没有放到暂存区。要暂存这次更新，需要运行 `git add` 命令（这是个多功能命令，根据目标文件的状态不同，此命令的效果也不同：可以用它开始跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等）。

使用 `git add` 将 readme.txt 添加到暂存区，状态：

![](/assets/images/git/modify_add.png)

现在 readme.txt 已暂存，下一次 commit 提交时就会记录到仓库。假设此时，我们修改 readme.txt，继续在头部插入一行：version 1.0.3，保存后，又会是什么情况呢？

![](/assets/images/git/modify_add_2.png)

从上图中我们可以看到，readme.txt 文件出现了两次，一次是已暂存，一次是未暂存，这是怎么回事呢？

实际上 Git 只不过暂存了你运行 `git add` 命令时的版本，如果现在提交，那么提交的是添加 "version 1.0.3" 前的版本，而非当前工作目录中的版本。所以，运行了 `git add` 之后又作了修改的文件，需要重新运行 `git add` 把最新版本重新暂存起来：

![](/assets/images/git/modify_add.png)

**查看已暂存和未暂存的更新**

实际上 `git status` 的显示比较简单，仅仅是列出了修改过的文件，如果要查看具体修改了什么地方，可以用 `git diff` 命令。现在，我们来解决两个问题：当前做的哪些更新还没有暂存，有哪些更新已经暂存起来准备好了下次提交？ `git diff` 会使用文件补丁的格式显示具体添加和删除的行。

我们将 readme.txt 文件中的 "version 1.0.3" 修改为 "version 1.0.3_beta"，然后继续在头部插入一行 "version 1.0.4"，查看状态：

![](/assets/images/git/modify_add_2.png)

要查看尚未暂存的文件了更新了哪些内容，使用 `git diff`：

![](/assets/images/git/diff_not_staged.png)

此命令比较的是工作目录中当前文件和暂存区域快照之间的差异，也就是修改之后还没有暂存起来的变化内容。

若要看已经暂存起来的文件和上次提交时的快照之间的差异，可以用 `git diff --staged` 命令。来看看实际的效果：

![](/assets/images/git/diff_staged.png)

注意，`git diff` 不跟参数是显示还没有暂存起来的改动，而不是这次工作和上次提交之间的差异。

我们将刚做的修改提交到版本库中。在此之前，一定要确认还有什么修改过的或新建的文件还没有 `git add` 过，否则提交的时候不会记录这些还没暂存起来的变化。所以，每次准备提交前，先用 `git status` 看下，是不是都已暂存起来了，然后再运行提交命令 git commit：

![](/assets/images/git/modify_commit.png)

### 3. 撤销修改和删除文件 ###

#### 3.1 撤销修改 ###

我现在在 readme.txt 文件里面头部插入一行内容为：version 1.0.5，我们先查看一下：

![](/assets/images/git/modify_add_3.png)

在未提交之前，如果发现添加的内容有误，得马上恢复以前的版本，现在我可以有如下几种方法可以做修改：

第一：如果我知道要删掉那些内容的话，直接手动更改去掉那些需要的文件，然后 `git add` 添加到暂存区，最后 commit。

第二：使用 `git reset --hard HEAD^` 回退到上一个版本（稍后讲解）。

第三：通过上图我们可以看到提示使用 `git checkout -- <file>...` 来丢弃已做的修改。

![](/assets/images/git/git_checkout.png)

命令 `git checkout -- readme.txt` 意思就是，把readme.txt文件在工作区做的修改全部撤销。

但对于 readme.txt 的修改也可能存在以下两种情况：

一种情况是：readme.txt 修改后，还没有放到暂存区，使用撤销修改就回到和版本库一模一样的状态，上图显示的就是这种情况。

另外一种是 readme.txt 已经放入暂存区，接着再一次作了修改，撤销修改就回到添加暂存区后的状态，如下所示：

![](/assets/images/git/git_checkout_2.png)

再作一次修改：

![](/assets/images/git/git_checkout_3.png)

撤销修改后：

![](/assets/images/git/git_checkout_4.png)

我们可以看到，撤销修改回到的状态是将 readme.txt 添加到暂存区后的状态。

#### 3.2 删除文件 ####

现在我们在工作区添加一个文件 profile.txt，然后提交。如下所示：

![](/assets/images/git/add_profile.png)

这时，我们发现刚添加的文件有错误，需要删除。

一般情况下，我们直接在工作区将刚添加的 profile.txt 文件删除，但当我们再使用 `git status` 时，情况如下：

![](/assets/images/git/delete_file.png)

此时有两个选择，一个是使用 `git add/rm <file>...` 删除后再提交保存到版本库，一个是撤销删除操作。

提交保存到版本库：

![](/assets/images/git/git_add_rm.png)

或

![](/assets/images/git/git_add_rm_2.png)

使用 `git add/rm <file>...` 是将状态存入暂存区，然后使用 `git commit -m 'info'` 提交保存到版本库中。

使用 `git checkout -- <file>...` 撤销删除的操作：

![](/assets/images/git/git_add_rm_3.png)

需要注意的是，当不是通过直接在工作区删除文件，而是通过 `git rm <file>...` 删除了工作区文件，需要通过版本回退的方式撤销删除动作。

### 4. 版本回退 ###

#### 4.1 查看提交历史 ####

在提交了若干更新之后，又或者克隆了某个项目，想回顾下提交历史，可以使用 `git log` 命令查看。

![](/assets/images/git/git_log.png)

默认不用任何参数的话，`git log` 会按提交时间列出所有的更新，最近的更新排在最上面。每次更新都有一个 SHA-1 校验和、作者的名字和电子邮件地址、提交时间，最后缩进显示提交说明。

`git log` 有个常用的 --pretty 选项，可以指定使用完全不同于默认格式的方式展示提交历史。比如用 oneline 将每个提交放在一行显示，这在提交数很大时非常有用。

![](/assets/images/git/git_log_pretty_oneline.png)

#### 4.2 回退 ####

为方便演示，我再多次修改并提交版本库。

![](/assets/images/git/modify_add_more.png)

现在我想使用版本回退操作，把当前的版本回退到上一个版本，使用命令：

```bash
$ git reset --hard HEAD^
```

该命令的作用是重置当前分支的 HEAD 为指定的 HEAD^（HEAD^ 表示当前版本的上一个版本，也可以用 HEAD^^ 表示上上一个版本，以此类推），同时重置暂存区和工作区，与指定的 HEAD^ 一致。

![](/assets/images/git/reset_head.png)

那如果再向前回退4个版本的话，使用上面的方法肯定不方便，我们可以使用下面的简便命令操作：`git reset --hard HEAD~4` 即可：

![](/assets/images/git/reset_head_4.png)

使用 `git log` 查看日志：

![](/assets/images/git/git_log_reset.png)

可以看到，现在版本为最初始化的第一个版本信息。

现在又有一个问题出现了，如果我在版本回退时发现现在回退到的这个版本不是我所需要的，而是需要回退到 version 1.0.4 所在的版本，又该怎么办呢？

`git log` 不能察看已经删除了的 commit 记录，`git reflog` 则可以查看所有分支的所有操作记录（包括 commit 和 reset 的操作），包括已经被删除的 commit 记录。

![](/assets/images/git/git_reflog.png)

最前边一列是对应各版本的版本号，我们可以通过版本号来实现回退：

![](/assets/images/git/git_reset_version.png)

现在我们再查看，readme.txt 文件中的内容就为我们需要回退到的版本内容了。

## 七、分支管理 ##

几乎每一种版本控制系统都以某种形式支持分支。使用分支意味着你可以从开发主线上分离开来，然后在不影响主线的同时继续工作。在很多版本控制系统中，这是个昂贵的过程，常常需要创建一个源代码目录的完整副本，对大型项目来说会花费很长时间。

有人把 Git 的分支模型称为“必杀技特性”，而正是因为它，将 Git 从版本控制系统家族里区分出来。Git 有何特别之处呢？Git 的分支可谓是难以置信的轻量级，它的新建操作几乎可以在瞬间完成，并且在不同分支间切换起来也差不多一样快。和许多其他版本控制系统不同，Git 鼓励在工作流程中频繁使用分支与合并，哪怕一天之内进行许多次都没有关系。理解分支的概念并熟练运用后，你才会意识到为什么 Git 是一个如此强大而独特的工具，并从此真正改变你的开发方式。

在前边的图片中，我们基本都可以看到这样的内容：

![](/assets/images/git/default_master.png)

这是每次操作所在的分支说明，master 分支是默认分支。

### 1. 新建与合并分支 ###

实际工作中（比如开发一个网站）大概会是这样的工作流程：

1. 为实现某个新的需求，创建一个分支。 
2. 在这个分支上开展工作。

假设此时，你突然接到一个电话说有个很严重的 bug 需要紧急修复，那么可以接着按照下面的步骤处理：

3. 返回到原先已经发布到生产服务器上的分支。 
4. 为这次紧急修复建立一个新分支，并在其中修复问题。
5. 通过测试后，回到生产服务器所在的分支，将修复分支合并进来，然后再推送到生产服务器上。
6. 切换到之前实现新需求的分支，继续工作。

#### 1.1 新建分支 ####

**创建分支**

使用如下命令来创建分支：

```bash
$ git branch branch_name
```

![](/assets/images/git/git_branch_dev.png)

**切换分支**

我们已经创建了一个新分支：dev，但当前分支仍然为 master 分支，所以还需要使用切换分支命令来切换操作：

```bash
$ git checkout branch_name
```

![](/assets/images/git/git_branch_checkout.png)

已成功切换到 dev 分支了。


**创建并切换分支**

我们也可以使用如下命令来新建并切换分支：

```bash
$ git checkout -b branch_name
```

![](/assets/images/git/git_branch_checkout_bug.png)

**列出分支**

使用命令：

```bash
$ git branch
```

如：

![](/assets/images/git/git_branch.png)

**向分支提交版本库**

下面我们向新分支 dev 中添加一个文件：

![](/assets/images/git/add_index_to_dev.png)

我们来看一下工作区目录结构：

![](/assets/images/git/dev_folder.png)

接下来切换回 master 分支：

![](/assets/images/git/git_checkout_master.png)

再看一下工作区目录结构：

![](/assets/images/git/master_folder.png)

比较两个不同分支下的目录结构，我们可以发现，在 dev 分支下保存到版本库中的文件 index.html，在 master 分支下看不见了。这是因为当切换分支的时候，Git 会用该分支的最后提交的快照替换工作目录的内容。

#### 1.2 合并分支 ####

如果我们需要将在 dev 分支版本库中的内容也添加到 master 分支中来，则需要合并分支：

```bash
$ git merge 
```

![](/assets/images/git/git_merge.png)

合并后工作区目录结构：

![](/assets/images/git/dev_folder.png)

当然，合并并不仅仅是简单的文件添加、移除的操作，Git 也会合并修改。

**合并冲突**

首先在 master 分支下新建一个文本文件 site.txt 并提交，文本内容为 "http://www.mobiletrain.org/"，如下所示：

![](/assets/images/git/add_site.png)

创建一个新分支 dev，在新分支中修改 site.txt 并提交，文件内容为 "http://www.1000phone.com/"，如下所示：

![](/assets/images/git/modify_site.png)

切换回 master 分支，再查看 site.txt 文件内容：

![](/assets/images/git/git_checkout_master_2.png)

当前 master 分支中没有未提交的修改，我们继续在 master 分支中修改 site.txt，向文件末尾添加一行 "http://www.codingke.com/" 的内容：

![](/assets/images/git/modify_site_2.png)

接下来，把 dev 分支中的内容合并过来：

![](/assets/images/git/git_merge_2.png)

这时，一个合并冲突就出现了，我们需要手动修改冲突，修改完毕后：

![](/assets/images/git/git_merge_conflict.png)

确保冲突合并修改完毕后，提交到版本库中：

![](/assets/images/git/git_merge_conflict_fixed.png)

#### 1.3 删除分支 ####

合并完成后，我们可以接着删除dev分支了，命令：

```bash
$ git branch -d branch_name
```

如：

![](/assets/images/git/git_branch_del.png)

## 八、Git 远程仓库 ##

Git 并不像 SVN 那样有个中心服务器。目前我们使用到的 Git 命令都是在本地执行，如果你想通过 Git 分享你的代码或者与其他开发人员合作。你就需要将数据放到一台其他开发人员能够连接的服务器上。

以下的介绍使用了 GitHub 作为远程仓库。

### 1. GitHub 简介 ###

如果你是一枚 Coder，但是你不知道 GitHub，那么我觉的你就不是一个菜鸟级别的 Coder，因为你压根不是真正 Coder，你只是一个 Code 搬运工。---- 菜鸟教程如是说。

> GitHub是一个通过Git进行版本控制的软件源代码托管服务，由GitHub公司（曾称Logical Awesome）的开发者Chris Wanstrath、PJ Hyett和Tom Preston-Werner使用Ruby on Rails编写而成。
> 
> GitHub同时提供付费账户和免费账户。这两种账户都可以创建公开的代码仓库，但是付费账户也可以创建私有的代码仓库。根据在2009年的Git用户调查，GitHub是最流行的Git访问站点。除了允许个人和组织创建和访问代码库以外，它也提供了一些方便社会化软件开发的功能，包括允许用户追踪其他用户、组织、软件库的动态，对软件代码的改动和bug提出评论等。GitHub也提供了图表功能，用于显示开发者们怎样在代码库上工作以及软件的开发活跃程度。
> 
> 截止到2015年，GitHub已经有超过九百万注册用户和2110万代码库。事实上已经成为了世界上最大的代码存放网站和开源社区。

这是[维基百科](https://zh.wikipedia.org/wiki/GitHub)对 GitHub 的介绍。

我们先作为免费用户来使用一下 GitHub。免费用户只能使用公共仓库，也就是代码要公开。

### 2. 注册账户 ###

要想使用 GitHub，第一步当然是注册 GitHub 账号了。如果你已经注册过 GitHub 账号，请跳过这一步。GitHub 官网地址：[https://github.com/](https://github.com/)。

![](/assets/images/git/register_github.png)

根据向导注册即可，不再赘述。

### 3. 创建仓库 ###

登录 GitHub 后，点击导航栏中的 "+" 号，打开下拉菜单，选择 "New Repository" 新建仓库：

![](/assets/images/git/create_repository.png)

输入新仓库名称，其它直接使用默认值，点击 "Create repository" 按钮，创建仓库。

![](/assets/images/git/create_repository_2.png)

仓库创建成功后，可看到三种方式向仓库中添加版本库内容：

![](/assets/images/git/create_repository_3.png)

### 4. 配置 SSH key ###

由于我们本地 Git 仓库和 GitHub 仓库之间的传输是通过 SSH 加密的，所以需要作一下配置。

**创建 SSH key**

在用户主目录下，查看是否有一个名为 .ssh 的文件夹，如果有，打开查看是否存在 id_rsa 和 id_rsa.pub 这两个文件，如果存在，则可以复制 id_rsa.pub 文件中的内容，然后跳过此步骤（假如文件存在，但自己从未创建过 SSH key，也可以继续进行如下步骤），如果这些都不存在，则输入如下命令：

```bash
$ ssh-keygen -t rsa -C 'your_email@youremail.com'
```

将 your_email@youremail.com 改为你在 GitHub 上注册的邮箱，之后会要求确认路径和输入密码，我直接使用默认的一路回车完成。成功的话会在用户主目录下生成 .ssh 文件夹，进入文件夹，使用文本工具打开 id_rsa.pub，我们可以看到文件里边一串文件信息，这是生成的 key，全选复制这些内容，以备后用。

**配置 GitHub 账户**

回到 GitHub，进入 Settings（配置）：

![](/assets/images/git/account_setting.png)

左边选择SSH and GPG Keys，打开页面中选择 New SSH key：

![](/assets/images/git/ssh_keys.png)

Title 随便填，Key 粘贴之前复制到剪贴板上的内容：

![](/assets/images/git/add_ssh_key.png)

点击 Add SSH key 按钮，完成配置：

![](/assets/images/git/add_ssh_key_ok.png)

为了验证是否成功，在 git bash 下输入：

```bash
$ ssh -T git@github.com
```

如果是第一次的会提示是否 Are you sure you want to continue connecting (yes/no)? ，输入 yes 就会看到：You've successfully authenticated, but GitHub does not provide shell access。这就表示已成功连上 GitHub。

**远程仓库信息**

要查看远程库的详细信息，可使用 `git remote –v`：

![](/assets/images/git/remote.png)

fetch 表示抓取分支，push 表示推送分支。

### 5. 推送本地仓库至 GitHub ###

我们在 GitHub 上创建仓库时，已经看到如下提示：

![](/assets/images/git/push_an_existing_repository.png)

根据该提示，在本地 git_test 仓库下运行这两条命令：

![](/assets/images/git/git_push.png)

输入登录 GitHub 的用户名与密码，等待本地仓库推送至 GitHub 完毕即可。

推送成功后，可以立刻在 GitHub 页面中看到远程库的内容已经和本地一模一样了：

![](/assets/images/git/git_push_success.png)

以后只要在本地作了提交，就可以通过如下命令：

```bash
$ git push origin master
```

把本地 master 分支的最新修改推送到 GitHub 上了。

现在我们就拥有了真正的分布式版本库了。

### 6. 抓取远程仓库分支 ###

如果是团队合作的项目，那么当有其他同事向远程仓库提交了新数据后，我们又该如何将最新版本数据从远程仓库同步到本地呢？

我直接在 GitHub 的仓库中添加了一个新文件 new_file.txt（内容为：this file was created on the server），来模拟其他同事的提交：

![](/assets/images/git/new_file_on_server.png)

在更新最新版本到本地之前，我们先通过 `git status` 查看下本地状态，这样可以知道是否有修改过的文件没有提交，因为如果本地修改的文件没有提交而服务器中存在提交修改的版本，那么更新过程中导致更新过程中就可能产生冲突，所以通过查看状态确保本地全部提交过：

![](/assets/images/git/git_status.png)

下面我们来更新本地仓库，使用命令：

```bash
$ git pull
```

![](/assets/images/git/git_pull.png)

查看本地工作区文件，可以看到服务器上的文件同步到本地仓库了：

![](/assets/images/git/git_pull_2.png)

也可以使用 `git fetch` 来抓取分支，它与 `git pull` 的区别在于：

`git fetch` 相当于是从远程获取最新版本到本地，不会自动merge；

`git pull` 相当于是从远程获取最新版本并merge到本地。

### 7. 克隆远程版本库 ###

上面我们了解了先有本地库，后有远程库的时候，如何关联远程库。

现在我们想，假如先有的是远程库，要把远程库的内容克隆到本地来 如何克隆呢？

首先，登录 GitHub，创建一个新的仓库，名字叫 git_test_clone。如下：

![](/assets/images/git/new_repository.png)

远程仓库准备好后，我们先复制远程仓库访问路径 URL：

![](/assets/images/git/copy_address.png)

我先在 F 盘下新建一个文件夹 clone，将从服务器上克隆的仓库放入该文件夹下，则执行如下命令克隆仓库：

```bash
$ git clone URL
```

![](/assets/images/git/clone_repository.png)

克隆成功后，我们就可以进入对应目录进行本地文件编辑了。

![](/assets/images/git/clone_success.png)

## 九、总结 ##

到此，简单的 Git 使用就介绍完毕了，下面总结一下常用到的 Git 命令：

日常使用命令：

![](/assets/images/git/most_use.png)

```bash
# 在当前目录新建一个Git代码库
$ git init

# 下载一个项目和它的整个代码历史
$ git clone [url]

# 显示当前的Git配置
$ git config --list

# 设置提交代码时的用户信息
$ git config [--global] user.name "[name]"
$ git config [--global] user.email "[email address]"

# 添加指定文件到暂存区
$ git add [file1] [file2] ...

# 添加指定目录到暂存区，包括子目录
$ git add [dir]

# 添加当前目录的所有文件到暂存区
$ git add .

# 删除工作区文件，并且将这次删除放入暂存区
$ git rm [file1] [file2] ...

# 提交暂存区到仓库区
$ git commit -m [message]

# 提交暂存区的指定文件到仓库区
$ git commit [file1] [file2] ... -m [message]

# 提交工作区自上次commit之后的变化，直接到仓库区
$ git commit -a

# 提交时显示所有diff信息
$ git commit -v

# 列出所有本地分支
$ git branch

# 列出所有远程分支
$ git branch -r

# 列出所有本地分支和远程分支
$ git branch -a

# 新建一个分支，但依然停留在当前分支
$ git branch [branch-name]

# 新建一个分支，并切换到该分支
$ git checkout -b [branch]

# 切换到指定分支，并更新工作区
$ git checkout [branch-name]

# 切换到上一个分支
$ git checkout -

# 合并指定分支到当前分支
$ git merge [branch]

# 删除分支
$ git branch -d [branch-name]

# 删除远程分支
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]

# 显示有变更的文件
$ git status

# 显示当前分支的版本历史
$ git log

# 显示暂存区和工作区的差异
$ git diff

# 显示暂存区和上一个commit的差异
$ git diff --cached [file]

# 显示当前分支的最近几次提交
$ git reflog

# 下载远程仓库的所有变动
$ git fetch [remote]

# 显示所有远程仓库
$ git remote -v

# 取回远程仓库的变化，并与本地分支合并
$ git pull [remote] [branch]

# 上传本地指定分支到远程仓库
$ git push [remote] [branch]

# 恢复暂存区的指定文件到工作区
$ git checkout [file]

# 恢复某个commit的指定文件到暂存区和工作区
$ git checkout [commit] [file]

# 恢复暂存区的所有文件到工作区
$ git checkout .

# 重置暂存区的指定文件，与上一次commit保持一致，但工作区不变
$ git reset [file]

# 重置暂存区与工作区，与上一次commit保持一致
$ git reset --hard

# 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变
$ git reset [commit]

# 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
$ git reset --hard [commit]
```

> 参考资料：
> 
> [http://www.cnblogs.com/wzyxidian/p/5520002.html](http://www.cnblogs.com/wzyxidian/p/5520002.html)
> 
> [http://www.runoob.com/git/git-tutorial.html](http://www.runoob.com/git/git-tutorial.html)
> 
> [http://www.cnblogs.com/tugenhua0707/p/4050072.html](http://www.cnblogs.com/tugenhua0707/p/4050072.html)
> 
> [http://www.runoob.com/git/git-tutorial.html](http://www.runoob.com/git/git-tutorial.html "http://www.runoob.com/git/git-tutorial.html")
> 
> [http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html "http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html")