---
title: "timeit：你可能忽视的 Python 性能测试利器"
date: 2026-06-25
source: "old-blog/技术分享/🕒 timeit：你可能忽视的 Python 性能测试利器.md"
---

# timeit：你可能忽视的 Python 性能测试利器

在日常开发中，我们时常会面临性能瓶颈或对多个实现方案之间的执行效率感到好奇。这时候，你可能会选择简单地在函数前后加个 `time.time()` 计算一下耗时。但如果你真的在意“准确”，那么你需要的，是标准库里那个不太起眼却异常强大的模块——`timeit`。

本文将带你系统了解 `timeit` 的设计思路、使用方法、常见误区以及几个实际应用场景，助你用好这个真正“精确”的时间测量工具。

* * *

## 为什么不是 `time.time()`？

很多人写性能测试都是这么干的：

```
python
复制编辑
import time

start = time.time()
my_function()
print(f"耗时：{time.time() - start} 秒")


```

这在**粗粒度、大任务**的测量中是 OK 的，但精度极低：

*   精度依赖系统时钟
*   易受后台任务/GC干扰
*   多次执行不稳定

### `timeit` 解决了这些问题：

*   使用高精度的 `perf_counter()`（纳秒级）
*   自动禁用垃圾回收（更稳定）
*   内置重复机制（避免偶然误差）

* * *

## 基本用法

最基础的使用方式：

```
import timeit

def read_file():
    with open("test.txt", "r") as f:
        return f.read()

print(timeit.timeit(read_file, number=100))


```

### 参数说明：

| 参数  | 含义  |
| --- | --- |
| `stmt` | 要测试的语句（或函数对象） |
| `number` | 执行多少次（越多越稳定） |
| 返回值 | 执行总耗时（单位：秒） |

### 不带参数的函数可以直接传函数名，带参数的需要包成 `lambda`：

```

timeit.timeit(lambda: my_func(42), number=100)


```

* * *

## 实际案例：文件读取方式对比

```

def read_with_read():
    with open("data.txt", "r") as f:
        f.read()

def read_with_readlines():
    with open("data.txt", "r") as f:
        f.readlines()

print("read:", timeit.timeit(read_with_read, number=100))
print("readlines:", timeit.timeit(read_with_readlines, number=100))


```

你会发现，在某些场景下 `readlines()` 比 `read()` 更快，或者相反——这才是“基于数据”的优化。

* * *

## 更复杂的用法：使用命令行

如果你只是快速测试一句代码，不想写脚本，可以直接用命令行：

```

python -m timeit '"-".join(str(n) for n in range(100))'


```

输出示例：

```

5000 loops, best of 5: 68.3 usec per loop

```

命令行下默认跑 5 次，每次重复 5000 次，帮你过滤掉系统抖动干扰。

* * *

## 高阶技巧

### 忽略首次运行的“冷启动”时间：

`timeit` 默认会多次运行，你可以自己控制 `repeat` 和 `setup` 参数：

```

import timeit

code = '''
total = 0
for i in range(1000):
    total += i
'''

print(timeit.timeit(stmt=code, number=1000))


```

### 初始化变量：

```

timeit.timeit('f(x)', setup='from math import sqrt as f; x = 9', number=1000)


```

* * *

## 常见误区

| 错误做法 | 原因  |
| --- | --- |
| 用 `timeit` 测试 I/O | 测的是磁盘/网络，不是代码性能 |
| 用 `time.time()` 跑小函数 | 精度不够，易波动 |
| 单次测试不重复 | 易受随机波动干扰 |

* * *

## 总结

模块 `timeit` 是你在 Python 中进行高精度、可靠性能测试的得力工具。无论是比较不同函数实现，还是调试代码瓶颈，`timeit` 都应成为你的首选武器。

**一句话总结：想跑得快，先测得准。**

* * *
