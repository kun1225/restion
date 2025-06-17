# Restion Backend Test System

This folder contains the complete test suite for theder contabackend, including unit tests, integration tests, and middleware tests.for the Restion backend, including unit tests, integration tests, and middleware tests.

## Test Structure

```
tests/
├── unit/                   # unit tests
│   ├── jwt.test.ts        # JWT tool tests
│   ├── models.test.ts     # data model tests
│   ├── middleware.test.ts # middleware tests
│   └── cleanup.test.ts    # cleanup tool tests
├── integration/           # integration tests
│   └── auth.test.ts       # auth API integration tests
├── helpers/               # test helper tools
│   └── testDb.ts         # test database tool
├── setup.ts              # test environment setup
├── jest.d.ts             # Jest type declarations
└── README.md             # this README file
```

## Run Tests

### Install test dependencies

```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

### Test commands

```bash
# run all tests
npm test

# run specific type of tests
npm run test:unit          # run only unit tests
npm run test:integration   # run only integration tests

# watch mode (for development)
npm run test:watch

# generate coverage report
npm run test:coverage

# use custom test runner
node test-runner.js
```

## Test Type Description

### Unit Tests (Unit Tests)

Test the functionality of individual functions and modules:

- **JWT tool** (`jwt.test.ts`)

  - Token generation and verification
  - Token revocation mechanism
  - Error handling

- **data model** (`models.test.ts`)

  - user creation and query
  - data validation

- **middleware** (`middleware.test.ts`)

  - authentication middleware
  - error handling

- **cleanup tool** (`cleanup.test.ts`)
  - expired token cleanup
  - statistics

### Integration Tests (Integration Tests)

Test the functionality of complete API endpoints:

- **authentication API** (`auth.test.ts`)
  - user registration (`POST /api/auth/register`)
  - user login (`POST /api/auth/login`)
  - token refresh (`POST /api/auth/refresh`)
  - user logout (`POST /api/auth/logout`)
  - get user information (`GET /api/auth/me`)

## Test environment configuration

### Environment variables

The test will automatically set the following environment variables:

```bash
NODE_ENV=test
ACCESS_TOKEN_SECRET=test_access_secret_key_for_testing_only
REFRESH_TOKEN_SECRET=test_refresh_secret_key_for_testing_only
DB_NAME=restion_test_db
```

### Database setup

The test uses a separate test database, and the database will be cleaned up before and after each test:

```typescript
beforeEach(async () => {
  await TestDbHelper.cleanupAll();
});

afterEach(async () => {
  await TestDbHelper.cleanupAll();
});
```

## Test tools

### TestDbHelper

Provide database test helper functions:

```typescript
// clean up all test data
await TestDbHelper.cleanupAll();

// create test user
const user = await TestDbHelper.createTestUser({
  email: 'test@example.com',
});

// create test token
const token = await TestDbHelper.createTestRefreshToken(userId);
```

### Mock objects

Use Jest's mock functionality to test middleware:

```typescript
const mockReq = { headers: {} };
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};
const mockNext = jest.fn();
```

## Test coverage

Target coverage:

- **unit tests**: ≥ 80%
- **integration tests**: ≥ 60%
- **critical features**: 100%

View coverage report:

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## Debugging tests

### Common issues

1. **Database connection failed**

   ```bash
   # check if the database is running
   pg_isready -h localhost -p 5432

   # check if the database migration is successful
   npm run migrate
   ```

2. **JWT error**

   ```bash
   # check if the environment variables are correctly set
   echo $ACCESS_TOKEN_SECRET
   ```

3. **Port conflict**

   ```bash
   # check if the test port is not occupied
   lsof -i :3001
   ```

### Debug mode

```bash
# run specific test file
npx jest tests/unit/jwt.test.ts --verbose

# debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Write new tests

### Unit test example

```typescript
describe('MyFunction', () => {
  beforeEach(async () => {
    await TestDbHelper.cleanupAll();
  });

  it('should return expected result', async () => {
    const result = await myFunction();
    expect(result).toBe('expected');
  });
});
```

### Integration test example

```typescript
describe('POST /api/my-endpoint', () => {
  it('should create resource successfully', async () => {
    const response = await request(app)
      .post('/api/my-endpoint')
      .send({ data: 'test' })
      .expect(201);

    expect(response.body).toHaveProperty('success', true);
  });
});
```

## Continuous integration

Run tests in CI/CD pipeline:

```yaml
# GitHub Actions example
- name: Run tests
  run: |
    npm ci
    npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v1
```

## Best practices

1. **test isolation**: each test should be independent, not dependent on other tests
2. **data cleanup**: use `beforeEach`/`afterEach` to ensure test data is clean
3. **descriptive naming**: test names should clearly describe the test content
4. **error testing**: not only test success cases, but also test error handling
5. **realistic scenarios**: tests should reflect real usage scenarios

## Reference

- [Jest official documentation](https://jestjs.io/)
- [Supertest documentation](https://github.com/visionmedia/supertest)
- [Testing best practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
