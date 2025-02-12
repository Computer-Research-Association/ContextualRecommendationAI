import * as vscode from "vscode";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function setAPIKey(context: vscode.ExtensionContext) {
  const APIKey = await vscode.window.showInputBox({
    prompt: "Enter your Gemini API Key",
    ignoreFocusOut: true,
    password: true,
    placeHolder: "API Key",
  });

  try {
    await verifyAPIKey(APIKey || "");
  } catch (err) {
    vscode.window.showErrorMessage("Invalid API Key");
    console.error(err);
    context.globalState.update("isValidGeminiAPIKey", false);
    return;
  }

  await context.secrets.store("CONTEXTUALRECOMMENDATIONAI_API_KEY", APIKey || "");
  vscode.window.showInformationMessage("API Key set");
  context.globalState.update("isValidGeminiAPIKey", true);
}

async function verifyAPIKey(APIKey: string) {
  const model = new GoogleGenerativeAI(APIKey || "").getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent("Hello World!");
  console.log(result.response.text());
}

export async function getAPIKey(context: vscode.ExtensionContext) {
  return await context.secrets.get("CONTEXTUALRECOMMENDATIONAI_API_KEY");
}
