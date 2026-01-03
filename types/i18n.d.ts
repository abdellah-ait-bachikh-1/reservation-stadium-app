// This file is auto-generated. Do not edit manually.
// Run: npm run generate-i18n

import 'next-intl';

declare module 'next-intl' {
  interface IntlMessages {
    pages: {
      home: {
        hero: {
          title: string;
          subtitle: string;
          cta: string;
        };
        metadata: {
          title: string;
          description: string;
          keywords: string;
        };
      };
    };
    common: {
      actions: {
        reserve: string;
        search: string;
        login: string;
        register: string;
        logout: string;
        save: string;
        cancel: string;
        confirm: string;
        delete: string;
        edit: string;
        view: string;
        book: string;
        checkout: string;
        continue: string;
        back: string;
        filter: string;
        sort: string;
        share: string;
        download: string;
      };
      theme: {
        light: string;
        dark: string;
        system: string;
        select: string;
        description: {
          light: string;
          dark: string;
          system: string;
        };
      };
    };
  }
}

// ============================================
// NAMESPACE TYPES FOR AUTOCOMPLETE
// ============================================

export type pages_home_hero = "title" | "subtitle" | "cta";
export type pages_home_metadata = "title" | "description" | "keywords";
export type common_actions = "reserve" | "search" | "login" | "register" | "logout" | "save" | "cancel" | "confirm" | "delete" | "edit" | "view" | "book" | "checkout" | "continue" | "back" | "filter" | "sort" | "share" | "download";
export type common_theme = "light" | "dark" | "system" | "select";
export type common_theme_description = "light" | "dark" | "system";

// ============================================
// FULL PATH TYPES FOR GLOBAL ACCESS
// ============================================

export type GlobalPath_pages_home_hero_title = "pages.home.hero.title";
export type GlobalPath_pages_home_hero_subtitle = "pages.home.hero.subtitle";
export type GlobalPath_pages_home_hero_cta = "pages.home.hero.cta";
export type GlobalPath_pages_home_metadata_title = "pages.home.metadata.title";
export type GlobalPath_pages_home_metadata_description = "pages.home.metadata.description";
export type GlobalPath_pages_home_metadata_keywords = "pages.home.metadata.keywords";
export type GlobalPath_common_actions_reserve = "common.actions.reserve";
export type GlobalPath_common_actions_search = "common.actions.search";
export type GlobalPath_common_actions_login = "common.actions.login";
export type GlobalPath_common_actions_register = "common.actions.register";
export type GlobalPath_common_actions_logout = "common.actions.logout";
export type GlobalPath_common_actions_save = "common.actions.save";
export type GlobalPath_common_actions_cancel = "common.actions.cancel";
export type GlobalPath_common_actions_confirm = "common.actions.confirm";
export type GlobalPath_common_actions_delete = "common.actions.delete";
export type GlobalPath_common_actions_edit = "common.actions.edit";
export type GlobalPath_common_actions_view = "common.actions.view";
export type GlobalPath_common_actions_book = "common.actions.book";
export type GlobalPath_common_actions_checkout = "common.actions.checkout";
export type GlobalPath_common_actions_continue = "common.actions.continue";
export type GlobalPath_common_actions_back = "common.actions.back";
export type GlobalPath_common_actions_filter = "common.actions.filter";
export type GlobalPath_common_actions_sort = "common.actions.sort";
export type GlobalPath_common_actions_share = "common.actions.share";
export type GlobalPath_common_actions_download = "common.actions.download";
export type GlobalPath_common_theme_light = "common.theme.light";
export type GlobalPath_common_theme_dark = "common.theme.dark";
export type GlobalPath_common_theme_system = "common.theme.system";
export type GlobalPath_common_theme_select = "common.theme.select";
export type GlobalPath_common_theme_description_light = "common.theme.description.light";
export type GlobalPath_common_theme_description_dark = "common.theme.description.dark";
export type GlobalPath_common_theme_description_system = "common.theme.description.system";

export type AllGlobalPaths = GlobalPath_pages_home_hero_title | GlobalPath_pages_home_hero_subtitle | GlobalPath_pages_home_hero_cta | GlobalPath_pages_home_metadata_title | GlobalPath_pages_home_metadata_description | GlobalPath_pages_home_metadata_keywords | GlobalPath_common_actions_reserve | GlobalPath_common_actions_search | GlobalPath_common_actions_login | GlobalPath_common_actions_register | GlobalPath_common_actions_logout | GlobalPath_common_actions_save | GlobalPath_common_actions_cancel | GlobalPath_common_actions_confirm | GlobalPath_common_actions_delete | GlobalPath_common_actions_edit | GlobalPath_common_actions_view | GlobalPath_common_actions_book | GlobalPath_common_actions_checkout | GlobalPath_common_actions_continue | GlobalPath_common_actions_back | GlobalPath_common_actions_filter | GlobalPath_common_actions_sort | GlobalPath_common_actions_share | GlobalPath_common_actions_download | GlobalPath_common_theme_light | GlobalPath_common_theme_dark | GlobalPath_common_theme_system | GlobalPath_common_theme_select | GlobalPath_common_theme_description_light | GlobalPath_common_theme_description_dark | GlobalPath_common_theme_description_system;

// Helper: Get keys for any namespace
export type NamespaceKeys<T, P extends string> = 
  P extends `${infer First}.${infer Rest}`
    ? First extends keyof T
      ? NamespaceKeys<T[First], Rest>
      : never
    : P extends keyof T
      ? keyof T[P]
      : never;
