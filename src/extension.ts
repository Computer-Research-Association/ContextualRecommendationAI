import * as vscode from "vscode";
import { getAPIKey, setAPIKey as setGemini } from "./utils";
import { getCodeContext } from "./generateRecommendations";
import { GenerateContentResult, GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

export async function activate(context: vscode.ExtensionContext) {
  if (!context.globalState.get<boolean>("isValidGeminiAPIKey")) {
    vscode.window.showErrorMessage("Please set your Gemini API Key", "Set API Key").then((value) => {
      if (value === "Set API Key") {
        setGemini(context);
      }
    });
    context.globalState.update("isValidGeminiAPIKey", false);
  }

  let statusBarVisible = true;
  let timeout: NodeJS.Timeout | undefined;
  const statusTextArray = ["Ready🦹‍♀️", "Typing💬"];
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.tooltip = "ContextualRecommendationAI";
  statusBarItem.text = statusTextArray[0];
  statusBarItem.show();

  let model: GenerativeModel | undefined;

  if (context.globalState.get<boolean>("isValidGeminiAPIKey")) {
    const APIKey = await getAPIKey(context);
    model = new GoogleGenerativeAI(APIKey || "").getGenerativeModel({
      model: "gemini-2.0-flash",
    });
  }

  const onTextChanged = vscode.workspace.onDidChangeTextDocument(() => {
    statusBarItem.text = statusTextArray[1];

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      statusBarItem.text = statusTextArray[0];
    }, 500);
  });

  const setAPIKey = vscode.commands.registerCommand("extension.setAPIKey", async () => {
    await setGemini(context);
  });

  vscode.languages.registerCompletionItemProvider(
    { language: vscode.window.activeTextEditor?.document.languageId },
    {
      async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const codeContext = getCodeContext(document, position);
        let res: GenerateContentResult | undefined;
        if ((res = await model?.generateContent(codeContext))) {
          const response = res.response.text();
          console.log(response);
          return [new vscode.CompletionItem(res.response.text())];
        }

        return;
      },
    }
  );

  context.subscriptions.push(onTextChanged, statusBarItem, setAPIKey);
}

export function deactivate() {}
