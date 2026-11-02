# CloudBase oRPC HTTP 云函数

CloudBase HTTP 云函数运行现有的 `src/index.ts` oRPC 路由。
Vite 会将服务端、工作区 API 契约及 npm 依赖打包到 `cloudbase/index.js`，
因此 CloudBase 无需再安装依赖。

## 构建和部署

服务端提供两个独立的构建任务：

- `pnpm --filter @repo/server build:local`：本地构建，产物位于 `apps/server/dist/`。
- `pnpm --filter @repo/server build:cloudbase`：CloudBase 构建，产物位于 `apps/server/cloudbase/`。
- `pnpm --filter @repo/server build`：按顺序执行以上两个构建。

在仓库根目录执行以下命令，单独构建并部署配置好的 `orpc-api` 云函数：

```powershell
pnpm --filter @repo/server build:cloudbase
tcb fn deploy orpc-api
```

也可以运行 `pnpm cloudbase:deploy` 一次完成构建和部署。需要时，先运行
`tcb login` 完成登录并选择环境。HTTP 云函数监听 9000 端口，oRPC 接口路径为 `/rpc`。

所有环境配置统一放在仓库根目录的 `.env`。CloudBase CLI 会自动读取此文件。
请设置 `TCB_ENV_ID`、`HOST`、`PORT`、`CLOUDBASE_PORT`、`OPENAI_BASE_URL`、
`OPENAI_API_KEY` 和 `OPENAI_MODEL`。本地服务使用 `PORT`（默认 3000）；
云函数使用 `CLOUDBASE_PORT`（必须为 9000）。`HOST` 应为 `0.0.0.0`。
部署配置通过变量引用这些值，不会将其写入受 Git 跟踪的 JSON 文件。
根目录 `.env` 已被 Git 忽略；可参考根目录的 `.env.example` 创建自己的配置。

本地开发时，`pnpm --filter @repo/server dev` 使用 Vite 的 `loadEnv` 自动读取根目录
中适用于 `development` 模式的 `.env` 文件：基础 `.env`、`.env.local`、
`.env.development` 和 `.env.development.local`。后加载的文件覆盖同名配置，启动进程
已有的环境变量优先级最高。`HOST` 和 `PORT` 也可由启动进程的环境变量覆盖。

云函数默认不公开。在完成身份验证功能前，请保持此设置：当前模型提供方响应包含
API Key 字段，未授权访问也可能导致模型接口被滥用。添加身份验证并从公开响应中
移除密钥后，再相应配置 CloudBase 访问权限和客户端传输方式。

客户端的后端地址来自 `VITE_API_ORIGIN`：开发模式（`pnpm dev`）由根目录
`.env.development` 固定指向本地后端 `http://127.0.0.1:3000`；构建产物
（`vite build`、`--mode cloudbase`）则从根目录 `.env` 读取（部署前端时请将其设为
已部署的 HTTP 云函数域名）。部署后请验证 `chat.chatStream` 是否能通过网关正常流式传输；
如果网关不支持，可改用 CloudBase 云托管运行常驻 oRPC 服务。
