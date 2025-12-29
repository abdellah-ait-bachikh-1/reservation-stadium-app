"use client";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import ClubInfo from "./ClubInfo";
import { MdLock, MdPersonOutline } from "react-icons/md";
import { Tab, Tabs } from "@heroui/tabs";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { TPreferredLocale } from "@/lib/types";
import { UserLocale, UserRole } from "@/lib/generated/prisma/enums";
import { Skeleton } from "@heroui/skeleton";
export type UserProfile = {
  id: string;
  fullNameFr: string;
  fullNameAr: string;
  email: string;
  approved: boolean;
  role: UserRole;
  phoneNumber: string;
  emailVerifiedAt: Date | null;
  preferredLocale: UserLocale;
  createdAt: Date;
  updatedAt: Date;
  club: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    nameAr: string;
    nameFr: string;
    addressFr: string;
    addressAr: string;
    sport: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date | null;
      nameAr: string;
      nameFr: string;
    };
  } | null;
};
const SettingsTabs = () => {
  const t = useTranslations("Pages.Dashboard.Profile.SettingsTabs");
  const [data, setData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch("/api/dashboard/profile/info");
        const responseData: UserProfile = await response.json();
        setData(responseData);
        console.log(responseData);
      } catch (error) {
        console.log({ error });
      }finally{
        setIsLoading(false)
      }
    };
    getUserInfo();
  }, []);
  if(isLoading){
    return <Skeleton  className="w-full h-20" />
  }
  const tabs = [
    {
      key: "profile",
      title: t("tabs.profile"),
      icon: MdPersonOutline,
      component: data ? <ProfileInfo user={data} /> : null,
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
          base: "w-full flex justify-center",
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
