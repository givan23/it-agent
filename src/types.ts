export type ActivityType =
    | 'append_to_file'
    | 'replace_entire_file'
    | 'insert_after_marker'
    | 'insert_before_marker'
    | 'ensure_text_exists'
    | 'replace_text'
    | 'replace_text_regex'
    | 'remove_text'
    | 'remove_import'
    | 'ensure_import_exists'
    | 'ast_ensure_import_exists'
    | 'ast_remove_import'
    | 'ast_append_object_to_array';

export interface AgentActivity {
    index: number;
    type: ActivityType;
    target: string;
    content?: string;
    marker?: string;
    searchText?: string;
    replaceWith?: string;
    pattern?: string;
    flags?: string;
    importModule?: string;
    importDefaultName?: string;
    arrayName?: string;
    objectLiteral?: string;
}

export interface AgentTask {
    dryRun: boolean;
    gitRepoPath: string;
    npmProjectPath: string;
    branchName: string;
    commitMessage: string;
    activities: AgentActivity[];
}
