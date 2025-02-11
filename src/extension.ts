import * as vscode from "vscode";
import { setAPIKey as setGemini } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  const setAPIKey = vscode.commands.registerCommand("extension.setAPIKey", async () => {
    await setGemini(context);
  });

  context.subscriptions.push(setAPIKey);
}

export function deactivate() {}
