/**
 * Сервис для загрузки изображений в Yandex Cloud S3
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "ru-central1",
  endpoint: "https://storage.yandexcloud.net",
  credentials: {
    accessKeyId: process.env.YC_S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.YC_S3_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.YC_S3_BUCKET_NAME || "";

export interface S3UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Загружает файл в S3 и возвращает публичную ссылку
 */
export async function uploadToS3(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<S3UploadResult> {
  try {
    if (!BUCKET_NAME) {
      return { success: false, error: "S3 bucket не настроен" };
    }

    // Генерируем уникальное имя файла
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = fileName.split(".").pop() || "jpg";
    const key = `uploads/${timestamp}-${randomStr}.${ext}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );

    // Формируем публичную ссылку
    const url = `https://${BUCKET_NAME}.storage.yandexcloud.net/${key}`;

    return { success: true, url };
  } catch (error) {
    console.error("S3 upload error:", error);
    return {
      success: false,
      error: "Ошибка загрузки файла в хранилище",
    };
  }
}
