import TelegramProvider from "@/components/providers/TelegramProvider";
import ShowcaseDetailPage from "@/components/pages/ShowcaseDetail";

export default async function ShowcaseDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TelegramProvider>
      <ShowcaseDetailPage showcaseId={id} />
    </TelegramProvider>
  );
}
