#!/usr/bin/env node

/**
 * Build Agent Skills Repository Script
 * Collects all agent skills from config/.claude/skills/ and outputs them
 * to .skill-repo-output/skills/ for publishing to a separate repository.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Color definitions
const colors = {
  RED: "\x1b[0;31m",
  GREEN: "\x1b[0;32m",
  YELLOW: "\x1b[1;33m",
  BLUE: "\x1b[0;34m",
  NC: "\x1b[0m", // No Color
};

// Configuration
const SKILLS_SOURCE_DIR = "config/.claude/skills";
const OUTPUT_DIR = ".skills-repo-output";
const SKILLS_OUTPUT_DIR = path.join(OUTPUT_DIR, "skills");
const README_TEMPLATE_PATH = path.join(
  __dirname,
  "skills-repo-template",
  "readme-template.md",
);
const ADDITIONAL_SKILLS_DIR = path.join(
  __dirname,
  "skills-repo-template",
  "cloudbase-guidelines",
);

/**
 * Parse SKILL.md frontmatter
 * @param {string} skillPath - Path to skill directory
 * @returns {{name: string, description: string}|null} Skill metadata
 */
function parseSkillMetadata(skillPath) {
  const skillFile = path.join(skillPath, "SKILL.md");
  if (!fs.existsSync(skillFile)) {
    return null;
  }

  try {
    const content = fs.readFileSync(skillFile, "utf8");
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return null;
    }

    const frontmatter = frontmatterMatch[1];
    const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
    const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

    return {
      name: nameMatch ? nameMatch[1].trim() : null,
      description: descMatch ? descMatch[1].trim() : null,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Generate README.md content from template
 * @param {Array} skills - Array of skill information
 * @returns {string} README content
 */
function generateREADME(skills) {
  // Read template file
  if (!fs.existsSync(README_TEMPLATE_PATH)) {
    console.log(
      `${colors.RED}❌ 错误: README 模板文件不存在: ${README_TEMPLATE_PATH}${colors.NC}`,
    );
    throw new Error(`README template not found: ${README_TEMPLATE_PATH}`);
  }

  const template = fs.readFileSync(README_TEMPLATE_PATH, "utf8");

  // Generate skills list
  const skillsList = skills
    .map((skill) => {
      const metadata = skill.metadata;
      const name = metadata?.name || skill.name;
      const description = metadata?.description || "No description available";
      return `- **${skill.name}** (${name})\n  ${description}`;
    })
    .join("\n\n");

  // Replace placeholders
  const timestamp = new Date().toISOString().split("T")[0];
  const content = template
    .replace(/\{\{LAST_UPDATED\}\}/g, timestamp)
    .replace(/\{\{SKILLS_COUNT\}\}/g, skills.length.toString())
    .replace(/\{\{SKILLS_LIST\}\}/g, skillsList);

  return content;
}

/**
 * Copy directory recursively
 * @param {string} srcDir - Source directory
 * @param {string} destDir - Destination directory
 * @returns {{files: number, errors: number}} Copy statistics
 */
function copyDirectoryRecursive(srcDir, destDir) {
  let filesCount = 0;
  let errorsCount = 0;

  function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) {
      return;
    }

    // Ensure destination directory exists
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else if (entry.isFile()) {
        try {
          // Remove existing file if it exists
          if (fs.existsSync(destPath)) {
            fs.unlinkSync(destPath);
          }
          // Copy file
          fs.copyFileSync(srcPath, destPath);
          filesCount++;
        } catch (error) {
          console.log(
            `   ${colors.RED}❌ 无法复制文件: ${entry.name} - ${error.message}${colors.NC}`,
          );
          errorsCount++;
        }
      }
    }
  }

  copyRecursive(srcDir, destDir);

  return { files: filesCount, errors: errorsCount };
}

/**
 * Build skills repository
 */
async function buildSkillsRepo() {
  console.log(
    `${colors.BLUE}🔧 CloudBase AI Agent Skills Repository Builder${colors.NC}`,
  );
  console.log("==================================================");

  const sourcePath = path.join(projectRoot, SKILLS_SOURCE_DIR);
  const outputPath = path.join(projectRoot, OUTPUT_DIR);
  const skillsOutputPath = path.join(projectRoot, SKILLS_OUTPUT_DIR);

  // Check if source directory exists
  if (!fs.existsSync(sourcePath)) {
    console.log(
      `${colors.RED}❌ 错误: 源目录 ${SKILLS_SOURCE_DIR} 不存在${colors.NC}`,
    );
    process.exit(1);
  }

  console.log(`${colors.GREEN}✅ 源目录存在: ${SKILLS_SOURCE_DIR}${colors.NC}`);

  // Clean output directory if it exists
  if (fs.existsSync(outputPath)) {
    console.log(`${colors.YELLOW}🧹 清理输出目录: ${OUTPUT_DIR}${colors.NC}`);
    fs.rmSync(outputPath, { recursive: true, force: true });
  }

  // Create output directory
  console.log(`${colors.BLUE}📁 创建输出目录: ${OUTPUT_DIR}${colors.NC}`);
  fs.mkdirSync(outputPath, { recursive: true });

  // Get all skill directories
  console.log(
    `${colors.YELLOW}🔍 扫描技能目录: ${SKILLS_SOURCE_DIR}${colors.NC}`,
  );

  const skillDirs = fs
    .readdirSync(sourcePath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  console.log(
    `${colors.BLUE}📋 找到 ${skillDirs.length} 个技能目录${colors.NC}`,
  );

  let totalFiles = 0;
  let totalErrors = 0;
  const processedSkills = [];

  // Process each skill directory
  for (let i = 0; i < skillDirs.length; i++) {
    const skillDir = skillDirs[i];
    console.log(
      `\n[${i + 1}/${skillDirs.length}] ${colors.BLUE}处理技能: ${skillDir}${colors.NC}`,
    );

    const skillSourcePath = path.join(sourcePath, skillDir);
    const skillOutputPath = path.join(skillsOutputPath, skillDir);

    // Parse skill metadata
    const metadata = parseSkillMetadata(skillSourcePath);

    const stats = copyDirectoryRecursive(skillSourcePath, skillOutputPath);

    totalFiles += stats.files;
    totalErrors += stats.errors;

    if (stats.errors === 0) {
      console.log(
        `   ${colors.GREEN}✅ 成功复制 ${stats.files} 个文件${colors.NC}`,
      );
      processedSkills.push({
        name: skillDir,
        files: stats.files,
        metadata: metadata,
      });
    } else {
      console.log(
        `   ${colors.YELLOW}⚠️  复制了 ${stats.files} 个文件，${stats.errors} 个错误${colors.NC}`,
      );
      processedSkills.push({
        name: skillDir,
        files: stats.files,
        metadata: metadata,
      });
    }
  }

  // Process additional skills from template directory
  if (fs.existsSync(ADDITIONAL_SKILLS_DIR)) {
    console.log(
      `\n${colors.BLUE}📦 处理额外技能: cloudbase-guidelines${colors.NC}`,
    );

    const skillDir = "cloudbase-guidelines";
    const skillSourcePath = ADDITIONAL_SKILLS_DIR;
    const skillOutputPath = path.join(skillsOutputPath, skillDir);

    // Parse skill metadata
    const metadata = parseSkillMetadata(skillSourcePath);

    const stats = copyDirectoryRecursive(skillSourcePath, skillOutputPath);

    totalFiles += stats.files;
    totalErrors += stats.errors;

    if (stats.errors === 0) {
      console.log(
        `   ${colors.GREEN}✅ 成功复制 ${stats.files} 个文件${colors.NC}`,
      );
      processedSkills.push({
        name: skillDir,
        files: stats.files,
        metadata: metadata,
      });
    } else {
      console.log(
        `   ${colors.YELLOW}⚠️  复制了 ${stats.files} 个文件，${stats.errors} 个错误${colors.NC}`,
      );
      processedSkills.push({
        name: skillDir,
        files: stats.files,
        metadata: metadata,
      });
    }
  }

  // Print summary
  console.log(`\n${colors.BLUE}📊 构建完成统计:${colors.NC}`);
  console.log(
    `${colors.GREEN}✅ 成功处理: ${processedSkills.length} 个技能${colors.NC}`,
  );
  console.log(`${colors.GREEN}✅ 总共复制: ${totalFiles} 个文件${colors.NC}`);
  if (totalErrors > 0) {
    console.log(`${colors.RED}❌ 复制失败: ${totalErrors} 个文件${colors.NC}`);
  }

  console.log(`\n${colors.BLUE}📋 处理的技能列表:${colors.NC}`);
  for (const skill of processedSkills) {
    console.log(
      `   ${colors.GREEN}✓${colors.NC} ${skill.name} (${skill.files} 个文件)`,
    );
  }

  // Generate README.md
  console.log(`\n${colors.BLUE}📝 生成 README.md...${colors.NC}`);
  const readmePath = path.join(outputPath, "README.md");
  const readmeContent = generateREADME(processedSkills);
  fs.writeFileSync(readmePath, readmeContent, "utf8");
  console.log(
    `${colors.GREEN}✅ README.md 已生成到: ${OUTPUT_DIR}/README.md${colors.NC}`,
  );

  console.log(
    `\n${colors.GREEN}✨ 技能仓库构建完成！输出目录: ${OUTPUT_DIR}${colors.NC}`,
  );
}

/**
 * Main function
 */
async function main() {
  try {
    await buildSkillsRepo();
  } catch (error) {
    console.error(
      `\n${colors.RED}❌ 脚本执行失败: ${error.message}${colors.NC}`,
    );
    console.error(error.stack);
    process.exit(1);
  }
}

// Run main function
main().catch(console.error);
