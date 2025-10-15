import TelegramProvider from "@/components/providers/TelegramProvider";
import ShowcaseEditForm from "@/components/pages/ShowcaseEdit";

export default async function ShowcaseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TelegramProvider>
      <ShowcaseEditForm showcaseId={id} />
    </TelegramProvider>
  );
}
