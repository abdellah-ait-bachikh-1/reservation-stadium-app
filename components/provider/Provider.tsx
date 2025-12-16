"use client";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <HeroUIProvider locale={locale} className="min-h-screen w-full">
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={true}
        key={"theme"}
        storageKey="theme" 
      >
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
