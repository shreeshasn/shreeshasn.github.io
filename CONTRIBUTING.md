# Contributing Guidelines

Thank you for your interest in contributing to the Brutalist / TUI Portfolio! We welcome community contributions to help improve the codebase, fix bugs, optimize performance, and introduce new interactive features.

---

## 🚫 CRITICAL RULE: No Portfolio Data Modifications

This project is a personal portfolio. As such, the profile data stored in `src/data/portfolio.json` represents the author's personal identity, achievements, experiences, and qualifications.

*   **Prohibited Changes:** **Any Pull Request that modifies `src/data/portfolio.json` or attempts to change the personal data to another individual's information will be immediately rejected and closed.**
*   **Allowed Changes:** Contributions should focus strictly on the **UI components**, **3D visuals**, **simulations**, **styling engine**, **accessibility**, **performance optimization**, or **new feature additions**.
*   **Local Editing:** If you want to use this codebase for your own portfolio, please **fork the repository** and edit the data locally on your own fork.

---

## ✦ What We Accept
We welcome contributions in the following areas:
*   **Visual Enhancements:** Brutalist design adjustments, micro-animations, or transition improvements.
*   **Performance Tuning:** Optimizing D3.js simulations, React 19 re-renders, Three.js shaders, or audio loader memory footprints.
*   **Feature Requests:** New commands for CLI Mode, interactive gadgets, or Easter eggs.
*   **Bug Fixes & Security:** Standard patches for layout issues, browser compatibility, or dependency updates.

---

## 🛠️ Local Development Setup

To test your changes locally:

1.  **Fork and Clone:** Clone your fork to your local machine.
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Access the dev build at `http://localhost:5173`.
4.  **Local Profile Editor:** You can test UI adjustments using the local editor at `http://localhost:5173/editor.html`. Remember, do not commit any changes made to `src/data/portfolio.json` to the main repository!

---

## 📜 Development Guidelines

### Aesthetic Guidelines
*   **Monospaced Only:** All text and labels must use `JetBrains Mono` (or the generic system monospaced stack). Sans-serif and serif fonts are disallowed.
*   **Keep Edges Sharp:** Use `0px` border radius for layouts. Subtle interactive elements (buttons, inputs) can use `4px` (`--rounded-sm`).
*   **Audio cues:** Connect any new significant user interaction to the synthesizer in `src/utils/audio.ts` using `SoundManager`.

### Code Quality
*   **Strict Types:** Maintain complete TypeScript type safety. Do not use `any`.
*   **Code Style:** Run the linter to verify formatting and alignment before submitting your changes:
    ```bash
    npm run lint
    ```
*   **Build Verification:** Ensure the production bundle compiles successfully with your changes:
    ```bash
    npm run build
    ```
