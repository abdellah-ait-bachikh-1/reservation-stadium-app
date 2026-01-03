// This file is auto-generated. Do not edit manually.
// Run: npm run generate-i18n

import { getTranslations as getTranslationsBase } from 'next-intl/server';
import { useTranslations as useTranslationsBase } from 'next-intl';

import type { 
  pages_home,
  pages_about,
  AllGlobalPaths,
} from '@/types/i18n';


/**
 * Get pages.home translations (server)
 * Usage: const t = await getPagesHomeTranslations();
 *        t("key") // ← autocomplete for title
 */
export async function getPagesHomeTranslations() {
  const t = await getTranslationsBase("pages.home");
  return (key: pages_home) => t(key);
}

/**
 * Get pages.about translations (server)
 * Usage: const t = await getPagesAboutTranslations();
 *        t("key") // ← autocomplete for title
 */
export async function getPagesAboutTranslations() {
  const t = await getTranslationsBase("pages.about");
  return (key: pages_about) => t(key);
}


/**
 * Use pages.home translations (client)
 * Usage: const t = usePagesHomeTranslations();
 *        t("key") // ← autocomplete for title
 */
export function usePagesHomeTranslations() {
  const t = useTranslationsBase("pages.home");
  return (key: pages_home) => t(key);
}

/**
 * Use pages.about translations (client)
 * Usage: const t = usePagesAboutTranslations();
 *        t("key") // ← autocomplete for title
 */
export function usePagesAboutTranslations() {
  const t = useTranslationsBase("pages.about");
  return (key: pages_about) => t(key);
}


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
