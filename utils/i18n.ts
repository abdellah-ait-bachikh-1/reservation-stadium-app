// This file is auto-generated. Do not edit manually.
// Run: npm run generate-i18n

import { getTranslations as getTranslationsBase } from 'next-intl/server';
import { useTranslations as useTranslationsBase } from 'next-intl';

import type { 
  pages_home_hero,
  pages_home_metadata,
  common_actions,
  common_theme,
  common_theme_description,
  AllGlobalPaths,
} from '@/types/i18n';


/**
 * Get pages.home.hero translations (server)
 * Usage: const t = await getPagesHomeHeroTranslations();
 *        t("key") // ← autocomplete for title, subtitle, cta
 */
export async function getPagesHomeHeroTranslations() {
  const t = await getTranslationsBase("pages.home.hero");
  return (key: pages_home_hero) => t(key);
}

/**
 * Get pages.home.metadata translations (server)
 * Usage: const t = await getPagesHomeMetadataTranslations();
 *        t("key") // ← autocomplete for title, description, keywords
 */
export async function getPagesHomeMetadataTranslations() {
  const t = await getTranslationsBase("pages.home.metadata");
  return (key: pages_home_metadata) => t(key);
}

/**
 * Get common.actions translations (server)
 * Usage: const t = await getCommonActionsTranslations();
 *        t("key") // ← autocomplete for reserve, search, login, register, logout, save, cancel, confirm, delete, edit, view, book, checkout, continue, back, filter, sort, share, download
 */
export async function getCommonActionsTranslations() {
  const t = await getTranslationsBase("common.actions");
  return (key: common_actions) => t(key);
}

/**
 * Get common.theme translations (server)
 * Usage: const t = await getCommonThemeTranslations();
 *        t("key") // ← autocomplete for light, dark, system, select
 */
export async function getCommonThemeTranslations() {
  const t = await getTranslationsBase("common.theme");
  return (key: common_theme) => t(key);
}

/**
 * Get common.theme.description translations (server)
 * Usage: const t = await getCommonThemeDescriptionTranslations();
 *        t("key") // ← autocomplete for light, dark, system
 */
export async function getCommonThemeDescriptionTranslations() {
  const t = await getTranslationsBase("common.theme.description");
  return (key: common_theme_description) => t(key);
}


/**
 * Use pages.home.hero translations (client)
 * Usage: const t = usePagesHomeHeroTranslations();
 *        t("key") // ← autocomplete for title, subtitle, cta
 */
export function usePagesHomeHeroTranslations() {
  const t = useTranslationsBase("pages.home.hero");
  return (key: pages_home_hero) => t(key);
}

/**
 * Use pages.home.metadata translations (client)
 * Usage: const t = usePagesHomeMetadataTranslations();
 *        t("key") // ← autocomplete for title, description, keywords
 */
export function usePagesHomeMetadataTranslations() {
  const t = useTranslationsBase("pages.home.metadata");
  return (key: pages_home_metadata) => t(key);
}

/**
 * Use common.actions translations (client)
 * Usage: const t = useCommonActionsTranslations();
 *        t("key") // ← autocomplete for reserve, search, login, register, logout, save, cancel, confirm, delete, edit, view, book, checkout, continue, back, filter, sort, share, download
 */
export function useCommonActionsTranslations() {
  const t = useTranslationsBase("common.actions");
  return (key: common_actions) => t(key);
}

/**
 * Use common.theme translations (client)
 * Usage: const t = useCommonThemeTranslations();
 *        t("key") // ← autocomplete for light, dark, system, select
 */
export function useCommonThemeTranslations() {
  const t = useTranslationsBase("common.theme");
  return (key: common_theme) => t(key);
}

/**
 * Use common.theme.description translations (client)
 * Usage: const t = useCommonThemeDescriptionTranslations();
 *        t("key") // ← autocomplete for light, dark, system
 */
export function useCommonThemeDescriptionTranslations() {
  const t = useTranslationsBase("common.theme.description");
  return (key: common_theme_description) => t(key);
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
