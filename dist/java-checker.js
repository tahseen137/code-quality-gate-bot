"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJavaLinting = checkJavaLinting;
exports.checkJavaCompilation = checkJavaCompilation;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
async function checkJavaLinting() {
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
                output = (0, child_process_1.execSync)('mvn clean compile checkstyle:check -DskipTests', {
                    encoding: 'utf-8',
                    stdio: ['pipe', 'pipe', 'pipe'],
                });
            }
            else {
                output = (0, child_process_1.execSync)('gradle check -x test', {
                    encoding: 'utf-8',
                    stdio: ['pipe', 'pipe', 'pipe'],
                });
            }
        }
        catch (error) {
            output = error.stdout || '';
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
    }
    catch (error) {
        return {
            passed: false,
            errors: 1,
            warnings: 0,
            message: `❌ Java linting check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}
async function checkJavaCompilation() {
    try {
        const isMaven = fs.existsSync('pom.xml');
        if (isMaven) {
            (0, child_process_1.execSync)('mvn clean compile -DskipTests', {
                encoding: 'utf-8',
                stdio: 'pipe',
            });
        }
        else {
            (0, child_process_1.execSync)('gradle build -x test', {
                encoding: 'utf-8',
                stdio: 'pipe',
            });
        }
        return {
            passed: true,
            message: '✅ Java compilation successful',
        };
    }
    catch (error) {
        return {
            passed: false,
            message: `❌ Java compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
    }
}
//# sourceMappingURL=java-checker.js.map