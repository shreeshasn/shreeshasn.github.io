# Security Policy

## Supported Versions

Only the latest release of this portfolio is actively supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| v1.1.x  | :white_check_mark: |
| < v1.1  | :x:                |

## Reporting a Vulnerability

If you discover any security vulnerability in this project, please **do not open a public issue**. Instead, report it privately to the maintainer:

*   **Email:** shreeshasnekkar81@gmail.com
*   **Response Time:** You can expect a response within 48 hours.

---

## 🔒 Production Security Architecture

This portfolio is designed to be fully static in production, mitigating typical web application threat vectors:

### 1. Local Data Editor Isolation
The portfolio includes a local profile data editor (`editor.html`) and associated Vite middleware API endpoints (`/api/portfolio`). 
*   These features are strictly **development-only tools** designed to run on `localhost`.
*   The production build (`npm run build`) compiles only the static React bundle from `index.html`. It completely excludes `editor.html` from the generated `./dist` output folder.
*   The Vite API saving handlers run inside Vite's dev server (`configureServer`) middleware and do not exist in the production environment.
*   Because the production environment (GitHub Pages) is 100% static, it is impossible for external users to execute writes or modify profile data files.

### 2. Client-Side Sanitization
Ensure that any content pulled from `portfolio.json` that is rendered dynamically (e.g., custom HTML or Markdown elements) is properly handled to prevent Cross-Site Scripting (XSS) risks.
