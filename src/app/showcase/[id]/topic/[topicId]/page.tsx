import TelegramProvider from "@/components/providers/TelegramProvider";
import TopicDetailForm from "@/components/pages/TopicDetail";

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ id: string; topicId: string }>;
}) {
  const { id, topicId } = await params;
  return (
    <TelegramProvider>
      <TopicDetailForm showcaseId={id} topicId={topicId} />
    </TelegramProvider>
  );
}
