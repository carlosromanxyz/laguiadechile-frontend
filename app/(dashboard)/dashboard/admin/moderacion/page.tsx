import { LDCModerationQueue } from "@/components/organisms/ldc-moderation-queue";
import { LDCDashboardPageTemplate } from "@/components/templates/ldc-dashboard-page-template";
import { requireDashboardRole } from "@/lib/dashboard/session";
import { getModerationQueue } from "@/services/dashboard/admin";
import { approveModerationAction, rejectModerationAction } from "./actions";

export const metadata = {
  title: "Moderación — Panel",
};

export default async function AdminModeracionPage() {
  const [, queue] = await Promise.all([requireDashboardRole("admin"), getModerationQueue()]);

  return (
    <LDCDashboardPageTemplate
      title="Moderación"
      description="Fichas y avisos que comercios y usuarios enviaron o editaron. Apruébalos para publicarlos en La Guía."
    >
      <LDCModerationQueue
        items={queue}
        moderationHref="/dashboard/admin/moderacion"
        onApprove={approveModerationAction}
        onReject={rejectModerationAction}
      />
    </LDCDashboardPageTemplate>
  );
}
