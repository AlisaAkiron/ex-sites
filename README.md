# ex-sites

制霸生成器合集 —— 在地图上标记你去过的地方，并导出成图片分享。

基于 [TanStack Start](https://tanstack.com/start) + React + Tailwind CSS 构建，部署在 Cloudflare Workers 上。

## 页面

| 页面 | 路径 | 说明 | 原作者 |
| --- | --- | --- | --- |
| 首页 | `/` | 制霸生成器列表 | — |
| 中国制霸生成器 | `/china-ex` | 中国三十四省级行政区域制霸标记生成工具 | [itorr](https://github.com/itorr/china-ex) |
| 吃货制霸生成器 | `/foodie-ex` | 中国各地特色美食制霸标记生成工具 | [lvwzhen](https://github.com/lvwzhen/foodie-ex) |
| 日本制霸生成器 | `/japan-ex` | 日本四十七都道府县制霸标记生成工具 | [ukyouz](https://github.com/ukyouz/JapanEx) |
| 美国制霸生成器 | `/us-ex` | 美国五十州及海外属地制霸标记生成工具 | [tenpages](https://github.com/tenpages/us-level) |

## 开发

```bash
pnpm install
pnpm dev        # 本地开发，http://localhost:3000
pnpm build      # 构建
pnpm deploy     # 构建并部署到 Cloudflare Workers
pnpm typecheck  # 类型检查
pnpm lint       # 代码检查
pnpm test       # 运行测试
```

### 环境变量

复制 `.env.example` 为 `.env` 并按需修改：

- `APP_URL` — 部署站点的公开访问地址（无结尾斜杠），用于生成 og:url、og:image、canonical、sitemap 等绝对链接。
