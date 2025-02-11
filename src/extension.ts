import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let statusBarVisible = false;
  let timeout: NodeJS.Timeout | undefined;
  const statusTextArray = ["Ready🦹‍♀️", "Typing💬"];
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);

  statusBarItem.text = statusTextArray[0];
  statusBarItem.show();

  // 텍스트 변화 감지, 상태 표시줄 텍스트 변경
  const onTextChanged = vscode.workspace.onDidChangeTextDocument(() => {
    statusBarItem.text = statusTextArray[1];

    if (timeout) {
      clearTimeout(timeout);
    }

    // reset to default state after half a second of no typing
    timeout = setTimeout(() => {
      statusBarItem.text = statusTextArray[0];
    }, 500);
  });

  // register statusBar toggle command
  const toggleStatusBarCommand = vscode.commands.registerCommand("extension.toggleStatusBar", () => {
    if (!statusBarVisible) {
      statusBarItem.show();
    } else {
      statusBarItem.hide();
    }
  });

  context.subscriptions.push(onTextChanged, statusBarItem);
}

export function deactivate() {}
