# 上线前准备清单

日期：2026-06-22

目标：用当前 Next.js + Sanity 新站替换原 WordPress 站。

当前新站：

```text
https://intcoframing-wheat.vercel.app
```

最终目标域名：

```text
https://www.intcoframing-us.com
```

## 1. 当前结论

新站内容、CMS、图片、基础 SEO、结构化数据和构建状态已经基本具备上线条件；但最终域名还没有切到新站，所以还不能认为上线完成。

最关键的未完成项：

- `www.intcoframing-us.com` 目前仍在服务旧 WordPress 站。
- 最终域名的 Vercel Production 环境变量和部署需要在切换前确认。
- Sanity CORS 需要确认包含最终域名。
- LeadsCloud 真实表单提交需要人工测试。
- Google Search Console、Rich Results、最终 sitemap 提交需要在域名切换后完成。
- fallback seed 文件仍保留旧站图片 URL，建议在关闭旧站前清理。

## 2. 已完成项

### Studio / CMS

- Studio 已简化为业务可用结构。
- Product 已按大类和子类分组。
- Product 分类选项已补全到大类 + 子类。
- 从分类入口新建产品会自动带对应分类。
- SEO Keywords 已进入 Sanity，可由运营维护。
- Product、News、Project 主图重复问题已修复。

当前 Sanity 数据检查：

```text
documents: 1452
English products: 108
English blog posts: 80
English projects: 13
old media strings in CMS: 0
product unique main images: 108 / 108
blog post unique cover images: 80 / 80
project unique main images: 13 / 13
```

### 资源依赖

- Sanity 生产数据中的图片已经迁移到 Sanity CDN。
- CMS 里未发现旧站 `wp-content` 媒体字符串。
- `next.config.ts` 已不再依赖旧站媒体域名。

注意：`sanity/seed/intcoframing.seed.json` 是本地 fallback 数据，目前仍保留旧站图片 URL。正常线上读取 Sanity，不会使用它；但如果 Sanity 请求异常，fallback 可能出现旧资源依赖。建议上线前做 P1 清理。

### 构建与基础验证

已执行：

```bash
npm run build
npm run sanity:audit:slugs -- --report reports/launch/sanity-slug-audit-20260622-sop-prelaunch.json
npm run launch:verify -- --base https://intcoframing-wheat.vercel.app --expected-origin https://intcoframing-wheat.vercel.app --expected-sitemap-count 1482 --legacy-limit 262 --allow-external-pending --report reports/launch/launch-readiness-vercel-20260622-sop-prelaunch-final.json
npm run launch:verify:cutover -- --report reports/launch/domain-cutover-current-20260622-sop-prelaunch.json
```

已确认：

- Production build 通过。
- Slug audit 通过：同语言重复 slug 为 0。
- Vercel 新站 robots 通过。
- 代表页面检查通过。
- 结构化数据检查通过。
- 旧链接全量检查通过：262 / 262。
- Sitemap 当前为 1482 条 URL，无错域名、无 query/hash、无重复。

当前自动化结论：

```text
automatedOk: true
externalOk: false
ready: false
```

`ready=false` 的原因不是页面代码失败，而是外部上线门槛仍未完成：LeadsCloud 最终域名/真实提交、Sanity CORS、Rich Results、Search Console。

## 3. 原站对照结果

原站仍可访问：

```text
https://www.intcoframing-us.com
```

原站核心结构：

- 顶部导航：Home、Products、Projects、Solutions、About INTCO、Contact。
- 产品大类：Mirror、Picture frame、Art、Furniture、Memo Board。
- 产品子类：Wall Mirror、Standing Mirror、Leaner Mirror、Door Mirror、LED Mirror、Tabletop Frame、Wall Frame、Poster Frame、Document Frame、Shadow Box、Collage Frame、Framed Art、Canvas Art、Alternative Wall Decor、Medicine Cabinet、Shelf、Chalkboard、Dry Erase Board、Cork Board、Linen Board。
- Solutions：Business Insights & Trends、Design & Engineering、Manufacturing & Delivery、Global Production and Supply、Certification、Retailer Support。
- About：Who We Are、Sustainability、Philosophy。
- 表单/聊天：LeadsCloud / 询盘云。
- 统计：GTM-NFFXV4DP。

新站已覆盖上述主要导航和内容结构。

## 4. 当前未完成项

### P0 - 域名切换

当前检查结果：

```text
www.intcoframing-us.com -> Cloudflare / old WordPress
home has WordPress assets: true
home has Next static assets: false
robots points to wp-sitemap.xml: true
/sitemap.xml status: 404
```

上线前必须完成：

1. 在 Vercel 绑定 `www.intcoframing-us.com` 到生产部署。
2. DNS 指向 Vercel。
3. 设置 Production 环境变量：

```text
NEXT_PUBLIC_SITE_URL=https://www.intcoframing-us.com
```

4. 重新部署 Production。
5. 重新运行：

```bash
npm run launch:verify:cutover -- --expected-sitemap-count 1482
```

通过标准：

- 首页有 Next/Vercel 指纹。
- 首页不再出现 WordPress 资源。
- robots 指向 `https://www.intcoframing-us.com/sitemap.xml`。
- sitemap 返回 1482 条新站 URL。
- 旧 WordPress 链接按预期跳转。

### P0 - 表单真实提交

脚本只能确认页面有 LeadsCloud 表单槽位，不能代替真实提交。

上线前需要人工测试：

- Contact 页面提交。
- Product inquiry 提交。
- Enquiry cart 提交。
- Footer newsletter 提交。

测试后确认：

- LeadsCloud 后台能收到线索。
- 邮件或 CRM 通知正常。
- 表单里带有页面或产品上下文。

### P0 - Sanity CORS

当前 token 无法读取 CORS 配置，脚本返回权限不足。

上线前需要在 Sanity 项目设置里确认包含：

```text
https://www.intcoframing-us.com
https://intcoframing-wheat.vercel.app
http://localhost:3000
```

至少最终域名必须启用。

### P1 - fallback seed 旧资源清理

Sanity 生产数据已经不依赖旧站图片，但 `sanity/seed/intcoframing.seed.json` 仍含旧站 `wp-content` URL。

风险：

- 正常生产不触发。
- 如果 Sanity fetch 失败，前台 fallback 可能使用旧站图片。
- 原站完全关闭后，这类 fallback 图片会失效。

建议：

- 在关闭旧站前，把 seed 中旧图片 URL 替换为 Sanity CDN URL。
- 或改造 fallback 逻辑，不再使用旧站图片。

### P1 - SEO 字段运营规则

目前 SEO Title 优先级高于普通标题。业务修改标题时，如果不改 SEO Title，浏览器标题和分享标题会保持旧内容。

已在 SOP 中明确：

- 改标题必须同步检查 `SEO - optional`。
- Search Title、Search Description、Image Alt Text 需要同步维护。

后续可以继续优化 Studio 文案，减少业务误操作。

### P1 - 搜索平台上线动作

域名切换后执行：

- Google Search Console 验证最终域名。
- 提交 `https://www.intcoframing-us.com/sitemap.xml`。
- 检查 robots。
- 选首页、产品页、新闻页、分类页做 Rich Results / 结构化数据验证。

## 5. 建议上线顺序

### 上线前一天

1. 冻结旧站内容更新，除非必须。
2. 让业务确认首页、产品分类、新闻列表、产品详情、Contact 页面。
3. 完成真实表单测试。
4. 确认 Sanity CORS。
5. 确认 Vercel Production 环境变量。
6. 确认 DNS 操作人和回滚方案。

### 上线当天

1. 重新部署 Vercel Production。
2. 将 `www.intcoframing-us.com` 指向 Vercel。
3. 等 DNS 生效。
4. 运行 domain cutover 验证。
5. 打开核心页面人工检查：
   - `/`
   - `/products`
   - `/mirror`
   - `/picture-frame`
   - `/projects`
   - `/solutions`
   - `/blog`
   - `/contact`
   - 一个产品详情页
   - 一篇新闻详情页
6. 测试 LeadsCloud 表单。
7. 提交 sitemap 到 Google Search Console。

### 上线后 24 小时

1. 检查 Search Console 抓取状态。
2. 检查询盘数据是否正常进入 LeadsCloud。
3. 检查 404 和旧链接跳转。
4. 检查核心关键词页面标题和描述。
5. 业务再抽查新增或修改内容是否可正常发布。

## 6. 回滚方案

如果切换后出现严重问题：

1. DNS 暂时指回旧站。
2. 保留 Vercel 部署，不删除。
3. 记录问题页面和截图。
4. 修复后重新部署，再二次切换。

上线当天不要关闭旧站服务器。建议至少保留旧站只读备份 7-14 天。
