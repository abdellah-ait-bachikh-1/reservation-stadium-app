import React from "react";
import "./globals.css";
import { Metadata } from "next";
import { getAppName } from "@/utils";

// const metadata: Metadata = {
//   title: getAppName("fr"),
//   description: "descreption",
//   keywords: "keywords",
// };
const RootLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  return <>{children}</>;
};

export default RootLayout;
