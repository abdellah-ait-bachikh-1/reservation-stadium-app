// This file is auto-generated. Do not edit manually.
// Run: npm run generate-i18n

import 'next-intl';

declare module 'next-intl' {
  interface IntlMessages {
    pages: {
      home: {
        title: string;
      };
      about: {
        title: string;
      };
    };
  }
}

// ============================================
// NAMESPACE TYPES FOR AUTOCOMPLETE
// ============================================

export type pages_home = "title";
export type pages_about = "title";

// ============================================
// FULL PATH TYPES FOR GLOBAL ACCESS
// ============================================

export type GlobalPath_pages_home_title = "pages.home.title";
export type GlobalPath_pages_about_title = "pages.about.title";

export type AllGlobalPaths = GlobalPath_pages_home_title | GlobalPath_pages_about_title;

// Helper: Get keys for any namespace
export type NamespaceKeys<T, P extends string> = 
  P extends `${infer First}.${infer Rest}`
    ? First extends keyof T
      ? NamespaceKeys<T[First], Rest>
      : never
    : P extends keyof T
      ? keyof T[P]
      : never;
