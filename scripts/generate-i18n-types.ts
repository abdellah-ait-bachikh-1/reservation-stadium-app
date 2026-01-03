// scripts/generate-i18n-enhanced.ts
import fs from 'fs';
import path from 'path';

function generateI18n() {
  const messagesDir = path.join(process.cwd(), 'messages');
  const enFile = path.join(messagesDir, 'en.json');
  
  if (!fs.existsSync(enFile)) {
    console.error('❌ en.json not found at:', enFile);
    process.exit(1);
  }
  
  try {
    const enContent = fs.readFileSync(enFile, 'utf-8');
    const messages = JSON.parse(enContent);
    
    console.log('🔄 Generating complete i18n types and utilities...');
    
    // 1. Generate types file
    generateTypesFile(messages);
    
    // 2. Generate utilities file
    generateUtilitiesFile(messages);
    
    console.log('✅ Successfully generated:');
    console.log('   📁 types/i18n.d.ts');
    console.log('   📁 utils/i18n.ts');
    
  } catch (error) {
    console.error('❌ Error generating i18n:', error);
    process.exit(1);
  }
}

function generateTypesFile(messages: any) {
  const typesDir = path.join(process.cwd(), 'types');
  if (!fs.existsSync(typesDir)) fs.mkdirSync(typesDir, { recursive: true });
  
  const typeContent = generateTypesContent(messages);
  fs.writeFileSync(path.join(typesDir, 'i18n.d.ts'), typeContent);
}

function generateUtilitiesFile(messages: any) {
  const utilsDir = path.join(process.cwd(), 'utils');
  if (!fs.existsSync(utilsDir)) fs.mkdirSync(utilsDir, { recursive: true });
  
  const utilityContent = generateUtilitiesContent(messages);
  fs.writeFileSync(path.join(utilsDir, 'i18n.ts'), utilityContent);
}

function generateTypesContent(messages: any): string {
  const typeStructure = generateTypeStructure(messages, 4);
  const namespaceTypes = generateAllNamespaceTypes(messages);
  const fullPathTypes = generateFullPathTypes(messages);
  
  return `// This file is auto-generated. Do not edit manually.
// Run: npm run generate-i18n

import 'next-intl';

declare module 'next-intl' {
  interface IntlMessages {
${typeStructure}
  }
}

// ============================================
// NAMESPACE TYPES FOR AUTOCOMPLETE
// ============================================

${namespaceTypes}

// ============================================
// FULL PATH TYPES FOR GLOBAL ACCESS
// ============================================

${fullPathTypes}

// Helper: Get keys for any namespace
export type NamespaceKeys<T, P extends string> = 
  P extends \`\${infer First}.\${infer Rest}\`
    ? First extends keyof T
      ? NamespaceKeys<T[First], Rest>
      : never
    : P extends keyof T
      ? keyof T[P]
      : never;
`;
}

function generateUtilitiesContent(messages: any): string {
  const namespaces = getAllNamespaces(messages);
  
  // Build imports
  const imports = `// This file is auto-generated. Do not edit manually.
// Run: npm run generate-i18n

import { getTranslations as getTranslationsBase } from 'next-intl/server';
import { useTranslations as useTranslationsBase } from 'next-intl';
`;

  // Build type imports
  const typeNames = namespaces.map(ns => ns.typeName).concat(['AllGlobalPaths']);
  const typeImports = `import type { 
${typeNames.map(type => `  ${type},`).join('\n')}
} from '@/types/i18n';
`;

  // Build server functions
  const serverFunctions = namespaces.map(ns => `
/**
 * Get ${ns.path} translations (server)
 * Usage: const t = await ${ns.functionName}();
 *        t("key") // ← autocomplete for ${ns.keys.join(', ')}
 */
export async function ${ns.functionName}() {
  const t = await getTranslationsBase("${ns.path}");
  return (key: ${ns.typeName}) => t(key);
}`).join('\n');

  // Build client hooks
  const clientHooks = namespaces.map(ns => `
/**
 * Use ${ns.path} translations (client)
 * Usage: const t = ${ns.hookName}();
 *        t("key") // ← autocomplete for ${ns.keys.join(', ')}
 */
export function ${ns.hookName}() {
  const t = useTranslationsBase("${ns.path}");
  return (key: ${ns.typeName}) => t(key);
}`).join('\n');

  // Global functions (always included)
  const globalFunctions = `
// ============================================
// GLOBAL TRANSLATIONS (All keys in JSON)
// ============================================

/**
 * Get ALL translations (global access to everything)
 * Usage: const t = await getGlobalTranslations();
 *        t("pages.home.title") // Full path
 */
export async function getGlobalTranslations() {
  const t = await getTranslationsBase();
  return (key: string) => t(key);
}

/**
 * Get global translations with type checking
 * Usage: const t = await getTypedGlobalTranslations();
 *        t("pages.home.title") // Works with autocomplete!
 *        t("invalid.key") // TypeScript error
 */
export async function getTypedGlobalTranslations() {
  const t = await getTranslationsBase();
  return (key: AllGlobalPaths) => t(key);
}

/**
 * Use global translations (client)
 * Usage: const t = useGlobalTranslations();
 *        t("pages.home.title")
 */
export function useGlobalTranslations() {
  const t = useTranslationsBase();
  return (key: string) => t(key);
}

/**
 * Use typed global translations (client)
 * Usage: const t = useTypedGlobalTranslations();
 *        t("pages.home.title") // Autocomplete works!
 */
export function useTypedGlobalTranslations() {
  const t = useTranslationsBase();
  return (key: AllGlobalPaths) => t(key);
}
`;

  return imports + '\n' + typeImports + '\n' + 
    serverFunctions + '\n\n' + clientHooks + '\n\n' + globalFunctions;
}

// ============================================
// KEY FIX: Get ALL namespaces, not just leaf nodes
// ============================================

function getAllNamespaces(obj: any, currentPath: string[] = []): Array<{
  path: string;
  typeName: string;
  functionName: string;
  hookName: string;
  keys: string[];
}> {
  const namespaces: Array<{
    path: string;
    typeName: string;
    functionName: string;
    hookName: string;
    keys: string[];
  }> = [];
  
  const traverse = (currentObj: any, path: string[]): void => {
    // Get string keys at this level
    const stringKeys = Object.entries(currentObj)
      .filter(([_, v]) => typeof v === 'string')
      .map(([k, _]) => k);
    
    // Only create namespace if we have STRING keys (not just objects)
    if (stringKeys.length > 0 && path.length > 0) {
      const namespacePath = path.join('.');
      const typeName = namespacePath.replace(/\./g, '_');
      const functionName = `get${toPascalCase(typeName)}Translations`;
      const hookName = `use${toPascalCase(typeName)}Translations`;
      
      namespaces.push({
        path: namespacePath,
        typeName,
        functionName,
        hookName,
        keys: stringKeys
      });
    }
    
    // Continue deeper for nested objects
    for (const [key, value] of Object.entries(currentObj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value, [...path, key]);
      }
    }
  };
  
  traverse(obj, currentPath);
  return namespaces;
}

function toPascalCase(str: string): string {
  return str
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function generateTypeStructure(obj: any, indent: number): string {
  const spaces = ' '.repeat(indent);
  const lines: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      lines.push(`${spaces}${key}: {`);
      lines.push(generateTypeStructure(value, indent + 2));
      lines.push(`${spaces}};`);
    } else {
      lines.push(`${spaces}${key}: string;`);
    }
  }
  
  return lines.join('\n');
}

function generateAllNamespaceTypes(obj: any, currentPath: string[] = []): string {
  const types: string[] = [];
  
  const traverse = (currentObj: any, path: string[]): void => {
    const stringKeys = Object.entries(currentObj)
      .filter(([_, v]) => typeof v === 'string')
      .map(([k, _]) => k);
    
    if (stringKeys.length > 0 && path.length > 0) {
      const namespace = path.join('.');
      const typeName = namespace.replace(/\./g, '_');
      types.push(`export type ${typeName} = ${stringKeys.map(k => `"${k}"`).join(' | ')};`);
    }
    
    for (const [key, value] of Object.entries(currentObj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value, [...path, key]);
      }
    }
  };
  
  traverse(obj, currentPath);
  return types.join('\n');
}

function generateFullPathTypes(obj: any, currentPath: string[] = []): string {
  const types: string[] = [];
  
  const traverse = (currentObj: any, path: string[]): void => {
    for (const [key, value] of Object.entries(currentObj)) {
      const newPath = [...path, key];
      const fullPath = newPath.join('.');
      
      if (typeof value === 'string') {
        types.push(`export type GlobalPath_${fullPath.replace(/\./g, '_')} = "${fullPath}";`);
      } else if (typeof value === 'object' && value !== null) {
        traverse(value, newPath);
      }
    }
  };
  
  traverse(obj, currentPath);
  
  if (types.length > 0) {
    const pathUnion = types
      .map(t => t.split(' = ')[0].replace('export type ', ''))
      .join(' | ');
    
    types.push(`\nexport type AllGlobalPaths = ${pathUnion};`);
  }
  
  return types.join('\n');
}

// Run if this file is executed directly
if (require.main === module) {
  generateI18n();
}

export { generateI18n };