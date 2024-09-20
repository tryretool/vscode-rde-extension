import * as vscode from "vscode";
import { Instruction } from "./instruction";
import { getOrCreateTerminal } from "./terminal/getOrCreateTerminal";
import { TestSpec } from "./utils/spec";
import * as path from "path";

export async function runTestsInFile(editor: vscode.TextEditor, instruction = Instruction.Watch): Promise<void> {
  // Document and Workspace.
  const document = editor.document;
  const workspace = vscode.workspace.getWorkspaceFolder(document.uri);
  if (!workspace) {
    return;
  }

  // Terminal.
  const terminal = getOrCreateTerminal(workspace);
  terminal.show(true);

  // Path
  const testPath = path.relative(workspace.uri.fsPath, document.uri.fsPath);

  // Run command
  await runRde(workspace, instruction, testPath);
}

export async function runTestFromCodeLens(editor: vscode.TextEditor, spec: TestSpec, instruction: Instruction): Promise<void> {
  // Workspace.
  const document = editor.document;
  const workspace = vscode.workspace.getWorkspaceFolder(editor.document.uri);
  if (!workspace) {
    return;
  }

  // Terminal
  const terminal = getOrCreateTerminal(workspace);
  terminal.show(true);

  // Path
  const testPath = path.relative(workspace.uri.fsPath, document.uri.fsPath);

  // Run command
  await runRde(workspace, instruction, testPath, spec.name);
}

async function runRde(workspace: vscode.WorkspaceFolder, instruction: Instruction, testPath: string, testFilter?: string): Promise<void> {
  // Terminal.
  const terminal = getOrCreateTerminal(workspace);
  terminal.show(true);

  let rdeCommand = "test";
  if (instruction === Instruction.Debug) {
    rdeCommand = "debug";
  }

  // Build command
  let consoleCommand = `rde ${rdeCommand} ${testPath}`;
  if (testFilter) {
    consoleCommand += ` --testNamePattern="${testFilter}"`;
  }
  if (instruction === Instruction.Watch) {
    consoleCommand += " --watch";
  }

  await vscode.commands.executeCommand("workbench.action.terminal.clear");
  terminal.sendText(consoleCommand, true);
}
