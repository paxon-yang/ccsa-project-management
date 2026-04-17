# Supabase 备份运行手册（P0）

## 目标
- 每日：Supabase 平台自动备份（数据库层）。
- 每周：把业务数据导出为 JSON/CSV，归档到公司网盘（文件层）。

## 一、每日备份（Supabase）
1. 在 Supabase 项目控制台确认项目处于 Pro/支持自动备份的计划。
2. 在 Database / Backups 中开启每日备份。
3. 记录最近一次成功备份时间，建议纳入运维巡检。

## 二、每周导出（本项目脚本）
### 1) 准备环境变量
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- 可选：`WORKSPACE_ID`（默认 `tmm-main`）

### 2) 执行导出
```bash
npm run backup:export -- --workspace tmm-main --outdir exports
```

执行后会生成一个时间戳目录，包含：
- `workspace.json`
- `payload.json`
- `projects.json`
- `tasks.json`
- `auditLogs.json`
- `projectPermissions.json`
- `revisions.json`
- `tasks.csv`
- `auditLogs.csv`

### 3) 归档到公司网盘
- 将本周导出目录整体上传到网盘。
- 建议目录命名：`YYYY-WW/TMM/`。

## 三、恢复建议（演练）
- 紧急恢复时先在测试环境导入 `payload.json` 验证，再回写生产。
- 每月至少做一次恢复演练，确认备份可用。
