import TelegramProvider from "@/components/providers/TelegramProvider";
import ShowcaseCreateForm from "@/components/pages/ShowcaseCreate";

export default function ShowcaseCreatePage() {
  return (
    <TelegramProvider>
      <ShowcaseCreateForm />
    </TelegramProvider>
  );
}
