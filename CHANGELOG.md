# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-27

### Added
- Initial release of Code Quality Gate Bot
- **Multi-language support**: Node.js, Java, and Spring Boot projects
- **Test coverage checking** with configurable thresholds
- **Linting enforcement**: ESLint for Node.js, Checkstyle for Java
- **Type checking**: TypeScript for Node.js, compilation for Java
- **Auto-detection** of project type based on configuration files
- **PR comments** with detailed quality gate results
- **GitHub check status** integration for branch protection
- Configurable coverage threshold (default: 70%)
- Custom coverage report path support
- Comprehensive documentation and examples

### Technical Details
- Built with TypeScript
- Uses GitHub Actions toolkit (@actions/core, @actions/github)
- Supports Jest/Vitest coverage format for Node.js
- Supports Jacoco coverage format for Java/Spring Boot

## [Unreleased]

### Planned
- Python support (pytest coverage)
- Go support
- Rust support
- Configuration file support (.quality-gate.yml)
- Ignore patterns for coverage
- Slack/Discord notifications
