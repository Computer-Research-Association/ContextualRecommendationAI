import * as vscode from "vscode";
import { getCodeContext } from "./generateRecommendations";

class CraInlineCompletionItemProvider implements vscode.InlineCompletionItemProvider {
  private apiKey: string;
  private extensionContext: vscode.ExtensionContext;
  private gemini?: string;

  constructor(extensionContext: vscode.ExtensionContext, apiKey: string) {
    this.apiKey = apiKey;
    this.extensionContext = extensionContext;
  }

  provideInlineCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.InlineCompletionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.InlineCompletionItem[] | vscode.InlineCompletionList> {
    return [];
  }
}
