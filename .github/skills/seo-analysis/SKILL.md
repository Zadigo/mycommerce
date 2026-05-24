---
name: seo-analysis
description: Use this skill to analyze the SEO of a Nuxt 4 frontend application, including meta tags, structured data, and performance optimizations by anlyzing the script portion of the Vue files located in pages.
---

## Workflow
1. Ask the user if the parent folder is a monorepo and if so, ask for the path to the Nuxt 4 frontend application. If not, assume the root is the Nuxt 4 frontend application.
2. Ask the user for the specific SEO aspect they want to analyze (e.g., meta tags, structured data, performance optimizations).
3. Based on the user's input, analyze the relevant Vue files in the `pages/` directory of the Nuxt 4 application, focusing on the script portion to identify any SEO-related issues or improvements.
