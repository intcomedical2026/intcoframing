# Sanity CMS 产品与新闻维护 SOP

适用对象：业务、运营、市场内容维护人员

适用入口：

```text
/studio
```

## 1. 基本原则

- 只在 Sanity Studio 里维护内容，不要去旧 WordPress 后台改内容。
- 图片必须上传到 Sanity，不要粘贴旧站 `wp-content` 图片地址。
- 修改标题时，同时检查 SEO 字段；否则网站正文可能变了，但浏览器标题或分享标题仍是旧的。
- 不熟悉 URL 规则时，不要随意修改 `Page Path` 和 `URL Slug`。URL 改动会影响 SEO、旧链接和客户收藏链接。
- 修改完成后必须点 `Publish`，仅保存 draft 不会同步到网站。
- 前台通常约 1 分钟内更新；如果刚发布后看不到变化，先强制刷新浏览器。

## 2. 修改已有新闻

路径：

```text
Start Here -> Add or Edit News
```

操作步骤：

1. 在列表中搜索新闻标题。
2. 点开对应 News。
3. 主要修改 `Edit Content` 里的字段：
   - `News Title`：页面正文标题。
   - `Category`：新闻分类，例如 Industry News、Inspiration、Press Release。
   - `Excerpt`：列表页和页面摘要。
   - `Body Text`：正文内容。
   - `Publish Date`：发布日期。
4. 修改图片：
   - `Images -> Cover Image`：新闻封面图。
   - `Images -> Gallery Images`：正文图库。
   - `Images -> Cover Image Alt Text`：图片说明，建议写清楚图片内容。
5. 检查 SEO：
   - `SEO - optional -> Search Title`：浏览器标题、Google 标题、分享标题优先读这里。
   - `SEO - optional -> Search Description`：Google/分享摘要。
   - `SEO - optional -> Keywords`：关键词。
   - `SEO - optional -> Image Alt Text`：社媒图说明。
6. 点 `Publish`。
7. 前台验证：
   - 打开对应新闻页面。
   - 检查正文标题、封面图、摘要、浏览器标签标题。

注意：

- 如果只改 `News Title`，但 `Search Title` 还保留旧标题，前台 SEO 标题仍会显示旧内容。
- 不建议为了标题变化就改 URL。URL 可以保留旧 slug，这对 SEO 和旧链接更安全。

## 3. 添加新新闻

路径：

```text
Start Here -> Add or Edit News -> Create
```

必填内容：

- `News Title`
- `URL Slug`
- `Page Path`
- `Category`
- `Excerpt`
- `Body Text`
- `Cover Image`
- `Cover Image Alt Text`
- `SEO - optional` 里的 Search Title、Search Description、Keywords

URL 规则：

```text
Page Path: /news/news-title-slug
URL Slug: news-title-slug
```

示例：

```text
News Title: New Frame Design Trends for 2026
URL Slug: new-frame-design-trends-for-2026
Page Path: /news/new-frame-design-trends-for-2026
```

发布前检查：

- 标题没有拼写错误。
- 分类正确。
- 封面图不是重复图或临时图。
- SEO 标题和描述不是空白，也不是复制其他文章的旧内容。
- Page Path 以 `/news/` 开头，不包含域名，不以 `/` 结尾。

## 4. 修改已有产品

路径：

```text
Start Here -> Add or Edit Products
```

建议按分类进入：

```text
Mirror
Picture Frame
Art
Furniture
Memo Board
```

操作步骤：

1. 进入对应产品大类或子类。
2. 搜索产品名称或通过 `Page Path` 判断产品。
3. 点开对应 Product。
4. 主要修改 `Edit Content`：
   - `Product Name`：产品名称。
   - `Description`：产品短描述。
   - `Product Details`：详情介绍。
   - `SKU / Item Number`：产品编号。
   - `Material`：材质。
   - `Dimensions`：尺寸。
   - `Product Categories`：产品所属分类。
   - `Main Category`：主分类，用于面包屑和主要归属。
5. 修改图片：
   - `Images -> Main Image`：产品主图，影响产品列表、详情页、搜索结果和相关产品卡片。
   - `Images -> Gallery Images`：详情页图库。
   - `Images -> Main Image Alt Text`：产品图片说明。
6. 检查 SEO：
   - `Search Title`
   - `Search Description`
   - `Keywords`
   - `Image Alt Text`
7. 点 `Publish`。
8. 前台验证：
   - 打开 `Page Path` 对应页面。
   - 检查产品详情页。
   - 检查对应分类页是否能看到该产品。

## 5. 添加新产品

推荐路径：

```text
Start Here -> Add or Edit Products -> 选择大类 -> 选择子类 -> Create
```

从子类入口创建时，系统会自动带上对应分类。例如从 `LED Mirror` 进入创建，会自动带上：

```text
mirror
led-mirror
```

必填内容：

- `Product Name`
- `URL Slug`
- `Page Path`
- `Product Categories`
- `Main Category`
- `Description`
- `Main Image`
- `Main Image Alt Text`
- `Gallery Images`
- SEO 信息

URL 规则：

```text
Page Path: /main-category/sub-category/product-slug
URL Slug: product-slug
```

示例：

```text
Product Name: Arched Gold LED Vanity Mirror
URL Slug: arched-gold-led-vanity-mirror
Page Path: /mirror/led-mirror/arched-gold-led-vanity-mirror
Product Categories: mirror, led-mirror
Main Category: mirror
```

发布后会影响的位置：

- 产品详情页。
- 对应分类页。
- 搜索结果。
- 相关产品推荐。

不一定自动影响的位置：

- 首页固定推荐模块。
- 某些大类页的营销卡片。
- 人工配置的精选内容。

## 6. 图片规范

产品图建议：

- 主图清晰，主体居中，不要用临时 banner。
- 建议方图或接近方图，至少 1000px 宽。
- Gallery 可以放多角度、细节、场景图。

新闻图建议：

- Cover Image 与文章主题相关。
- 避免所有文章共用同一张通用图。
- Alt Text 写清楚图片内容，例如 `Modern black wall mirror in bathroom setting`。

禁止：

- 直接粘贴旧站 `wp-content` 图片链接。
- 使用模糊、低清、水印明显、和内容无关的图片。
- 上传超大无压缩图片后不检查前台显示。

## 7. URL 修改规则

不要轻易修改：

- `URL Slug`
- `Page Path`

需要修改 URL 的情况：

- 原 URL 拼写明显错误。
- 产品分类归属变更，必须调整路径。
- SEO 团队明确要求。

修改 URL 前必须确认：

- 是否需要保留旧 URL 的 301 跳转。
- 是否已有客户、广告、邮件或搜索结果使用旧链接。
- 是否同步修改内部链接。

业务人员如果不确定，先记录需求，让开发处理跳转。

## 8. 发布后检查清单

每次发布后检查：

- 页面能正常打开。
- 标题、摘要、图片正确。
- 浏览器标签标题正确。
- 分类页能找到新增或修改的产品/新闻。
- 手机端查看没有明显错位。
- 如果改了 SEO 字段，等待搜索引擎重新抓取，不会立刻反映到 Google。

## 9. 常见问题

### Publish 后前台没变化

先检查：

- 是否点了 `Publish`，而不是只保存 draft。
- 是否改的是 English 内容，还是其他语言版本。
- 是否等待了约 1 分钟。
- 是否浏览器缓存未刷新。
- 是否只改了标题，但 SEO Title 仍是旧的。

### 页面标题变了，但浏览器标签还是旧的

原因通常是 `SEO - optional -> Search Title` 仍是旧内容。

处理方式：同步修改 Search Title。

### 产品没有出现在分类页

检查：

- `Product Categories` 是否包含对应子类。
- `Main Category` 是否正确。
- `Page Path` 是否写在正确分类路径下。

### 图片还是旧的或不对

检查：

- 是否改的是 `Main Image / Cover Image`，不是只改 Gallery。
- 是否点了 Publish。
- 是否上传到了 Sanity，而不是复制旧站链接。

