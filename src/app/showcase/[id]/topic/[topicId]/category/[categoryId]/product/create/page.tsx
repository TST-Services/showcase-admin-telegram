import TelegramProvider from "@/components/providers/TelegramProvider";
import ProductCreateForm from "@/components/pages/ProductCreate";

export default async function ProductCreatePage({
  params,
}: {
  params: Promise<{ id: string; topicId: string; categoryId: string }>;
}) {
  const { id, topicId, categoryId } = await params;
  return (
    <TelegramProvider>
      <ProductCreateForm
        showcaseId={id}
        topicId={topicId}
        categoryId={categoryId}
      />
    </TelegramProvider>
  );
}
