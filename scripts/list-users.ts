import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (users.length === 0) {
      console.log("ℹ️  Нет пользователей в базе данных");
      return;
    }

    console.log(`\n📋 Список пользователей (всего: ${users.length}):\n`);
    console.log("─".repeat(80));

    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Telegram ID: ${user.telegramId}`);
      console.log(`   Создан: ${user.createdAt.toLocaleString()}`);
      console.log("─".repeat(80));
    });
  } catch (error: any) {
    console.error(
      "❌ Ошибка при получении списка пользователей:",
      error.message
    );
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
