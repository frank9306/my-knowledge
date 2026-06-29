---
title: "利用 sys.excepthook 捕获未处理异常并记录日志"
date: 2026-06-25
source: "old-blog/技术分享/利用 sys.excepthook 捕获未处理异常并记录日志.md"
---

# 利用 sys.excepthook 捕获未处理异常并记录日志

最近在阅读一篇文章 [Python Gotcha: Logging Uncaught Exception](https://andrewwegner.com/python-gotcha-logging-uncaught-exception.html?utm_source=www.pythonweekly.com&utm_medium=newsletter&utm_campaign=python-weekly-issue-707-july-17-2025) 时，我发现了一个非常实用但经常被忽视的 Python 特性：`sys.excepthook`。这为我打开了一个新的思路 —— 如何优雅地处理未捕获异常，并将其写入日志，便于问题追踪与排查。

## 背景

在常规的 Python 程序中，我们大多会使用 `try/except` 来捕获异常。然而，总有一些异常是我们没有处理到的，比如：

```
def divide(a, b):
    return a / b

divide(10, 0

```

这段代码会抛出 `ZeroDivisionError`，程序中断。默认情况下，Python 会将堆栈信息打印到标准错误输出，但不会写入我们配置的日志文件。这对线上系统来说，是个隐患。

## 作者给出的解决方案

文章提出了使用 `sys.excepthook` 来捕捉主线程中未被处理的异常。以下是一个简洁实用的范例：

```

import logging
import sys

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

handler = logging.FileHandler("app.log")
formatter = logging.Formatter("%(asctime)s %(name)s %(levelname)s %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

def handle_uncaught_exception(exc_type, exc_value, exc_traceback):
    logger.critical(
        "uncaught exception, application will terminate.",
        exc_info=(exc_type, exc_value, exc_traceback),
    )
sys.excepthook = handle_uncaught_exception


```

有了这个钩子函数，哪怕你没有用 `try/except`，也能让致命异常被捕捉并记录。

例如下面这个函数：

```

def main():
    logger.info("Application start")
    a = 10
    b = 0
    logger.info(divide(a,b))  # 会触发 ZeroDivisionError
    logger.info("Application end")


```

执行时虽然程序还是崩了，但日志文件中已经记录了完整的异常堆栈：

```
2025-07-18 10:19:40,974 __main__ INFO Application start
2025-07-18 10:19:40,974 __main__ CRITICAL uncaught exception, application will terminate.
Traceback (most recent call last):
  File "D:\\woker\\repository\\rpa\\rpa-editor\\test.py", line 253, in <module>
    main()
  File "D:\\woker\\repository\\rpa\\rpa-editor\\test.py", line 249, in main
    logger.info(divide(a,b))
  File "D:\\woker\\repository\\rpa\\rpa-editor\\test.py", line 243, in divide
    return a/b
ZeroDivisionError: division by zero


```

## 总结

通过这篇文章，我重新认识了 `sys.excepthook` 的价值。它就像是在你程序挂掉前的最后一根救命稻草，至少你还能知道它是怎么死的。

我已经将这个模式加入我的通用项目初始化模板中了。

再次感谢原文作者 [Andrew Wegner](https://andrewwegner.com/python-gotcha-logging-uncaught-exception.html) 的分享。如果你还没给你的应用加上异常钩子，现在就动手吧！
