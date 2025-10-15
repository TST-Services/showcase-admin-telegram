"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(
  topicId: string,
  data: {
    title: string;
    description?: string;
    iconUrl?: string;
  }
) {
  try {
    const category = await prisma.showcaseCategory.create({
      data: {
        title: data.title,
        description: data.description || null,
        imgUrl: data.iconUrl || null,
        topicId,
      },
    });
    revalidatePath(`/topic/${topicId}`);
    return { success: true, category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function getCategory(id: string) {
  try {
    const category = await prisma.showcaseCategory.findUnique({
      where: { id },
    });
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error("Failed to fetch category");
  }
}

export async function updateCategory(
  id: string,
  data: {
    title: string;
    description?: string;
    iconUrl?: string;
  }
) {
  try {
    const category = await prisma.showcaseCategory.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        imgUrl: data.iconUrl || null,
      },
    });
    revalidatePath(`/category/${id}`);
    return { success: true, category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const category = await prisma.showcaseCategory.findUnique({
      where: { id },
      select: { topicId: true },
    });

    await prisma.showcaseCategory.delete({
      where: { id },
    });

    if (category?.topicId) {
      revalidatePath(`/topic/${category.topicId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

export async function getCategoryProducts(categoryId: string) {
  try {
    const products = await prisma.showcaseProduct.findMany({
      where: { categoryId },
      orderBy: { title: "asc" },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}
