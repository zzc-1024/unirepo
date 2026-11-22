# 共享组件演示场

`@repo/components` 包含共享的 Vue 组件及其交互式文档演示场。
每个示例都以独立的 Vue 文件形式存放在 `src/playground/examples/` 下；演示场会将该文件
同时作为预览组件和展示源码加载，因此两者始终保持一致。

## 本地运行

在 monorepo 根目录执行：

```powershell
pnpm --filter @repo/components dev
```

在浏览器中打开终端输出的 Vite 地址。侧边栏可跳转至各组件参考页面。
每个示例都包含预览区域，以及带有复制操作的 **查看代码** 面板。
开发服务器和生产预览共用根目录 `.env` 中的 `PLAYGROUND_PORT`（默认 `8081`），
开发模式可在 `.env.development` 中覆盖；端口被占用时会直接报错，不会自动切换端口。

## 构建与类型检查

```powershell
pnpm --filter @repo/components type-check
pnpm --filter @repo/components build
```

生产站点输出至 `packages/components/dist/`。

## 新增或更新示例

1. 在 `src/playground/examples/<component>/` 下新增一个自包含的 `.vue` 文件。
2. 在对应页面中使用 `createExample('<component>/<file>.vue', title, description)` 注册该示例。
3. 预览与源码必须使用同一个文件，不要将代码片段复制成字符串。

组件文档按页面拆分存放在 `src/playground/pages/` 中。共享的页面布局、参考表格
和示例展示组件位于 `src/playground/components/`。

## 共享组件导出

包入口仍为 `src/index.ts`；演示场页面与示例文件不属于该公开导出范围。
