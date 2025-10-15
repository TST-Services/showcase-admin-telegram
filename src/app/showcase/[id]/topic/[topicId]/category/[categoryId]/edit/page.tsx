import TelegramProvider from "@/components/providers/TelegramProvider";
import CategoryEditForm from "@/components/pages/CategoryEdit";

export default async function CategoryEditPage({
  params,
}: {
  params: Promise<{ id: string; topicId: string; categoryId: string }>;
}) {
  const { id, topicId, categoryId } = await params;
  return (
    <TelegramProvider>
      <CategoryEditForm
        showcaseId={id}
        topicId={topicId}
        categoryId={categoryId}
      />
    </TelegramProvider>
  );
}
