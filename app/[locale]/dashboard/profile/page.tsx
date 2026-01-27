import { Metadata } from "next";
import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth";
import { UserProfileData } from "@/types/profile";
import ProfileClient from "@/components/dashboard/profile/ProfileClient";
import { getUserProfileData } from "@/lib/queries/dashboard/profile";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`../../../../messages/${locale}.json`)).default;

  return {
    title: `${messages.pages?.dashboard?.profile?.metadata?.title || "Profile"} - ${messages.common?.appName || "Tantan Stadium Booking"}`,
    description: messages.pages?.dashboard?.profile?.metadata?.description,
  };
}

const ProfilePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const session = await getSession();
  
  if (!session || !session.user) {
    redirect({ locale: locale, href: "/" });
    return;
  }

  // Get user profile data
  let profileData: UserProfileData;
  try {
    profileData = await getUserProfileData(session.user.id);
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    profileData = getStaticProfileData(session.user);
  }

  return (
    <ProfileClient
      user={session.user}
      profileData={profileData}
      locale={locale}
    />
  );
};

export default ProfilePage;

function getStaticProfileData(user: any): UserProfileData {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      preferredLocale: user.preferredLocale || "FR",
      role: user.role,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
}