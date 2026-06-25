---
title: "用 Git Bisect 精准狙击 Bug：调试到天亮不如用对工具"
source: "old-blog/心情随笔/用 Git Bisect 精准狙击 Bug：调试到天亮不如用.md"
---

# 用 Git Bisect 精准狙击 Bug：调试到天亮不如用对工具

> 看完 Debugging Till Dawn 这篇博客，我才意识到：调 bug 真不该靠人脑硬抗，git bisect 是个被严重低估的神器。

* * *

## 🧠 背景：调试到天亮？不如二分查找

那位作者遇到的场景和我太熟悉了：

*   一个功能原本没问题，某次提交之后突然挂了；
*   提交记录一大堆，几十个、上百个；
*   你想找出是哪个提交引入了 Bug，但一个个手动测太折磨了。

这时候，他用了 `git bisect`，几分钟内精准找出问题提交，避免了一整个通宵爆肝。

* * *

## 🚀 Git Bisect 是个啥？

一句话：**用二分法在提交历史中定位引入 Bug 的提交**。

流程就像查字典一样高效。

你只需要告诉它：

*   哪个提交是 **“坏的”**（有 bug）
*   哪个提交是 **“好的”**（没 bug）

然后 Git 自动帮你在中间提交里一个一个试，一般只需要 `log₂(N)` 次就能锁定罪魁祸首。

* * *

## 🔨 实战演练：以文件存在与否为例

以下是我用来测试的一个案例：

### 🧪 场景

假设有个项目，某次提交不小心多加了个 `test.ini` 文件，这个文件一旦存在，程序就会出错。

我们用 `git bisect` 来定位是哪一提交引入了它。

* * *

### 1️⃣ 创建测试仓库

```

mkdir bisect-demo && cd bisect-demo
git init
echo 'print("Hello world")' > app.py
git add .
git commit -m "initial good version"


```

### 2️⃣ 随便提交几次

```

echo '# another line' >> app.py
git commit -am "add comment"

touch test.ini
git add test.ini
git commit -m "oops: added test.ini file (bug)"


```

### 3️⃣ 编写判断 test.ini 的测试脚本 `test_bug.sh`

```

#!/bin/bash
if [ -f "test.ini" ]; then
  exit 0  # bad
else
  exit 1  # good
fi


```

并加执行权限：

```

chmod +x test_bug.sh


```

* * *

### 4️⃣ 启动 bisect

```

git bisect start
git bisect bad HEAD
git bisect good <最早的提交哈希>
git bisect run ./test_bug.sh


```

Git 会自动切换 commit、执行脚本，并告诉你：

```

<哈希值> is the first bad commit


```

* * *

## ✍️ 总结：工具在手，天亮不用愁

学了这么多年 Git，却总是忘了 `git bisect`。直到今天看了那篇博客才恍然大悟：这玩意是调 bug 的神兵利器，特别是在这些场景下：

*   **新版本挂了，老版本正常，历史提交数量多**；
*   **你能写出一个能判断对错的脚本**；
*   **你不想在黑夜中用肉眼和回忆调试**。

以后我再遇到这种情况，肯定不再盲猜，直接 `git bisect` 干起来！

* * *

## 🔚 附：参考链接

*   原文博客：[Debugging Till Dawn](https://www.mikebuss.com/posts/debugging-till-dawn)
*   官方文档：[git bisect – Manual](https://git-scm.com/docs/git-bisect)
