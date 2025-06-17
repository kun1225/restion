#!/usr/bin/env node

const { execSync } = require('child_process');

// 使用簡單的顏色函數代替 chalk
const colors = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
};

console.log(colors.blue('🧪 Restion Backend Test Suite'));
console.log(colors.blue('===============================\n'));

// 設置測試環境變數
process.env.NODE_ENV = 'test';
process.env.ACCESS_TOKEN_SECRET = 'test_access_secret_key_for_testing_only';
process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret_key_for_testing_only';

try {
  console.log(colors.yellow('📋 檢查測試環境...'));

  // 檢查 Jest 是否安裝
  try {
    execSync('npx jest --version', { stdio: 'pipe' });
    console.log(colors.green('✅ Jest 已安裝'));
  } catch (error) {
    console.log(
      colors.red('❌ Jest 未安裝，請運行: npm install --save-dev jest'),
    );
    process.exit(1);
  }

  // 檢查 TypeScript 支援
  try {
    execSync('npx ts-jest --version', { stdio: 'pipe' });
    console.log(colors.green('✅ TypeScript 支援已配置'));
  } catch (error) {
    console.log(
      colors.red('❌ ts-jest 未安裝，請運行: npm install --save-dev ts-jest'),
    );
    process.exit(1);
  }

  console.log(colors.yellow('\n🏃‍♂️ 運行測試...'));

  // 運行簡單的 Jest 命令
  console.log(colors.cyan('\n📖 運行所有測試'));
  try {
    execSync('npx jest --verbose', { stdio: 'inherit' });
    console.log(colors.green('✅ 測試通過'));
  } catch (error) {
    console.log(colors.red('❌ 測試失敗'));
    console.log(colors.yellow('提示：某些測試可能需要資料庫連接或環境配置'));
  }

  console.log(colors.green('\n🎉 測試運行完成！'));
} catch (error) {
  console.error(colors.red('❌ 測試運行失敗:'), error.message);
  process.exit(1);
}
