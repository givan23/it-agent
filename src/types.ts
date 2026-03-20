export type ActivityType =
  | 'append_to_file'
  | 'replace_entire_file'
  | 'insert_after_marker'
  | 'insert_before_marker'
  | 'ensure_text_exists';

export interface AgentActivity {
  index: number;
  type: ActivityType;
  target: string;
  content: string;
  marker?: string;
}

export interface AgentTask {
  dryRun: boolean;
  gitRepoPath: string;
  npmProjectPath: string;
  branchName: string;
  commitMessage: string;
  activities: AgentActivity[];
}
