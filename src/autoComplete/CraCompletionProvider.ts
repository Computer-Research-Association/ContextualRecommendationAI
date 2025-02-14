import * as vscode from "vscode";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { GeminiClient } from "./GeminiClient";

const Diff = require("diff");

interface DiffType {
  count: number;
  added: boolean;
  removed: boolean;
  value: string;
}

export class CraCompletionProvider implements vscode.InlineCompletionItemProvider {
  private geminiClient: GeminiClient;

  constructor(apiKey: string) {
    this.geminiClient = new GeminiClient(apiKey);
  }

  public async provideInlineCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.InlineCompletionContext,
    token: vscode.CancellationToken
  ): Promise<vscode.InlineCompletionItem[] | vscode.InlineCompletionList | null> {
    // Don't autocomplete when tab is disabled
    const enableTabAutocomplete = true;
    if (!enableTabAutocomplete) {
      return null;
    }
    // Don't autocomplete in SCM document
    if (document.uri.scheme === "vscode-scm") {
      return null;
    }
    // Don't autocomplete with multi-cursor
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.selections.length > 1) {
      return null;
    }
    if (
      context.selectedCompletionInfo &&
      !context.selectedCompletionInfo.text.startsWith(document.getText(context.selectedCompletionInfo.range))
    ) {
      return null;
    }

    let range = new vscode.Range(position, position);

    try {
      const completionText = await this.geminiClient.getCompletions(document, position);

      const isSingleLine = completionText.split("\n").length <= 1;

      if (isSingleLine) {
      } else {
        range = new vscode.Range(position, document.lineAt(position.line + 1).range.end);
      }

      // const inlineCompletionItem = new vscode.InlineCompletionItem(
      //   completionText,
      //   new vscode.Range(position.line, position.character, position.line, position.character)
      // );

      return [];
    } catch (error) {}

    return [new vscode.InlineCompletionItem("cra") || new vscode.InlineCompletionItem("gemini")];
  }
}

type DiffPartType = "+" | "-" | "=";

function diffPatternMatches(diffs: DiffType[], pattern: DiffPartType[]): boolean {
  if (diffs.length !== pattern.length) {
    return false;
  }

  for (let i = 0; i < diffs.length; i++) {
    const diff = diffs[i];
    const diffPartType: DiffPartType = !diff.added && !diff.removed ? "=" : diff.added ? "+" : "-";

    if (diffPartType !== pattern[i]) {
      return false;
    }
  }

  return true;
}
