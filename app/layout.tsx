import React from "react";
import "./globals.css";

const RootLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  return <> {children} </>;
};

export default RootLayout;
