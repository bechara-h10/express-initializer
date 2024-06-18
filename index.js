#!/usr/bin/env node

import inquirer from "inquirer";
import path, { dirname } from "path";
import fs from "fs-extra";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function constructTemplateDir(language, moduleType) {
  const _moduleType =
    language.toLowerCase() === "typescript"
      ? "commonjs"
      : moduleType.toLowerCase();
  return path.join(
    __dirname, // Assuming templates folder is in the same directory as this script
    "templates",
    `${language.toLowerCase()}-${_moduleType}`
  );
}

async function createProject(projectName, templateDir) {
  const newProjectDir = path.join(process.cwd(), projectName);

  try {
    // Check if templateDir exists
    const templateExists = await fs.pathExists(templateDir);
    if (!templateExists) {
      throw new Error(`Template directory not found: ${templateDir}`);
    }

    // Read package.json from templateDir
    const packageJson = await fs.readJson(
      path.join(templateDir, "package.json")
    );
    packageJson.name = projectName;

    // Copy templateDir to newProjectDir
    await fs.copy(templateDir, newProjectDir);

    // Write modified package.json to new project directory
    await fs.writeJson(path.join(newProjectDir, "package.json"), packageJson);

    console.log(chalk.green("Project Initialized Successfully"));
    console.log(chalk.bold("Run the following commands to get started:"));
    console.log(chalk.cyan(`cd ${projectName}`));
    console.log(chalk.cyan("npm install"));
    console.log(chalk.bold("To start the project:"));
    console.log(chalk.cyan("npm run serve"));
    console.log(chalk.yellow("Happy Coding! 🚀"));
  } catch (err) {
    throw new Error(`Error creating project: ${err.message}`);
  }
}

async function main() {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "What is the name of your project?",
        default: "my-app",
      },
      {
        type: "list",
        name: "language",
        message: "Which language do you want to use?",
        choices: ["JavaScript", "TypeScript"],
        default: "JavaScript",
      },
      {
        type: "list",
        name: "moduleType",
        message: "Which module type do you want to use?",
        choices: ["CommonJs", "ESM"],
        default: "CommonJs",
        when: (ans) => ans.language.toLowerCase() === "javascript",
      },
    ]);

    const templateDir = constructTemplateDir(
      answers.language,
      answers.moduleType
    );

    await createProject(answers.projectName, templateDir);
  } catch (err) {
    console.error(chalk.red(err.message));
    process.exit(1);
  }
}

main();
