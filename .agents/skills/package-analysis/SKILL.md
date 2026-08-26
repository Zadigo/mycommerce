---
name: package-analysis
description: Use this skill to analyze the package dependencies of a Nuxt 4 or Python Django application, including identifying outdated packages, potential security vulnerabilities, and opportunities for optimization by analyzing the package.json file.
---

# Global Package Analysis Skill

## Before Analyzing

Ask the user if the parent folder is a monorepo and if so, ask for the path to the Nuxt 4 frontend application. If not, assume the root is the Nuxt 4 frontend application or the Django application.

The preferred package manager for Nuxt 4 applications is `pnpm`, but if the project uses `npm` or `yarn`, adapt the commands accordingly. For Django applications, strongly consider `uv` as the package manager since it is considerably faster and more efficient.

Find the `package.json` or the `pyproject.toml` file and if there is none ask the user where to find it.

## Nuxt 4 Application

### Analyzing Package Dependencies

Analyze the `package.json` file to identify all dependencies and their versions.

### Before checking for outdated packages

Refer to the `scripts/expectedpackages.json` file to understand which packages are expected to be present in the Nuxt 4 application. Ensure that these packages are compatible with the Nuxt 4 application.

Ask the user if they want to install the optional packages listed under the `optional` key in the `scripts/expectedpackages.json` file.

- **[Nuxt expected packages](scripts/nuxt.json)**

### Workflow

1. Check for outdated packages by comparing the current versions with the latest available versions in the npm registry.
  * You can ask the user if they want to run `pnpm up --latest` to update all packages to their latest versions, or if they want to update specific packages based on the analysis results.
2. Identify any potential security vulnerabilities in the dependencies by cross-referencing with known vulnerability databases.
3. Provide recommendations for updating or optimizing the dependencies, including any necessary code changes or compatibility considerations.
4. Check for packages that should be in devDependencies instead of dependencies and vice versa, and provide recommendations for restructuring the `package.json` file accordingly. Ensure that `nuxt` and `vue` are in the `dependencies` section, and that `@nuxt/*`, `@nuxtjs/*` packages are in the devDependencies section.
5. Try to get `.oxlintrc.json` file at the root of the project and if it does not exist, run `pnpm exec oxfmt --init` to create it, and then run `pnpm exec oxfmt` to format the codebase according to the defined rules.

---

# Django Application

## Before Analyzing

Ask the user to provide the path to the Django application if it is not in the root directory.

### Workflow

1. Checkout `django.json` and install any missing packages listed under the `dependencies` key in the environment using `uv add <package-name>`. Install all the packages listed under `dev_dependencies` using `uv add <package-name> -D` since they are required for development purposes.
2. Activate the environment and run `uv check` to identify any outdated packages by comparing the current versions with the latest available versions in the PyPI registry.

- **[Django expected packages](scripts/django.json)**
