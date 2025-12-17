import db from "./db";

export const getUserByEmailFromDb = async (email: string) => {
  return await db.user.findUnique({ where: { email: email } });
};
