"use client";
import { HeroUIProvider } from "@heroui/system";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";

import React from "react";

const Providers = ({
  children,
  locale,
  messages,
}: {
  children: Readonly<React.ReactNode>;
  locale: string;
  messages: any;
}) => {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <HeroUIProvider locale={locale}>{children}</HeroUIProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
};

export default Providers;
