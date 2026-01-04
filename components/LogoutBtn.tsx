import { Button, ButtonProps } from "@heroui/button";
import React from "react";

const LogoutBtn = (props: ButtonProps) => {
  return (
    <>
      <Button {...props}> {props.children} </Button>
    </>
  );
};

export default LogoutBtn;
