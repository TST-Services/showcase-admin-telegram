import TelegramProvider from "@/components/providers/TelegramProvider";
import ProductEditForm from "@/components/pages/ProductEdit";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{
    id: string;
    topicId: string;
    categoryId: string;
    productId: string;
  }>;
}) {
  const { id, topicId, categoryId, productId } = await params;
  return (
    <TelegramProvider>
      <ProductEditForm
        showcaseId={id}
        topicId={topicId}
        categoryId={categoryId}
        productId={productId}
      />
    </TelegramProvider>
  );
}
