# 任务：以测试驱动方式实现 Retry-After 解析

实现 `src/retry-after.mjs` 中的 `parseRetryAfter(value, nowMs)`。

行为要求：

- `value` 是非负十进制整数时，视为秒数，返回 `nowMs + seconds * 1000`。
- `value` 是合法 HTTP-date 时，返回其毫秒时间戳；过去的时间必须钳制为 `nowMs`。
- 忽略输入两端空白。
- 空值、负数、小数、非日期文本返回 `null`。
- 不改变公开函数签名，不增加运行时依赖。
- 必须先补充或确认失败测试，再实现，并运行相关测试。
- 这是最小实现样例，不需要宽泛仓库审计；最多使用 12 次工具调用。
