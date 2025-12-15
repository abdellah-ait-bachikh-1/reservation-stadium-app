import { Spinner } from "@heroui/spinner";
import React from "react";

const Loading = () => {
  return (
    <html>
      <body className="w-screen h-screen flec items-center justify-center">
        <Spinner size="lg" />
      </body>
    </html>
  );
};

export default Loading;
