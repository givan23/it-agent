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

function normalizeLineEndings(value: string): string {
    return value.replace(/\r\n/g, '\n');
}

function restoreOriginalLineEndings(content: string, originalContent: string): string {
    return originalContent.includes('\r\n')
        ? content.replace(/\n/g, '\r\n')
        : content;
}

function appendToFile(target: string, content: string): void {
    const currentContent = readFile(target);
    const normalizedCurrentContent = normalizeLineEndings(currentContent);
    const normalizedContent = normalizeLineEndings(content);

    if (normalizedCurrentContent.includes(normalizedContent)) {
        logInfo(`Contenuto già presente, skip: ${target}`);
        return;
    }

    const updatedNormalizedContent = `${normalizedCurrentContent.trimEnd()}\n${normalizedContent}\n`;
    const finalContent = restoreOriginalLineEndings(updatedNormalizedContent, currentContent);

    writeFile(target, finalContent);
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
    const normalizedCurrentContent = normalizeLineEndings(currentContent);
    const normalizedContent = normalizeLineEndings(content);

    if (normalizedCurrentContent.includes(normalizedContent)) {
        logInfo(`Testo già presente, skip: ${target}`);
        return;
    }

    const updatedNormalizedContent = `${normalizedCurrentContent.trimEnd()}\n${normalizedContent}\n`;
    const finalContent = restoreOriginalLineEndings(updatedNormalizedContent, currentContent);

    writeFile(target, finalContent);
}

function insertAfterMarker(target: string, marker: string, content: string): void {
    const currentContent = readFile(target);
    const normalizedCurrentContent = normalizeLineEndings(currentContent);
    const normalizedMarker = normalizeLineEndings(marker);
    const normalizedContent = normalizeLineEndings(content);

    if (normalizedCurrentContent.includes(normalizedContent)) {
        logInfo(`Contenuto già presente, skip: ${target}`);
        return;
    }

    const markerIndex = normalizedCurrentContent.indexOf(normalizedMarker);

    if (markerIndex === -1) {
        throw new Error(`Marker non trovato nel file: ${target}`);
    }

    const insertPosition = markerIndex + normalizedMarker.length;
    const updatedNormalizedContent =
        normalizedCurrentContent.slice(0, insertPosition) +
        `\n${normalizedContent}` +
        normalizedCurrentContent.slice(insertPosition);

    const finalContent = restoreOriginalLineEndings(updatedNormalizedContent, currentContent);

    writeFile(target, finalContent);
}

function insertBeforeMarker(target: string, marker: string, content: string): void {
    const currentContent = readFile(target);
    const normalizedCurrentContent = normalizeLineEndings(currentContent);
    const normalizedMarker = normalizeLineEndings(marker);
    const normalizedContent = normalizeLineEndings(content);

    if (normalizedCurrentContent.includes(normalizedContent)) {
        logInfo(`Contenuto già presente, skip: ${target}`);
        return;
    }

    const markerIndex = normalizedCurrentContent.indexOf(normalizedMarker);

    if (markerIndex === -1) {
        throw new Error(`Marker non trovato nel file: ${target}`);
    }

    const updatedNormalizedContent =
        normalizedCurrentContent.slice(0, markerIndex) +
        `${normalizedContent}\n` +
        normalizedCurrentContent.slice(markerIndex);

    const finalContent = restoreOriginalLineEndings(updatedNormalizedContent, currentContent);

    writeFile(target, finalContent);
}

function replaceText(target: string, searchText: string, replaceWith: string): void {
    const currentContent = readFile(target);
    const normalizedCurrentContent = normalizeLineEndings(currentContent);
    const normalizedSearchText = normalizeLineEndings(searchText);
    const normalizedReplaceWith = normalizeLineEndings(replaceWith);

    if (!normalizedCurrentContent.includes(normalizedSearchText)) {
        throw new Error(`Search Text non trovato nel file: ${target}`);
    }

    const updatedNormalizedContent = normalizedCurrentContent.replace(
        normalizedSearchText,
        normalizedReplaceWith
    );

    if (updatedNormalizedContent === normalizedCurrentContent) {
        logInfo(`Nessuna sostituzione necessaria, skip: ${target}`);
        return;
    }

    const finalContent = restoreOriginalLineEndings(updatedNormalizedContent, currentContent);

    writeFile(target, finalContent);
}

function replaceTextRegex(
    target: string,
    pattern: string,
    replaceWith: string,
    flags?: string
): void {
    const currentContent = readFile(target);
    const normalizedCurrentContent = normalizeLineEndings(currentContent);
    const normalizedReplaceWith = normalizeLineEndings(replaceWith);
    const safeFlags = flags ?? '';
    const regex = new RegExp(pattern, safeFlags);

    if (!regex.test(normalizedCurrentContent)) {
        throw new Error(`Pattern regex non trovato nel file: ${target}`);
    }

    const updatedNormalizedContent = normalizedCurrentContent.replace(regex, normalizedReplaceWith);

    if (updatedNormalizedContent === normalizedCurrentContent) {
        logInfo(`Nessuna sostituzione regex necessaria, skip: ${target}`);
        return;
    }

    const finalContent = restoreOriginalLineEndings(updatedNormalizedContent, currentContent);

    writeFile(target, finalContent);
}

function removeText(target: string, content: string): void {
    const currentContent = readFile(target);
    const normalizedCurrentContent = normalizeLineEndings(currentContent);
    const normalizedContent = normalizeLineEndings(content);

    if (!normalizedCurrentContent.includes(normalizedContent)) {
        logInfo(`Testo da rimuovere non trovato, skip: ${target}`);
        return;
    }

    const updatedNormalizedContent = normalizedCurrentContent.replace(normalizedContent, '');

    const finalContent = restoreOriginalLineEndings(updatedNormalizedContent, currentContent);

    writeFile(target, finalContent);
}

function ensureImportExists(target: string, importStatement: string): void {
    const currentContent = readFile(target);
    const normalizedCurrentContent = normalizeLineEndings(currentContent);
    const normalizedImport = normalizeLineEndings(importStatement.trim());

    if (normalizedCurrentContent.includes(normalizedImport)) {
        logInfo(`Import già presente, skip: ${target}`);
        return;
    }

    const importRegex = /^import .*;$/gm;
    const matches = [...normalizedCurrentContent.matchAll(importRegex)];

    let updatedNormalizedContent: string;

    if (matches.length === 0) {
        updatedNormalizedContent = `${normalizedImport}\n\n${normalizedCurrentContent}`;
    } else {
        const lastMatch = matches[matches.length - 1];
        const insertPosition = (lastMatch.index ?? 0) + lastMatch[0].length;
        updatedNormalizedContent =
            normalizedCurrentContent.slice(0, insertPosition) +
            `\n${normalizedImport}` +
            normalizedCurrentContent.slice(insertPosition);
    }

    const finalContent = restoreOriginalLineEndings(updatedNormalizedContent, currentContent);

    writeFile(target, finalContent);
}

function removeImport(target: string, importStatement: string): void {
    const currentContent = readFile(target);
    const normalizedCurrentContent = normalizeLineEndings(currentContent);
    const normalizedImport = normalizeLineEndings(importStatement.trim());

    const importLineWithNewline = `${normalizedImport}\n`;

    let updatedNormalizedContent = normalizedCurrentContent;

    if (updatedNormalizedContent.includes(importLineWithNewline)) {
        updatedNormalizedContent = updatedNormalizedContent.replace(importLineWithNewline, '');
    } else if (updatedNormalizedContent.includes(normalizedImport)) {
        updatedNormalizedContent = updatedNormalizedContent.replace(normalizedImport, '');
    } else {
        logInfo(`Import da rimuovere non trovato, skip: ${target}`);
        return;
    }

    const finalContent = restoreOriginalLineEndings(updatedNormalizedContent, currentContent);

    writeFile(target, finalContent);
}

export function applyActivity(activity: AgentActivity): void {
    switch (activity.type) {
        case 'append_to_file':
            appendToFile(activity.target, activity.content!);
            return;
        case 'replace_entire_file':
            replaceEntireFile(activity.target, activity.content!);
            return;
        case 'ensure_text_exists':
            ensureTextExists(activity.target, activity.content!);
            return;
        case 'insert_after_marker':
            if (!activity.marker) {
                throw new Error(`Activity ${activity.index}: Marker mancante`);
            }

            insertAfterMarker(activity.target, activity.marker, activity.content!);
            return;
        case 'insert_before_marker':
            if (!activity.marker) {
                throw new Error(`Activity ${activity.index}: Marker mancante`);
            }

            insertBeforeMarker(activity.target, activity.marker, activity.content!);
            return;
        case 'replace_text':
            if (activity.searchText === undefined || activity.replaceWith === undefined) {
                throw new Error(`Activity ${activity.index}: Search Text o Replace With mancanti`);
            }

            replaceText(activity.target, activity.searchText, activity.replaceWith);
            return;
        case 'replace_text_regex':
            if (activity.pattern === undefined || activity.replaceWith === undefined) {
                throw new Error(`Activity ${activity.index}: Pattern o Replace With mancanti`);
            }

            replaceTextRegex(activity.target, activity.pattern, activity.replaceWith, activity.flags);
            return;
        case 'remove_text':
            removeText(activity.target, activity.content!);
            return;
        case 'remove_import':
            removeImport(activity.target, activity.content!);
            return;
        case 'ensure_import_exists':
            ensureImportExists(activity.target, activity.content!);
            return;
        default:
            throw new Error(`Tipo attività non supportato: ${activity.type satisfies never}`);
    }
}
