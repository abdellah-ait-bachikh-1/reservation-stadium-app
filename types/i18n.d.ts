// This file is auto-generated. Do not edit manually.
// Run: npm run generate-i18n

import 'next-intl';

declare module 'next-intl' {
  interface IntlMessages {
    pages: {
      error: {
        title: string;
        subtitle: string;
        tryAgain: string;
        goHome: string;
        technicalDetails: string;
        errorId: string;
        noStackTrace: string;
      };
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
      stadiums: {
        metadata: {
          title: string;
          description: string;
          keywords: string;
        };
      };
      about: {
        metadata: {
          title: string;
          description: string;
          keywords: string;
        };
      };
      contact: {
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
      user: {
        dashboard: string;
        profile: string;
        logout: string;
        viewProfile: string;
        goToDashboard: string;
        signOut: string;
        menu: string;
        name: string;
        email: string;
        role: string;
        welcome: string;
        roles: {
          admin: string;
          club: string;
        };
      };
      modals: {
        logout: {
          title: string;
          message: string;
          cancel: string;
          confirm: string;
        };
      };
      navigation: {
        public: {
          title: string;
          links: {
            home: string;
            stadiums: string;
            about: string;
            contact: string;
            sectionTitle: string;
          };
        };
      };
    };
  }
}

// ============================================
// NAMESPACE TYPES FOR AUTOCOMPLETE
// ============================================

export type pages = "error" | "home" | "stadiums" | "about" | "contact";
export type pages_error = "title" | "subtitle" | "tryAgain" | "goHome" | "technicalDetails" | "errorId" | "noStackTrace";
export type pages_home = "hero" | "metadata";
export type pages_home_hero = "title" | "subtitle" | "cta";
export type pages_home_metadata = "title" | "description" | "keywords";
export type pages_stadiums = "metadata";
export type pages_stadiums_metadata = "title" | "description" | "keywords";
export type pages_about = "metadata";
export type pages_about_metadata = "title" | "description" | "keywords";
export type pages_contact = "metadata";
export type pages_contact_metadata = "title" | "description" | "keywords";
export type common = "actions" | "theme" | "user" | "modals" | "navigation";
export type common_actions = "reserve" | "search" | "login" | "register" | "logout" | "save" | "cancel" | "confirm" | "delete" | "edit" | "view" | "book" | "checkout" | "continue" | "back" | "filter" | "sort" | "share" | "download";
export type common_theme = "light" | "dark" | "system" | "select" | "description";
export type common_theme_description = "light" | "dark" | "system";
export type common_user = "dashboard" | "profile" | "logout" | "viewProfile" | "goToDashboard" | "signOut" | "menu" | "name" | "email" | "role" | "welcome" | "roles";
export type common_user_roles = "admin" | "club";
export type common_modals = "logout";
export type common_modals_logout = "title" | "message" | "cancel" | "confirm";
export type common_navigation = "public";
export type common_navigation_public = "title" | "links";
export type common_navigation_public_links = "home" | "stadiums" | "about" | "contact" | "sectionTitle";

// ============================================
// FULL PATH TYPES FOR GLOBAL ACCESS
// ============================================

export type GlobalPath_pages_error_title = "pages.error.title";
export type GlobalPath_pages_error_subtitle = "pages.error.subtitle";
export type GlobalPath_pages_error_tryAgain = "pages.error.tryAgain";
export type GlobalPath_pages_error_goHome = "pages.error.goHome";
export type GlobalPath_pages_error_technicalDetails = "pages.error.technicalDetails";
export type GlobalPath_pages_error_errorId = "pages.error.errorId";
export type GlobalPath_pages_error_noStackTrace = "pages.error.noStackTrace";
export type GlobalPath_pages_home_hero_title = "pages.home.hero.title";
export type GlobalPath_pages_home_hero_subtitle = "pages.home.hero.subtitle";
export type GlobalPath_pages_home_hero_cta = "pages.home.hero.cta";
export type GlobalPath_pages_home_metadata_title = "pages.home.metadata.title";
export type GlobalPath_pages_home_metadata_description = "pages.home.metadata.description";
export type GlobalPath_pages_home_metadata_keywords = "pages.home.metadata.keywords";
export type GlobalPath_pages_stadiums_metadata_title = "pages.stadiums.metadata.title";
export type GlobalPath_pages_stadiums_metadata_description = "pages.stadiums.metadata.description";
export type GlobalPath_pages_stadiums_metadata_keywords = "pages.stadiums.metadata.keywords";
export type GlobalPath_pages_about_metadata_title = "pages.about.metadata.title";
export type GlobalPath_pages_about_metadata_description = "pages.about.metadata.description";
export type GlobalPath_pages_about_metadata_keywords = "pages.about.metadata.keywords";
export type GlobalPath_pages_contact_metadata_title = "pages.contact.metadata.title";
export type GlobalPath_pages_contact_metadata_description = "pages.contact.metadata.description";
export type GlobalPath_pages_contact_metadata_keywords = "pages.contact.metadata.keywords";
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
export type GlobalPath_common_user_dashboard = "common.user.dashboard";
export type GlobalPath_common_user_profile = "common.user.profile";
export type GlobalPath_common_user_logout = "common.user.logout";
export type GlobalPath_common_user_viewProfile = "common.user.viewProfile";
export type GlobalPath_common_user_goToDashboard = "common.user.goToDashboard";
export type GlobalPath_common_user_signOut = "common.user.signOut";
export type GlobalPath_common_user_menu = "common.user.menu";
export type GlobalPath_common_user_name = "common.user.name";
export type GlobalPath_common_user_email = "common.user.email";
export type GlobalPath_common_user_role = "common.user.role";
export type GlobalPath_common_user_welcome = "common.user.welcome";
export type GlobalPath_common_user_roles_admin = "common.user.roles.admin";
export type GlobalPath_common_user_roles_club = "common.user.roles.club";
export type GlobalPath_common_modals_logout_title = "common.modals.logout.title";
export type GlobalPath_common_modals_logout_message = "common.modals.logout.message";
export type GlobalPath_common_modals_logout_cancel = "common.modals.logout.cancel";
export type GlobalPath_common_modals_logout_confirm = "common.modals.logout.confirm";
export type GlobalPath_common_navigation_public_title = "common.navigation.public.title";
export type GlobalPath_common_navigation_public_links_home = "common.navigation.public.links.home";
export type GlobalPath_common_navigation_public_links_stadiums = "common.navigation.public.links.stadiums";
export type GlobalPath_common_navigation_public_links_about = "common.navigation.public.links.about";
export type GlobalPath_common_navigation_public_links_contact = "common.navigation.public.links.contact";
export type GlobalPath_common_navigation_public_links_sectionTitle = "common.navigation.public.links.sectionTitle";

export type AllGlobalPaths = GlobalPath_pages_error_title | GlobalPath_pages_error_subtitle | GlobalPath_pages_error_tryAgain | GlobalPath_pages_error_goHome | GlobalPath_pages_error_technicalDetails | GlobalPath_pages_error_errorId | GlobalPath_pages_error_noStackTrace | GlobalPath_pages_home_hero_title | GlobalPath_pages_home_hero_subtitle | GlobalPath_pages_home_hero_cta | GlobalPath_pages_home_metadata_title | GlobalPath_pages_home_metadata_description | GlobalPath_pages_home_metadata_keywords | GlobalPath_pages_stadiums_metadata_title | GlobalPath_pages_stadiums_metadata_description | GlobalPath_pages_stadiums_metadata_keywords | GlobalPath_pages_about_metadata_title | GlobalPath_pages_about_metadata_description | GlobalPath_pages_about_metadata_keywords | GlobalPath_pages_contact_metadata_title | GlobalPath_pages_contact_metadata_description | GlobalPath_pages_contact_metadata_keywords | GlobalPath_common_actions_reserve | GlobalPath_common_actions_search | GlobalPath_common_actions_login | GlobalPath_common_actions_register | GlobalPath_common_actions_logout | GlobalPath_common_actions_save | GlobalPath_common_actions_cancel | GlobalPath_common_actions_confirm | GlobalPath_common_actions_delete | GlobalPath_common_actions_edit | GlobalPath_common_actions_view | GlobalPath_common_actions_book | GlobalPath_common_actions_checkout | GlobalPath_common_actions_continue | GlobalPath_common_actions_back | GlobalPath_common_actions_filter | GlobalPath_common_actions_sort | GlobalPath_common_actions_share | GlobalPath_common_actions_download | GlobalPath_common_theme_light | GlobalPath_common_theme_dark | GlobalPath_common_theme_system | GlobalPath_common_theme_select | GlobalPath_common_theme_description_light | GlobalPath_common_theme_description_dark | GlobalPath_common_theme_description_system | GlobalPath_common_user_dashboard | GlobalPath_common_user_profile | GlobalPath_common_user_logout | GlobalPath_common_user_viewProfile | GlobalPath_common_user_goToDashboard | GlobalPath_common_user_signOut | GlobalPath_common_user_menu | GlobalPath_common_user_name | GlobalPath_common_user_email | GlobalPath_common_user_role | GlobalPath_common_user_welcome | GlobalPath_common_user_roles_admin | GlobalPath_common_user_roles_club | GlobalPath_common_modals_logout_title | GlobalPath_common_modals_logout_message | GlobalPath_common_modals_logout_cancel | GlobalPath_common_modals_logout_confirm | GlobalPath_common_navigation_public_title | GlobalPath_common_navigation_public_links_home | GlobalPath_common_navigation_public_links_stadiums | GlobalPath_common_navigation_public_links_about | GlobalPath_common_navigation_public_links_contact | GlobalPath_common_navigation_public_links_sectionTitle;

// Helper: Get keys for any namespace
export type NamespaceKeys<T, P extends string> = 
  P extends `${infer First}.${infer Rest}`
    ? First extends keyof T
      ? NamespaceKeys<T[First], Rest>
      : never
    : P extends keyof T
      ? keyof T[P]
      : never;
