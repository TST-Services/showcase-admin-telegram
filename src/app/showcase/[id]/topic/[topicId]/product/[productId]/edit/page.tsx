import ProductEditForm from "@/components/pages/ProductEdit";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string; topicId: string; productId: string }>;
}) {
  const { id, topicId, productId } = await params;
  return <ProductEditForm showcaseId={id} topicId={topicId} productId={productId} />;
}
