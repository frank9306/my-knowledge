---
title: "Win11 PIN 码自动化输入教程：基于 Interception 驱动级模拟"
date: 2026-06-25
source: "old-blog/Win11 PIN 码自动化输入教程：基于 Intercep.md"
---

# Win11 PIN 码自动化输入教程：基于 Interception 驱动级模拟

## 前言

win11 更新版本之后之前通过 pyautogui 编写的脚本失败了，在模拟输入的时候对弹出的windows hello 窗体中输入PIN码，但是现在根本不输入了。最终找到了基于 Interception 驱动级模拟输入的方式。

### 1\. 为什么 PyAutoGUI 失效了？

Windows 11 的安全机制（如 UIPI）会阻止普通应用程序向高权限窗口（如登录界面、UAC 提示框、PIN 输入框）发送按键消息。**Interception** 通过在操作系统内核安装键盘过滤驱动，直接伪造硬件中断信号，从而绕过所有软件层的限制。

* * *

### 2\. 环境准备与驱动安装

#### Step 1: 下载驱动

1.  访问 [Interception GitHub Release](https://github.com/oblitum/Interception/releases) 下载 `Interception.zip`。
2.  解压文件。

#### Step 2: 安装驱动

1.  以 **管理员身份** 运行“命令提示符 (CMD)”。
2.  进入解压目录下的 `command line installer` 文件夹。
3.  执行安装命令：
    
    DOS
    
    ```
    install-interception.exe /install
    
    ```
4.  **必须重启电脑**：安装完成后，驱动需要重启才能加载到内核。

#### Step 3: 提取运行库

1.  重启后，进入 `Interception\library` 文件夹。
2.  根据你的 Python 位数选择：
    *   64位 Python：拷贝 `x64\interception.dll`。
    *   32位 Python：拷贝 `x86\interception.dll`。
3.  将该 DLL 文件放在你的 Python 脚本所在的同级目录下。

* * *

### 3\. Python 自动化脚本

创建一个名为 `pin_input.py` 的文件，并将以下代码粘贴进去：

```python
import ctypes
import os
import time

# 1. 加载 DLL
curr_dir = os.path.dirname(os.path.abspath(__file__))
dll_path = os.path.join(curr_dir, "interception.dll")
interception = ctypes.WinDLL(dll_path)

# ---------------------------------------------------------
# 2. 定义 Interception 专用的数据结构 (关键步骤)
# ---------------------------------------------------------
class KeyStroke(ctypes.Structure):
    _fields_ = [
        ("code", ctypes.c_ushort),  # 扫描码
        ("state", ctypes.c_ushort), # 状态 (按下 0, 抬起 1)
        ("information", ctypes.c_uint) # 额外信息，通常为 0
    ]

# ---------------------------------------------------------
# 3. 函数原型定义
# ---------------------------------------------------------
interception.interception_create_context.restype = ctypes.c_void_p
interception.interception_destroy_context.argtypes = [ctypes.c_void_p]
PREDICATE_TYPE = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.c_int)
is_keyboard = PREDICATE_TYPE(interception.interception_is_keyboard)

interception.interception_set_filter.argtypes = [ctypes.c_void_p, PREDICATE_TYPE, ctypes.c_ushort]
interception.interception_wait.argtypes = [ctypes.c_void_p]
interception.interception_wait.restype = ctypes.c_int
# 注意：这里接收和发送的参数改为了 KeyStroke 结构体的指针
interception.interception_receive.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.POINTER(KeyStroke), ctypes.c_uint]
interception.interception_send.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.POINTER(KeyStroke), ctypes.c_uint]

# 常量定义
INTERCEPTION_FILTER_KEY_ALL = 0xFFFF # 过滤所有按键动作
SCAN_CODES = {'1': 0x02, '2': 0x03, '3': 0x04, '4': 0x05, '5': 0x06, '6': 0x07}

def main():
    context = interception.interception_create_context()
    if not context:
        print("错误：无法创建上下文。请确认以管理员身份运行且驱动已安装重启。")
        return

    try:
        # 1. 设置过滤器
        interception.interception_set_filter(context, is_keyboard, INTERCEPTION_FILTER_KEY_ALL)
        print(">>> 驱动已就绪。请按一下键盘上的【回车键】确认绑定...")

        # 2. 等待并捕获一次按键以获取 ID
        stroke = KeyStroke()
        device_id = interception.interception_wait(context)
        interception.interception_receive(context, device_id, ctypes.byref(stroke), 1)
        interception.interception_send(context, device_id, ctypes.byref(stroke), 1)

        print(f">>> 绑定成功！ID: {device_id}。请在 3 秒内切换到记事本并确保是英文输入法...")
        time.sleep(3)

        # 3. 开始循环发送
        for char in "123456":
            code = SCAN_CODES[char]
            print(f"正在发送: {char} (Code: {hex(code)})")
            
            # 按下
            m_down = KeyStroke(code, 0, 0)
            interception.interception_send(context, device_id, ctypes.byref(m_down), 1)
            time.sleep(0.03)
            
            # 抬起
            m_up = KeyStroke(code, 1, 0)
            interception.interception_send(context, device_id, ctypes.byref(m_up), 1)
            time.sleep(0.1)

        print(">>> 执行完毕。")

    finally:
        interception.interception_destroy_context(context)

if __name__ == "__main__":
    main()
```

### 4\. 运行说明

1.  **管理员权限**：由于涉及内核驱动通信，运行 Python 的终端（VS Code, PyCharm 或 CMD）**必须**以管理员身份打开。
2.  **设备绑定**：程序运行后会进入等待状态。此时你需要按一下键盘。这个动作是让驱动识别你的“主键盘 ID”，随后它会通过这个 ID 注入信号。
3.  **输入法状态**：确保输入状态为**英文**。如果处于中文输入法，数字可能会被拦截到候选框中。
4.  **安全提示**：请勿将包含真实 PIN 码的脚本上传到公开代码仓库。

* * *

### 5\. 常见问题排查

*   **现象：脚本运行了但没反应。**
    *   检查：是否以管理员权限运行？
    *   检查：`interception.dll` 位数是否和 Python 一致（64位 vs 32位）？
*   **现象：键盘在脚本运行期间失灵了。**
    *   原因：脚本设置了拦截过滤器但未正常释放。
    *   解决：按 `Ctrl+C` 强行停止脚本，或拔插键盘。
*   **现象：PIN 码输错或漏输。**
    *   解决：适当调大代码中 `time.sleep` 的数值，模拟更缓慢的物理按键。

* * *

这种方法不仅能解决 PIN 码输入，还可以处理 **UAC 提示框点击**、**游戏防作弊绕过** 等高级自动化场景。
