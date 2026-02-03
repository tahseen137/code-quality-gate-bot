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
exports.detectProjectType = detectProjectType;
const fs = __importStar(require("fs"));
function detectProjectType() {
    // Check for Spring Boot (pom.xml with spring-boot-starter)
    if (fs.existsSync('pom.xml')) {
        const pomContent = fs.readFileSync('pom.xml', 'utf-8');
        if (pomContent.includes('spring-boot-starter')) {
            return 'springboot';
        }
        return 'java';
    }
    // Check for Gradle (build.gradle or build.gradle.kts)
    if (fs.existsSync('build.gradle') || fs.existsSync('build.gradle.kts')) {
        const buildContent = fs.readFileSync(fs.existsSync('build.gradle') ? 'build.gradle' : 'build.gradle.kts', 'utf-8');
        if (buildContent.includes('spring-boot')) {
            return 'springboot';
        }
        return 'java';
    }
    // Check for Node.js
    if (fs.existsSync('package.json')) {
        return 'nodejs';
    }
    // Default to Node.js
    return 'nodejs';
}
//# sourceMappingURL=project-detector.js.map