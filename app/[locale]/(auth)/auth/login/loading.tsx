import { Spinner } from "@heroui/spinner";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner size="lg" label="Loadign Login Page" />
    </div>
  );
};

export default Loading;
