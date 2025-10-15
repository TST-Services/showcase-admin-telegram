import TelegramProvider from "@/components/providers/TelegramProvider";
import TopicEditForm from "@/components/pages/TopicEdit";

export default async function TopicEditPage({
  params,
}: {
  params: Promise<{ id: string; topicId: string }>;
}) {
  const { id, topicId } = await params;
  return (
    <TelegramProvider>
      <TopicEditForm showcaseId={id} topicId={topicId} />
    </TelegramProvider>
  );
}
