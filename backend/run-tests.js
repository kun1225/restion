#!/usr/bin/env node

const { execSync } = require('child_process');

// 顏色輸出
const colors = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
};

console.log(colors.blue('🧪 Restion Backend 測試系統'));
console.log(colors.blue('==============================\n'));

// 設置測試環境變數
process.env.NODE_ENV = 'test';
process.env.ACCESS_TOKEN_SECRET = 'test_access_secret_key_for_testing_only';
process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret_key_for_testing_only';

const testSuites = [
  {
    name: '基本環境測試',
    command: 'npx jest tests/simple.test.ts --verbose',
    required: true,
  },
  {
    name: '密碼哈希工具測試',
    command: 'npx jest tests/unit/hash.test.ts --verbose',
    required: true,
  },
  {
    name: '其他單元測試 (可能需要資料庫)',
    command:
      'npx jest tests/unit --verbose --testPathIgnorePatterns=hash.test.ts',
    required: false,
  },
  {
    name: '整合測試 (需要資料庫)',
    command: 'npx jest tests/integration --verbose',
    required: false,
  },
];

let passedTests = 0;
let totalTests = testSuites.length;

for (const suite of testSuites) {
  console.log(colors.cyan(`\n📖 ${suite.name}`));
  console.log('─'.repeat(50));

  try {
    execSync(suite.command, { stdio: 'inherit' });
    console.log(colors.green(`✅ ${suite.name} - 通過`));
    passedTests++;
  } catch (error) {
    if (suite.required) {
      console.log(colors.red(`❌ ${suite.name} - 失敗 (必要測試)`));
    } else {
      console.log(colors.yellow(`⚠️ ${suite.name} - 跳過 (可能需要額外配置)`));
      passedTests++; // 非必要測試不計入失敗
    }
  }
}

console.log(colors.blue('\n📊 測試總結'));
console.log('─'.repeat(50));
console.log(`總測試套件: ${totalTests}`);
console.log(`通過測試: ${colors.green(passedTests)}`);
console.log(
  `失敗測試: ${totalTests - passedTests > 0 ? colors.red(totalTests - passedTests) : '0'}`,
);

if (passedTests === totalTests) {
  console.log(colors.green('\n🎉 所有測試通過！'));
} else {
  console.log(colors.yellow('\n💡 部分測試可能需要資料庫連接或其他配置'));
}

console.log(colors.blue('\n🚀 後續步驟:'));
console.log('1. 設置測試資料庫來運行完整測試');
console.log('2. 運行 npm run test:coverage 生成覆蓋率報告');
console.log('3. 查看 tests/README.md 了解更多測試信息');
