"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProduct(id: string) {
  try {
    const product = await prisma.showcaseProduct.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function createProduct(
  categoryId: string,
  data: {
    title: string;
    description?: string;
    iconUrl?: string;
    buttonUrl?: string;
    backgroundColor?: string;
  }
) {
  try {
    // Получаем showcaseId из категории
    const category = await prisma.showcaseCategory.findUnique({
      where: { id: categoryId },
      select: { topic: { select: { showcaseId: true } } },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    const product = await prisma.showcaseProduct.create({
      data: {
        title: data.title,
        description: data.description || "",
        icon: data.iconUrl || "",
        link: data.buttonUrl || "",
        backgroundColor: data.backgroundColor || null,
        categoryId,
        showcaseId: category.topic.showcaseId,
      },
    });
    revalidatePath(`/category/${categoryId}`);
    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "Продукт с таким названием уже существует",
      };
    }
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(
  id: string,
  data: {
    title: string;
    description?: string;
    iconUrl?: string;
    buttonUrl?: string;
    backgroundColor?: string;
  }
) {
  try {
    const product = await prisma.showcaseProduct.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || "",
        icon: data.iconUrl || "",
        link: data.buttonUrl || "",
        backgroundColor: data.backgroundColor || null,
      },
    });
    revalidatePath(`/category/${product.categoryId}`);
    return { success: true, product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await prisma.showcaseProduct.findUnique({
      where: { id },
      select: { categoryId: true, topicId: true },
    });

    await prisma.showcaseProduct.delete({
      where: { id },
    });

    if (product?.categoryId) {
      revalidatePath(`/category/${product.categoryId}`);
    }
    if (product?.topicId) {
      revalidatePath(`/topic/${product.topicId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function createProductForTopic(
  showcaseId: string,
  topicId: string,
  data: {
    title: string;
    description?: string;
    iconUrl?: string;
    buttonUrl?: string;
    backgroundColor?: string;
  }
) {
  try {
    const product = await prisma.showcaseProduct.create({
      data: {
        title: data.title,
        description: data.description || "",
        icon: data.iconUrl || "",
        link: data.buttonUrl || "",
        backgroundColor: data.backgroundColor || null,
        topicId,
        showcaseId,
      },
    });
    revalidatePath(`/topic/${topicId}`);
    return { success: true, product };
  } catch (error) {
    console.error("Error creating product for topic:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "Продукт с таким названием уже существует",
      };
    }
    return { success: false, error: "Failed to create product" };
  }
}
