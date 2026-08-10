import db from "@/lib/db";

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  if (!token) return false;

  const blacklisted = await db.tokenBlacklist.findUnique({
    where: { token },
  });

  return !!blacklisted;
}