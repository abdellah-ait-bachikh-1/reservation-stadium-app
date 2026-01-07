"use client";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

const TestToast = () => {
  return (
    <Button
      onPress={() => {
        addToast({
          title: "hello",
          description: "this is test toast if it's work",
          color: "success",
        });
      }}
    >
      TestToast
    </Button>
  );
};

export default TestToast;
