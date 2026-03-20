import * as fs from 'fs';
import * as path from 'path';

export function ensurePathExists(targetPath: string, label: string): void {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`${label} non trovato: ${targetPath}`);
  }
}

export function ensureGitRepo(projectPath: string): void {
  const gitPath = path.join(projectPath, '.git');
  ensurePathExists(gitPath, 'Cartella .git');
}

export function normalizeBranchName(rawBranchName: string): string {
  const trimmed = rawBranchName.trim();

  const parts = trimmed.split('/');
  if (parts.length === 2) {
    const prefix = parts[0].toLowerCase();
    const rest = parts[1]
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return `${prefix}/${rest}`;
  }

  return trimmed
    .toLowerCase()
    .replace(/[^a-z0-9/\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function toBoolean(value: string): boolean {
  return value.trim().toLowerCase() === 'true';
}
