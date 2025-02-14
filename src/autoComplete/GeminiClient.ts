import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import * as vscode from "vscode";

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async getCompletions(document: vscode.TextDocument, position: vscode.Position): Promise<string> {
    try {
      const codeContext = this.getCodeContext(document, position);

      const result = await this.model.generateContent(codeContext);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error("Error fetching completions from Gemini API:", error);
      return "";
    }
  }

  getCodeContext(document: vscode.TextDocument, position: vscode.Position): string {
    const line = document.lineAt(position).text;
    const fullText = document.getText();
    return `current code context: ${fullText}
    cursor position: Ln ${position.line + 1}, Col ${position.character + 1}|
    Based on the following ${document.languageId} code, suggest the following one most appropriate code fragment
    with no backticks`;
  }
}
