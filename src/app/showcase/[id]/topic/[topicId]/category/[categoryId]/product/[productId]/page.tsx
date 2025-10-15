import TelegramProvider from "@/components/providers/TelegramProvider";
import ProductDetailForm from "@/components/pages/ProductDetail";

export default async function ProductDetailPage({
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
      <ProductDetailForm
        showcaseId={id}
        topicId={topicId}
        categoryId={categoryId}
        productId={productId}
      />
    </TelegramProvider>
  );
}
