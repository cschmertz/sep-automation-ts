# Automation Framework: Cucumber BDD with Playwright & Prisma  

![Cucumber BDD](https://img.shields.io/badge/BDD-Cucumber-green)  
![Playwright](https://img.shields.io/badge/Test%20Runner-Playwright-blue)  
![Prisma ORM](https://img.shields.io/badge/Database-Prisma-ff69b4)  

Modern automation framework implementing Behavior-Driven Development (BDD) with full-stack testing capabilities:  
**UI Testing** (Playwright) + **API Testing** (Playwright APIRequestContext) + **Database Validation** (Prisma ORM)

```mermaid
graph TD
    A[Feature Files] --> B[Step Definitions]
    B --> C{Execution Layer}
    C --> D[UI Actions - Playwright]
    C --> E[API Calls - APIRequestContext]
    C --> F[DB Operations - Prisma]
    F --> G[PostgreSQL]
    D --> H[Browser]
    E --> I[REST API]
```

## Key Features

- **Trifecta Testing**: Unified workflow for UI actions, API calls, and DB assertions  
- **Playwright Integration**: Single tool for UI automation and API testing  
- **Environment Config**: Toggle browsers/headless mode via environment variables  
- **Atomic Tests**: Database reset hooks for test isolation  
- **CI/CD Ready**: Advanced Jenkins pipeline with time-based triggers  
- **Payment Testing**: Real-world Stripe card number validation  
- **Parallel Execution**: 4x parallel workers for faster test runs  

## Prerequisites

1. Node.js 18+
2. PostgreSQL 12+
3. Playwright browsers (`npx playwright install`)
4. Environment variables (create `.env` file):
```ini
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
STRIPE_CREDENTIALS="path/to/stripe_data.json"
TEST_TYPE="ui|api|db"  # Optional override
```

## Project Structure

```bash
├── features/               # Gherkin feature files
├── steps/                  # Step definitions
├── support/
│   ├── world.ts            # Custom World implementation
│   ├── hooks.ts            # Global before/after hooks
│   └── globalPagesSetup.ts # Page Object Model initializer
├── utilities/
│   ├── apiClient.ts        # Playwright APIRequestContext wrapper
│   ├── prismaClient.ts     # DB connection manager
│   ├── dbUtils.ts          # Database utilities
│   └── dataGenerators.ts   # Test data factories
├── models/                 # TypeScript interfaces
├── configs/                # API/DB configuration
└── reports/                # Test execution reports
```

## Getting Started

```bash
# 1. Clone repository
git clone https://github.com/yourrepo/automation-framework.git
cd automation-framework

# 2. Install dependencies
npm ci

# 3. Run tests
npm run test:smoke       # Smoke tests
npm run test:api         # API-only tests
npm run test:db          # Database tests
npm test                 # Full regression

# 4. View reports (after execution)
npm run Mac-open:report   # macOS
npm run Windows-open:report # Windows
```

## Writing Tests

### Feature File Example
```gherkin
@smoke @ui
Feature: User login
  Scenario: Successful login with valid credentials
    Given I navigate to login page
    When I enter username "valid@user.com"
    And I enter password "Passw0rd!"
    And I click login button
    Then I should see welcome message
```

### Step Definition with API Testing
```typescript
import { Given, When, Then } from "@cucumber/cucumber";

Given("I have valid API credentials", async function () {
  this.apiContext = await request.newContext();
});

When("I create a booking via API", async function () {
  this.response = await this.apiContext.post('/bookings', {
    data: {
      userId: 123,
      date: "2025-08-15"
    }
  });
});

Then("the booking should exist in database", async function () {
  expect(this.response.status()).toEqual(201);
  const bookingId = (await this.response.json()).id;
  
  const dbBooking = await this.db.bookings.findUnique({
    where: { id: bookingId }
  });
  expect(dbBooking).not.toBeNull();
});
```

## Test Data Management

```typescript
// Generate realistic test data
const user = generateValidUser(); 

// Get valid Stripe test card
const cardNumber = getRandomCardNumber();

// Create complex DB entities
const { company, drivers } = await testData.createCompanyWithDrivers(5);
```

## CI/CD Pipeline (Jenkins)

**Execution Strategy**:
| Branch Type | Schedule Time | Test Type               | Tags Executed   |
|-------------|---------------|-------------------------|-----------------|
| `main`      | 8 AM UTC      | Daily Smoke             | `@smoke`        |
| `main`      | Manual merge  | Sprint Regression       | `@regression`   |
| `develop`   | 8 AM UTC      | Daily Smoke             | `@smoke`        |
| `develop`   | 2 AM UTC      | Nightly Regression      | `@regression`   |
| `develop`   | Manual merge  | Critical Integration    | `@critical`     |
| `release/*` | Any           | Release Regression      | `@regression`   |

**Pipeline Features**:
- Automatic HTML report publishing
- Slack notifications with status colors
- Time-based test selection (UTC)
- Environment variable injection
- Smart branch filtering

```mermaid
journey
    title Jenkins Pipeline Flow
    section Main Branch
      Scheduled(8 AM): 5: Daily Smoke
      Manual Merge: 3: Sprint Regression
    section Develop Branch
      Scheduled(8 AM): 5: Daily Smoke
      Scheduled(2 AM): 2: Nightly Regression
      Manual Merge: 1: Critical Tests
    section Release Branches
      Any Trigger: 4: Release Regression
```

## Best Practices

1. **Tagging Strategy**:
   - `@ui`: UI-intensive tests
   - `@api`: API-only tests (uses Playwright APIRequestContext)
   - `@db`: Database-dependent tests
   - `@smoke`: Critical path (5-10 min)
   - `@critical`: Integration tests for develop branch
   - `@regression`: Full suite (60+ min)

2. **API Testing Pattern**:
```typescript
// Create isolated API context
Before({ tags: "@api" }, async function () {
  this.apiContext = await request.newContext();
});

// Reuse in steps
When("I get user profile", async function () {
  this.response = await this.apiContext.get('/users/me');
});

// Cleanup resources
After({ tags: "@api" }, async function () {
  await this.apiContext.dispose();
});
```

3. **DB Factories**:
```typescript
// Create test entities
const testDriver = await dbFactories.createDriver({
  firstName: "Test",
  lastName: "Driver",
  licenseNumber: "DL-123456"
});

// Reuse in assertions
Then("the driver should be active", async function () {
  const driver = await this.db.drivers.findUnique({
    where: { id: testDriver.id }
  });
  expect(driver.status).toEqual("ACTIVE");
});
```

## Troubleshooting

**Common Issues**:
```bash
# Database connection failures
⚠️ Failed to connect to database. Tests will run without DB.

# Playwright timeout
Increase default timeout in support/world.ts:
setDefaultTimeout(60000); 

# View API traces
await this.apiContext.tracing.stop({ path: 'api-trace.zip' });
```

**Generate DB Schema Diagram**:
```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio  # View DB in browser
```

## Contribution

1. Create feature branch from `develop`
2. Write tests for new functionality
3. Update Prisma schema if needed
4. Submit PR with tag-based execution proof:
```bash
npm run test:tag -- --tags @new_feature
```

## License

MIT License © 2025 Conor Schmertz