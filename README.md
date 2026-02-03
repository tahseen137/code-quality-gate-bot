# Code Quality Gate Bot 🚦

[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/tahseen137/code-quality-gate-bot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)

> **Automated code quality enforcement for your pull requests.** Never merge substandard code again!

A GitHub Action that enforces code quality standards on every pull request. Supports **Node.js**, **Java**, and **Spring Boot** projects. Blocks merges if code doesn't meet quality thresholds.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌐 **Multi-Language Support** | Node.js, Java, Spring Boot |
| 📊 **Coverage Checking** | Ensures minimum code coverage percentage |
| 🔍 **Linting Enforcement** | ESLint (Node.js), Checkstyle (Java) |
| ✅ **Type Checking** | TypeScript (Node.js), Compilation (Java) |
| 🔮 **Auto-Detection** | Automatically detects project type |
| 💬 **PR Comments** | Posts detailed results directly on PRs |
| 🚥 **Check Status** | Integrates with branch protection rules |

## 📸 Example Output

**When a PR fails quality gates:**
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

**When a PR passes:**
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

## 🚀 Quick Start

### 1. Add the Workflow

Create `.github/workflows/quality-gate.yml`:

#### For Node.js Projects

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

#### For Java/Spring Boot Projects

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

### 2. Configure Your Project

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

#### Java/Spring Boot

Add Jacoco plugin to `pom.xml`:

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

### 3. Set Branch Protection (Recommended)

1. Go to **Settings** → **Branches**
2. Click **Add rule** for your main branch
3. Check **Require status checks to pass before merging**
4. Search for and select **Code Quality Gate**

Now PRs cannot be merged until quality gates pass! 🔒

## ⚙️ Configuration

### Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `github-token` | Yes | - | GitHub token for API access |
| `project-type` | No | `auto` | Project type: `nodejs`, `java`, `springboot`, or `auto` |
| `coverage-threshold` | No | `70` | Minimum code coverage percentage |
| `coverage-report-path` | No | auto | Path to coverage report (auto-detected if not provided) |

### Coverage Report Paths

| Project Type | Default Path |
|--------------|--------------|
| Node.js | `coverage/coverage-final.json` |
| Java/Spring Boot | `target/site/jacoco/jacoco.xml` |

## 🛠️ Supported Languages

| Language | Linting | Type Check | Coverage |
|----------|---------|------------|----------|
| Node.js/TypeScript | ESLint | TypeScript | Jest/Vitest |
| Java | Checkstyle | Maven/Gradle | Jacoco |
| Spring Boot | Checkstyle | Maven/Gradle | Jacoco |

## 🔧 Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Type check
npm run type-check
```

## 🗺️ Roadmap

- [ ] Python support (pytest)
- [ ] Go support
- [ ] Rust support
- [ ] Configuration file (.quality-gate.yml)
- [ ] Slack/Discord notifications
- [ ] Custom linting rules
- [ ] Ignore patterns

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with:
- [GitHub Actions Toolkit](https://github.com/actions/toolkit)
- [TypeScript](https://www.typescriptlang.org/)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/tahseen137">Tahseen-ur Rahman</a>
</p>
