---
title: Git 多人协作
category: web
tags: [git, workflow, tutorial, pull request, pr, rebase]
key: git_tutorials_workflow
---

## 概述

现在很多公司多人协作时代码都是使用 `Git` 进行集中管理，那么如何在多人协作过程中使用好 `Git` 也是工作的必备技能，本文主要介绍在需要多人协作开发项目中 `Git` 工作流的使用，包括集中式工作流、功能分支工作流、`pull request` 等。

## 集中式工作流

### 说明

集中式工作流以中央仓库作为项目所有修改的单点实体，该工作流只用到 `master` 分支，并且所有修改都提交到这个分支上。

这种工作流比较**适合小型团队**，因为小型团队可能不会有太多的协作和合流的动作。

![centralized-01](/assets/images/2020-06-03/centralized-01.svg)

### 示例

让我们用示例来展示一个常见的小型团队是如何使用这种工作流来协作的。假设有两个开发者（小明和小红），来看看他们是如何开发自己的功能并上传到中央仓库中的。

#### 初始化中央仓库

首先需要有人在服务器上创建好仓库，我们可以使用远程仓库如 [github](https://github.com/)、[coding](https://coding.net/)、[码云](https://gitee.com/) 等平台

#### 所有人克隆中央仓库

所有人在本地克隆远程中央仓库，通过 `git clone` 命令完成：

```bash
$ git clone git@gitee.com:username/repo.git
```

克隆仓库时 `Git` 会自动添加别名 `origin` 指回远程中央仓库。将远程中央仓库克隆到本地后，就可以开始功能开发了。

#### 小明开发功能

![centralized-03](/assets/images/2020-06-03/centralized-03.svg)

小明在自己的本地仓库中，可以使用标准的 `Git` 过程来开发功能：编辑、暂存(`stage`)和提交(`commit`)。

```bash
$ git add -A # 添加到暂存区
$ git commit -m 'tag: message' # 提交到版本库
```

注意上述命令只提交到本地仓库中，小明可以多次重复这个本地提交的动作，而不用担心远程中央仓库受到影响。

#### 小红开发功能

![centralized-04](/assets/images/2020-06-03/centralized-04.svg)

同时，小红也在自己的本地仓库中，用相同的编辑、暂存和提交过程开发功能。和小明一样，她也不用担心自己本地的提交会影响到远程中央仓库，当然更不用关心小明在他的本地仓库中的操作，因为小明与小红各自的本地仓库是彼此独立的，私有的。

#### 小明发布功能

![centralized-05](/assets/images/2020-06-03/centralized-05.svg)

当小明完成了他的功能开发，就会将他本地仓库中的变化提交（推送）到远程中央仓库中，这样其它团队成员才可以看到他的修改。可以使用 `git push` 来完成推送操作：

```bash
$ git push origin master
```

`origin` 是在小明克隆仓库时 `Git` 创建的远程中央仓库的别名；`master` 是告诉 `Git` 推送的分支。由于中央仓库自从小明克隆以来还没有被更新过，所以 `push` 操作不会有冲突，能够顺利推送完成。

#### 小红尝试发布功能

![centralized-06](/assets/images/2020-06-03/centralized-06.svg)

小红使用同样的 `git push` 命令来推送本地仓库到远程中央仓库中：

```bash
$ git push origin master
```

但她的本地仓库已经和远程中央仓库有分歧了，`Git` 拒绝了操作并抛出错误：

```html
To git@gitee.com:username/repo.git
 ! [rejected]        master -> master (fetch first)
error: failed to push some refs to 'git@gitee.com:username/repo.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

由提示可以看出，小红需要先 `pull` 远程中央仓库的更新到本地仓库，合并本地修改之后，再重新推送到远程中央仓库中。

#### 小红在小明的提交之上 rebase

![centralized-07](/assets/images/2020-06-03/centralized-07.svg)

小红用 `git pull` 合并上游的修改到自己的仓库中，并尝试与本地的修改合并：

```bash
$ git pull --rebase origin master
```

`--rebase` 选项告诉 `Git` 把小红的提交移到同步了中央仓库修改后的 `master` 分支的顶部，如下图所示：

![centralized-08](/assets/images/2020-06-03/centralized-08.svg)

如果你忘了加 `--rebase` 这个选项，`pull` 操作仍然可以完成，但每次 `pull` 操作要同步中央仓库中别人的修改时，提交历史会以一个多余的 “合并提交” 结尾。 对于集中式工作流，最好是使用 `--rebase` 而不是生成一个合并提交。

#### 小红解决合并冲突

![centralized-04](/assets/images/2020-06-03/centralized-04.svg)

`rebase` 操作过程是把本地提交一次一个地迁移到更新了的中央仓库 `master` 分支之上， 这意味着可能要解决在迁移某个提交时出现的合并冲突，而不是解决包含了所有提交的大型合并时所出现的冲突， 这样的方式让我们尽可能保持每个提交的聚焦和项目历史的整洁。反过来，简化了哪里引入 `Bug` 的分析，如果有必要，回滚修改也可以做到对项目的影响最小。

如果小红和小明的功能是不相关的，不大可能在 `rebase` 过程中有冲突。如果有，`Git` 在合并有冲突的提交处会暂停 `rebase` 过程，输出下面的信息并带上相关的指令：

```bash
warning: no common commits
remote: Enumerating objects: 6, done.
remote: Counting objects: 100% (6/6), done.
remote: Compressing objects: 100% (3/3), done.
remote: Total 6 (delta 0), reused 0 (delta 0), pack-reused 0
Unpacking objects: 100% (6/6), 574 bytes | 31.00 KiB/s, done.
From git@gitee.com:username/repo
 * branch            master     -> FETCH_HEAD
 * [new branch]      master     -> origin/master
error: could not apply 926f4bd... <commit-message>
Resolve all conflicts manually, mark them as resolved with
"git add/rm <conflicted_files>", then run "git rebase --continue".
You can instead skip this commit: run "git rebase --skip".
To abort and get back to the state before "git rebase", run "git rebase --abort".
Could not apply 926f4bd... <commit-message>
CONFLICT (<content>): Merge conflict in <file>
Auto-merging <file>
```

 ![centralized-09](/assets/images/2020-06-03/centralized-09.svg)

`Git` 很赞的一点是，任何人都可以解决他自己的冲突。这个例子中，小红可以使用 `git status` 来查看哪儿出现了问题：

```bash
$ git status
interactive rebase in progress; onto 51ed6e6
Last commands done (2 commands done):
   pick 119f597 <commit-message>   pick 926f4bd <commit-message>
No commands remaining.
You are currently rebasing branch 'master' on '51ed6e6'.
  (fix conflicts and then run "git rebase --continue")
  (use "git rebase --skip" to skip this patch)
  (use "git rebase --abort" to check out the original branch)

Unmerged paths:
  (use "git restore --staged <file>..." to unstage)
  (use "git add <file>..." to mark resolution)
        both added:      <file>

no changes added to commit (use "git add" and/or "git commit -a")

```

冲突文件列在 `Unmerged paths` 一节中：`both added:      <file>`，小红可以编辑列出的文件进行修改。

修改完毕后， 小红可以使用老套路暂存这些文件：

```bash
$ git add <file>
```

接下来继续让 `git rebase` 完成剩下的事情：

```bash
$ git rebase --continue
```

`Git` 会继续一个一个地合并后面的提交，如其它的提交有冲突就重复这个过程。

如果你碰到了冲突，但发现搞不定，不要惊慌，只要执行下面这条命令，就可以回到你执行 `git pull --rebase origin master` 命令前的样子：

```bash
$ git rebase --abort
```

#### 小红成功发布功能

![centralized-10](/assets/images/2020-06-03/centralized-10.svg)

小红完成和远程中央仓库的同步后，就能成功发布她的修改了：

```bash
$ git push origin master
```

### 小结

集中式工作流比较**适合小型团队**，当没有太多的协作和合流的动作时，集中式工作流可以很好的胜任工作。

## 功能分支工作流

### 说明

一旦你玩转了集中式工作流，在开发过程中就可以简单地加上功能分支，用来鼓励在开发者之间协作和简化交流。

功能分支工作流就是以集中式工作流为基础，区别在于为各个新功能分配一个专门的分支来开发。这样就可以在把新功能集成到正式项目前，用 `Pull Requests` 的方式讨论变更（`Pull Requests` 也简称 `PR`）。

功能分支工作流背后的核心思路是所有的功能开发应该在一个专门的分支，而不是在 `master` 分支上。 这个隔离可以方便多个开发者在各自的功能分支上开发而不会弄乱主干代码。 另外，也保证了 `master` 分支的代码一定不会是有问题的，极大有利于集成环境。

`Pull Requests` 能为每个分支发起一个讨论，在分支合入正式项目之前，给其它开发者有表示赞同或拒绝的机会。 另外，如果你在功能开发中有问题卡住了，可以开一个 `pull requests` 来向同学们征求建议。 这些做法的重点就是，`pull requests` 让团队成员之间互相评论工作变成非常方便！

### 工作方式

功能分支工作流仍然用到远程中央仓库，并且 `master` 分支还是代表了正式项目的历史，但不是直接提交本地修改到各自的本地 `master` 分支。

开发者每次在开始新功能前先创建一个新分支，功能分支应该有个描述性的名称，比如 `xiaoming/cart` 或 `xiaoming/issue-#1` 之类的名称，这样可以让分支有个清楚且高聚焦的用途。

对于 `master` 分支和功能分支，`Git` 没有技术上的区别，所以开发者可以用和集中式工作流中完全一样的方式编辑、暂存和提交修改到功能分支上。另外，功能分支也可以（并且应该）`push` 到远程中央仓库中，这样不修改正式代码就可以和其它开发者分享提交的功能。

### 示例

以下的示例演示了如何把 `Pull Requests` 作为 `Code Review` 的方式，但注意 `Pull Requests` 可以用于很多其它的目的。

#### 小红开发一个新功能

![centralized-11](/assets/images/2020-06-03/centralized-11.svg)

在小红开始开发功能前，她需要新建一个独立的分支：

```bash
$ git checkout -b xiaohong/feature master
```

这个命令检出（创建）一个基于 `master` 分支且名为` xiaohong/feature` 的新分支，`Git` 的 `-b` 选项表示如果分支还不存在则新建分支。在这个新分支上，小红可以按老套路编辑、暂存和提交修改，按需要提交以实现功能：

```bash
$ git add <some-file>
$ git commit -m <commit-message>
```

#### 小红去吃午饭

![centralized-12](/assets/images/2020-06-03/centralized-12.svg)

上午小红为新功能添加一些提交，在去吃午饭前，`push` 功能分支到远程中央仓库是很好的做法，这样可以方便地备份，如果和其他开发者协作，也可以让他们看到小红的提交。

```bash
$ git push origin xiaohong/feature
```

这条命令会推送 `xiaohong/feature` 分支到远程中央仓库（`origin`）中。

#### 小红完成功能开发

![centralized-13](/assets/images/2020-06-03/centralized-13.svg)

小红吃完午饭回来后，完成了整个功能的开发，这时她要确认本地功能分支和远程中央仓库中有她的最新提交：

```bash
$ git add <file>
$ git commit -m <message>
$ git push origin xiaohong/feature
```

小红开发的功能在一个独立的功能分支中，在合并到 `master` 分支前，她发起一个 `Pull Request` 让团队的其他成员知道功能已经完成。

小红在她的远程中央仓库中发起 `Pull Request`，请求合并 `xiaohong/feature` 到 `master`，团队成员会自动收到通知：

![pr-01](/assets/images/2020-06-03/pr-01.png)

新建 `Pull Request`：

![pr-02](/assets/images/2020-06-03/pr-02.png)

#### 小明收到 Pull Request

![centralized-14](/assets/images/2020-06-03/centralized-14.svg)

小明收到了 `Pull Request` 后会查看 `xiaohong/feature` 的修改，决定在合并到正式项目前是否要做些修改，且通过 `Pull Request` 和小红来回地讨论。

![pr-03](/assets/images/2020-06-03/pr-03.png)

#### 小红再做修改

![centralized-15](/assets/images/2020-06-03/centralized-15.svg)

要再做修改，小红用和第一个迭代完全一样的过程：编辑、暂存、提交并 `push` 更新到远程中央仓库中。

小红这些活动都会显示在 `Pull Request` 上，小明可以看到并断续做评论。

![pr-04](/assets/images/2020-06-03/pr-04.png)

如果小明有需要，也可以把 `xiaohong/feature` 分支拉到本地，自己来修改，他添加的提交也会一样显示在 `Pull Request` 上：

![pr-05](/assets/images/2020-06-03/pr-05.png)

#### 小红发布她的功能

![centralized-16](/assets/images/2020-06-03/centralized-16.svg)

一旦小明可以接受 `Pull Request`，就需要合并功能到稳定的项目代码中（可以由小明或是小红来完成这个操作）：

```bash
$ git checkout master
$ git pull
$ git pull origin xiaohong/feature
$ git push origin master
```

无论由谁来合并功能，首先要切换到 master 分支，并且确认它是最新的，然后执行 `git pull origin xiaohong/feature` 合并 `xiaohong/feature` 分支到本地的 `master` 分支中，最后执行 `git push origin master` 将更新的 `master` 分支推送回远程中央仓库。

#### 小黑同时开发一个新功能

当小红和小明在 `xiaohong/feature` 上工作并讨论她的 `Pull Request` 的时候，小黑以最初的 `master` 分支作为基准分支创建了自己的功能分支 `mrblack/feature`，他在自己的功能分支上开发一个新的功能。在小明或小红合并了 `xiaohong/feature` 分支到 `master` 分支后，最终小黑也完成了他的功能开发，小黑继续将自己的功能分支推送到远程中央仓库中：

```bash
$ git push origin mrblack/feature
```

小黑也提交 `Pull Request` 讨论，但当他添加新 `Pull Request` 时，可能提示“不可自动合并”：

![pr-06](/assets/images/2020-06-03/pr-06.png)

由于小黑提交自己的功能分支时，其基准分支 `master` 已要不是最新的了，但小黑并不知道，而且他也可能操作了与小红相同的资源并造成了冲突。

#### 小黑解决冲突

小黑用 `git pull` 合并最新的 `master` 分支到自己的仓库中，并尝试与本地的修改合并：

```bash
$ git pull --rebase origin master
$ git status
```

使用 `git status` 查看冲突文件，修改后添加到暂存区：

```bash
$ git add <file>
```

然后继续解决冲突：

```bash
$ git rebase --continue
```

直到所有冲突解决完毕。

如果此时小黑推送自己的功能分支到远程中央仓库：

```bash
$ git push origin mrblack/feature
```

可能得到如下结果：

```bash
To git@gitee.com:username/repo.git
 ! [rejected]        mrblack/feature -> mrblack/feature (non-fast-forward)
error: failed to push some refs to 'git@gitee.com:username/repo.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

这是因为本地解决冲突时可能已经修改了资源导致和远程中央仓库中的功能分支不一致，所以还需要将远程中央仓库中的功能分支 `pull` 到本地功能分支中，继续合并解决冲突：

```bash
$ git pull origin mrblack/feature
$ git status
```

 `git status` 查看冲突文件并解决。解决完冲突后：

```bash
$ git add <file>
$ git commit -m 'fix: xxx'
$ git push origin mrblack/feature
```

将本地功能分支推送到远程中央仓库中，继续做 `Pull Request` 讨论。

#### 小黑发布他的功能

当大家都接受 `Pull Request` 时，可以将新功能合并到稳定分支中：

```bash
$ git checkout master
$ git pull
$ git pull origin mrblack/feature
$ git push origin master
```

同样的，合并 `Pull Request` 的动作可由小明、小红或者小黑自己来完成。

### 小结

功能分支工作流通过隔离功能到独立的分支上，每个人都可以自主的工作。利用功能分支我们可以很直接地在 “集中式工作流” 的仅有的 `master` 分支上完成多功能的开发，另外，功能分支还使用了 `Pull Request`，使得团队成员间可以讨论某个提交。

功能分支工作流是开发项目异常灵活的方式，问题是，有时候太灵活了，对于大型团队，常常还需要给不同分支分配一个更具体的角色，在此就不讨论了。 

## 总结

`Git` 工作流除了上述介绍的两种外，还有诸如 `Git Flow` 工作流、`Forking` 工作流、`Github Flow` 工作流等，或者你可以从不同的工作流中挑选或揉合出一个满足你自己需求的工作流，这些都需要我们在日常使用 `Git` 实现多人协作时多积累相关业务经验，根据自己的实际需要进行选择使用。

再有根据上文中的两个例子我们看到，在多人协作时，如果有遇到版本冲突，就需要解决冲突后再推送到远程中央仓库，所以养成在 `push` 前先 `pull` 最新版本是一个好的习惯，我们可以在实际练习使用中慢慢体会。

> 参考：
>
> [Comparing Workflows](https://www.atlassian.com/git/tutorials/comparing-workflows)

