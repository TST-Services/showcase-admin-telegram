"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTopic(id: string) {
  try {
    const topic = await prisma.showcaseTopic.findUnique({
      where: { id },
    });

    if (!topic) {
      throw new Error("Topic not found");
    }

    return topic;
  } catch (error) {
    console.error("Error fetching topic:", error);
    throw error;
  }
}

export async function deleteTopic(id: string) {
  try {
    const topic = await prisma.showcaseTopic.findUnique({
      where: { id },
      select: { showcaseId: true },
    });

    await prisma.showcaseTopic.delete({
      where: { id },
    });

    if (topic?.showcaseId) {
      revalidatePath(`/showcase/${topic.showcaseId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting topic:", error);
    return { success: false, error: "Failed to delete topic" };
  }
}

export async function getTopicCategories(topicId: string) {
  try {
    console.log("Fetching categories for topic:", topicId);
    const categories = await prisma.showcaseCategory.findMany({
      where: { topicId },
      orderBy: { title: "asc" },
    });
    console.log("Found categories:", categories.length);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
