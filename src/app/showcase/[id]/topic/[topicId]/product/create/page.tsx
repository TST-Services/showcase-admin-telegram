import ProductCreateForm from "@/components/pages/ProductCreate";

export default async function ProductCreatePage({
  params,
}: {
  params: Promise<{ id: string; topicId: string }>;
}) {
  const { id, topicId } = await params;
  return <ProductCreateForm showcaseId={id} topicId={topicId} />;
}
