import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let statusBarVisible = true;
  let timeout: NodeJS.Timeout | undefined;
  const statusTextArray = ["Ready🦹‍♀️", "Typing💬"];
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = statusTextArray[0];
  statusBarItem.show();

  const onTextChanged = vscode.workspace.onDidChangeTextDocument(() => {
    statusBarItem.text = statusTextArray[1];

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      statusBarItem.text = statusTextArray[0];
    }, 500);
  });

  context.subscriptions.push(onTextChanged, statusBarItem);
}

export function deactivate() {}
