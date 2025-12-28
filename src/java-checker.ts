import { execSync } from 'child_process';
import * as fs from 'fs';

export interface LintResult {
  passed: boolean;
  errors: number;
  warnings: number;
  message: string;
}

export async function checkJavaLinting(): Promise<LintResult> {
  try {
    // Check if using Maven or Gradle
    const isMaven = fs.existsSync('pom.xml');
    const isGradle = fs.existsSync('build.gradle') || fs.existsSync('build.gradle.kts');

    if (!isMaven && !isGradle) {
      return {
        passed: false,
        errors: 1,
        warnings: 0,
        message: '❌ No Maven (pom.xml) or Gradle (build.gradle) found',
      };
    }

    // Run checkstyle or spotbugs via Maven/Gradle
    let output = '';
    try {
      if (isMaven) {
        output = execSync('mvn clean compile checkstyle:check -DskipTests', {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        });
      } else {
        output = execSync('gradle check -x test', {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        });
      }
    } catch (error) {
      output = (error as any).stdout || '';
    }

    // Parse output for errors
    const errorCount = (output.match(/\[ERROR\]/g) || []).length;
    const warningCount = (output.match(/\[WARN\]/g) || []).length;

    if (errorCount > 0) {
      return {
        passed: false,
        errors: errorCount,
        warnings: warningCount,
        message: `❌ Checkstyle failed: ${errorCount} error(s), ${warningCount} warning(s)`,
      };
    }

    return {
      passed: true,
      errors: 0,
      warnings: warningCount,
      message: warningCount > 0
        ? `⚠️ Checkstyle passed with ${warningCount} warning(s)`
        : '✅ Checkstyle passed',
    };
  } catch (error) {
    return {
      passed: false,
      errors: 1,
      warnings: 0,
      message: `❌ Java linting check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function checkJavaCompilation(): Promise<{ passed: boolean; message: string }> {
  try {
    const isMaven = fs.existsSync('pom.xml');

    if (isMaven) {
      execSync('mvn clean compile -DskipTests', {
        encoding: 'utf-8',
        stdio: 'pipe',
      });
    } else {
      execSync('gradle build -x test', {
        encoding: 'utf-8',
        stdio: 'pipe',
      });
    }

    return {
      passed: true,
      message: '✅ Java compilation successful',
    };
  } catch (error) {
    return {
      passed: false,
      message: `❌ Java compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
