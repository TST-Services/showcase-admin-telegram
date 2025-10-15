import TelegramProvider from "@/components/providers/TelegramProvider";
import TopicCreateForm from "@/components/pages/TopicCreate";

export default async function TopicCreatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TelegramProvider>
      <TopicCreateForm showcaseId={id} />
    </TelegramProvider>
  );
}
