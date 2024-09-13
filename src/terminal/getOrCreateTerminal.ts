import * as vscode from "vscode";

export function getOrCreateTerminal(workspace: vscode.WorkspaceFolder): vscode.Terminal {
  const terminal = vscode.window.activeTerminal;
  if (terminal) {
    return terminal;
  }

  return vscode.window.createTerminal({ cwd: workspace.uri.path });
}
