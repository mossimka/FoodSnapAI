# 🍳 Contributing to FoodSnapAI

First of all, thank you for being interested in contributing to **FoodSnapAI**! 
Whether you are fixing a bug, adding a new AI recipe agent, or improving the UI, your help is what makes this project better.

Before you start, please make sure you've read our Code of Conduct.

---

# 🛠️ How Can I Contribute?

**🐛 Reporting Bugs**

If you find a bug, please open an Issue and include:

A clear, descriptive title.

Steps to reproduce the problem.

What you expected to happen vs. what actually happened.

Screenshots if the issue is visual/frontend-related.

**✨ Suggesting Enhancements**

We love new ideas! If you have a suggestion for the Multi-Agent system or a UI improvement:

Open an Issue with the tag enhancement.

Explain the "why" behind the feature and how it benefits the users.

**📝 Improving Documentation**

Found a mistake in the README or this file? Feel free to submit a Pull Request!

---

# 🚀 Development Workflow

**Here is how we handle the code flow:**

Fork the repository and create your branch from main.

Branch Naming: Use descriptive prefixes:

feat/ for new features (e.g., feat/add-vegan-agent)

fix/ for bug fixes (e.g., fix/upload-button-mobile)

docs/ for documentation changes.

Commit Messages: Keep them short and imperative (e.g., Add Lucide icon for dietary restrictions).

Push to your fork and submit a Pull Request.

---

# 🎨 Our Standards

To keep the codebase clean and maintainable, please follow these guidelines:

**Frontend (Next.js / TypeScript)**

Type Everything: Avoid using any. Use TypeScript interfaces for props and API responses.

Component Structure: Keep components modular and reusable within the frontend/components directory.

Styling: Use CSS Modules. Avoid inline styles unless absolutely necessary for dynamic animations.

**Backend (FastAPI / Python)**

PEP 8: Follow standard Python styling.

Type Hints: Use Python type hinting for all function signatures and FastAPI dependencies.

Agent Logic: If adding to the Gemini Multi-Agent System, ensure your logic is isolated within the back/src logic to avoid side effects.

---

# ✅ Pull Request Checklist

**Before submitting your PR, please double-check:**

[ ] Does the code follow the style guidelines above?

[ ] Have you tested your changes locally?

[ ] Did you update the documentation if you added a new feature?

[ ] Are your commit messages clear?

Happy coding!
