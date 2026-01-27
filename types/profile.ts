export interface UserProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    preferredLocale: string;
    role: "ADMIN" | "CLUB";
    emailVerifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}