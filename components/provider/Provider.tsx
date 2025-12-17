"use client";

import { AuthContextProvider } from "@/context/authContext";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <AuthContextProvider>
      <HeroUIProvider locale={locale} className="min-h-screen w-full">
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          key={"theme"}
          storageKey="theme"
        >
          {children}
          <ToastProvider placement="top-center"  />
        </NextThemesProvider>
      </HeroUIProvider>
    </AuthContextProvider>
  );
}
