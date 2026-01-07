import { colors } from "@heroui/theme";
import {  HashLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <HashLoader size={150} color={colors.yellow[400]} />
    </div>
  );
}
