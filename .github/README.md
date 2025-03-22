# GitHub Workflows

This directory contains GitHub Actions workflows for automating various tasks in the project.

## Auto-generate PR Description

The `auto-pr-description.yml` workflow automatically generates and updates PR descriptions when a pull request is opened or updated against the `main` branch.

### How It Works

1. When a PR is created or updated against `main`, the workflow runs
2. It checks if the PR description is empty or contains only the template
3. If so, it runs the PR description generator script
4. The generated description is then automatically applied to the PR

### Benefits

- Saves time by automating PR description creation
- Ensures consistent PR descriptions across the project
- Categorizes changes based on conventional commit types
- Includes relevant links and information

### Requirements

The workflow requires:
- Node.js environment (set up automatically)
- Access to Git history (fetch-depth is set to 0)
- `GITHUB_TOKEN` for updating the PR (provided automatically by GitHub)

### Customization

To customize this workflow:

1. Edit `.github/workflows/auto-pr-description.yml`
2. Modify the `generate-pr-description.js` script in the `scripts` directory

For example, you can:
- Change the trigger conditions (e.g., different target branches)
- Customize the PR description format
- Add additional validation or requirements 