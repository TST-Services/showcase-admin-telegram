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

export async function updateTopic(
  id: string,
  data: { title: string; priority?: number }
) {
  try {
    const topic = await prisma.showcaseTopic.update({
      where: { id },
      data: {
        title: data.title,
        priority: data.priority !== undefined ? data.priority : 0,
      },
    });
    revalidatePath(`/topic/${id}`);
    return { success: true, topic };
  } catch (error) {
    console.error("Error updating topic:", error);
    return { success: false, error: "Failed to update topic" };
  }
}

export async function getTopicCategories(topicId: string) {
  try {
    const categories = await prisma.showcaseCategory.findMany({
      where: { topicId },
      orderBy: { title: "asc" },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getTopicProducts(topicId: string) {
  try {
    const products = await prisma.showcaseProduct.findMany({
      where: { topicId },
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch (error) {
    console.error("Error fetching topic products:", error);
    throw error;
  }
}
