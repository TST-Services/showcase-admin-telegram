import ProductDetailForm from "@/components/pages/ProductDetail";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string; topicId: string; productId: string }>;
}) {
  const { id, topicId, productId } = await params;
  return <ProductDetailForm showcaseId={id} topicId={topicId} productId={productId} />;
}
