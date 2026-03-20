import * as fs from 'fs';
import * as path from 'path';
import { AgentActivity, AgentTask, ActivityType } from './types';
import { normalizeBranchName, toBoolean } from './utils';

function extractSection(content: string, sectionTitle: string): string {
  const regex = new RegExp(`## ${sectionTitle}\\s*([\\s\\S]*?)(?=\\n## |$)`, 'i');
  const match = content.match(regex);

  if (!match || !match[1]) {
    throw new Error(`Section "${sectionTitle}" non trovata nel task.md`);
  }

  return match[1].trim();
}

function isSupportedActivityType(type: string): type is ActivityType {
  return (
    type === 'append_to_file' ||
    type === 'replace_entire_file' ||
    type === 'insert_after_marker' ||
    type === 'insert_before_marker' ||
    type === 'ensure_text_exists'
  );
}

function isMarkerBasedActivity(type: ActivityType): boolean {
  return type === 'insert_after_marker' || type === 'insert_before_marker';
}

function parseActivityBlock(block: string, index: number): AgentActivity {
  const typeMatch = block.match(/Type:\s*(.+)/i);
  const targetMatch = block.match(/Target:\s*(.+)/i);
  const markerMatch = block.match(/Marker:\s*(.+)/i);
  const contentMatch = block.match(/Content:\s*([\s\S]*)/i);

  if (!typeMatch?.[1]) {
    throw new Error(`Activity ${index}: Type mancante`);
  }

  if (!targetMatch?.[1]) {
    throw new Error(`Activity ${index}: Target mancante`);
  }

  if (!contentMatch?.[1]) {
    throw new Error(`Activity ${index}: Content mancante`);
  }

  const rawType = typeMatch[1].trim();

  if (!isSupportedActivityType(rawType)) {
    throw new Error(
      `Activity ${index}: Type non supportato "${rawType}". Valori ammessi: append_to_file, replace_entire_file, insert_after_marker, insert_before_marker, ensure_text_exists`
    );
  }

  const target = path.normalize(targetMatch[1].trim());
  const marker = markerMatch?.[1]?.trim();
  const content = contentMatch[1].trim();

  if (isMarkerBasedActivity(rawType) && !marker) {
    throw new Error(`Activity ${index}: Marker mancante`);
  }

  return {
    index,
    type: rawType,
    target,
    content,
    marker
  };
}

function parseActivities(sectionContent: string): AgentActivity[] {
  const blocks = sectionContent
    .split(/\n(?=\d+\.)/g)
    .map((item) => item.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    throw new Error('Nessuna activity trovata nella sezione Activities');
  }

  return blocks.map((block, idx) => parseActivityBlock(block, idx + 1));
}

export function parseTaskFile(taskFilePath: string): AgentTask {
  const absoluteTaskPath = path.resolve(taskFilePath);

  if (!fs.existsSync(absoluteTaskPath)) {
    throw new Error(`Task file non trovato: ${absoluteTaskPath}`);
  }

  const content = fs.readFileSync(absoluteTaskPath, 'utf-8');

  const dryRunRaw = extractSection(content, 'Dry Run');
  const gitRepoPath = path.normalize(extractSection(content, 'Git repo path'));
  const npmProjectPath = path.normalize(extractSection(content, 'Npm project path'));
  const rawBranchName = extractSection(content, 'Branch name');
  const commitMessage = extractSection(content, 'Commit message');
  const activitiesRaw = extractSection(content, 'Activities');

  return {
    dryRun: toBoolean(dryRunRaw),
    gitRepoPath,
    npmProjectPath,
    branchName: normalizeBranchName(rawBranchName),
    commitMessage: commitMessage.trim(),
    activities: parseActivities(activitiesRaw)
  };
}
