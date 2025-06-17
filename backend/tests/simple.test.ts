// 簡單的測試用來驗證測試環境配置
describe('Test Environment', () => {
  test('basic JavaScript functionality', () => {
    const sum = 1 + 2;
    expect(sum).toBe(3);
  });

  test('environment variables are set', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.ACCESS_TOKEN_SECRET).toBeDefined();
    expect(process.env.REFRESH_TOKEN_SECRET).toBeDefined();
  });

  test('async operations work', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });
});
