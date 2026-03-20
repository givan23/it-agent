import { execSync } from 'child_process';
import { logInfo } from './logger';

function execCommand(
  command: string,
  cwd: string,
  options?: { stdio?: 'inherit' | 'pipe' }
): string {
  const stdio = options?.stdio ?? 'pipe';

  logInfo(`CMD: ${command}`);

  const output = execSync(command, {
    cwd,
    stdio: stdio === 'inherit' ? 'inherit' : 'pipe',
    encoding: 'utf-8'
  });

  return output ?? '';
}

export function gitFetchAll(cwd: string): void {
  execCommand('git fetch --all --prune', cwd, { stdio: 'inherit' });
}

export function gitCheckoutMain(cwd: string): void {
  execCommand('git checkout main', cwd, { stdio: 'inherit' });
}

export function gitPullMain(cwd: string): void {
  execCommand('git pull origin main', cwd, { stdio: 'inherit' });
}

export function localBranchExists(branchName: string, cwd: string): boolean {
  try {
    execCommand(`git show-ref --verify --quiet refs/heads/${branchName}`, cwd);
    return true;
  } catch {
    return false;
  }
}

export function remoteBranchExists(branchName: string, cwd: string): boolean {
  try {
    const output = execCommand(`git ls-remote --heads origin ${branchName}`, cwd);
    return output.trim().length > 0;
  } catch {
    return false;
  }
}

export function createBranch(branchName: string, cwd: string): void {
  execCommand(`git checkout -b "${branchName}"`, cwd, { stdio: 'inherit' });
}

export function runLintFix(cwd: string): void {
  execCommand('npm run lint:fix', cwd, { stdio: 'inherit' });
}

export function runFormat(cwd: string): void {
  execCommand('npm run format', cwd, { stdio: 'inherit' });
}

export function runTests(cwd: string): void {
  execCommand('npm run test -- --watchAll=false', cwd, { stdio: 'inherit' });
}

export function gitAddAll(cwd: string): void {
  execCommand('git add .', cwd, { stdio: 'inherit' });
}

export function gitCommit(commitMessage: string, cwd: string): void {
  execCommand(`git commit -m "${commitMessage}"`, cwd, { stdio: 'inherit' });
}

export function gitPush(branchName: string, cwd: string): void {
  execCommand(`git push -u origin "${branchName}"`, cwd, { stdio: 'inherit' });
}
