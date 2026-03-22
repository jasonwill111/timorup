#!/usr/bin/env bash
# ============================================================
# Tech Stack 版本强制检查脚本（强制执行版）
# 用法:
#   ./scripts/check-versions.sh              # 完整检查+报告（默认）
#   ./scripts/check-versions.sh --check-only # hook 用（仅检查，不升级）
#   ./scripts/check-versions.sh --upgrade    # 检查+自动升级
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

OUTDATED_OUTPUT=""
OUTDATED_COUNT=0

echo "═══════════════════════════════════════════"
echo "  Tech Stack 版本检查"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "═══════════════════════════════════════════"

# --- 检测 pnpm ---
if ! command -v pnpm &>/dev/null; then
  echo "❌ pnpm 未安装，终止检查"
  exit 1
fi

# --- 1. pnpm outdated 核心检查 ---
echo ""
echo "📦 依赖版本状态:"
if OUTDATED_OUTPUT=$(pnpm outdated 2>&1); then
  # 提取有 "latest" 列的行（表示有新版本）
  LINES_WITH_LATEST=$(echo "$OUTDATED_OUTPUT" | grep -v "^Package\|^Dependencies\|^DevDependencies\|^PeerDependencies\|^│\|^Packages\|^Done\|^$" | grep -c "latest" 2>/dev/null || echo "0")

  if echo "$OUTDATED_OUTPUT" | grep -qE "(Package|astro|next|hono|better-auth|zod|drizzle|tailwindcss|mastra)"; then
    echo "$OUTDATED_OUTPUT"
    echo ""
    # 统计未升级的包数量
    OUTDATED_COUNT=$(echo "$OUTDATED_OUTPUT" | grep "latest" | grep -v "^$" | wc -l | tr -d ' ')
    if [ "${OUTDATED_COUNT:-0}" -gt 0 ] 2>/dev/null; then
      echo "⚠️  发现 $OUTDATED_COUNT 个依赖有新版本"
    fi
  else
    echo "  ✅ 所有依赖已是最新稳定版"
  fi
else
  echo "  ⚠️  pnpm outdated 出错（可能无网络）"
fi

# --- 2. 核心依赖逐一验证 ---
echo ""
echo "🌐 核心依赖详情:"

check_pkg() {
  local pkg=$1
  local latest current status

  latest=$(pnpm info "$pkg" version 2>/dev/null) || latest=""
  current=$(pnpm list "$pkg" --depth=0 --json 2>/dev/null | \
    python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0]['dependencies'].get('$pkg',{}).get('version','') if d else '')" 2>/dev/null) || \
    current=$(grep "\"$pkg\"" package.json 2>/dev/null | head -1 | \
      sed -E 's/.*"[^"]*@([^"]+)".*/\1/' | tr -d ' ' | grep -E '^[0-9]' | head -1) || current=""

  if [ -z "$latest" ]; then
    status="—"
  elif [ -z "$current" ]; then
    status="—"
  elif [ "$current" = "$latest" ]; then
    status="✅"
  else
    status="⚠️  $current → $latest"
  fi

  printf "  %-35s %s\n" "$pkg:" "$status"
}

check_pkg "astro"
check_pkg "@astrojs/cloudflare"
check_pkg "next"
check_pkg "react"
check_pkg "hono"
check_pkg "better-auth"
check_pkg "zod"
check_pkg "drizzle-orm"
check_pkg "@tailwindcss/vite"
check_pkg "mastra"

echo ""
echo "═══════════════════════════════════════════"
echo "  检查完成: $(date '+%Y-%m-%d %H:%M:%S')"
echo "═══════════════════════════════════════════"

# --- --check-only: hook 专用模式 ---
if [ "${1:-}" = "--check-only" ]; then
  if echo "$OUTDATED_OUTPUT" | grep -qE "latest" | grep -v "^$" | grep -qE "(astro|next|hono|better-auth|zod|drizzle|tailwindcss|mastra)" 2>/dev/null; then
    echo ""
    echo "❌ 有核心依赖未升级！"
    echo "   运行 ./scripts/check-versions.sh 查看详情"
    echo "   或 ./scripts/check-versions.sh --upgrade 自动升级"
    echo ""
    echo "   如需跳过检查（需有充分理由），使用："
    echo "   git commit --no-verify"
    echo ""
    exit 1
  fi
  exit 0
fi

# --- --upgrade: 自动升级 ---
if [ "${1:-}" = "--upgrade" ]; then
  echo ""
  echo "🚀 检测到 --upgrade 参数，执行升级..."
  pnpm up --latest
  echo ""
  echo "✅ 升级完成。必须执行以下验证："
  echo "   1. pnpm build       → 构建是否通过"
  echo "   2. pnpm dev         → 开发服务是否正常"
  echo "   3. git add . && git commit"
  echo ""
fi
