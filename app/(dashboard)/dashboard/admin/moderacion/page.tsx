import { LDCModerationQueue } from "@/components/organisms/ldc-moderation-queue";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { getModerationQueue } from "@/services/dashboard/admin";

export const metadata = {
  title: "Moderación — Panel",
};

export default async function AdminModeracionPage() {
  const queue = await getModerationQueue();

  return (
    <LDCDashboardPageTemplate
      title="Moderación"
      description="Fichas nuevas, renovaciones y reportes que esperan revisión."
    >
      <LDCModerationQueue items={queue} moderationHref="/dashboard/admin/moderacion" simulated />
    </LDCDashboardPageTemplate>
  );
}
