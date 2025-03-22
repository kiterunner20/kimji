#!/usr/bin/env node

/**
 * PR Description Generator
 * 
 * This script automatically generates a PR description based on commits
 * between the current branch and a target branch (default: main).
 * 
 * Usage:
 *   node scripts/generate-pr-description.js [base-branch]
 * 
 * Example:
 *   node scripts/generate-pr-description.js main
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Configuration
const DEFAULT_BASE_BRANCH = 'main';
const CATEGORIES = {
  feat: '🚀 Features',
  fix: '🐛 Bug Fixes',
  docs: '📝 Documentation',
  style: '💅 Styling',
  refactor: '♻️ Refactoring',
  perf: '⚡ Performance',
  test: '✅ Testing',
  build: '👷 Build System',
  ci: '🔄 CI/CD',
  chore: '🧹 Chores',
  revert: '⏪ Reverts'
};

// Get the target branch from command line argument or use default
const baseBranch = process.argv[2] || DEFAULT_BASE_BRANCH;

// Determine current branch - handling GitHub Actions environment
let currentBranch;
if (process.env.GITHUB_HEAD_REF) {
  // We're in a GitHub Action
  currentBranch = process.env.GITHUB_HEAD_REF;
} else {
  // Local environment
  currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
}

// Exit if we're on the base branch (not applicable in GitHub Actions environment)
if (currentBranch === baseBranch && !process.env.GITHUB_ACTIONS) {
  console.error(`Error: You are currently on the ${baseBranch} branch. Switch to a feature branch to generate a PR description.`);
  process.exit(1);
}

try {
  // Get the list of commits between current branch and target branch
  const commitsCmd = `git log ${baseBranch}..${currentBranch} --pretty=format:"%h|%s|%an" --no-merges`;
  
  // In GitHub Actions, we need to ensure we have the target branch
  if (process.env.GITHUB_ACTIONS) {
    try {
      execSync(`git fetch origin ${baseBranch}:${baseBranch}`);
    } catch (error) {
      console.log(`Note: ${baseBranch} branch might already exist locally`);
    }
  }
  
  const commits = execSync(commitsCmd)
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean) // Filter out empty lines
    .map(commit => {
      const [hash, message, author] = commit.split('|');
      return { hash, message, author };
    });

  if (!commits.length) {
    console.error(`No commits found between ${baseBranch} and ${currentBranch}`);
    process.exit(1);
  }

  // Parse commits into categories
  const categorizedCommits = {};
  const uncategorized = [];

  commits.forEach(commit => {
    let categorized = false;
    
    // Check for conventional commit format (type: message)
    const match = commit.message.match(/^(\w+)(?:\(.*?\))?:\s(.+)$/);
    
    if (match) {
      const [, type, message] = match;
      const category = CATEGORIES[type] || CATEGORIES.chore;
      
      if (!categorizedCommits[category]) {
        categorizedCommits[category] = [];
      }
      
      categorizedCommits[category].push({
        message: message.trim(),
        hash: commit.hash,
        author: commit.author
      });
      
      categorized = true;
    }
    
    if (!categorized) {
      uncategorized.push(commit);
    }
  });

  // Add uncategorized commits to "Other Changes"
  if (uncategorized.length) {
    categorizedCommits['🔄 Other Changes'] = uncategorized.map(commit => ({
      message: commit.message,
      hash: commit.hash,
      author: commit.author
    }));
  }

  // Generate PR title based on branch name
  const branchName = currentBranch.replace(/-/g, ' ').replace(/_/g, ' ');
  const suggestedTitle = branchName
    .split('/')
    .pop()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Generate PR description
  let description = `# ${suggestedTitle}\n\n`;
  
  // Add branch information
  description += `## Branch Information\n`;
  description += `- From branch: \`${currentBranch}\`\n`;
  description += `- Into branch: \`${baseBranch}\`\n\n`;
  
  // Add summary of changes
  description += `## Changes\n\n`;
  
  Object.keys(categorizedCommits).forEach(category => {
    const commits = categorizedCommits[category];
    description += `### ${category}\n\n`;
    
    commits.forEach(commit => {
      description += `- ${commit.message} ([${commit.hash.substring(0, 7)}](${getCommitUrl(commit.hash)}))\n`;
    });
    
    description += '\n';
  });
  
  // Add testing instructions
  description += `## Testing Instructions\n\n`;
  description += `- [ ] Code reviews completed\n`;
  description += `- [ ] All tests pass\n`;
  description += `- [ ] Manual testing completed\n\n`;
  
  // Add additional sections that might be filled in manually
  description += `## Screenshots / Videos\n\n`;
  description += `<!-- Add any relevant screenshots or videos here -->\n\n`;
  
  description += `## Additional Notes\n\n`;
  description += `<!-- Add any additional information that reviewers should know -->\n`;
  
  // Output the description
  console.log(description);
  
  // Save to file
  const outputFile = 'PR_DESCRIPTION.md';
  fs.writeFileSync(outputFile, description);
  console.log(`\nPR description saved to ${outputFile}`);

} catch (error) {
  console.error(`Error generating PR description: ${error.message}`);
  process.exit(1);
}

/**
 * Helper function to get the commit URL (assumes GitHub)
 */
function getCommitUrl(hash) {
  try {
    // Try to get remote URL to determine if GitHub/GitLab/etc
    const remoteUrl = execSync('git remote get-url origin')
      .toString()
      .trim()
      .replace(/\.git$/, '');
    
    if (remoteUrl.includes('github.com')) {
      return `${remoteUrl}/commit/${hash}`;
    } else if (remoteUrl.includes('gitlab.com')) {
      return `${remoteUrl}/-/commit/${hash}`;
    } else {
      // Generic fallback
      return `${remoteUrl}/commit/${hash}`;
    }
  } catch (error) {
    // If we can't determine the remote URL, just return the hash
    return `#${hash}`;
  }
}