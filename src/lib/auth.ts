"use server";

import { prisma } from "@/lib/prisma";

export async function checkUserAccess(telegramId: number): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });

    return user !== null;
  } catch (error) {
    console.error("Error checking user access:", error);
    return false;
  }
}
