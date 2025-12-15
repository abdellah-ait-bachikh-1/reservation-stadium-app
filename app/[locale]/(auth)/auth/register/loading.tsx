import { Spinner } from "@heroui/spinner";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner size="lg" label="Loadign Regisetr Page" />
    </div>
  );
};

export default Loading;
