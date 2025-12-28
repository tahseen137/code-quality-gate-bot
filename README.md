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

Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "type-check": "tsc --noEmit"
  }
}
```

#### Java / Spring Boot

Ensure your `pom.xml` includes:

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

<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-checkstyle-plugin</artifactId>
  <version>3.2.0</version>
</plugin>
```

### 3. Set branch protection rules

In GitHub repo settings:
- Require "Code Quality Gate" check to pass before merging
- This prevents low-quality code from reaching main

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `github-token` | Yes | - | GitHub token for API access |
| `project-type` | No | auto | Project type: `nodejs`, `java`, `springboot`, or `auto` |
| `coverage-threshold` | No | 70 | Minimum code coverage percentage |
| `coverage-report-path` | No | auto | Path to coverage report (auto-detected if not provided) |

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
