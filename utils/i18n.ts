// This file is auto-generated. Do not edit manually.
// Run: npm run generate-i18n

import { getTranslations as getTranslationsBase } from 'next-intl/server';
import { useTranslations as useTranslationsBase } from 'next-intl';

import type { 
  pages,
  pages_error,
  pages_home,
  pages_home_hero,
  pages_home_metadata,
  pages_stadiums,
  pages_stadiums_metadata,
  pages_about,
  pages_about_metadata,
  pages_contact,
  pages_contact_metadata,
  common,
  common_actions,
  common_theme,
  common_theme_description,
  common_user,
  common_user_roles,
  common_modals,
  common_modals_logout,
  common_navigation,
  common_navigation_public,
  common_navigation_public_links,
  AllGlobalPaths,
} from '@/types/i18n';


/**
 * Get pages translations (server)
 * Usage: const t = await getPagesTranslations();
 *        t("key") // ← autocomplete for error, home, stadiums, about, contact
 */
export async function getPagesTranslations() {
  const t = await getTranslationsBase("pages");
  return (key: pages) => t(key);
}

/**
 * Get pages.error translations (server)
 * Usage: const t = await getPagesErrorTranslations();
 *        t("key") // ← autocomplete for title, subtitle, tryAgain, goHome, technicalDetails, errorId, noStackTrace
 */
export async function getPagesErrorTranslations() {
  const t = await getTranslationsBase("pages.error");
  return (key: pages_error) => t(key);
}

/**
 * Get pages.home translations (server)
 * Usage: const t = await getPagesHomeTranslations();
 *        t("key") // ← autocomplete for hero, metadata
 */
export async function getPagesHomeTranslations() {
  const t = await getTranslationsBase("pages.home");
  return (key: pages_home) => t(key);
}

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
 * Get pages.stadiums translations (server)
 * Usage: const t = await getPagesStadiumsTranslations();
 *        t("key") // ← autocomplete for metadata
 */
export async function getPagesStadiumsTranslations() {
  const t = await getTranslationsBase("pages.stadiums");
  return (key: pages_stadiums) => t(key);
}

/**
 * Get pages.stadiums.metadata translations (server)
 * Usage: const t = await getPagesStadiumsMetadataTranslations();
 *        t("key") // ← autocomplete for title, description, keywords
 */
export async function getPagesStadiumsMetadataTranslations() {
  const t = await getTranslationsBase("pages.stadiums.metadata");
  return (key: pages_stadiums_metadata) => t(key);
}

/**
 * Get pages.about translations (server)
 * Usage: const t = await getPagesAboutTranslations();
 *        t("key") // ← autocomplete for metadata
 */
export async function getPagesAboutTranslations() {
  const t = await getTranslationsBase("pages.about");
  return (key: pages_about) => t(key);
}

/**
 * Get pages.about.metadata translations (server)
 * Usage: const t = await getPagesAboutMetadataTranslations();
 *        t("key") // ← autocomplete for title, description, keywords
 */
export async function getPagesAboutMetadataTranslations() {
  const t = await getTranslationsBase("pages.about.metadata");
  return (key: pages_about_metadata) => t(key);
}

/**
 * Get pages.contact translations (server)
 * Usage: const t = await getPagesContactTranslations();
 *        t("key") // ← autocomplete for metadata
 */
export async function getPagesContactTranslations() {
  const t = await getTranslationsBase("pages.contact");
  return (key: pages_contact) => t(key);
}

/**
 * Get pages.contact.metadata translations (server)
 * Usage: const t = await getPagesContactMetadataTranslations();
 *        t("key") // ← autocomplete for title, description, keywords
 */
export async function getPagesContactMetadataTranslations() {
  const t = await getTranslationsBase("pages.contact.metadata");
  return (key: pages_contact_metadata) => t(key);
}

/**
 * Get common translations (server)
 * Usage: const t = await getCommonTranslations();
 *        t("key") // ← autocomplete for actions, theme, user, modals, navigation
 */
export async function getCommonTranslations() {
  const t = await getTranslationsBase("common");
  return (key: common) => t(key);
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
 *        t("key") // ← autocomplete for light, dark, system, select, description
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
 * Get common.user translations (server)
 * Usage: const t = await getCommonUserTranslations();
 *        t("key") // ← autocomplete for dashboard, profile, logout, viewProfile, goToDashboard, signOut, menu, name, email, role, welcome, roles
 */
export async function getCommonUserTranslations() {
  const t = await getTranslationsBase("common.user");
  return (key: common_user) => t(key);
}

/**
 * Get common.user.roles translations (server)
 * Usage: const t = await getCommonUserRolesTranslations();
 *        t("key") // ← autocomplete for admin, club
 */
export async function getCommonUserRolesTranslations() {
  const t = await getTranslationsBase("common.user.roles");
  return (key: common_user_roles) => t(key);
}

/**
 * Get common.modals translations (server)
 * Usage: const t = await getCommonModalsTranslations();
 *        t("key") // ← autocomplete for logout
 */
export async function getCommonModalsTranslations() {
  const t = await getTranslationsBase("common.modals");
  return (key: common_modals) => t(key);
}

/**
 * Get common.modals.logout translations (server)
 * Usage: const t = await getCommonModalsLogoutTranslations();
 *        t("key") // ← autocomplete for title, message, cancel, confirm
 */
export async function getCommonModalsLogoutTranslations() {
  const t = await getTranslationsBase("common.modals.logout");
  return (key: common_modals_logout) => t(key);
}

/**
 * Get common.navigation translations (server)
 * Usage: const t = await getCommonNavigationTranslations();
 *        t("key") // ← autocomplete for public
 */
export async function getCommonNavigationTranslations() {
  const t = await getTranslationsBase("common.navigation");
  return (key: common_navigation) => t(key);
}

/**
 * Get common.navigation.public translations (server)
 * Usage: const t = await getCommonNavigationPublicTranslations();
 *        t("key") // ← autocomplete for title, links
 */
export async function getCommonNavigationPublicTranslations() {
  const t = await getTranslationsBase("common.navigation.public");
  return (key: common_navigation_public) => t(key);
}

/**
 * Get common.navigation.public.links translations (server)
 * Usage: const t = await getCommonNavigationPublicLinksTranslations();
 *        t("key") // ← autocomplete for home, stadiums, about, contact, sectionTitle
 */
export async function getCommonNavigationPublicLinksTranslations() {
  const t = await getTranslationsBase("common.navigation.public.links");
  return (key: common_navigation_public_links) => t(key);
}


/**
 * Use pages translations (client)
 * Usage: const t = usePagesTranslations();
 *        t("key") // ← autocomplete for error, home, stadiums, about, contact
 */
export function usePagesTranslations() {
  const t = useTranslationsBase("pages");
  return (key: pages) => t(key);
}

/**
 * Use pages.error translations (client)
 * Usage: const t = usePagesErrorTranslations();
 *        t("key") // ← autocomplete for title, subtitle, tryAgain, goHome, technicalDetails, errorId, noStackTrace
 */
export function usePagesErrorTranslations() {
  const t = useTranslationsBase("pages.error");
  return (key: pages_error) => t(key);
}

/**
 * Use pages.home translations (client)
 * Usage: const t = usePagesHomeTranslations();
 *        t("key") // ← autocomplete for hero, metadata
 */
export function usePagesHomeTranslations() {
  const t = useTranslationsBase("pages.home");
  return (key: pages_home) => t(key);
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
 * Use pages.stadiums translations (client)
 * Usage: const t = usePagesStadiumsTranslations();
 *        t("key") // ← autocomplete for metadata
 */
export function usePagesStadiumsTranslations() {
  const t = useTranslationsBase("pages.stadiums");
  return (key: pages_stadiums) => t(key);
}

/**
 * Use pages.stadiums.metadata translations (client)
 * Usage: const t = usePagesStadiumsMetadataTranslations();
 *        t("key") // ← autocomplete for title, description, keywords
 */
export function usePagesStadiumsMetadataTranslations() {
  const t = useTranslationsBase("pages.stadiums.metadata");
  return (key: pages_stadiums_metadata) => t(key);
}

/**
 * Use pages.about translations (client)
 * Usage: const t = usePagesAboutTranslations();
 *        t("key") // ← autocomplete for metadata
 */
export function usePagesAboutTranslations() {
  const t = useTranslationsBase("pages.about");
  return (key: pages_about) => t(key);
}

/**
 * Use pages.about.metadata translations (client)
 * Usage: const t = usePagesAboutMetadataTranslations();
 *        t("key") // ← autocomplete for title, description, keywords
 */
export function usePagesAboutMetadataTranslations() {
  const t = useTranslationsBase("pages.about.metadata");
  return (key: pages_about_metadata) => t(key);
}

/**
 * Use pages.contact translations (client)
 * Usage: const t = usePagesContactTranslations();
 *        t("key") // ← autocomplete for metadata
 */
export function usePagesContactTranslations() {
  const t = useTranslationsBase("pages.contact");
  return (key: pages_contact) => t(key);
}

/**
 * Use pages.contact.metadata translations (client)
 * Usage: const t = usePagesContactMetadataTranslations();
 *        t("key") // ← autocomplete for title, description, keywords
 */
export function usePagesContactMetadataTranslations() {
  const t = useTranslationsBase("pages.contact.metadata");
  return (key: pages_contact_metadata) => t(key);
}

/**
 * Use common translations (client)
 * Usage: const t = useCommonTranslations();
 *        t("key") // ← autocomplete for actions, theme, user, modals, navigation
 */
export function useCommonTranslations() {
  const t = useTranslationsBase("common");
  return (key: common) => t(key);
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
 *        t("key") // ← autocomplete for light, dark, system, select, description
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

/**
 * Use common.user translations (client)
 * Usage: const t = useCommonUserTranslations();
 *        t("key") // ← autocomplete for dashboard, profile, logout, viewProfile, goToDashboard, signOut, menu, name, email, role, welcome, roles
 */
export function useCommonUserTranslations() {
  const t = useTranslationsBase("common.user");
  return (key: common_user) => t(key);
}

/**
 * Use common.user.roles translations (client)
 * Usage: const t = useCommonUserRolesTranslations();
 *        t("key") // ← autocomplete for admin, club
 */
export function useCommonUserRolesTranslations() {
  const t = useTranslationsBase("common.user.roles");
  return (key: common_user_roles) => t(key);
}

/**
 * Use common.modals translations (client)
 * Usage: const t = useCommonModalsTranslations();
 *        t("key") // ← autocomplete for logout
 */
export function useCommonModalsTranslations() {
  const t = useTranslationsBase("common.modals");
  return (key: common_modals) => t(key);
}

/**
 * Use common.modals.logout translations (client)
 * Usage: const t = useCommonModalsLogoutTranslations();
 *        t("key") // ← autocomplete for title, message, cancel, confirm
 */
export function useCommonModalsLogoutTranslations() {
  const t = useTranslationsBase("common.modals.logout");
  return (key: common_modals_logout) => t(key);
}

/**
 * Use common.navigation translations (client)
 * Usage: const t = useCommonNavigationTranslations();
 *        t("key") // ← autocomplete for public
 */
export function useCommonNavigationTranslations() {
  const t = useTranslationsBase("common.navigation");
  return (key: common_navigation) => t(key);
}

/**
 * Use common.navigation.public translations (client)
 * Usage: const t = useCommonNavigationPublicTranslations();
 *        t("key") // ← autocomplete for title, links
 */
export function useCommonNavigationPublicTranslations() {
  const t = useTranslationsBase("common.navigation.public");
  return (key: common_navigation_public) => t(key);
}

/**
 * Use common.navigation.public.links translations (client)
 * Usage: const t = useCommonNavigationPublicLinksTranslations();
 *        t("key") // ← autocomplete for home, stadiums, about, contact, sectionTitle
 */
export function useCommonNavigationPublicLinksTranslations() {
  const t = useTranslationsBase("common.navigation.public.links");
  return (key: common_navigation_public_links) => t(key);
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
