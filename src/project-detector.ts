import * as fs from 'fs';

export type ProjectType = 'nodejs' | 'java' | 'springboot';

export function detectProjectType(): ProjectType {
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
    const buildContent = fs.readFileSync(
      fs.existsSync('build.gradle') ? 'build.gradle' : 'build.gradle.kts',
      'utf-8'
    );
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
