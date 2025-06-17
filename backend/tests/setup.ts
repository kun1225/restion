import dotenv from 'dotenv';

// load test environment variables
dotenv.config({ path: '.env.test' });

process.env.NODE_ENV = 'test';
process.env.ACCESS_TOKEN_SECRET = 'test_access_secret_key_for_testing_only';
process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret_key_for_testing_only';
process.env.DB_NAME = 'restion_test_db';

// global test setup
// beforeAll(async () => {});

// afterAll(async () => {});

// afterEach(async () => {});

// global error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
