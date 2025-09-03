# Contributing to minify-html-css

Thank you for your interest in contributing to **minify-html-css**! Your help is greatly appreciated. Please follow the guidelines below to help us keep the project healthy and consistent.

---

## Requirements

- The project uses [Bun](https://bun.sh/) for development, testing, and running scripts. Please ensure Bun is installed on your machine to work correctly.

---

## How to Contribute

1. **Fork the repository** and clone your fork locally.
2. **Create a new branch** for your feature or fix:

   ```bash
   git switch -c my-feature
   ```

3. **Make your changes** and **add tests** if possible.

4. **Run lint and tests** to verify your changes:

   ```bash
   bun run lint
   bun test
   ```

5. **Commit your changes** with a clear and descriptive message in [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) format:

   ```bash
   git commit -m "feat: add option to preserve whitespace in <pre> tags"
   ```

6. **Push your branch** to your fork:

   ```bash
   git push origin my-feature
   ```

7. **Submit a pull request** from your branch to the `main` branch of the original repository.

---

## Guidelines

- **Keep pull requests focused:** Each PR should address a single concern or feature.
- **Write clear commit messages:** Explain why the change is needed — use the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) format for commit messages. CI will not pass if the commit format is incorrect.
- **Add or update documentation:** If your change affects usage or APIs, update the appropriate documentation.
- **Add tests:** Cover new features or bug fixes with tests whenever possible. Each feature or bug fix should have corresponding tests for better maintainability.
- **Be respectful and constructive:** Treat others with courtesy and aim for positive, helpful collaboration in code reviews and discussions.

---

## Code of Conduct

Please be respectful and considerate of others. For more details, see the [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) if available.

---

Thank you for helping improve minify-html-css!
