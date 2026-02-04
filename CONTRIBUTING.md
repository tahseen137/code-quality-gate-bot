# Contributing to Code Quality Gate Bot

First off, thank you for considering contributing to Code Quality Gate Bot! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs **actual behavior**
- **Environment details** (OS, Node.js version, project type)
- **Relevant logs** from GitHub Actions

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title** describing the enhancement
- **Detailed description** of the proposed functionality
- **Use case** explaining why this would be useful
- **Possible implementation** if you have ideas

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests
3. Ensure the test suite passes
4. Make sure your code lints
5. Issue that pull request!

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/code-quality-gate-bot.git
cd code-quality-gate-bot

# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Type check
npm run type-check
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style (enforced by ESLint)
- Write meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- Add JSDoc comments for public functions

## Testing Your Changes

To test the action locally:

1. Build the project: `npm run build`
2. Create a test workflow in a sample repository
3. Point the workflow to your fork's branch

## Adding Support for New Languages

Want to add support for a new language/framework? Great! Here's how:

1. Create a new checker in `src/` (e.g., `python-checker.ts`)
2. Update `src/project-detector.ts` to detect the new project type
3. Update `src/index.ts` to use the new checker
4. Add documentation in `README.md`
5. Test with a sample project

## Questions?

Feel free to open an issue for any questions. We're here to help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
