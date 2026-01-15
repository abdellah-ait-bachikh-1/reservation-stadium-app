import React from "react";
import "./globals.css";

// const metadata: Metadata = {
//   title: getAppName("fr"),
//   description: "descreption",
//   keywords: "keywords",
// };
const RootLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  return <>{children}</>;
};

export default RootLayout;
