# Utility Scripts

This directory contains various utility scripts for the project.

## PR Description Generator

The PR description generator automatically creates formatted PR descriptions based on the commits between your current branch and a target branch (default: `main`).

### Features

- Automatically categorizes commits based on conventional commit types (feat, fix, docs, etc.)
- Generates a well-structured Markdown PR description
- Includes links to commits
- Creates a suggested PR title based on the branch name
- Saves the PR description to a file for easy copying

### Usage

You can run the script in two ways:

#### 1. Using the npm script:

```bash
npm run pr-description [base-branch]
```

#### 2. Running the script directly:

```bash
node scripts/generate-pr-description.js [base-branch]
```

If no base branch is specified, the script will use `main` as the default.

### Output

The script will:

1. Print the PR description to the console
2. Save the PR description to `PR_DESCRIPTION.md` in the project root

### Commit Format

For best results, use [Conventional Commits](https://www.conventionalcommits.org/) format for your commit messages:

```
<type>[optional scope]: <description>
```

Where `type` is one of:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring without changes to functionality
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `build`: Changes to build process or tools
- `ci`: Changes to CI configuration or scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

Commits that don't follow this format will be grouped under "Other Changes". 