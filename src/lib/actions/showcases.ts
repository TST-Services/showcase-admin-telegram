"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getShowcases() {
  try {
    const showcases = await prisma.showcase.findMany({
      orderBy: { createdAt: "desc" },
    });
    return showcases;
  } catch (error) {
    console.error("Error fetching showcases:", error);
    throw new Error("Failed to fetch showcases");
  }
}

export async function getShowcase(id: string) {
  try {
    const showcase = await prisma.showcase.findUnique({
      where: { id },
    });
    return showcase;
  } catch (error) {
    console.error("Error fetching showcase:", error);
    throw new Error("Failed to fetch showcase");
  }
}

export async function createShowcase(data: {
  name: string;
  uniqueName: string;
  description?: string;
  template: "BANK" | "SHOP";
  primaryColor: string;
  logoUrl: string;
}) {
  try {
    const showcase = await prisma.showcase.create({
      data,
    });
    revalidatePath("/");
    return { success: true, showcase };
  } catch (error: any) {
    console.error("Error creating showcase:", error);
    if (error.code === "P2002") {
      return {
        success: false,
        error: "Витрина с таким уникальным именем уже существует",
      };
    }
    return { success: false, error: "Failed to create showcase" };
  }
}

export async function updateShowcase(
  id: string,
  data: {
    name: string;
    description?: string;
    template: "BANK" | "SHOP";
    primaryColor: string;
    logoUrl: string;
  }
) {
  try {
    const showcase = await prisma.showcase.update({
      where: { id },
      data,
    });
    revalidatePath(`/showcase/${id}`);
    return { success: true, showcase };
  } catch (error) {
    console.error("Error updating showcase:", error);
    return { success: false, error: "Failed to update showcase" };
  }
}

export async function deleteShowcase(id: string) {
  try {
    await prisma.showcase.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting showcase:", error);
    return { success: false, error: "Failed to delete showcase" };
  }
}

export async function getShowcaseTopics(showcaseId: string) {
  try {
    const topics = await prisma.showcaseTopic.findMany({
      where: { showcaseId },
      include: {
        _count: {
          select: { categories: true },
        },
      },
    });
    return topics;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw new Error("Failed to fetch topics");
  }
}

export async function createTopic(showcaseId: string, title: string) {
  try {
    const topic = await prisma.showcaseTopic.create({
      data: {
        title,
        showcaseId,
      },
    });
    revalidatePath(`/showcase/${showcaseId}`);
    return { success: true, topic };
  } catch (error: any) {
    console.error("Error creating topic:", error);
    if (error.code === "P2002") {
      return {
        success: false,
        error: "Топик с таким названием уже существует в этой витрине",
      };
    }
    return { success: false, error: "Failed to create topic" };
  }
}
