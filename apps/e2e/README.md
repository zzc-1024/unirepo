# E2E

Playwright 基础设施与一个桌面启动示例。配置会自动启动客户端 Vite 服务。

```sh
pnpm test:e2e
```

Playwright 与 Vite 共用仓库根目录 `.env` 中的 `CLIENT_PORT`，默认是 `8080`。
临时覆盖端口时，设置 `CLIENT_PORT` 环境变量后运行测试。

示例用例位于 `specs/desktop/launch.test.ts`；运行时会复用已启动的客户端服务。
