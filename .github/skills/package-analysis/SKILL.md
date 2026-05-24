---
name: package-analysis
description: Use this skill to analyze the package dependencies of a Nuxt 4 frontend application, including identifying outdated packages, potential security vulnerabilities, and opportunities for optimization by analyzing the package.json file.
---

## Workflow
1. Ask the user if the parent folder is a monorepo and if so, ask for the path to the Nuxt 4 frontend application. If not, assume the root is the Nuxt 4 frontend application.
2. Analyze the `package.json` file of the Nuxt 4 application to identify all dependencies and their versions.
3. Check for outdated packages by comparing the current versions with the latest available versions in the npm registry.
4. Identify any potential security vulnerabilities in the dependencies by cross-referencing with known vulnerability databases.
5. Provide recommendations for updating or optimizing the dependencies, including any necessary code changes or compatibility considerations.
6. Check for packages that should be in devDependencies instead of dependencies and vice versa, and provide recommendations for restructuring the `package.json` file accordingly.
7. You can ask the user if they want to run `pnpm up --latest` to update all packages to their latest versions, or if they want to update specific packages based on the analysis results.
8. Ensure that the packages under the `required` key in `scripts/expectedpackages.json` are present in the `package.json` file and that they are compatible with the Nuxt 4 application. You can ask the user to run install the optional packages under the `optional` key.
9. Try to get `.oxlintrc.json` file at the root of the project and if it does not exist, run `pnpm exec oxfmt --init` to create it, and then run `pnpm exec oxfmt` to format the codebase according to the defined rules.
