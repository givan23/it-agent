import * as path from 'path';
import { parseTaskFile } from './parser';
import { applyActivity } from './file-actions';
import {
  createBranch,
  gitAddAll,
  gitCheckoutMain,
  gitCommit,
  gitFetchAll,
  gitPullMain,
  gitPush,
  localBranchExists,
  remoteBranchExists,
  runFormat,
  runLintFix,
  runTests
} from './git';
import { logError, logInfo, logStep, logWarn } from './logger';
import { ensureGitRepo, ensurePathExists } from './utils';

function printPlan(): void {
  logWarn('Dry run attivo: nessuna modifica verrà applicata.');
}

function main(): void {
  try {
    const taskFilePath = process.argv[2];

    if (!taskFilePath) {
      throw new Error('Passa il path del task file. Esempio: npm run dev ./tasks/task.md');
    }

    logStep('Parse task');
    const task = parseTaskFile(taskFilePath);

    logInfo(`Git repo path: ${task.gitRepoPath}`);
    logInfo(`Npm project path: ${task.npmProjectPath}`);
    logInfo(`Branch name: ${task.branchName}`);
    logInfo(`Commit message: ${task.commitMessage}`);
    logInfo(`Dry run: ${String(task.dryRun)}`);
    logInfo(`Activities count: ${task.activities.length}`);

    logStep('Validate project');
    ensurePathExists(task.gitRepoPath, 'Git repo path');
    ensureGitRepo(task.gitRepoPath);

    ensurePathExists(task.npmProjectPath, 'Npm project path');
    ensurePathExists(path.join(task.npmProjectPath, 'package.json'), 'package.json');

    if (task.dryRun) {
      printPlan();

      task.activities.forEach((activity) => {
        logInfo(`Activity ${activity.index}: ${activity.type} -> ${activity.target}`);
      });

      return;
    }

    logStep('Prepare git');
    gitFetchAll(task.gitRepoPath);
    gitCheckoutMain(task.gitRepoPath);
    gitPullMain(task.gitRepoPath);

    const localExists = localBranchExists(task.branchName, task.gitRepoPath);
    const remoteExists = remoteBranchExists(task.branchName, task.gitRepoPath);

    if (localExists || remoteExists) {
      throw new Error(
        `Il branch "${task.branchName}" esiste già` +
          `${localExists ? ' localmente' : ''}` +
          `${localExists && remoteExists ? ' e' : ''}` +
          `${remoteExists ? ' su origin' : ''}`
      );
    }

    createBranch(task.branchName, task.gitRepoPath);

    logStep('Apply activities');
    task.activities.forEach((activity) => {
      logInfo(`Applying activity ${activity.index}: ${activity.type}`);
      applyActivity(activity);
    });

    logStep('Run validations');
    runLintFix(task.npmProjectPath);
    runFormat(task.npmProjectPath);
    runTests(task.npmProjectPath);

    logStep('Git add / commit / push');
    gitAddAll(task.gitRepoPath);
    gitCommit(task.commitMessage, task.gitRepoPath);
    gitPush(task.branchName, task.gitRepoPath);

    logStep('Done');
    logInfo('Agente completato con successo.');
  } catch (error) {
    logError('Errore durante l’esecuzione dell’agente.');
    console.error(error);
    process.exit(1);
  }
}

main();
