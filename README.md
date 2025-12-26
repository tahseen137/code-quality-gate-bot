# Code Quality Gate Bot

A GitHub Action that enforces code quality standards on every pull request. Blocks merges if code doesn't meet quality thresholds.

## Features

- **Test Coverage Checking**: Ensures minimum code coverage percentage
- **Linting Enforcement**: Runs ESLint and fails on errors
- **Type Checking**: Validates TypeScript types
- **PR Comments**: Posts detailed results directly on PRs
- **Check Status**: Sets GitHub check status for visibility

## Usage

### 1. Add to your repository

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
        uses: your-org/code-quality-gate-bot@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          coverage-threshold: 70
          coverage-report-path: coverage/coverage-final.json
```

### 2. Configure your project

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

### 3. Set branch protection rules

In GitHub repo settings:
- Require "Code Quality Gate" check to pass before merging
- This prevents low-quality code from reaching main

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `github-token` | Yes | - | GitHub token for API access |
| `coverage-threshold` | No | 70 | Minimum code coverage percentage |
| `coverage-report-path` | No | `coverage/coverage-final.json` | Path to coverage report |

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
