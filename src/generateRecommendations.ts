import * as vscode from "vscode";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function getCodeContext(document: vscode.TextDocument, position: vscode.Position): string {
  const line = document.lineAt(position).text;
  const prefix = line.substring(0, position.character);
  const fullText = document.getText();
  return `current code context: ${fullText}
  cursor position: Ln ${position.line + 1}, Col ${position.character + 1}|
  Based on the following ${document.languageId} code, suggest the following one most appropriate code fragment
  with no backticks`;
}
