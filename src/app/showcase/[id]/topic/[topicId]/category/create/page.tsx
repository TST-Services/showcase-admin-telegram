import TelegramProvider from "@/components/providers/TelegramProvider";
import CategoryCreateForm from "@/components/pages/CategoryCreate";

export default async function CategoryCreatePage({
  params,
}: {
  params: Promise<{ id: string; topicId: string }>;
}) {
  const { id, topicId } = await params;
  return (
    <TelegramProvider>
      <CategoryCreateForm showcaseId={id} topicId={topicId} />
    </TelegramProvider>
  );
}
