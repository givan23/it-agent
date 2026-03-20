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
        type === 'ensure_text_exists' ||
        type === 'replace_text' ||
        type === 'replace_text_regex' ||
        type === 'remove_text' ||
        type === 'remove_import' ||
        type === 'ensure_import_exists' ||
        type === 'ast_ensure_import_exists' ||
        type === 'ast_remove_import' ||
        type === 'ast_append_object_to_array'
    );
}

function isMarkerBasedActivity(type: ActivityType): boolean {
    return type === 'insert_after_marker' || type === 'insert_before_marker';
}

function isContentBasedActivity(type: ActivityType): boolean {
    return (
        type === 'append_to_file' ||
        type === 'replace_entire_file' ||
        type === 'ensure_text_exists' ||
        type === 'ensure_import_exists' ||
        type === 'insert_after_marker' ||
        type === 'insert_before_marker' ||
        type === 'remove_text' ||
        type === 'remove_import'
    );
}

function parseActivityBlock(block: string, index: number): AgentActivity {
    const typeMatch = block.match(/Type:\s*(.+)/i);
    const targetMatch = block.match(/Target:\s*(.+)/i);
    const markerMatch = block.match(/Marker:\s*(.+)/i);
    const searchTextMatch = block.match(/Search Text:\s*([\s\S]*?)(?=\n(?:Replace With|Pattern|Flags|Content|Import Module|Import Default Name|Array Name|Object):|$)/i);
    const replaceWithMatch = block.match(/Replace With:\s*([\s\S]*?)(?=\n(?:Pattern|Flags|Content|Import Module|Import Default Name|Array Name|Object):|$)/i);
    const patternMatch = block.match(/Pattern:\s*([\s\S]*?)(?=\n(?:Flags|Content|Import Module|Import Default Name|Array Name|Object):|$)/i);
    const flagsMatch = block.match(/Flags:\s*(.+)/i);
    const importModuleMatch = block.match(/Import Module:\s*(.+)/i);
    const importDefaultNameMatch = block.match(/Import Default Name:\s*(.+)/i);
    const arrayNameMatch = block.match(/Array Name:\s*(.+)/i);
    const objectLiteralMatch = block.match(/Object:\s*([\s\S]*?)(?=\nContent:|$)/i);
    const contentMatch = block.match(/Content:\s*([\s\S]*)/i);

    if (!typeMatch?.[1]) {
        throw new Error(`Activity ${index}: Type mancante`);
    }

    if (!targetMatch?.[1]) {
        throw new Error(`Activity ${index}: Target mancante`);
    }

    const rawType = typeMatch[1].trim();

    if (!isSupportedActivityType(rawType)) {
        throw new Error(
            `Activity ${index}: Type non supportato "${rawType}".`
        );
    }

    const target = path.normalize(targetMatch[1].trim());
    const marker = markerMatch?.[1]?.trim();
    const searchText = searchTextMatch?.[1]?.trim();
    const replaceWith = replaceWithMatch?.[1]?.trim();
    const pattern = patternMatch?.[1]?.trim();
    const flags = flagsMatch?.[1]?.trim();
    const importModule = importModuleMatch?.[1]?.trim();
    const importDefaultName = importDefaultNameMatch?.[1]?.trim();
    const arrayName = arrayNameMatch?.[1]?.trim();
    const objectLiteral = objectLiteralMatch?.[1]?.trim();
    const content = contentMatch?.[1]?.trim();

    if (isMarkerBasedActivity(rawType) && !marker) {
        throw new Error(`Activity ${index}: Marker mancante`);
    }

    if (isContentBasedActivity(rawType) && !content) {
        throw new Error(`Activity ${index}: Content mancante`);
    }

    if (rawType === 'replace_text') {
        if (!searchText) {
            throw new Error(`Activity ${index}: Search Text mancante`);
        }

        if (replaceWith === undefined) {
            throw new Error(`Activity ${index}: Replace With mancante`);
        }
    }

    if (rawType === 'replace_text_regex') {
        if (!pattern) {
            throw new Error(`Activity ${index}: Pattern mancante`);
        }

        if (replaceWith === undefined) {
            throw new Error(`Activity ${index}: Replace With mancante`);
        }
    }

    if (rawType === 'ast_ensure_import_exists' || rawType === 'ast_remove_import') {
        if (!importModule) {
            throw new Error(`Activity ${index}: Import Module mancante`);
        }
    }

    if (rawType === 'ast_append_object_to_array') {
        if (!arrayName) {
            throw new Error(`Activity ${index}: Array Name mancante`);
        }

        if (!objectLiteral) {
            throw new Error(`Activity ${index}: Object mancante`);
        }
    }

    return {
        index,
        type: rawType,
        target,
        content,
        marker,
        searchText,
        replaceWith,
        pattern,
        flags,
        importModule,
        importDefaultName,
        arrayName,
        objectLiteral
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
