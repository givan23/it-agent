import * as fs from 'fs';
import { Project, QuoteKind, SyntaxKind } from 'ts-morph';
import { AgentActivity } from './types';
import { logInfo } from './logger';

function ensureFileExists(filePath: string): void {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File non trovato: ${filePath}`);
    }
}

function ensureCodeFile(target: string): void {
    if (!/\.(js|jsx|ts|tsx)$/.test(target)) {
        throw new Error(`Le action AST supportano solo file JS/TS/JSX/TSX: ${target}`);
    }
}

function createProject(): Project {
    return new Project({
        manipulationSettings: {
            quoteKind: QuoteKind.Double,
            useTrailingCommas: true,
        },
        skipAddingFilesFromTsConfig: true,
    });
}

function loadSourceFile(project: Project, target: string) {
    ensureFileExists(target);
    ensureCodeFile(target);

    return project.addSourceFileAtPath(target);
}

export function astEnsureImportExists(activity: AgentActivity): void {
    const { target, importModule, importDefaultName } = activity;

    if (!importModule) {
        throw new Error(`Activity ${activity.index}: Import Module mancante`);
    }

    const project = createProject();
    const sourceFile = loadSourceFile(project, target);

    const existingImport = sourceFile.getImportDeclaration((declaration) => {
        return declaration.getModuleSpecifierValue() === importModule;
    });

    if (existingImport) {
        if (importDefaultName) {
            const currentDefaultImport = existingImport.getDefaultImport()?.getText();

            if (currentDefaultImport === importDefaultName) {
                logInfo(`Import AST già presente, skip: ${target}`);
                return;
            }

            if (!currentDefaultImport) {
                existingImport.setDefaultImport(importDefaultName);
                sourceFile.saveSync();
                return;
            }

            throw new Error(
                `Import già presente con default diverso per modulo "${importModule}" in ${target}`
            );
        }

        logInfo(`Import AST già presente, skip: ${target}`);
        return;
    }

    sourceFile.addImportDeclaration({
        defaultImport: importDefaultName,
        moduleSpecifier: importModule,
    });

    sourceFile.saveSync();
}

export function astRemoveImport(activity: AgentActivity): void {
    const { target, importModule, importDefaultName } = activity;

    if (!importModule) {
        throw new Error(`Activity ${activity.index}: Import Module mancante`);
    }

    const project = createProject();
    const sourceFile = loadSourceFile(project, target);

    const existingImport = sourceFile.getImportDeclaration((declaration) => {
        return declaration.getModuleSpecifierValue() === importModule;
    });

    if (!existingImport) {
        logInfo(`Import AST da rimuovere non trovato, skip: ${target}`);
        return;
    }

    if (importDefaultName) {
        const currentDefaultImport = existingImport.getDefaultImport()?.getText();
        if (currentDefaultImport && currentDefaultImport !== importDefaultName) {
            throw new Error(
                `Import trovato per modulo "${importModule}" ma con default diverso in ${target}`
            );
        }
    }

    existingImport.remove();
    sourceFile.saveSync();
}

export function astAppendObjectToArray(activity: AgentActivity): void {
    const { target, arrayName, objectLiteral } = activity;

    if (!arrayName) {
        throw new Error(`Activity ${activity.index}: Array Name mancante`);
    }

    if (!objectLiteral) {
        throw new Error(`Activity ${activity.index}: Object mancante`);
    }

    const project = createProject();
    const sourceFile = loadSourceFile(project, target);

    const variableDeclaration = sourceFile.getVariableDeclaration(arrayName);

    if (!variableDeclaration) {
        throw new Error(`Array "${arrayName}" non trovato in ${target}`);
    }

    const initializer = variableDeclaration.getInitializer();

    if (!initializer || initializer.getKind() !== SyntaxKind.ArrayLiteralExpression) {
        throw new Error(`La variabile "${arrayName}" non è un array literal in ${target}`);
    }

    const arrayLiteral = initializer.asKindOrThrow(SyntaxKind.ArrayLiteralExpression);
    const normalizedObjectLiteral = objectLiteral.replace(/\r\n/g, '\n').trim();

    const alreadyPresent = arrayLiteral
        .getElements()
        .some((element) => element.getText().replace(/\r\n/g, '\n').trim() === normalizedObjectLiteral);

    if (alreadyPresent) {
        logInfo(`Oggetto AST già presente nell'array "${arrayName}", skip: ${target}`);
        return;
    }

    arrayLiteral.addElement(normalizedObjectLiteral);
    sourceFile.saveSync();
}
