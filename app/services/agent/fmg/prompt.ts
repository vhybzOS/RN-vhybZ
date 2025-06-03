import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { Prompt, PromptProvider } from './types';
import mustache from 'mustache';


const promptMap: Record<string, number> = {
  jodi: require('assets/prompts/jodi.md'),
  jose: require('assets/prompts/jose.md')
};

export async function loadMarkdown(name: string): Promise<string> {
  const module = promptMap[name];
  if (!module) Promise.resolve(name)

  const asset = Asset.fromModule(module);
  await asset.downloadAsync();
  return await FileSystem.readAsStringAsync(asset.localUri!);
}

export async function renderTemplate(name: string, params: Record<string, any>): Promise<string> {
  const template = await loadMarkdown(name)
  return mustache.render(template, params)
}

export const makePrompt: PromptProvider = (name: string) => {
  return (params?: Record<string, any>) => { return renderTemplate(name, params || {}) }
}

export async function getPrompt(promptFn: Prompt, params?: Record<string, any>): Promise<string> {
  if (typeof promptFn === "string") {
    return promptFn
  }
  return await promptFn(params)
}
