import * as fs from 'fs';
import * as path from 'path';
import { AgentActivity } from './types';
import { logInfo } from './logger';

function ensureFileExists(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File non trovato: ${filePath}`);
  }
}

function readFile(target: string): string {
  ensureFileExists(target);
  return fs.readFileSync(target, 'utf-8');
}

function writeFile(target: string, content: string): void {
  fs.writeFileSync(target, `${content.trimEnd()}\n`, 'utf-8');
}

function appendToFile(target: string, content: string): void {
  const currentContent = readFile(target);

  if (currentContent.includes(content)) {
    logInfo(`Contenuto già presente, skip: ${target}`);
    return;
  }

  const updatedContent = `${currentContent.trimEnd()}\n${content}\n`;
  writeFile(target, updatedContent);
}

function replaceEntireFile(target: string, content: string): void {
  const parentDir = path.dirname(target);

  if (!fs.existsSync(parentDir)) {
    throw new Error(`Cartella padre non trovata per il file: ${target}`);
  }

  writeFile(target, content);
}

function ensureTextExists(target: string, content: string): void {
  const currentContent = readFile(target);

  if (currentContent.includes(content)) {
    logInfo(`Testo già presente, skip: ${target}`);
    return;
  }

  const updatedContent = `${currentContent.trimEnd()}\n${content}\n`;
  writeFile(target, updatedContent);
}

function insertAfterMarker(target: string, marker: string, content: string): void {
  const currentContent = readFile(target);

  if (currentContent.includes(content)) {
    logInfo(`Contenuto già presente, skip: ${target}`);
    return;
  }

  const markerIndex = currentContent.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error(`Marker non trovato nel file: ${target}`);
  }

  const insertPosition = markerIndex + marker.length;
  const updatedContent =
    currentContent.slice(0, insertPosition) + `\n${content}` + currentContent.slice(insertPosition);

  writeFile(target, updatedContent);
}

function insertBeforeMarker(target: string, marker: string, content: string): void {
  const currentContent = readFile(target);

  if (currentContent.includes(content)) {
    logInfo(`Contenuto già presente, skip: ${target}`);
    return;
  }

  const markerIndex = currentContent.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error(`Marker non trovato nel file: ${target}`);
  }

  const updatedContent =
    currentContent.slice(0, markerIndex) + `${content}\n` + currentContent.slice(markerIndex);

  writeFile(target, updatedContent);
}

export function applyActivity(activity: AgentActivity): void {
  switch (activity.type) {
    case 'append_to_file':
      appendToFile(activity.target, activity.content);
      return;
    case 'replace_entire_file':
      replaceEntireFile(activity.target, activity.content);
      return;
    case 'ensure_text_exists':
      ensureTextExists(activity.target, activity.content);
      return;
    case 'insert_after_marker':
      if (!activity.marker) {
        throw new Error(`Activity ${activity.index}: Marker mancante`);
      }

      insertAfterMarker(activity.target, activity.marker, activity.content);
      return;
    case 'insert_before_marker':
      if (!activity.marker) {
        throw new Error(`Activity ${activity.index}: Marker mancante`);
      }

      insertBeforeMarker(activity.target, activity.marker, activity.content);
      return;
    default:
      throw new Error(`Tipo attività non supportato: ${activity.type satisfies never}`);
  }
}
