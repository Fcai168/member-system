# Cloudflare Token 格式指南

## 两种 Token 类型

### 1. API Token (推荐)
- **格式**: `sc.xxxxxxxxxxxxxxxxxxxxxx`
- **用途**: 自动化部署、API 调用
- **权限**: 可精确控制访问范围
- **Pages API**: ✅ 支持

### 2. User Service Key (旧式)
- **格式**: `cfat_xxxxxxxxxxxxxxxxxxxxxx`
- **用途**: 旧版 API、某些特定场景
- **权限**: 账户级别全权限
- **Pages API**: ❌ 不支持（返回 400/6003 错误）

## 常见问题

### 错误: 400 Authentication failed
```json
{"success":false,"errors":[{"code":9106,"message":"Authentication failed (status: 400)"}]}
```
**原因**: 使用了 `cfat_` 开头的 User Service Key
**解决**: 重新生成 `sc.` 开头的 API Token

### 错误: 6003 Invalid request headers
```json
{"success":false,"errors":[{"code":6003,"message":"Invalid request headers"}]}
```
**原因**: Token 格式错误或缺失
**解决**: 确保 Token 以 `sc.` 开头

## 生成正确 Token 的步骤

1. 打开 https://dash.cloudflare.com/profile/api-tokens
2. 点击 "Create Token"
3. 选择模板 "Edit Cloudflare Pages"
4. 配置权限：
   - Account → Cloudflare Pages → Edit
   - Zone → Workers KV Storage → Edit
5. 点击 "Continue to summary" → "Create Token"
6. 复制生成的 Token（应以 `sc.` 开头）

## 验证 Token

```bash
# 验证 API Token
curl -s "https://api.cloudflare.com/client/v4/user" \
  -H "Authorization: Bearer [REDACTED_BEARER]"

# 期望返回用户信息，而不是错误
```

## GitHub Secrets 配置

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    steps:
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}  # sc. 开头的 token
          accountId: ${{ secrets.CF_ACCOUNT_ID }}  # 账户ID
```

Secrets 名称:
- `CF_API_TOKEN`: 新的 `sc.` 格式 Token
- `CF_ACCOUNT_ID`: 账户 ID (如 `4c914d6d5372ceb9ea6363590c407145`)