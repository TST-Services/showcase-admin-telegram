/**
 * Сервис для загрузки изображений на ImgBB
 */

interface ImgBBResponse {
  success: boolean;
  data?: {
    url: string;
    display_url: string;
    delete_url: string;
  };
  error?: {
    message: string;
  };
}

export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export class ImageUploadService {
  private apiKey: string;
  private baseUrl = "https://api.imgbb.com/1/upload";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Загружает изображение на ImgBB
   */
  async uploadImage(file: File): Promise<ImageUploadResponse> {
    try {
      // Проверяем тип файла
      if (!file.type.startsWith("image/")) {
        return {
          success: false,
          error:
            "Неподдерживаемый формат файла. Поддерживаются только изображения.",
        };
      }

      // Проверяем размер файла (максимум 32MB для ImgBB)
      if (file.size > 32 * 1024 * 1024) {
        return {
          success: false,
          error: "Размер файла превышает 32MB",
        };
      }

      // Конвертируем файл в base64
      const base64Image = await this.fileToBase64(file);

      // Подготавливаем данные для запроса
      const formData = new FormData();
      formData.append("key", this.apiKey);
      formData.append("image", base64Image);
      formData.append("name", file.name || "showcase_image");

      // Отправляем запрос
      const response = await fetch(this.baseUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ImgBBResponse = await response.json();

      if (result.success && result.data) {
        return {
          success: true,
          url: result.data.url,
        };
      } else {
        return {
          success: false,
          error: result.error?.message || "Неизвестная ошибка",
        };
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return {
        success: false,
        error: "Произошла ошибка при загрузке изображения",
      };
    }
  }

  /**
   * Конвертирует File в base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Убираем префикс "data:image/...;base64,"
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }
}
