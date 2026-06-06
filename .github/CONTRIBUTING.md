# Contributing to PromptForge

Thank you for your interest in contributing to PromptForge! We welcome code contributions, documentation, bug reports, and feature suggestions.

## 🚀 Local Onboarding Setup
1. **Fork the Repository:** Fork this repository on GitHub to your account.
2. **Clone Locally:** Clone your fork using your terminal:
   ```bash
   git clone https://github.com/YOUR-USERNAME/PromptForge.git
   cd PromptForge
   ```
3. **Environment Setup:** Make sure you have the appropriate dependencies installed (e.g. Node.js or Python). Install project-specific packages:
   * Node.js/Vite: `npm install`
   * Python: `pip install -r requirements.txt`

## 🧪 Testing Expectations
* Always run local tests before pushing your changes:
  * Running tests: `npm run test` or `python -m pytest` where applicable.
* Ensure code adheres to formatting rules. Running `npm run lint` or `black .` is highly encouraged.

## 🌿 Branching Strategy
* Always create a descriptive branch for your changes:
  * `feature/your-feature-name` for new features
  * `bugfix/your-fix-name` for bug fixes
* Submit your Pull Request targeting the `main` or `master` branch.

## ✍️ Semantic Commit Message Rules
We follow semantic commit messages to keep our history clean and clear:
* `feat`: A new feature
* `fix`: A bug fix
* `chore`: Maintenance, updates, configurations
* `docs`: Documentation changes
* `refactor`: Code restructuring without function change
* `test`: Adding or correcting tests

Example: `feat: add input sanitization for form variables`