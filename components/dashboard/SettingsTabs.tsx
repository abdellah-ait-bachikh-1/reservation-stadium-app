"use client";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import ClubInfo from "./ClubInfo";
import { MdLock, MdPersonOutline } from "react-icons/md";
import { Tab, Tabs } from "@heroui/tabs";
import { useTranslations } from "next-intl";

const SettingsTabs = () => {
  const t = useTranslations("Pages.Dashboard.Profile.SettingsTabs");
  
  const tabs = [
    {
      key: "profile",
      title: t("tabs.profile"),
      icon: MdPersonOutline,
      component: <ProfileInfo />,
    },
    {
      key: "password",
      title: t("tabs.password"),
      icon: MdLock,
      component: <ChangePassword />,
    },
    {
      key: "club",
      title: t("tabs.club"),
      icon: MdPersonOutline,
      component: <ClubInfo />,
    },
  ];
  
  return (
    <div className="bg-white dark:bg-gray-950 rounded-xl p-4 border border-slate-200 dark:border-slate-700 ">
      <Tabs
        aria-label={t("ariaLabel")}
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider ",
          cursor: "w-full bg-[#22d3ee] ",
          tab: "max-w-fit px-0 h-12 ",
          tabContent: "group-data-[selected=true]:text-[#06b6d4] ",
          base: "w-full flex justify-center"
        }}
        color="primary"
        variant="underlined" 
        size="sm"
        defaultSelectedKey={"profile"}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            title={
              <div className="flex items-center space-x-2">
                <tab.icon />
                <span>{tab.title}</span>
              </div>
            }
          >
            <div className="mt-6">{tab.component}</div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default SettingsTabs;