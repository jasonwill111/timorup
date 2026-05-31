# TimorUp 完整功能测试清单

## 浏览器测试要求
- 使用 Chrome DevTools (F12)
- Network 标签: 检查 API 请求/响应
- Console 标签: 检查 JS 错误
- Application 标签: 检查 LocalStorage/Cookie

---

## P0 - 关键路径 (必须测试)

### 1. 主页 (/)
- [ ] 页面加载，顶部显示 Carousel Banner
- [ ] Carousel 自动播放，左右箭头切换
- [ ] 4个实体卡片显示 (Businesses, Classified Ads, Non-Profits, Public Sectors)
- [ ] 点击卡片跳转对应列表页
- [ ] Server Island 加载 (显示 skeleton → 内容)
- [ ] "Create Your Business Page" CTA 按钮存在

### 2. Businesses 列表 (/businesses)
- [ ] 页面加载，显示 business 卡片网格
- [ ] Carousel Banner 显示在顶部
- [ ] 卡片显示: 图片, 名称, 地址, 评分, 点赞数
- [ ] 分类筛选工作
- [ ] 搜索功能工作
- [ ] 分页 (12项/页) 工作

### 3. Business 详情 (/business/[slug])
- [ ] 页面加载，显示完整信息
- [ ] Industry badge 显示正确
- [ ] 地址、联系电话显示
- [ ] 5星评分显示
- [ ] Photo Gallery 显示
- [ ] Products/Services tab 显示
- [ ] Like 按钮点击有反应
- [ ] Reviews section 显示

### 4. Listings 列表 (/listings)
- [ ] 页面加载，显示分类广告
- [ ] Type filters 工作 (Job/Product/Service/Property/Vehicle)
- [ ] 价格显示在卡片上
- [ ] "Create Listing" 按钮存在

### 5. 用户认证
- [ ] /register 页面加载
- [ ] 表单验证 (空字段提交显示错误)
- [ ] /login 页面加载
- [ ] 错误密码显示错误提示
- [ ] 登录后跳转到 dashboard

### 6. 错误页面
- [ ] 访问不存在的 business 显示 404
- [ ] 500 页面优雅降级

---

## P1 - 重要功能

### 7. Non-Profits (/non-profits)
- [ ] 列表页加载
- [ ] 详情页加载，category badge 显示

### 8. Public Sectors (/public-sectors)
- [ ] 列表页加载
- [ ] 详情页加载

### 9. Dashboard (/dashboard)
- [ ] 需要登录才能访问
- [ ] 未登录重定向到 /login
- [ ] 显示用户信息

### 10. Business 创建 (/businesses/create)
- [ ] 表单加载
- [ ] 必填字段验证 (name, category, address)
- [ ] 图片上传功能
- [ ] 创建成功跳转详情页

### 11. 定价页 (/pricing)
- [ ] 显示所有服务套餐
- [ ] Business Plans: Basic $39, Pro $69, Max $99
- [ ] Listing Renewals: 7天 $8, 30天 $15, 365天 $120

### 12. Admin 后台 (/admin)
- [ ] /admin/login 登录页
- [ ] Dashboard 显示统计数据
- [ ] 侧边栏导航工作
- [ ] 各管理页面加载 (businesses, listings, users, etc.)

---

## P2 - 次要功能

### 13. 静态页面
- [ ] /about 页面加载
- [ ] /faq 页面加载，定价正确
- [ ] /contact 页面加载
- [ ] /blog 列表加载
- [ ] /privacy 页面加载

### 14. API 测试 (DevTools Network)
- [ ] GET /api/businesses 返回数据
- [ ] GET /api/health 返回 {status: "healthy"}
- [ ] 检查响应时间和大小

---

## Chrome DevTools 检查清单

### Network 标签
- [ ] 过滤 XHR/fetch 查看 API 调用
- [ ] 检查请求头 (Authentication, Content-Type)
- [ ] 检查响应状态码 (200/401/404/500)
- [ ] 检查响应体 JSON 格式

### Console 标签
- [ ] 无红色 Error
- [ ] 无黄色 Warning (关键)
- [ ] console.log 输出正常

### Application 标签
- [ ] Cookies: session 存在
- [ ] LocalStorage: 用户偏好设置
- [ ] 检查 Service Worker 注册

### Performance 标签
- [ ] 记录加载时间
- [ ] 检查 LCP (Largest Contentful Paint)
- [ ] 检查是否有大的资源阻塞

---

## 已知问题记录

```
日期: 2026-05-27
问题: Carousel Banner 高度可能在移动端显示不正确
验证: 在 Chrome DevTools mobile view 测试
```