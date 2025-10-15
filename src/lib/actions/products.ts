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
        categoryId,
        showcaseId: category.topic.showcaseId,
      },
    });
    revalidatePath(`/category/${categoryId}`);
    return { success: true, product };
  } catch (error: any) {
    console.error("Error creating product:", error);
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
      select: { categoryId: true },
    });

    await prisma.showcaseProduct.delete({
      where: { id },
    });

    if (product?.categoryId) {
      revalidatePath(`/category/${product.categoryId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
