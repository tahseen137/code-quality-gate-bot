# Code Quality Gate Bot

A GitHub Action that enforces code quality standards on every pull request. Supports Node.js, Java, and Spring Boot projects. Blocks merges if code doesn't meet quality thresholds.

## Features

- **Multi-Language Support**: Node.js, Java, Spring Boot
- **Test Coverage Checking**: Ensures minimum code coverage percentage
- **Linting Enforcement**: ESLint (Node.js), Checkstyle (Java)
- **Type Checking**: TypeScript (Node.js), Compilation (Java)
- **Auto-Detection**: Automatically detects project type
- **PR Comments**: Posts detailed results directly on PRs
- **Check Status**: Sets GitHub check status for visibility

## Supported Languages

### Node.js
- Linting: ESLint
- Type Checking: TypeScript
- Coverage: Jest/Vitest (coverage-final.json)

### Java / Spring Boot
- Linting: Checkstyle
- Type Checking: Maven/Gradle compilation
- Coverage: Jacoco (jacoco.xml)
- Build Tools: Maven or Gradle

## Quick Start

### Step 1: Choose Your Project Type

Identify if your project is Node.js, Java, or Spring Boot. The bot auto-detects this, but you can also specify it explicitly.

### Step 2: Create the Workflow File

Create a new file in your repository at `.github/workflows/quality-gate.yml` and choose the appropriate configuration below.

### Step 3: Configure Your Project

Add the required build scripts and dependencies to your project (see configurations below).

### Step 4: Set Branch Protection (Optional but Recommended)

In your GitHub repository settings, require the "Code Quality Gate" check to pass before merging.

### Step 5: Create a PR and Test

Push your changes and create a pull request. The bot will run automatically and comment with results.

---

## Usage

### 1. Add to your repository

#### Node.js Project

Create `.github/workflows/quality-gate.yml`:

```yaml
name: Code Quality Gate

on:
  pull_request:
    branches: [main, develop]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: Run quality gate
        uses: tahseen137/code-quality-gate-bot@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          project-type: nodejs
          coverage-threshold: 70
```

#### Java / Spring Boot Project

Create `.github/workflows/quality-gate.yml`:

```yaml
name: Code Quality Gate

on:
  pull_request:
    branches: [main, develop]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: maven

      - name: Run tests with coverage
        run: mvn clean test jacoco:report

      - name: Run quality gate
        uses: tahseen137/code-quality-gate-bot@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          project-type: springboot
          coverage-threshold: 70
          coverage-report-path: target/site/jacoco/jacoco.xml
```

### 2. Configure your project

#### Node.js

**Step 1:** Install testing framework (if not already installed):

```bash
npm install --save-dev jest @types/jest ts-jest
# or for Vitest
npm install --save-dev vitest
```

**Step 2:** Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "type-check": "tsc --noEmit"
  }
}
```

**Step 3:** Create `jest.config.js` (if using Jest):

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
```

**Step 4:** Ensure ESLint is configured (`.eslintrc.json`):

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "env": { "node": true, "es2020": true }
}
```

#### Java / Spring Boot

**Step 1:** Add Jacoco plugin to `pom.xml`:

```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.8</version>
  <executions>
    <execution>
      <goals>
        <goal>prepare-agent</goal>
      </goals>
    </execution>
    <execution>
      <id>report</id>
      <phase>test</phase>
      <goals>
        <goal>report</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

**Step 2:** Add Checkstyle plugin to `pom.xml`:

```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-checkstyle-plugin</artifactId>
  <version>3.2.0</version>
  <configuration>
    <configLocation>checkstyle.xml</configLocation>
  </configuration>
</plugin>
```

**Step 3:** Create `checkstyle.xml` in project root:

```xml
<?xml version="1.0"?>
<!DOCTYPE module PUBLIC "-//Puppy Crawl//DTD Check Configuration 1.3//EN"
    "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
  <module name="TreeWalker">
    <module name="NeedBraces"/>
    <module name="LeftCurly"/>
    <module name="RightCurly"/>
  </module>
</module>
```

**Step 4:** Ensure you have unit tests in `src/test/java/`:

```bash
mvn test
```

### 3. Verify the Workflow

**Step 1:** Push your changes to GitHub:

```bash
git add .
git commit -m "Add code quality gate workflow"
git push origin your-branch
```

**Step 2:** Create a pull request on GitHub

**Step 3:** Wait for the workflow to run (usually 1-2 minutes)

**Step 4:** Check the PR for the quality gate results

### 4. Set branch protection rules

In your GitHub repository:

1. Go to **Settings** → **Branches**
2. Click **Add rule** under "Branch protection rules"
3. Enter branch name pattern: `main` (or your main branch)
4. Check **Require status checks to pass before merging**
5. Search for and select **Code Quality Gate**
6. Click **Create**

Now PRs cannot be merged until the quality gate passes.

### 5. Troubleshooting

**Workflow not running?**
- Ensure `.github/workflows/quality-gate.yml` is in the correct location
- Check that the file is committed and pushed to GitHub
- Go to the **Actions** tab in your repo to see workflow status

**Coverage report not found?**
- Verify the coverage report path matches your test framework output
- Run tests locally: `npm run test:coverage` (Node.js) or `mvn test` (Java)
- Check that coverage files are generated in the expected location

**Linting errors?**
- Run linting locally: `npm run lint` (Node.js) or `mvn checkstyle:check` (Java)
- Fix errors before pushing

**Type checking errors?**
- Run type check locally: `npm run type-check` (Node.js)
- Ensure TypeScript is properly configured

---

## 2. Configure your project

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `github-token` | Yes | - | GitHub token for API access |
| `project-type` | No | auto | Project type: `nodejs`, `java`, `springboot`, or `auto` |
| `coverage-threshold` | No | 70 | Minimum code coverage percentage |
| `coverage-report-path` | No | auto | Path to coverage report (auto-detected if not provided) |

## Common Configurations

### Adjust Coverage Threshold

To require 80% coverage instead of 70%:

```yaml
- name: Run quality gate
  uses: tahseen137/code-quality-gate-bot@main
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    coverage-threshold: 80
```

### Specify Project Type Explicitly

If auto-detection doesn't work:

```yaml
- name: Run quality gate
  uses: tahseen137/code-quality-gate-bot@main
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    project-type: nodejs
```

### Custom Coverage Report Path

If your coverage report is in a non-standard location:

```yaml
- name: Run quality gate
  uses: tahseen137/code-quality-gate-bot@main
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    coverage-report-path: ./reports/coverage.json
```

## Example Output

When a PR fails quality gates:

```
❌ Code Quality Gate FAILED

### Coverage
❌ Coverage: 45% (threshold: 70%)

### Linting
✅ No linting errors found

### Type Checking
❌ TypeScript errors found: 3 error(s)

Please fix the issues above before merging.
```

When a PR passes:

```
✅ Code Quality Gate PASSED

### Coverage
✅ Coverage: 85% (threshold: 70%)

### Linting
✅ No linting errors found

### Type Checking
✅ No TypeScript errors found

All quality gates passed! 🎉
```

## Development

```bash
npm install
npm run build
npm run dev
npm run lint
npm run type-check
```

## License

MIT
