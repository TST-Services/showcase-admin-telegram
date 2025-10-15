import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addUser(telegramId: string) {
  try {
    const user = await prisma.user.create({
      data: {
        telegramId: BigInt(telegramId),
      },
    });

    console.log("✅ Пользователь успешно добавлен:");
    console.log(`   ID: ${user.id}`);
    console.log(`   Telegram ID: ${user.telegramId}`);
    console.log(`   Создан: ${user.createdAt}`);
  } catch (error: any) {
    if (error.code === "P2002") {
      console.error(
        "❌ Ошибка: Пользователь с таким Telegram ID уже существует"
      );
    } else {
      console.error("❌ Ошибка при добавлении пользователя:", error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

const telegramId = process.argv[2];

if (!telegramId) {
  console.error("❌ Использование: tsx scripts/add-user.ts <telegram_id>");
  console.error("   Пример: tsx scripts/add-user.ts 123456789");
  process.exit(1);
}

if (!/^\d+$/.test(telegramId)) {
  console.error("❌ Ошибка: Telegram ID должен быть числом");
  process.exit(1);
}

addUser(telegramId);
