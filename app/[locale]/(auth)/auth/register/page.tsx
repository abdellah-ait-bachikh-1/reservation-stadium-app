import { Link } from "@/i18n/navigation";
import { button, cn } from "@heroui/theme";

const ReisterPage = async () => {
  await new Promise((res) => setTimeout(res, 5000));
  return (
    <div>
      ReisterPage
      <Link href={"/"} className={cn(button())}>
        Home
      </Link>
    </div>
  );
};

export default ReisterPage;
