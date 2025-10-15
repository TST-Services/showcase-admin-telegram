import TelegramProvider from "@/components/providers/TelegramProvider";
import CategoryDetailForm from "@/components/pages/CategoryDetail";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string; topicId: string; categoryId: string }>;
}) {
  const { id, topicId, categoryId } = await params;
  return (
    <TelegramProvider>
      <CategoryDetailForm
        showcaseId={id}
        topicId={topicId}
        categoryId={categoryId}
      />
    </TelegramProvider>
  );
}
